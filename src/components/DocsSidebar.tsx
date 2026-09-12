"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import type { DocsNavItem, DocsNavSection } from "../types";
import { flattenNavItems, isActiveDocsPath } from "../utils";

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
    () => navigation.filter((section) => hasVisibleItems(section)),
    [navigation]
  );
  const sidebarStateKey = `${variant}:${pathname}:${sections
    .map((section) => section.key)
    .join("|")}`;

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
    getInitialCollapsedState(sections, pathname)
  );
  const isDesktop = variant === "desktop";

  return (
    <div className={isDesktop ? "emcydocs-sidebar" : "emcydocs-sidebar-mobile"}>
      {header ? <div className="emcydocs-sidebar-header">{header}</div> : null}
      <nav aria-label="Documentation navigation" className="emcydocs-sidebar-scroll">
        {sections.map((section) => (
          <NavBranch
            key={section.key || "root"}
            section={section}
            collapseKey={section.key || "root"}
            depth={0}
            collapsed={collapsed}
            pathname={pathname}
            onToggle={(key) =>
              setCollapsed((current) => ({
                ...current,
                [key]: !(current[key] ?? false),
              }))
            }
            onNavigate={onNavigate}
          />
        ))}
      </nav>
      {footer ? <div className="emcydocs-sidebar-footer">{footer}</div> : null}
    </div>
  );
}

function NavBranch({
  section,
  collapseKey,
  depth,
  collapsed,
  pathname,
  onToggle,
  onNavigate,
}: {
  section: DocsNavSection;
  collapseKey: string;
  depth: number;
  collapsed: Record<string, boolean>;
  pathname: string;
  onToggle: (key: string) => void;
  onNavigate?: () => void;
}) {
  const isCollapsed = collapsed[collapseKey] ?? false;
  const sectionId = `emcydocs-sidebar-section-${collapseKey.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  const isGroup = depth > 0;

  return (
    <section
      className={isGroup ? "emcydocs-sidebar-group" : "emcydocs-sidebar-section"}
    >
      <button
        type="button"
        className={
          isGroup
            ? "emcydocs-sidebar-group-toggle"
            : "emcydocs-sidebar-section-toggle"
        }
        aria-controls={sectionId}
        aria-expanded={!isCollapsed}
        onClick={() => onToggle(collapseKey)}
      >
        <span>{section.label}</span>
        <span aria-hidden="true">{isCollapsed ? "+" : "−"}</span>
      </button>
      {!isCollapsed ? (
        <ul id={sectionId} className="emcydocs-sidebar-list">
          {section.items.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              pathname={pathname}
              onNavigate={onNavigate}
            />
          ))}
          {section.groups.map((group) => (
            <li key={group.key} className="emcydocs-sidebar-group-item">
              <NavBranch
                section={group}
                collapseKey={`${collapseKey}::${group.key}`}
                depth={depth + 1}
                collapsed={collapsed}
                pathname={pathname}
                onToggle={onToggle}
                onNavigate={onNavigate}
              />
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

function NavLink({
  item,
  pathname,
  onNavigate,
}: {
  item: DocsNavItem;
  pathname: string;
  onNavigate?: () => void;
}) {
  const isActive = isActiveDocsPath(pathname, item.href);
  return (
    <li>
      <Link
        href={item.href}
        className={["emcydocs-sidebar-link", isActive ? "is-active" : ""]
          .filter(Boolean)
          .join(" ")}
        onClick={onNavigate}
      >
        {item.title}
      </Link>
    </li>
  );
}

function hasVisibleItems(section: DocsNavSection): boolean {
  return flattenNavItems([section]).length > 0;
}

function collectActiveKeys(sections: DocsNavSection[], pathname: string): string[] {
  const keys: string[] = [];

  for (const section of sections) {
    const sectionKey = section.key || "root";
    if (sectionContainsPath(section, pathname)) {
      keys.push(sectionKey);
      for (const group of section.groups) {
        if (sectionContainsPath(group, pathname)) {
          keys.push(`${sectionKey}::${group.key}`);
        }
      }
    }
  }

  return keys;
}

function sectionContainsPath(section: DocsNavSection, pathname: string): boolean {
  return flattenNavItems([section]).some((item) => isActiveDocsPath(pathname, item.href));
}

function getInitialCollapsedState(sections: DocsNavSection[], pathname: string) {
  const activeKeys = new Set(collectActiveKeys(sections, pathname));
  const state: Record<string, boolean> = {};

  for (const section of sections) {
    const sectionKey = section.key || "root";
    const sectionIsActive = activeKeys.has(sectionKey);
    state[sectionKey] = !sectionIsActive;

    for (const group of section.groups) {
      const groupKey = `${sectionKey}::${group.key}`;
      state[groupKey] = !(sectionIsActive && activeKeys.has(groupKey));
    }
  }

  if (activeKeys.size === 0 && sections[0]) {
    state[sections[0].key || "root"] = false;
  }

  return state;
}
