"use client";

import { useEffect, useRef } from "react";
import type { DocsSearchAction } from "../types";
import DocsSearchResults from "./DocsSearchResults";
import { useDocsSearch } from "./useDocsSearch";

export default function DocsSearchCommand({
  searchAction,
  locale,
  placeholder = "Search the docs...",
  open,
  onOpenChange,
}: {
  searchAction?: DocsSearchAction;
  locale?: string;
  placeholder?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const search = useDocsSearch({
    searchAction,
    locale,
    onNavigate: () => onOpenChange(false),
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
      window.setTimeout(() => search.focusInput(), 0);
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, search]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    const handleClose = () => {
      search.reset();
      onOpenChange(false);
    };

    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onOpenChange, search]);

  return (
    <dialog ref={dialogRef} className="emcydocs-search-dialog">
      <div className="emcydocs-search-dialog-panel">
        <div className="emcydocs-search-dialog-header">
          <div className="emcydocs-search-input-wrap emcydocs-search-input-wrap-dialog">
            <svg
              className="emcydocs-search-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              id={search.inputId}
              type="search"
              value={search.query}
              placeholder={placeholder}
              className="emcydocs-search-input"
              onChange={(event) => {
                search.setQuery(event.target.value);
                search.setIsOpen(true);
              }}
              onKeyDown={search.handleKeyDown}
              disabled={!searchAction}
              autoComplete="off"
            />
            <span className="emcydocs-search-kbd">ESC</span>
          </div>
          <button
            type="button"
            className="emcydocs-search-dialog-close"
            aria-label="Close search"
            onClick={() => onOpenChange(false)}
          >
            ×
          </button>
        </div>
        <div className="emcydocs-search-dialog-body">
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
      </div>
    </dialog>
  );
}
