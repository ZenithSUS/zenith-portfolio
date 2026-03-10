import type { Components } from "react-markdown";

export const markdownComponents: Components = {
  p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
  ul: ({ children }) => (
    <ul className="mb-3 list-disc space-y-1 pl-5">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-3 list-decimal space-y-1 pl-5">{children}</ol>
  ),
  li: ({ children }) => <li className="text-text/95">{children}</li>,
  code: ({ children }) => (
    <code className="text-primary/90 rounded bg-black/30 px-1.5 py-0.5 text-[13px]">
      {children}
    </code>
  ),
  strong: ({ children }) => (
    <strong className="text-text/95 font-semibold">{children}</strong>
  ),
};
