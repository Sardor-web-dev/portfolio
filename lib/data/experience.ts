/**
 * Roles, newest first. Structure only — title, summary and the responsibility
 * list are translated under `Experience.roles.<id>` in /messages.
 *
 * NOTE: no dates are recorded because none were supplied. Add `period` here
 * and the timeline rail renders it automatically. `location` and the
 * responsibility list are optional too: a role that has neither renders as
 * company, title and summary rather than padding itself out.
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
  { id: "wepro", company: "Wepro.uz", href: "https://wepro.uz" },
  { id: "dotlabs", company: "Dotlabs.uz" },
  { id: "ozon", company: "Ozon" },
];
