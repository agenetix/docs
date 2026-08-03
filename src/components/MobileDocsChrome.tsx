"use client";

import type { ReactNode } from "react";

export default function MobileDocsChrome({
  currentTitle,
  isNavOpen,
  onToggleNav,
  showNavigationToggle = true,
  children,
}: {
  currentTitle: string;
  isNavOpen: boolean;
  onToggleNav: () => void;
  showNavigationToggle?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="emcydocs-mobile">
      <div className="emcydocs-mobile-row">
        <span className="emcydocs-mobile-title">{currentTitle}</span>
        <div className="emcydocs-mobile-actions">
          {children}
          {showNavigationToggle ? (
            <button
              type="button"
              className="emcydocs-mobile-toggle"
              aria-controls="emcydocs-mobile-nav"
              aria-expanded={isNavOpen}
              aria-label={isNavOpen ? "Close menu" : "Open menu"}
              data-state={isNavOpen ? "open" : "closed"}
              onClick={onToggleNav}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {isNavOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
