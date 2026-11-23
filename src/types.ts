export const SCHEMA_VERSION = "0.2.0";

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

/** Fixed plain-language explanation for a check, written for people who do not know the terms. */
export type Guide = {
  /** Name without jargon, e.g. "いつも暗号化して開く設定". */
  name: string;
  /** What was checked. */
  what: string;
  /** Why it matters. */
  why: string;
  /** What happens if it is left alone or set wrongly. */
  risk: string;
};

export type AreaId = "website" | "mail" | "domain";

/** Where an area stands, decided by the check in it that needs the most attention. */
export type AreaState = "action" | "error" | "review" | "unchecked" | "clear";

export type AreaSummary = {
  id: AreaId;
  name: string;
  state: AreaState;
  /** One sentence for non-experts. */
  summary: string;
  counts: Record<CheckStatus, number>;
  /** How many of the not_checked results are simply not applicable. */
  notApplicable: number;
  checkIds: string[];
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
  /**
   * Set on `not_checked` results when the check does not apply at all (no CNAME, no website, no mail),
   * as opposed to "could not be checked". Not-applicable checks do not make an area look unfinished.
   */
  notApplicable?: boolean;
  /** Plain-language explanation (added from the catalog in src/guide.ts). */
  guide?: Guide;
};

export type TargetReport = {
  host: string;
  /** Registrable domain from the Public Suffix List, e.g. example.co.jp for www.example.co.jp. */
  organizationalDomain: string;
  /** Readiness per purpose (website, mail, domain), instead of a score. */
  areas: AreaSummary[];
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
