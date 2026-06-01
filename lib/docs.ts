import { readFile } from "fs/promises";
import { join } from "path";

const DOCS_DIR = join(process.cwd(), "docs");

export type DocEntry = {
  slug: string;
  title: string;
  description: string;
  file: string;
};

export const DOC_ENTRIES: DocEntry[] = [
  {
    slug: "implementation-checklist",
    title: "Implementation Checklist",
    description:
      "Step-by-step checklist: Staging → Testing → Production, CI, Vercel, release-it.",
    file: "implementation-checklist.md",
  },
  {
    slug: "ci-cd-release-plan",
    title: "CI/CD & Release Plan",
    description:
      "Architecture and planning reference for pipelines and releases.",
    file: "ci-cd-release-plan.md",
  },
];

export function getDocBySlug(slug: string): DocEntry | undefined {
  return DOC_ENTRIES.find((doc) => doc.slug === slug);
}

export async function readDocMarkdown(file: string): Promise<string> {
  return readFile(join(DOCS_DIR, file), "utf-8");
}
