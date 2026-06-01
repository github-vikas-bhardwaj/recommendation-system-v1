import type { Metadata } from "next";
import Link from "next/link";
import { DOC_ENTRIES } from "@/lib/docs";

export const metadata: Metadata = {
  title: "Docs | recommendation-system-v1",
  description: "Project documentation for CI/CD, releases, and workflow.",
};

export default function DocsIndexPage() {
  return (
    <>
      <div className="docs-banner">
        Run <code>npm run dev</code> and open these pages in your browser for
        readable formatting.
      </div>
      <div className="docs-article">
        <h1 className="docs-h1">Documentation</h1>
        <p className="docs-p">
          Implementation guides for your Staging → Testing → Production
          workflow, GitHub CI, Vercel, and release-it.
        </p>
        {DOC_ENTRIES.map((doc) => (
          <Link
            key={doc.slug}
            href={`/docs/${doc.slug}`}
            className="docs-index-card"
          >
            <h2>{doc.title}</h2>
            <p>{doc.description}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
