"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import type { DocsNavSection } from "../types";
import { isActiveDocsPath } from "../utils";

export default function DocsSidebar({
  navigation,
  variant = "desktop",
  onNavigate,
  header,
  footer,
}: {
  navigation: DocsNavSection[];
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
  header?: ReactNode;
  footer?: ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const sections = useMemo(
    () => navigation.filter((section) => section.items.length > 0),
    [navigation]
  );
  const sidebarStateKey = useMemo(
    () =>
      variant === "mobile"
        ? `mobile:${pathname}:${sections.map((section) => section.key).join("|")}`
        : variant,
    [pathname, sections, variant]
  );

  return (
    <DocsSidebarContent
      key={sidebarStateKey}
      sections={sections}
      pathname={pathname}
      variant={variant}
      onNavigate={onNavigate}
      header={header}
      footer={footer}
    />
  );
}

function DocsSidebarContent({
  sections,
  pathname,
  variant,
  onNavigate,
  header,
  footer,
}: {
  sections: DocsNavSection[];
  pathname: string;
  variant: "desktop" | "mobile";
  onNavigate?: () => void;
  header?: ReactNode;
  footer?: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(() =>
    getInitialCollapsedState(sections, pathname, variant)
  );
  const isDesktop = variant === "desktop";

  return (
    <div className={isDesktop ? "agenetixdocs-sidebar" : "agenetixdocs-sidebar-mobile"}>
      {header ? <div className="agenetixdocs-sidebar-header">{header}</div> : null}
      <nav aria-label="Documentation navigation" className="agenetixdocs-sidebar-scroll">
        {sections.map((section) => {
          const isCollapsed = collapsed[section.key] ?? false;
          const sectionId = `agenetixdocs-sidebar-section-${section.key || "root"}`;

          return (
            <section key={section.key || "root"} className="agenetixdocs-sidebar-section">
              {isDesktop ? (
                <h3 className="agenetixdocs-sidebar-section-label">{section.label}</h3>
              ) : (
                <button
                  type="button"
                  className="agenetixdocs-sidebar-section-toggle"
                  aria-controls={sectionId}
                  aria-expanded={!isCollapsed}
                  onClick={() =>
                    setCollapsed((current) => ({
                      ...current,
                      [section.key]: !current[section.key],
                    }))
                  }
                >
                  <span>{section.label}</span>
                  <span aria-hidden="true">{isCollapsed ? "+" : "−"}</span>
                </button>
              )}
              {(!isCollapsed || isDesktop) && (
                <ul id={sectionId} className="agenetixdocs-sidebar-list">
                  {section.items.map((item) => {
                    const depth = Math.max(0, item.slugs.length - 1);
                    const isActive = isActiveDocsPath(pathname, item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={[
                            "agenetixdocs-sidebar-link",
                            isActive ? "is-active" : "",
                            depth > 0 ? "is-nested" : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                          style={depth > 0 ? { paddingLeft: `${0.75 + depth * 0.5}rem` } : undefined}
                          onClick={onNavigate}
                        >
                          {item.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          );
        })}
      </nav>
      {footer ? <div className="agenetixdocs-sidebar-footer">{footer}</div> : null}
    </div>
  );
}

function getInitialCollapsedState(
  sections: DocsNavSection[],
  pathname: string,
  variant: "desktop" | "mobile"
) {
  if (variant !== "mobile") {
    return {};
  }

  const activeSection = sections.find((section) =>
    section.items.some((item) => isActiveDocsPath(pathname, item.href))
  );
  const expandedSectionKey = activeSection?.key ?? sections[0]?.key;

  return sections.reduce<Record<string, boolean>>((state, section) => {
    state[section.key] = section.key !== expandedSectionKey;
    return state;
  }, {});
}
