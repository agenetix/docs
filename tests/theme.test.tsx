import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DocsThemeProvider, useDocsTheme } from "../src";
import DocsLayout from "../src/components/DocsLayout";
import { resolveDocsTheme } from "../src/theme";
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
        locale: "en",
        contentLocale: "en",
        availableLocales: ["en"],
        isHome: false,
      },
    ],
  },
];

describe("theme resolver", () => {
  it("normalizes nested config, derives tokens, and applies overrides last", () => {
    const resolvedTheme = resolveDocsTheme({
      color: {
        preset: "ocean",
        mode: "dark",
        accentHue: 182,
        accentStrength: "bold",
        surfaceStyle: "elevated",
      },
      layout: {
        density: "compact",
        layoutWidth: "1500px",
      },
      shape: {
        radius: "xl",
      },
      tokens: {
        background: "210 50% 10%",
      },
    });

    expect(resolvedTheme.config.color.preset).toBe("ocean");
    expect(resolvedTheme.config.color.mode).toBe("dark");
    expect(resolvedTheme.config.color.accentHue).toBe(182);
    expect(resolvedTheme.config.layout.density).toBe("compact");
    expect(resolvedTheme.config.layout.layoutWidth).toBe("1500px");
    expect(resolvedTheme.config.shape.radius).toBe("xl");
    expect(resolvedTheme.tokens.background).toBe("210 50% 10%");
    expect(resolvedTheme.tokens.primary.startsWith("182 ")).toBe(true);
    expect(resolvedTheme.style["--radius"]).toBe("1.5rem");
    expect(resolvedTheme.style["--emcydocs-page-padding"]).toBe("1rem");
    expect(resolvedTheme.style["--emcydocs-code-bg"]).toBeTruthy();
  });
});

describe("theme provider", () => {
  it("lets provider state drive DocsLayout and override the theme prop", async () => {
    render(
      <DocsThemeProvider
        initialTheme={{
          color: {
            preset: "neutral",
            mode: "light",
          },
        }}
      >
        <ThemeTestControl />
        <DocsLayout
          navigation={navigation}
          variant="embedded"
          theme={{
            color: {
              preset: "sqlos",
              mode: "dark",
            },
          }}
        >
          <div>Docs body</div>
        </DocsLayout>
      </DocsThemeProvider>
    );

    const shell = document.querySelector(".emcydocs-shell") as HTMLElement;

    expect(shell.dataset.emcydocsPreset).toBe("neutral");
    expect(shell.dataset.emcydocsMode).toBe("light");

    fireEvent.click(screen.getByRole("button", { name: "Apply ocean compact" }));

    await waitFor(() => {
      expect(shell.dataset.emcydocsPreset).toBe("ocean");
      expect(shell.dataset.emcydocsMode).toBe("dark");
      expect(shell.dataset.emcydocsDensity).toBe("compact");
      expect(shell.dataset.emcydocsSurfaceStyle).toBe("elevated");
      expect(shell.style.getPropertyValue("--radius")).toBe("1.5rem");
      expect(shell.style.getPropertyValue("--emcydocs-sidebar-width")).toBe("300px");
    });
  });
});

function ThemeTestControl() {
  const { updateTheme } = useDocsTheme();

  return (
    <button
      type="button"
      onClick={() =>
        updateTheme({
          color: {
            preset: "ocean",
            mode: "dark",
            accentHue: 188,
            accentStrength: "bold",
            surfaceStyle: "elevated",
          },
          layout: {
            density: "compact",
            sidebarWidth: "300px",
          },
          shape: {
            radius: "xl",
          },
        })
      }
    >
      Apply ocean compact
    </button>
  );
}
