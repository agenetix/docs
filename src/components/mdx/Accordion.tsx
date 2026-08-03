import type { ReactNode } from "react";

interface AccordionProps {
  children: ReactNode;
}

export default function Accordion({ children }: AccordionProps) {
  return <div className="emcydocs-accordion">{children}</div>;
}

interface AccordionItemProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: AccordionItemProps) {
  return (
    <details className="emcydocs-accordion-item" open={defaultOpen}>
      <summary className="emcydocs-accordion-summary">
        <span>{title}</span>
        <svg
          className="emcydocs-accordion-chevron"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </summary>
      <div className="emcydocs-accordion-panel">{children}</div>
    </details>
  );
}
