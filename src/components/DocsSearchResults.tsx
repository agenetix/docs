"use client";

import Link from "next/link";
import type { RefObject } from "react";
import type { DocsSearchResult } from "../types";

export default function DocsSearchResults({
  visibleResults,
  activeIndex,
  resultRefs,
  error,
  isPending,
  trimmedQuery,
  onResultClick,
  onFocusResult,
}: {
  visibleResults: DocsSearchResult[];
  activeIndex: number;
  resultRefs: RefObject<Array<HTMLAnchorElement | null>>;
  error: string | null;
  isPending: boolean;
  trimmedQuery: string;
  onResultClick: () => void;
  onFocusResult: (index: number) => void;
}) {
  if (trimmedQuery.length === 0) {
    return (
      <p className="agenetixdocs-search-empty">
        Type to search documentation. Use arrow keys to navigate results.
      </p>
    );
  }

  if (error) {
    return <p className="agenetixdocs-search-empty">{error}</p>;
  }

  if (isPending) {
    return <p className="agenetixdocs-search-empty">Searching…</p>;
  }

  if (visibleResults.length === 0) {
    return <p className="agenetixdocs-search-empty">No matching documents.</p>;
  }

  return (
    <ul className="agenetixdocs-search-results" role="listbox">
      {visibleResults.map((result, index) => (
        <li key={`${result.href}-${index}`}>
          <Link
            href={result.href}
            ref={(element) => {
              resultRefs.current[index] = element;
            }}
            className={[
              "agenetixdocs-search-result",
              activeIndex === index ? "is-active" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={onResultClick}
            onFocus={() => onFocusResult(index)}
          >
            <div className="agenetixdocs-search-result-top">
              <span className="agenetixdocs-search-result-title">{result.title}</span>
              {result.sectionTitle ? (
                <span className="agenetixdocs-search-result-section">{result.sectionTitle}</span>
              ) : null}
            </div>
            <p className="agenetixdocs-search-result-snippet">{result.snippet}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
