"use client";

import { useEffect, useRef } from "react";
import type { DocsSearchAction } from "../types";
import DocsSearchResults from "./DocsSearchResults";
import { useDocsSearch } from "./useDocsSearch";

export default function DocsSearch({
  searchAction,
  locale,
  placeholder = "Search the docs...",
  variant = "desktop",
}: {
  searchAction?: DocsSearchAction;
  locale?: string;
  placeholder?: string;
  variant?: "desktop" | "mobile";
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const search = useDocsSearch({ searchAction, locale });

  useEffect(() => {
    if (!search.isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (!containerRef.current?.contains(target)) {
        search.setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [search]);

  useEffect(() => {
    if (variant !== "desktop") {
      return;
    }

    const handleShortcut = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "k") {
        return;
      }

      event.preventDefault();
      search.open();
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [search, variant]);

  return (
    <div ref={containerRef} className="emcydocs-search">
      <div className="emcydocs-search-input-wrap">
        <svg className="emcydocs-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          id={search.inputId}
          type="search"
          value={search.query}
          placeholder={placeholder}
          className="emcydocs-search-input"
          onFocus={() => search.setIsOpen(true)}
          onChange={(event) => {
            search.setQuery(event.target.value);
            search.setIsOpen(true);
          }}
          onKeyDown={search.handleKeyDown}
          disabled={!searchAction}
        />
        {variant === "desktop" ? <span className="emcydocs-search-kbd">⌘K</span> : null}
      </div>

      {search.isOpen && search.trimmedQuery.length > 0 ? (
        <div className="emcydocs-search-panel">
          <DocsSearchResults
            visibleResults={search.visibleResults}
            activeIndex={search.activeIndex}
            resultRefs={search.resultRefs}
            error={search.error}
            isPending={search.isPending}
            trimmedQuery={search.trimmedQuery}
            onResultClick={search.handleResultClick}
            onFocusResult={search.setActiveIndex}
          />
        </div>
      ) : null}
    </div>
  );
}
