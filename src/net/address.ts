import { BlockList, isIP } from "node:net";

/**
 * Addresses the tool must never connect to: private, loopback, link-local (incl. cloud metadata),
 * CGNAT, multicast, documentation and other reserved ranges.
 */
const blocked = new BlockList();
for (const [network, prefix] of [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.0.0.0", 24],
  ["192.0.2.0", 24],
  ["192.168.0.0", 16],
  ["198.18.0.0", 15],
  ["198.51.100.0", 24],
  ["203.0.113.0", 24],
  ["224.0.0.0", 4],
  ["240.0.0.0", 4],
] as const) {
  blocked.addSubnet(network, prefix, "ipv4");
}
for (const [network, prefix] of [
  ["::", 128],
  ["::1", 128],
  ["64:ff9b::", 96],
  ["100::", 64],
  ["2001:db8::", 32],
  ["fc00::", 7],
  ["fe80::", 10],
  ["ff00::", 8],
] as const) {
  blocked.addSubnet(network, prefix, "ipv6");
}

export function isPublicAddress(address: string): boolean {
  const family = isIP(address);
  if (family === 0) return false;
  // IPv4-mapped IPv6 (::ffff:a.b.c.d) is judged by its IPv4 part. A ::ffff:0:0/96 subnet rule would
  // not work here: BlockList also matches plain IPv4 addresses against it, which blocks everything.
  const mapped = family === 6 ? address.toLowerCase().match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/) : null;
  if (mapped) return isPublicAddress(mapped[1]!);
  if (family === 6 && /^::ffff:/i.test(address)) return false;
  return !blocked.check(address, family === 4 ? "ipv4" : "ipv6");
}
