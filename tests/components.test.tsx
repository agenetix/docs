import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DocsSidebar from "../src/components/DocsSidebar";
import DocsToc from "../src/components/DocsToc";
import type { DocsNavSection } from "../src/types";

vi.mock("next/navigation", () => ({
  usePathname: () => "/docs/getting-started",
}));

const navigation: DocsNavSection[] = [
  {
    key: "getting-started",
    label: "Getting Started",
    items: [
      {
        slug: "getting-started",
        slugs: ["getting-started"],
        href: "/docs/getting-started",
        title: "Getting started",
        description: "Intro",
        order: 1,
        section: "getting-started",
        sectionLabel: "Getting Started",
        group: null,
        groupLabel: null,
        sidebar: true,
        locale: "en",
        contentLocale: "en",
        availableLocales: ["en"],
        isHome: false,
      },
    ],
    groups: [
      {
        key: "social",
        label: "Social",
        items: [
          {
            slug: "getting-started/google",
            slugs: ["getting-started", "google"],
            href: "/docs/getting-started/google",
            title: "Google",
            description: "Social",
            order: 2,
            section: "getting-started",
            sectionLabel: "Getting Started",
            group: "social",
            groupLabel: "Social",
            sidebar: true,
            locale: "en",
            contentLocale: "en",
            availableLocales: ["en"],
            isHome: false,
          },
        ],
        groups: [],
      },
    ],
  },
  {
    key: "reference",
    label: "Reference",
    items: [
      {
        slug: "reference/api",
        slugs: ["reference", "api"],
        href: "/docs/reference/api",
        title: "API reference",
        description: "API",
        order: 1,
        section: "reference",
        sectionLabel: "Reference",
        group: null,
        groupLabel: null,
        sidebar: true,
        locale: "en",
        contentLocale: "en",
        availableLocales: ["en"],
        isHome: false,
      },
    ],
    groups: [],
  },
];

describe("docs components", () => {
  it("renders sidebar navigation and marks the active link", () => {
    render(<DocsSidebar navigation={navigation} />);

    const link = screen.getByRole("link", { name: "Getting started" });
    expect(link).toHaveAttribute("href", "/docs/getting-started");
    expect(link.className).toContain("is-active");
    expect(screen.queryByRole("link", { name: "API reference" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Google" })).not.toBeInTheDocument();
  });

  it("collapses inactive desktop sections and expands a nested group on demand", () => {
    render(<DocsSidebar navigation={navigation} />);

    fireEvent.click(screen.getByRole("button", { name: /Social/ }));
    expect(screen.getByRole("link", { name: "Google" })).toHaveAttribute(
      "href",
      "/docs/getting-started/google"
    );

    fireEvent.click(screen.getByRole("button", { name: /Reference/ }));
    expect(screen.getByRole("link", { name: "API reference" })).toBeInTheDocument();
  });

  it("renders the table of contents from server-provided headings", () => {
    render(
      <DocsToc
        headings={[
          { id: "authentication", text: "Authentication", level: 2 },
          { id: "search", text: "Search", level: 3 },
        ]}
      />
    );

    expect(screen.getByText("On this page")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Authentication" })).toHaveAttribute(
      "href",
      "#authentication"
    );
    expect(screen.getByRole("link", { name: "Search" })).toHaveAttribute(
      "href",
      "#search"
    );
  });
});
