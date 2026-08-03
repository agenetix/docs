import Link from "next/link";
import type { ReactNode } from "react";

interface BannerProps {
  title: string;
  children?: ReactNode;
  href?: string;
  actionLabel?: string;
  eyebrow?: string;
  icon?: ReactNode;
}

export default function Banner({
  title,
  children,
  href,
  actionLabel = "Learn more",
  eyebrow,
  icon,
}: BannerProps) {
  const content = (
    <>
      <div className="agenetixdocs-banner-copy">
        {eyebrow ? <span className="agenetixdocs-banner-eyebrow">{eyebrow}</span> : null}
        <div className="agenetixdocs-banner-title-row">
          {icon ? <span className="agenetixdocs-banner-icon">{icon}</span> : null}
          <h3 className="agenetixdocs-banner-title">{title}</h3>
        </div>
        {children ? <div className="agenetixdocs-banner-body">{children}</div> : null}
      </div>
      {href ? (
        <span className="agenetixdocs-banner-action">
          <span>{actionLabel}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className="agenetixdocs-banner agenetixdocs-banner-link">
        {content}
      </Link>
    );
  }

  return <section className="agenetixdocs-banner">{content}</section>;
}
