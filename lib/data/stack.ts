/**
 * The stack grouped by layer. Product names stay in English in both locales;
 * only the group labels are translated (`Stack.groups.<id>`).
 */
export interface StackGroup {
  id: string;
  items: string[];
}

export const stackGroups: StackGroup[] = [
  {
    id: "languages",
    items: ["TypeScript", "JavaScript", "Python", "Go", "HTML5", "CSS3"],
  },
  {
    id: "frontend",
    items: [
      "React",
      "Next.js",
      "Tailwind CSS",
      "shadcn/ui",
      "React Hook Form",
      "Motion",
      "Responsive design",
      "Internationalization",
    ],
  },
  {
    id: "backend",
    items: [
      "Node.js",
      "NestJS",
      "REST API",
      "Prisma",
      "Authentication",
      "Authorization",
      "API design",
    ],
  },
  {
    id: "databases",
    items: ["PostgreSQL", "Neon", "Supabase", "Firebase", "Appwrite"],
  },
  { id: "mobile", items: ["React Native", "Expo"] },
  {
    id: "devops",
    items: [
      "Git",
      "GitHub",
      "Docker",
      "Vercel",
      "Render",
      "Postman",
      "Swagger / OpenAPI",
      "CI/CD fundamentals",
    ],
  },
];
