import { describe, expect, it } from "vitest";
import { InputError, normalizeHost, organizationalDomain, parseMailUsage } from "../src/input.js";
import { isPublicAddress } from "../src/net/address.js";

describe("normalizeHost", () => {
  it("accepts and normalizes host names", () => {
    expect(normalizeHost(" WWW.Example.COM. ")).toBe("www.example.com");
  });
  it.each(["https://example.com", "example.com/path", "example.com:8443", "192.0.2.1", "[::1]", "*.example.com", "localhost", "intranet", "printer.local", "-bad.example.com"])(
    "rejects %s",
    (raw) => expect(() => normalizeHost(raw)).toThrow(InputError),
  );
});

describe("organizationalDomain", () => {
  it.each([
    ["www.example.com", "example.com"],
    ["a.b.example.co.jp", "example.co.jp"],
    ["mail.example.tokyo", "example.tokyo"],
  ])("%s → %s", (host, domain) => expect(organizationalDomain(host)).toBe(domain));
  it("rejects a bare public suffix", () => expect(() => organizationalDomain("co.jp")).toThrow(InputError));
});

describe("parseMailUsage", () => {
  it("defaults to unknown and rejects other values", () => {
    expect(parseMailUsage(undefined)).toBe("unknown");
    expect(parseMailUsage("none")).toBe("none");
    expect(() => parseMailUsage("maybe")).toThrow(InputError);
  });
});

describe("isPublicAddress", () => {
  it.each(["10.0.0.1", "127.0.0.1", "169.254.169.254", "172.16.5.4", "192.168.1.1", "100.64.0.1", "::1", "fe80::1", "fd00::1", "::ffff:127.0.0.1", "::ffff:7f00:1", "0.0.0.0"])(
    "blocks %s",
    (address) => expect(isPublicAddress(address)).toBe(false),
  );
  it.each(["1.1.1.1", "8.8.8.8", "2606:4700::6810:84e5", "::ffff:1.1.1.1"])("allows %s", (address) => expect(isPublicAddress(address)).toBe(true));
});

import { toCaaRecord } from "../src/net/dns.js";

describe("toCaaRecord", () => {
  it("reads the tag by name, with or without Node's type field", () => {
    expect(toCaaRecord({ critical: 0, issue: "letsencrypt.org" })).toEqual({ critical: 0, tag: "issue", value: "letsencrypt.org" });
    expect(toCaaRecord({ critical: 0, type: "CAA", issue: "pki.goog" })).toEqual({ critical: 0, tag: "issue", value: "pki.goog" });
    expect(toCaaRecord({ critical: 128, type: "CAA", iodef: "mailto:security@example.com" })).toMatchObject({ critical: 128, tag: "iodef" });
  });
});
