import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const components: Components = {
  h1: ({ children }) => <h1 className="docs-h1">{children}</h1>,
  h2: ({ children }) => <h2 className="docs-h2">{children}</h2>,
  h3: ({ children }) => <h3 className="docs-h3">{children}</h3>,
  h4: ({ children }) => <h4 className="docs-h4">{children}</h4>,
  p: ({ children }) => <p className="docs-p">{children}</p>,
  ul: ({ children }) => <ul className="docs-ul">{children}</ul>,
  ol: ({ children }) => <ol className="docs-ol">{children}</ol>,
  li: ({ children, className }) => (
    <li className={`docs-li ${className ?? ""}`.trim()}>{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="docs-blockquote">{children}</blockquote>
  ),
  hr: () => <hr className="docs-hr" />,
  a: ({ href, children }) => (
    <a href={href} className="docs-a" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  code: ({ className, children }) => {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      return (
        <code className={`docs-code-block ${className ?? ""}`}>{children}</code>
      );
    }
    return <code className="docs-code-inline">{children}</code>;
  },
  pre: ({ children }) => <pre className="docs-pre">{children}</pre>,
  table: ({ children }) => (
    <div className="docs-table-wrap">
      <table className="docs-table">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="docs-thead">{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr className="docs-tr">{children}</tr>,
  th: ({ children }) => <th className="docs-th">{children}</th>,
  td: ({ children }) => <td className="docs-td">{children}</td>,
  strong: ({ children }) => <strong className="docs-strong">{children}</strong>,
  input: ({ type, checked, disabled }) => {
    if (type === "checkbox") {
      return (
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          readOnly
          className="docs-checkbox"
          aria-label="Checklist item"
        />
      );
    }
    return <input type={type} checked={checked} disabled={disabled} readOnly />;
  },
};

type MarkdownDocProps = {
  content: string;
};

export function MarkdownDoc({ content }: MarkdownDocProps) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
}
