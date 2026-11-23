import { isIP } from "node:net";
import { getDomain } from "tldts";
import type { MailUsage } from "./types.js";

export const MAIL_USAGES: MailUsage[] = ["send-and-receive", "send-only", "receive-only", "none", "unknown"];

export class InputError extends Error {}

const LABEL = /^(?!-)[a-z0-9-]{1,63}(?<!-)$/;

/**
 * Accepts a bare DNS host name only. URLs, ports, IP literals and wildcards are rejected so that
 * the tool can only be pointed at public names (see docs/SECURITY.md).
 */
export function normalizeHost(raw: string): string {
  const host = raw.trim().toLowerCase().replace(/\.$/, "");
  if (host.includes("://") || host.includes("/")) throw new InputError(`"${raw}" はURLです。ホスト名だけを指定してください（例: example.com）`);
  if (host.includes(":")) throw new InputError(`"${raw}" にはポートやIPv6アドレスを含められません`);
  if (isIP(host)) throw new InputError(`"${raw}" はIPアドレスです。ホスト名を指定してください`);
  if (host.includes("*")) throw new InputError(`"${raw}" のようなワイルドカードは指定できません`);
  if (host.length > 253) throw new InputError(`"${raw}" はホスト名として長すぎます`);
  const labels = host.split(".");
  if (labels.length < 2 || !labels.every((label) => LABEL.test(label))) {
    throw new InputError(`"${raw}" は有効なホスト名ではありません`);
  }
  if (["localhost", "local", "internal", "home.arpa", "localdomain"].some((suffix) => host === suffix || host.endsWith("." + suffix))) {
    throw new InputError(`"${raw}" は内部向けの名前のため点検できません`);
  }
  return host;
}

/** Registrable ("organizational") domain via the Public Suffix List. */
export function organizationalDomain(host: string): string {
  const domain = getDomain(host, { allowPrivateDomains: false });
  if (!domain) throw new InputError(`"${host}" の組織ドメインを判定できません（公開サフィックスそのものの可能性があります）`);
  return domain;
}

export function parseMailUsage(raw: string | undefined): MailUsage {
  if (raw === undefined) return "unknown";
  if ((MAIL_USAGES as string[]).includes(raw)) return raw as MailUsage;
  throw new InputError(`--mail は ${MAIL_USAGES.join(" / ")} のいずれかです`);
}

export function normalizeSelector(raw: string): string {
  const selector = raw.trim().toLowerCase();
  if (!/^[a-z0-9._-]{1,63}$/.test(selector) || selector.startsWith(".") || selector.endsWith(".")) {
    throw new InputError(`DKIMセレクタ "${raw}" が不正です`);
  }
  return selector;
}
