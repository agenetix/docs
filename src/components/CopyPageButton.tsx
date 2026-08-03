"use client";

import { useEffect, useRef, useState } from "react";

type CopyState = "idle" | "copied-link" | "copied-page";

export default function CopyPageButton({
  label = "Copy page",
}: {
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handle = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("pointerdown", handle);
    return () => document.removeEventListener("pointerdown", handle);
  }, [isOpen]);

  useEffect(() => {
    if (copyState === "idle") return;
    const id = window.setTimeout(() => setCopyState("idle"), 2000);
    return () => window.clearTimeout(id);
  }, [copyState]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyState("copied-link");
    } catch {
      window.prompt("Copy link", window.location.href);
    }
  };

  const copyMarkdown = async () => {
    const article = document.querySelector(".emcydocs-article");
    if (!article) return;

    const title = article.querySelector("h1")?.textContent ?? "";
    const desc = article.querySelector(".emcydocs-page-header > p")?.textContent ?? "";
    const prose = article.querySelector(".emcydocs-prose");
    const text = prose?.textContent ?? "";

    const md = [
      title && `# ${title}`,
      desc && `\n${desc}`,
      text && `\n${text}`,
      `\nSource: ${window.location.href}`,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await navigator.clipboard.writeText(md);
      setCopyState("copied-page");
    } catch {
      window.prompt("Copy content", md.slice(0, 500));
    }
  };

  const buttonLabel =
    copyState === "copied-link"
      ? "Copied link!"
      : copyState === "copied-page"
        ? "Copied!"
        : label;

  return (
    <div ref={ref} className="emcydocs-copymenu">
      <button
        type="button"
        className="emcydocs-copymenu-trigger"
        onClick={() => setIsOpen((o) => !o)}
        aria-expanded={isOpen}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
        <span>{buttonLabel}</span>
        <svg className="emcydocs-copymenu-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" data-open={isOpen}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen ? (
        <div className="emcydocs-copymenu-panel">
          <button
            type="button"
            className="emcydocs-copymenu-item"
            onClick={() => {
              copyLink();
              setIsOpen(false);
            }}
          >
            <span className="emcydocs-copymenu-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
              </svg>
            </span>
            <span className="emcydocs-copymenu-text">
              <span className="emcydocs-copymenu-title">Copy link</span>
              <span className="emcydocs-copymenu-desc">Share this page URL</span>
            </span>
          </button>

          <button
            type="button"
            className="emcydocs-copymenu-item"
            onClick={() => {
              copyMarkdown();
              setIsOpen(false);
            }}
          >
            <span className="emcydocs-copymenu-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
            </span>
            <span className="emcydocs-copymenu-text">
              <span className="emcydocs-copymenu-title">Copy page</span>
              <span className="emcydocs-copymenu-desc">Copy as Markdown for LLMs</span>
            </span>
          </button>

          <a
            href={`https://claude.ai/new?q=${encodeURIComponent(`Read this documentation page and answer my questions about it: ${typeof window !== "undefined" ? window.location.href : ""}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="emcydocs-copymenu-item"
            onClick={() => setIsOpen(false)}
          >
            <span className="emcydocs-copymenu-icon emcydocs-copymenu-icon-accent">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2z" />
                <path d="M12 16v.01" />
                <path d="M12 8v4" />
              </svg>
            </span>
            <span className="emcydocs-copymenu-text">
              <span className="emcydocs-copymenu-title">
                Ask Claude
                <svg className="emcydocs-copymenu-external" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </span>
              <span className="emcydocs-copymenu-desc">Ask questions about this page</span>
            </span>
          </a>
        </div>
      ) : null}
    </div>
  );
}
