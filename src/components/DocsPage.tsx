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
    <div className="emcydocs-page">
      <article className="emcydocs-article">
        <header className="emcydocs-page-header">
          {backHref ? (
            <nav className="emcydocs-page-breadcrumb" aria-label="Breadcrumb">
              <Link href={backHref}>{backLabel}</Link>
              <span aria-hidden="true">/</span>
              <span>{entry.title}</span>
            </nav>
          ) : entry.sectionLabel ? (
            <p className="emcydocs-page-kicker">{entry.sectionLabel}</p>
          ) : null}
          <div className="emcydocs-page-title-row">
            <h1>{entry.title}</h1>
            <CopyPageButton />
          </div>
          {entry.description ? <p>{entry.description}</p> : null}
          {showDeveloperMeta && (headingCount > 0 || localeCount > 1) ? (
            <div className="emcydocs-page-meta">
              {headingCount > 0 ? (
                <span className="emcydocs-page-meta-chip">
                  {headingCount} section{headingCount === 1 ? "" : "s"}
                </span>
              ) : null}
              {localeCount > 1 ? (
                <span className="emcydocs-page-meta-chip">
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
          <nav className="emcydocs-prev-next" aria-label="Document pagination">
            {previousEntry ? (
              <Link
                href={previousEntry.href}
                className="emcydocs-prev-next-link"
                data-direction="previous"
              >
                <span className="emcydocs-prev-next-label">Previous</span>
                <span className="emcydocs-prev-next-title">{previousEntry.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {nextEntry ? (
              <Link
                href={nextEntry.href}
                className="emcydocs-prev-next-link"
                data-direction="next"
              >
                <span className="emcydocs-prev-next-label">Next</span>
                <span className="emcydocs-prev-next-title">{nextEntry.title}</span>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </article>

      <aside className="emcydocs-page-aside">
        {asideHeader ? <div className="emcydocs-aside-header">{asideHeader}</div> : null}
        <DocsToc headings={entry.headings} />
        {asideFooter ? <div className="emcydocs-aside-footer">{asideFooter}</div> : null}
      </aside>
    </div>
  );
}

function DocsMdxFallback() {
  return (
    <div className="emcydocs-prose emcydocs-mdx-loading" aria-busy="true" aria-label="Loading article">
      <div className="emcydocs-mdx-loading-line" />
      <div className="emcydocs-mdx-loading-line emcydocs-mdx-loading-line-short" />
      <div className="emcydocs-mdx-loading-line" />
    </div>
  );
}
