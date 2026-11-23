import { lookup as dnsLookup } from "node:dns";
import http from "node:http";
import https from "node:https";
import type { LookupFunction } from "node:net";
import tls from "node:tls";
import { isPublicAddress } from "./address.js";

/** "not-followed": a redirect to another organization's domain, deliberately not requested. */
export type WebFailure = "blocked-address" | "dns" | "timeout" | "tls" | "connect" | "not-followed" | "other";

export type WebResponse = {
  ok: true;
  status: number;
  /** Lower-cased header names. Repeated headers are joined with ", ". */
  headers: Record<string, string>;
  remoteAddress: string;
};

export type WebError = { ok: false; failure: WebFailure; message: string };

export type Certificate = {
  ok: true;
  /** Chain and host name both verified against the system trust store. */
  authorized: boolean;
  authorizationError?: string;
  subject: string;
  issuer: string;
  /** Issuer organisation (O=), used to compare with CAA. */
  issuerOrganization: string;
  validFrom: string;
  validTo: string;
  subjectAltNames: string[];
  protocol: string;
  remoteAddress: string;
};

/** Network access for web checks. Tests supply a fake; the CLI uses NodeWebClient. */
export interface WebClient {
  /** One request without following redirects. Only headers are read. */
  get(url: URL): Promise<WebResponse | WebError>;
  certificate(host: string): Promise<Certificate | WebError>;
}

const TIMEOUT_MS = 8_000;
/** Says what the request is and where to ask, for whoever reads the server log. */
const USER_AGENT = "domain-preflight/0.1 (read-only configuration check; +https://github.com/takafumikobayashi/domain-preflight)";

class BlockedAddressError extends Error {
  code = "EBLOCKED";
}

/**
 * Resolves like the system does, but refuses the connection if any address is not public, and
 * pins the connection to the address that was checked (no second lookup, so no DNS rebinding).
 */
const safeLookup: LookupFunction = (hostname, options, callback) => {
  dnsLookup(hostname, { all: true }, (error, addresses) => {
    if (error) return callback(error, "", 0);
    const list = addresses as { address: string; family: number }[];
    const unsafe = list.find((entry) => !isPublicAddress(entry.address));
    if (unsafe || list.length === 0) {
      return callback(new BlockedAddressError(`${hostname} が公開されていないアドレス (${unsafe?.address ?? "なし"}) に解決されたため接続しません`), "", 0);
    }
    const wanted = typeof options === "object" && options.family ? list.filter((entry) => entry.family === options.family) : list;
    const chosen = wanted[0] ?? list[0]!;
    if (typeof options === "object" && options.all) return (callback as unknown as (e: null, a: typeof list) => void)(null, [chosen]);
    callback(null, chosen.address, chosen.family);
  });
};

function failureOf(error: NodeJS.ErrnoException): WebFailure {
  if (error.code === "EBLOCKED") return "blocked-address";
  if (error.code === "ENOTFOUND" || error.code === "EAI_AGAIN") return "dns";
  if (error.code === "ETIMEDOUT" || error.message === "timeout") return "timeout";
  if (error.code?.startsWith("ERR_TLS") || error.code?.includes("CERT") || error.code === "EPROTO") return "tls";
  if (error.code === "ECONNREFUSED" || error.code === "ECONNRESET" || error.code === "EHOSTUNREACH") return "connect";
  return "other";
}

function cn(fields: Record<string, unknown> | undefined): string {
  if (!fields) return "";
  return Object.entries(fields)
    .map(([key, value]) => `${key}=${Array.isArray(value) ? value.join("+") : String(value)}`)
    .join(", ");
}

export class NodeWebClient implements WebClient {
  get(url: URL): Promise<WebResponse | WebError> {
    return new Promise((resolve) => {
      const module = url.protocol === "https:" ? https : http;
      const request = module.request(
        url,
        {
          method: "GET",
          lookup: safeLookup,
          headers: { "user-agent": USER_AGENT, accept: "text/html,*/*;q=0.5" },
          timeout: TIMEOUT_MS,
          // Certificate problems are reported by certificate(); here we still want the headers.
          rejectUnauthorized: false,
        },
        (response) => {
          const headers: Record<string, string> = {};
          for (const [name, value] of Object.entries(response.headers)) {
            if (value !== undefined) headers[name.toLowerCase()] = Array.isArray(value) ? value.join(", ") : value;
          }
          const remoteAddress = response.socket.remoteAddress ?? "";
          response.destroy();
          resolve({ ok: true, status: response.statusCode ?? 0, headers, remoteAddress });
        },
      );
      request.on("timeout", () => request.destroy(Object.assign(new Error("timeout"), { code: "ETIMEDOUT" })));
      request.on("error", (error: NodeJS.ErrnoException) => resolve({ ok: false, failure: failureOf(error), message: error.message }));
      request.end();
    });
  }

  certificate(host: string): Promise<Certificate | WebError> {
    return new Promise((resolve) => {
      const socket = tls.connect({
        host,
        port: 443,
        servername: host,
        lookup: safeLookup,
        rejectUnauthorized: false,
        timeout: TIMEOUT_MS,
      });
      socket.once("secureConnect", () => {
        const peer = socket.getPeerCertificate();
        let authorizationError = socket.authorizationError ? String(socket.authorizationError) : undefined;
        // Host name verification, explicitly, in case the runtime skipped it with rejectUnauthorized: false.
        if (!authorizationError && peer && Object.keys(peer).length > 0) {
          const identityError = tls.checkServerIdentity(host, peer);
          if (identityError) authorizationError = (identityError as NodeJS.ErrnoException).code ?? identityError.message;
        }
        const issuer = peer.issuer as unknown as Record<string, unknown> | undefined;
        resolve({
          ok: true,
          authorized: socket.authorized && !authorizationError,
          authorizationError,
          subject: cn(peer.subject as unknown as Record<string, unknown>),
          issuer: cn(issuer),
          issuerOrganization: String(issuer?.O ?? issuer?.CN ?? ""),
          validFrom: peer.valid_from,
          validTo: peer.valid_to,
          subjectAltNames: (peer.subjectaltname ?? "")
            .split(",")
            .map((entry) => entry.trim().replace(/^DNS:/, ""))
            .filter(Boolean),
          protocol: socket.getProtocol() ?? "",
          remoteAddress: socket.remoteAddress ?? "",
        });
        socket.end();
      });
      socket.once("timeout", () => socket.destroy(Object.assign(new Error("timeout"), { code: "ETIMEDOUT" })));
      socket.once("error", (error: NodeJS.ErrnoException) => resolve({ ok: false, failure: failureOf(error), message: error.message }));
    });
  }
}
