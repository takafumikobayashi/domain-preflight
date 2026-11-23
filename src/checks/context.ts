import type { DnsAnswer, DnsClient } from "../net/dns.js";
import type { WebClient } from "../net/web.js";
import type { CheckResult, Evidence, MailUsage } from "../types.js";

export type CheckContext = {
  host: string;
  organizationalDomain: string;
  mailUsage: MailUsage;
  dkimSelectors: string[];
  dns: DnsClient;
  web: WebClient;
  /** Injected so tests get stable timestamps. */
  now: () => Date;
};

export function evidence(context: CheckContext, source: string, detail: string): Evidence {
  return { source, observedAt: context.now().toISOString(), detail };
}

export function result(partial: Omit<CheckResult, "evidence" | "recommendations" | "limitations"> & Partial<CheckResult>): CheckResult {
  return { evidence: [], recommendations: [], limitations: [], ...partial };
}

/** Describes a DNS answer for evidence, including failures (which are facts too). */
export function describeAnswer<T>(answer: DnsAnswer<T>, format: (record: T) => string = String): string {
  if (answer.ok) return answer.records.map(format).join(" | ");
  if (answer.failure === "NODATA") return "レコードなし";
  if (answer.failure === "NXDOMAIN") return "名前が存在しない (NXDOMAIN)";
  return `取得失敗 (${answer.failure}: ${answer.message})`;
}

/** True when the answer is a lookup failure rather than a definite "nothing here". */
export function isLookupError<T>(answer: DnsAnswer<T>): boolean {
  return !answer.ok && answer.failure !== "NODATA" && answer.failure !== "NXDOMAIN";
}

export const sendsMail = (usage: MailUsage) => usage === "send-and-receive" || usage === "send-only";
export const receivesMail = (usage: MailUsage) => usage === "send-and-receive" || usage === "receive-only";
