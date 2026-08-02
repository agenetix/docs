import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import type { DocsEntry, DocsEntryMeta } from "../types";
import { DocsMdx } from "../mdx";
import CopyPageButton from "./CopyPageButton";
import DocsPageMobileToc from "./DocsPageMobileToc";
import DocsToc from "./DocsToc";

export default async function DocsPage({
  entry,
  previousEntry,
  nextEntry,
  backHref,
  backLabel = "All docs",
  showDeveloperMeta = false,
  components,
  asideHeader,
  asideFooter,
}: {
  entry: DocsEntry;
  previousEntry?: DocsEntryMeta | null;
  nextEntry?: DocsEntryMeta | null;
  backHref?: string;
  backLabel?: string;
  showDeveloperMeta?: boolean;
  components?: Record<string, React.ComponentType<any>>;
  asideHeader?: ReactNode;
  asideFooter?: ReactNode;
}) {
  const headingCount = entry.headings.filter((heading) => heading.level === 2).length;
  const localeCount = entry.availableLocales.length;

  return (
    <div className="agenetixdocs-page">
      <article className="agenetixdocs-article">
        <header className="agenetixdocs-page-header">
          {backHref ? (
            <nav className="agenetixdocs-page-breadcrumb" aria-label="Breadcrumb">
              <Link href={backHref}>{backLabel}</Link>
              <span aria-hidden="true">/</span>
              <span>{entry.title}</span>
            </nav>
          ) : entry.sectionLabel ? (
            <p className="agenetixdocs-page-kicker">{entry.sectionLabel}</p>
          ) : null}
          <div className="agenetixdocs-page-title-row">
            <h1>{entry.title}</h1>
            <CopyPageButton />
          </div>
          {entry.description ? <p>{entry.description}</p> : null}
          {showDeveloperMeta && (headingCount > 0 || localeCount > 1) ? (
            <div className="agenetixdocs-page-meta">
              {headingCount > 0 ? (
                <span className="agenetixdocs-page-meta-chip">
                  {headingCount} section{headingCount === 1 ? "" : "s"}
                </span>
              ) : null}
              {localeCount > 1 ? (
                <span className="agenetixdocs-page-meta-chip">
                  {localeCount} locales
                </span>
              ) : null}
            </div>
          ) : null}
        </header>

        <DocsPageMobileToc headings={entry.headings} />

        <Suspense fallback={<DocsMdxFallback />}>
          <DocsMdx entry={entry} components={components} />
        </Suspense>

        {(previousEntry || nextEntry) && (
          <nav className="agenetixdocs-prev-next" aria-label="Document pagination">
            {previousEntry ? (
              <Link
                href={previousEntry.href}
                className="agenetixdocs-prev-next-link"
                data-direction="previous"
              >
                <span className="agenetixdocs-prev-next-label">Previous</span>
                <span className="agenetixdocs-prev-next-title">{previousEntry.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {nextEntry ? (
              <Link
                href={nextEntry.href}
                className="agenetixdocs-prev-next-link"
                data-direction="next"
              >
                <span className="agenetixdocs-prev-next-label">Next</span>
                <span className="agenetixdocs-prev-next-title">{nextEntry.title}</span>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </article>

      <aside className="agenetixdocs-page-aside">
        {asideHeader ? <div className="agenetixdocs-aside-header">{asideHeader}</div> : null}
        <DocsToc headings={entry.headings} />
        {asideFooter ? <div className="agenetixdocs-aside-footer">{asideFooter}</div> : null}
      </aside>
    </div>
  );
}

function DocsMdxFallback() {
  return (
    <div className="agenetixdocs-prose agenetixdocs-mdx-loading" aria-busy="true" aria-label="Loading article">
      <div className="agenetixdocs-mdx-loading-line" />
      <div className="agenetixdocs-mdx-loading-line agenetixdocs-mdx-loading-line-short" />
      <div className="agenetixdocs-mdx-loading-line" />
    </div>
  );
}
