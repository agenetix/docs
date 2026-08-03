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
      <div className="emcydocs-banner-copy">
        {eyebrow ? <span className="emcydocs-banner-eyebrow">{eyebrow}</span> : null}
        <div className="emcydocs-banner-title-row">
          {icon ? <span className="emcydocs-banner-icon">{icon}</span> : null}
          <h3 className="emcydocs-banner-title">{title}</h3>
        </div>
        {children ? <div className="emcydocs-banner-body">{children}</div> : null}
      </div>
      {href ? (
        <span className="emcydocs-banner-action">
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
      <Link href={href} className="emcydocs-banner emcydocs-banner-link">
        {content}
      </Link>
    );
  }

  return <section className="emcydocs-banner">{content}</section>;
}
