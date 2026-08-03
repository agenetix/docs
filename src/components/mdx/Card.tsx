import type { ReactNode } from "react";
import Link from "next/link";

interface CardProps {
  title: string;
  description?: string;
  href?: string;
  icon?: ReactNode;
  children?: ReactNode;
}

export default function Card({ title, description, href, icon, children }: CardProps) {
  const content = (
    <>
      {icon && <div className="emcydocs-card-icon">{icon}</div>}
      <div className="emcydocs-card-content">
        <h3 className="emcydocs-card-title">{title}</h3>
        {description && <p className="emcydocs-card-description">{description}</p>}
        {children}
      </div>
      {href && (
        <svg className="emcydocs-card-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className="emcydocs-card emcydocs-card-link">
        {content}
      </Link>
    );
  }

  return <div className="emcydocs-card">{content}</div>;
}

interface CardGridProps {
  children: ReactNode;
  cols?: 1 | 2 | 3;
}

export function CardGrid({ children, cols = 2 }: CardGridProps) {
  return <div className={`emcydocs-card-grid emcydocs-card-grid-${cols}`}>{children}</div>;
}
