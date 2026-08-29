/**
 * Project data model.
 *
 * Structure and assets live here; every sentence lives in /messages under
 * `Work.<slug>`. Lists of unknown length (features, what-I-built, results) are
 * read with `t.raw()` so a translator can add or remove a line without a code
 * change.
 *
 * Screenshots go in /public/projects/<slug>/. Width and height are required so
 * next/image can reserve the space and never shift the layout.
 */

export interface Shot {
  src: string;
  width: number;
  height: number;
  /** Key under `Work.<slug>.captions`. */
  caption: string;
  /** Key under `Work.<slug>.alt`. */
  alt: string;
  /** Phone screenshots render inside a device frame instead of a browser one. */
  device?: "browser" | "phone";
}

export interface Project {
  slug: string;
  name: string;
  href?: string;
  domain?: string;
  tech: string[];
  shots: Shot[];
  /** Phone captures. Empty by design until real ones exist — nothing is faked. */
  mobileShots: Shot[];
}

/** The lead case study. */
export const osonUy: Project = {
  slug: "oson-uy",
  name: "Oson Uy",
  href: "https://oson-uy.uz",
  domain: "oson-uy.uz",
  tech: [
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "NestJS",
    "Prisma",
    "PostgreSQL",
    "React Native",
    "Expo",
    "Supabase",
  ],
  shots: [
    {
      src: "/projects/oson-uy/storefront.webp",
      width: 2000,
      height: 1091,
      caption: "storefront",
      alt: "storefront",
      device: "browser",
    },
    {
      src: "/projects/oson-uy/dashboard.webp",
      width: 2000,
      height: 1091,
      caption: "dashboard",
      alt: "dashboard",
      device: "browser",
    },
  ],
  mobileShots: [],
};

/** The second case study. */
export const kidscity: Project = {
  slug: "kidscity",
  name: "KidsCity.uz",
  href: "https://kidscity.uz",
  domain: "kidscity.uz",
  tech: [
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Prisma",
    "PostgreSQL",
    "NextAuth",
    "Supabase",
    "UploadThing",
  ],
  shots: [
    {
      src: "/projects/kidscity/storefront.webp",
      width: 2000,
      height: 1091,
      caption: "storefront",
      alt: "storefront",
      device: "browser",
    },
  ],
  mobileShots: [],
};

/**
 * Everything else, as a compact index rather than a wall of cards.
 * Only shipped work is listed; add a row here and it appears in the table.
 */
export interface IndexEntry {
  slug: string;
  name: string;
  href?: string;
  domain?: string;
  tech: string[];
}

export const otherProjects: IndexEntry[] = [
  {
    slug: "wms",
    name: "WMS",
    tech: ["Next.js", "TypeScript", "NestJS", "PostgreSQL"],
  },
  {
    slug: "evro-plaza",
    name: "EVRO PLAZA",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    slug: "samyak",
    name: "Samyak",
    href: "https://samyak.uz",
    domain: "samyak.uz",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    slug: "tespack",
    name: "Tespack",
    href: "https://tespack.uz",
    domain: "tespack.uz",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    slug: "pishcool",
    name: "Pishcool",
    href: "https://pishcool.uz",
    domain: "pishcool.uz",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
];

/** Layers of the Oson Uy system, drawn top-down in the architecture figure. */
export interface ArchNode {
  id: string;
  label: string;
  /** Key under `Work.oson-uy.architecture.nodes.<id>` for the one-line role. */
  note: string;
  tag: string;
}

export const osonUyArchitecture: {
  clients: ArchNode[];
  core: ArchNode[];
} = {
  clients: [
    { id: "web", label: "Next.js", note: "web", tag: "Web client" },
    { id: "mobile", label: "React Native · Expo", note: "mobile", tag: "Mobile client" },
    { id: "admin", label: "Admin dashboard", note: "admin", tag: "Internal" },
  ],
  core: [
    { id: "api", label: "NestJS", note: "api", tag: "REST API" },
    { id: "orm", label: "Prisma", note: "orm", tag: "ORM" },
    { id: "db", label: "PostgreSQL", note: "db", tag: "Database" },
  ],
};
