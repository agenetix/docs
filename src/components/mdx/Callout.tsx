import type { ReactNode } from "react";

interface CalloutProps {
  type?: "info" | "warning" | "error" | "tip";
  title?: string;
  children: ReactNode;
}

const icons = {
  info: (
    <svg className="emcydocs-callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  ),
  warning: (
    <svg className="emcydocs-callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" />
    </svg>
  ),
  error: (
    <svg className="emcydocs-callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M15 9l-6 6M9 9l6 6" />
    </svg>
  ),
  tip: (
    <svg className="emcydocs-callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18h6M10 22h4M12 2a7 7 0 017 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 01-1 1H9a1 1 0 01-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 017-7z" />
    </svg>
  ),
};

export default function Callout({ type = "info", title, children }: CalloutProps) {
  return (
    <div className={`emcydocs-callout emcydocs-callout-${type}`}>
      <div className="emcydocs-callout-header">
        {icons[type]}
        {title && <span className="emcydocs-callout-title">{title}</span>}
      </div>
      <div className="emcydocs-callout-content">{children}</div>
    </div>
  );
}
