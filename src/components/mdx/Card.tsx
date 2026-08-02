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
      {icon && <div className="agenetixdocs-card-icon">{icon}</div>}
      <div className="agenetixdocs-card-content">
        <h3 className="agenetixdocs-card-title">{title}</h3>
        {description && <p className="agenetixdocs-card-description">{description}</p>}
        {children}
      </div>
      {href && (
        <svg className="agenetixdocs-card-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className="agenetixdocs-card agenetixdocs-card-link">
        {content}
      </Link>
    );
  }

  return <div className="agenetixdocs-card">{content}</div>;
}

interface CardGridProps {
  children: ReactNode;
  cols?: 1 | 2 | 3;
}

export function CardGrid({ children, cols = 2 }: CardGridProps) {
  return <div className={`agenetixdocs-card-grid agenetixdocs-card-grid-${cols}`}>{children}</div>;
}
