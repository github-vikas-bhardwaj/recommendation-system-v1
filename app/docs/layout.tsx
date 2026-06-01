import Link from "next/link";
import "./docs.css";
import { DOC_ENTRIES } from "@/lib/docs";

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="docs-shell">
      <aside className="docs-sidebar">
        <p className="docs-sidebar-title">Project docs</p>
        <nav>
          <Link href="/docs" className="docs-nav-link">
            Overview
          </Link>
          {DOC_ENTRIES.map((doc) => (
            <Link
              key={doc.slug}
              href={`/docs/${doc.slug}`}
              className="docs-nav-link"
            >
              {doc.title}
              <span className="docs-nav-desc">{doc.description}</span>
            </Link>
          ))}
        </nav>
        <p className="docs-sidebar-title" style={{ marginTop: "2rem" }}>
          App
        </p>
        <Link href="/" className="docs-nav-link">
          Back to home
        </Link>
      </aside>
      <div className="docs-main">{children}</div>
    </div>
  );
}
