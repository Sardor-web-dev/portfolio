/**
 * Roles, newest first. Structure only — title, summary and the responsibility
 * list are translated under `Experience.roles.<id>` in /messages.
 *
 * NOTE: no dates are recorded because none were supplied. Add `period` here
 * and the timeline rail renders it automatically.
 */
export interface Role {
  id: string;
  company: string;
  /** Optional, e.g. "2024 — Present". */
  period?: string;
  href?: string;
}

export const roles: Role[] = [
  { id: "sds", company: "Sardor & Danila Systems" },
  { id: "dotlabs", company: "Dotlabs.uz" },
  { id: "ozon", company: "Ozon" },
];
