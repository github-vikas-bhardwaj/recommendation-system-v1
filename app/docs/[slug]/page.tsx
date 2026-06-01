import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarkdownDoc } from "@/components/MarkdownDoc";
import { DOC_ENTRIES, getDocBySlug, readDocMarkdown } from "@/lib/docs";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return DOC_ENTRIES.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  if (!doc) {
    return { title: "Not found" };
  }
  return {
    title: `${doc.title} | Docs`,
    description: doc.description,
  };
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  if (!doc) {
    notFound();
  }

  const content = await readDocMarkdown(doc.file);

  return (
    <>
      <div className="docs-banner">
        Source: <code>docs/{doc.file}</code> — edits appear after refresh
      </div>
      <article className="docs-article">
        <MarkdownDoc content={content} />
      </article>
    </>
  );
}
