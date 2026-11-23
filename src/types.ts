export const SCHEMA_VERSION = "0.1.0";

export type CheckStatus = "pass" | "finding" | "review" | "not_checked" | "error";

/** Independent of status. `critical` is not used in the MVP (public data rarely supports it). */
export type Severity = "high" | "medium" | "low" | "info";

export type MailUsage = "send-and-receive" | "send-only" | "receive-only" | "none" | "unknown";

export type Evidence = {
  /** Where the fact came from, e.g. "DNS TXT _dmarc.example.com" or "HTTPS response https://example.com/". */
  source: string;
  observedAt: string;
  /** Observed value, with secrets removed. */
  detail: string;
};

export type CheckResult = {
  id: string;
  title: string;
  status: CheckStatus;
  severity?: Severity;
  summary: string;
  evidence: Evidence[];
  /** Suggestions, each stating the condition under which it applies. */
  recommendations: string[];
  /** What this check cannot tell. */
  limitations: string[];
};

export type TargetReport = {
  host: string;
  /** Registrable domain from the Public Suffix List, e.g. example.co.jp for www.example.co.jp. */
  organizationalDomain: string;
  checks: CheckResult[];
};

export type ScanReport = {
  schemaVersion: typeof SCHEMA_VERSION;
  tool: { name: "domain-preflight"; version: string };
  mode: "public";
  startedAt: string;
  finishedAt: string;
  input: { hosts: string[]; mailUsage: MailUsage; dkimSelectors: string[]; resolver: string };
  targets: TargetReport[];
};
