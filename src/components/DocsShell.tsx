"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import type {
  DocsHeaderSlotProps,
  DocsLayoutCommonProps,
  DocsLayoutSlot,
  DocsSidebarSlotProps,
} from "../types";
import { resolveDocsTheme } from "../theme";
import { useOptionalDocsTheme } from "../theme-provider";
import DocsSearchPalette from "./DocsSearchPalette";
import DocsSearchTrigger from "./DocsSearchTrigger";
import DocsSidebar from "./DocsSidebar";
import HeadingLinks from "./HeadingLinks";
import MobileDocsChrome from "./MobileDocsChrome";

export default function DocsShell({
  navigation,
  children,
  variant = "full",
  brand,
  topLinks,
  header,
  sidebar,
  sidebarHeader,
  sidebarFooter,
  languageSwitcher,
  themeSwitcher,
  searchAction,
  locale,
  theme,
  className,
}: DocsLayoutCommonProps) {
  const pathname = usePathname();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isEmbedded = variant === "embedded";
  const themeContext = useOptionalDocsTheme();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsNavOpen(false);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isNavOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isNavOpen]);

  const currentTitle = useMemo(() => {
    const current = navigation
      .flatMap((section) => section.items)
      .find((item) => item.href === pathname);

    return current?.title ?? "Documentation";
  }, [navigation, pathname]);

  const resolvedTheme = useMemo(
    () => themeContext?.resolvedTheme ?? resolveDocsTheme(theme),
    [theme, themeContext]
  );
  const themePreset = resolvedTheme.attributes.preset;
  const hasSidebar = sidebar !== null;

  const headerSlotProps: Omit<DocsHeaderSlotProps, "isMobile"> = {
    navigation,
    brand,
    topLinks,
    languageSwitcher,
    themeSwitcher,
    searchAction,
    locale,
    currentTitle,
    isNavigationOpen: isNavOpen,
    openNavigation: () => setIsNavOpen(true),
    closeNavigation: () => setIsNavOpen(false),
    toggleNavigation: () => setIsNavOpen((current) => !current),
  };

  const sidebarSlotProps: Omit<DocsSidebarSlotProps, "isMobile"> = {
    navigation,
    locale,
    currentTitle,
    closeNavigation: () => setIsNavOpen(false),
  };

  // In embedded mode, skip rendering the docs header
  const desktopHeader = isEmbedded
    ? null
    : renderSlot(header, { ...headerSlotProps, isMobile: false }, () => (
        <div className="emcydocs-header-inner">
          <div className="emcydocs-header-brand">
            {brand ?? <span>Documentation</span>}
          </div>
          <div className="emcydocs-header-search">
            <button
              type="button"
              className="emcydocs-search-trigger"
              onClick={() => setIsSearchOpen(true)}
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
              <span className="emcydocs-search-trigger-label">Search the docs...</span>
              <span className="emcydocs-search-kbd">⌘K</span>
            </button>
          </div>
          {themeSwitcher ? (
            <div className="emcydocs-header-theme">{themeSwitcher}</div>
          ) : null}
          {languageSwitcher ? (
            <div className="emcydocs-header-language">{languageSwitcher}</div>
          ) : null}
          {topLinks?.length ? (
            <nav className="emcydocs-header-links" aria-label="Top level docs links">
              {topLinks.map((link) => (
                <a key={link.href} href={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>
          ) : null}
        </div>
      ));

  // In embedded mode, use a simpler mobile header (just nav toggle)
  const mobileHeader = isEmbedded
    ? null
    : renderSlot(header, { ...headerSlotProps, isMobile: true }, () => (
        <MobileDocsChrome
          currentTitle={currentTitle}
          isNavOpen={isNavOpen}
          onToggleNav={() => setIsNavOpen((current) => !current)}
          showNavigationToggle={hasSidebar}
        >
          <DocsSearchTrigger onClick={() => setIsSearchOpen(true)} />
          {themeSwitcher ? (
            <div className="emcydocs-mobile-theme">{themeSwitcher}</div>
          ) : null}
        </MobileDocsChrome>
      ));

  const desktopSidebar = hasSidebar
    ? renderSlot(sidebar, { ...sidebarSlotProps, isMobile: false }, () => (
        <DocsSidebar
          navigation={navigation}
          header={sidebarHeader}
          footer={sidebarFooter}
        />
      ))
    : null;

  const mobileSidebar = hasSidebar
    ? renderSlot(sidebar, { ...sidebarSlotProps, isMobile: true }, () => (
        <DocsSidebar
          navigation={navigation}
          variant="mobile"
          onNavigate={() => setIsNavOpen(false)}
          header={sidebarHeader}
          footer={sidebarFooter}
        />
      ))
    : null;

  return (
    <div
      className={[
        "emcydocs-shell",
        isEmbedded ? "emcydocs-shell-embedded" : "",
        hasSidebar ? "" : "emcydocs-shell-sidebarless",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-emcydocs-preset={themePreset}
      data-emcydocs-mode={resolvedTheme.attributes.mode}
      data-emcydocs-density={resolvedTheme.attributes.density}
      data-emcydocs-surface-style={resolvedTheme.attributes.surfaceStyle}
      data-emcydocs-accent-strength={resolvedTheme.attributes.accentStrength}
      style={resolvedTheme.style}
    >
      {desktopHeader ? <header className="emcydocs-header">{desktopHeader}</header> : null}

      {mobileHeader ? (
        <div
          className={["emcydocs-mobile-wrap", isNavOpen ? "is-open" : ""]
            .filter(Boolean)
            .join(" ")}
        >
          <div className="emcydocs-mobile-inner">{mobileHeader}</div>
          {mobileSidebar ? (
            <div className="emcydocs-mobile-inner">
              <div
                id="emcydocs-mobile-nav"
                className={["emcydocs-mobile-nav-panel", isNavOpen ? "is-open" : ""]
                  .filter(Boolean)
                  .join(" ")}
                aria-hidden={!isNavOpen}
              >
                {mobileSidebar}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* In embedded mode on mobile, show a simple nav toggle */}
      {isEmbedded && hasSidebar ? (
        <div className="emcydocs-embedded-mobile-bar">
          <DocsSearchTrigger onClick={() => setIsSearchOpen(true)} />
          <button
            type="button"
            className="emcydocs-embedded-nav-toggle"
            onClick={() => setIsNavOpen(!isNavOpen)}
            aria-expanded={isNavOpen}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {isNavOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
            <span>{isNavOpen ? "Close" : "Menu"}</span>
          </button>
          {isNavOpen && mobileSidebar ? (
            <div className="emcydocs-embedded-nav-panel">{mobileSidebar}</div>
          ) : null}
        </div>
      ) : null}

      <div className="emcydocs-frame">
        {desktopSidebar ? (
          <aside className="emcydocs-desktop-nav">{desktopSidebar}</aside>
        ) : null}
        <main className="emcydocs-main">
          <HeadingLinks />
          {children}
        </main>
      </div>

      <DocsSearchPalette
        searchAction={searchAction}
        locale={locale}
        open={isSearchOpen}
        onOpenChange={setIsSearchOpen}
        showTrigger={false}
      />
    </div>
  );
}

function renderSlot<Props>(
  slot: DocsLayoutSlot<Props> | undefined,
  props: Props,
  fallback: () => ReactNode
) {
  if (slot === undefined) {
    return fallback();
  }

  if (slot === null) {
    return null;
  }

  if (typeof slot === "function") {
    return slot(props);
  }

  return slot;
}
