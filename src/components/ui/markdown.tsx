"use client";

import ReactMarkdown from "react-markdown";

export function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        h2: ({ children }) => (
          <h2 className="text-xl font-serif text-bark-500 mt-8 mb-3">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-serif text-bark-400 mt-6 mb-2">{children}</h3>
        ),
        h4: ({ children }) => (
          <h4 className="font-serif text-bark-400 mt-4 mb-1">{children}</h4>
        ),
        p: ({ children }) => (
          <p className="text-bark-300 leading-relaxed mb-4">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="list-disc pl-5 space-y-1 mb-4 text-bark-300">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal pl-5 space-y-1 mb-4 text-bark-300">{children}</ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        strong: ({ children }) => (
          <strong className="text-bark-400 font-semibold">{children}</strong>
        ),
        a: ({ href, children }) => (
          <a href={href} className="text-gold-500 hover:text-gold-400 underline" target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-gold-500/40 pl-4 my-4 italic text-bark-200">
            {children}
          </blockquote>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="border-b border-cream-300/20">{children}</thead>
        ),
        th: ({ children }) => (
          <th className="text-left px-3 py-2 text-xs text-cream-500 uppercase tracking-wider">{children}</th>
        ),
        td: ({ children }) => (
          <td className="px-3 py-2 text-bark-300 border-b border-cream-300/10">{children}</td>
        ),
        hr: () => <hr className="border-cream-300/20 my-6" />,
        code: ({ children }) => (
          <code className="bg-cream-100/10 px-1.5 py-0.5 rounded text-sm text-gold-400">{children}</code>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
