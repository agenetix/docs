"use client";

import { useEffect, useState } from "react";
import type { DocsSearchAction } from "../types";
import DocsSearch from "./DocsSearch";
import DocsSearchCommand from "./DocsSearchCommand";

export default function DocsSearchPalette({
  searchAction,
  locale,
  placeholder = "Search the docs...",
  mode = "command",
  open: controlledOpen,
  onOpenChange,
  showTrigger = true,
}: {
  searchAction?: DocsSearchAction;
  locale?: string;
  placeholder?: string;
  mode?: "command" | "inline" | "both";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  const useCommand = mode === "command" || mode === "both";
  const useInline = mode === "inline" || mode === "both";

  useEffect(() => {
    if (!useCommand) {
      return;
    }

    const handleShortcut = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "k") {
        return;
      }

      event.preventDefault();
      setOpen(true);
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [setOpen, useCommand]);

  return (
    <>
      {useCommand ? (
        <>
          {showTrigger ? (
            <button
              type="button"
              className="emcydocs-search-trigger"
              onClick={() => setOpen(true)}
              aria-label="Open search"
            >
              <svg
                className="emcydocs-search-trigger-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <span className="emcydocs-search-trigger-label">{placeholder}</span>
              <span className="emcydocs-search-kbd">⌘K</span>
            </button>
          ) : null}
          <DocsSearchCommand
            searchAction={searchAction}
            locale={locale}
            placeholder={placeholder}
            open={open}
            onOpenChange={setOpen}
          />
        </>
      ) : null}
      {useInline ? (
        <DocsSearch
          searchAction={searchAction}
          locale={locale}
          placeholder={placeholder}
          variant="desktop"
        />
      ) : null}
    </>
  );
}
