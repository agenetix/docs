"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState, useTransition } from "react";
import type { DocsSearchAction, DocsSearchResponse } from "../types.js";

const EMPTY_RESPONSE: DocsSearchResponse = {
  query: "",
  total: 0,
  results: [],
};

export function useDocsSearch({
  searchAction,
  locale,
  onNavigate,
}: {
  searchAction?: DocsSearchAction;
  locale?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const inputId = useId();
  const resultRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [response, setResponse] = useState<DocsSearchResponse>(EMPTY_RESPONSE);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const trimmedQuery = query.trim();
  const visibleResults = useMemo(
    () => (trimmedQuery.length >= 2 ? response.results : []),
    [response.results, trimmedQuery.length]
  );

  const reset = () => {
    setQuery("");
    setIsOpen(false);
    setResponse(EMPTY_RESPONSE);
    setError(null);
    setActiveIndex(-1);
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      reset();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [pathname]);

  useEffect(() => {
    if (!searchAction || trimmedQuery.length < 2) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      startTransition(async () => {
        try {
          const next = await searchAction(trimmedQuery, locale);
          setResponse(next);
          setError(null);
          setActiveIndex(next.results.length > 0 ? 0 : -1);
        } catch {
          setError("Search is unavailable right now.");
        }
      });
    }, 140);

    return () => window.clearTimeout(timeoutId);
  }, [locale, searchAction, trimmedQuery]);

  const focusInput = () => {
    const input = document.getElementById(inputId);
    if (input instanceof HTMLInputElement) {
      input.focus();
      input.select();
    }
  };

  const open = () => {
    setIsOpen(true);
    window.setTimeout(focusInput, 0);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!visibleResults.length) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => {
        const next = current < visibleResults.length - 1 ? current + 1 : 0;
        resultRefs.current[next]?.focus();
        return next;
      });
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => {
        const next = current > 0 ? current - 1 : visibleResults.length - 1;
        resultRefs.current[next]?.focus();
        return next;
      });
      return;
    }

    if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleResultClick = () => {
    reset();
    onNavigate?.();
  };

  return {
    inputId,
    query,
    setQuery,
    isOpen,
    setIsOpen,
    activeIndex,
    setActiveIndex,
    response,
    error,
    isPending,
    trimmedQuery,
    visibleResults,
    resultRefs,
    searchAction,
    open,
    reset,
    focusInput,
    handleKeyDown,
    handleResultClick,
  };
}
