import Link from "next/link";
import type { DocsEntry, DocsNavSection } from "../types";
import { DocsMdx } from "../mdx";

const sectionIcons: Record<string, React.ReactNode> = {
  "": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  "getting-started": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  guides: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  reference: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  internationalization: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

function getSectionIcon(sectionKey: string, label: string): React.ReactNode {
  const key = (sectionKey || label).toLowerCase().replace(/\s+/g, "-");
  return (
    sectionIcons[key] ||
    sectionIcons[label.toLowerCase()] || (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  );
}

export default async function DocsHomePage({
  entry,
  navigation,
  title,
  description,
  quickLinks,
}: {
  entry?: DocsEntry | null;
  navigation: DocsNavSection[];
  title?: string;
  description?: string;
  quickLinks?: Array<{ href: string; label: string }>;
}) {
  const pageTitle = title ?? entry?.title ?? "Documentation";
  const pageDescription = description ?? entry?.description ?? "";
  const defaultQuickLinks = getDefaultQuickLinks(navigation);
  const links = quickLinks?.length ? quickLinks : defaultQuickLinks;

  return (
    <div className="emcydocs-home">
      <section className="emcydocs-home-hero">
        <div className="emcydocs-home-hero-main">
          <h1>{pageTitle}</h1>
          {pageDescription ? <p>{pageDescription}</p> : null}
          {links.length > 0 ? (
            <div className="emcydocs-home-quick-links">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="emcydocs-home-quick-link">
                  {link.label}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {entry ? (
        <section className="emcydocs-home-content">
          <DocsMdx entry={entry} />
        </section>
      ) : null}

      <section className="emcydocs-home-grid">
        {navigation.map((section) => {
          const landingHref = section.items[0]?.href;
          return (
            <article key={section.key || "root"} className="emcydocs-home-card">
              <div className="emcydocs-home-card-head">
                <div className="emcydocs-home-card-heading">
                  <span className="emcydocs-home-card-icon">
                    <span>{getSectionIcon(section.key, section.label)}</span>
                  </span>
                  <h2>{section.label}</h2>
                </div>
                <span className="emcydocs-home-card-count">{section.items.length} pages</span>
              </div>
              {getSectionSummary(section.items) ? (
                <p className="emcydocs-home-card-summary">{getSectionSummary(section.items)}</p>
              ) : null}
              <div className="emcydocs-home-card-links">
                {section.items.slice(0, 4).map((item) => (
                  <Link key={item.href} href={item.href} className="emcydocs-home-card-link">
                    <div>
                      <strong>{item.title}</strong>
                      {item.description ? <span>{truncateText(item.description, 68)}</span> : null}
                    </div>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </Link>
                ))}
              </div>
              {section.items.length > 4 && landingHref ? (
                <Link href={landingHref} className="emcydocs-home-card-more">
                  Browse {section.items.length} pages in {section.label}
                </Link>
              ) : null}
            </article>
          );
        })}
      </section>
    </div>
  );
}

function getDefaultQuickLinks(navigation: DocsNavSection[]) {
  const flat = navigation.flatMap((section) => section.items);
  const picks = [
    flat.find((item) => item.slugs.join("/").includes("getting-started")),
    flat.find((item) => item.slugs.join("/").includes("component")),
    flat.find((item) => item.slugs.join("/").includes("theme")),
  ].filter((item): item is NonNullable<typeof item> => Boolean(item));

  return picks.slice(0, 3).map((item) => ({ href: item.href, label: item.title }));
}

function getSectionSummary(items: DocsNavSection["items"]) {
  const firstWithDescription = items.find((item) => item.description.trim().length > 0);
  return firstWithDescription ? truncateText(firstWithDescription.description, 140) : "";
}

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1).trimEnd()}…`;
}
