import { describe, expect, it } from "vitest";
import { mergeDocsThemeConfig, resolveDocsTheme } from "../src";
import {
  createDocsThemeShareUrl,
  createDocsThemeStorageValue,
  decodeDocsThemeParam,
  DOCS_THEME_PARAM_KEY,
  encodeDocsThemeParam,
  normalizeDocsThemeConfig,
  resolveStudioThemeValue,
} from "../site/src/lib/docs-theme-studio";
import { docsClassicTheme } from "../site/src/lib/docs-themes";

describe("docs theme studio helpers", () => {
  it("prefers the URL theme over local storage during hydration", () => {
    const urlTheme = mergeDocsThemeConfig(docsClassicTheme, {
      color: {
        preset: "ocean",
        mode: "dark",
        accentHue: 188,
      },
    });
    const storedTheme = mergeDocsThemeConfig(docsClassicTheme, {
      color: {
        preset: "sqlos",
        mode: "light",
      },
    });

    const resolvedTheme = resolveStudioThemeValue(
      docsClassicTheme,
      encodeDocsThemeParam(urlTheme, docsClassicTheme),
      createDocsThemeStorageValue(storedTheme, docsClassicTheme)
    );

    expect(resolveDocsTheme(resolvedTheme).config.color.preset).toBe("ocean");
    expect(resolveDocsTheme(resolvedTheme).config.color.mode).toBe("dark");
  });

  it("stores only non-default overrides for persistence", () => {
    expect(createDocsThemeStorageValue(docsClassicTheme, docsClassicTheme)).toBe("{}");

    const customTheme = mergeDocsThemeConfig(docsClassicTheme, {
      layout: {
        density: "compact",
      },
    });
    const storedValue = JSON.parse(
      createDocsThemeStorageValue(customTheme, docsClassicTheme)
    ) as ReturnType<typeof normalizeDocsThemeConfig>;

    expect(storedValue.layout?.density).toBe("compact");
    expect(storedValue.color).toBeUndefined();
  });

  it("round-trips share URLs back into the same theme state", () => {
    const customTheme = mergeDocsThemeConfig(docsClassicTheme, {
      color: {
        preset: "dusk",
        mode: "dark",
        accentHue: 286,
        accentStrength: "bold",
      },
      layout: {
        density: "compact",
      },
      tokens: {
        primary: "286 84% 58%",
      },
    });

    const sharePath = createDocsThemeShareUrl(
      "/docs",
      "?tab=theme",
      customTheme,
      docsClassicTheme
    );
    const shareUrl = new URL(`https://mcpstackdocs.dev${sharePath}`);
    const decodedTheme = decodeDocsThemeParam(
      shareUrl.searchParams.get(DOCS_THEME_PARAM_KEY)
    );
    const hydratedTheme = resolveStudioThemeValue(
      docsClassicTheme,
      shareUrl.searchParams.get(DOCS_THEME_PARAM_KEY),
      null
    );

    expect(shareUrl.searchParams.get("tab")).toBe("theme");
    expect(decodedTheme?.color?.preset).toBe("dusk");
    expect(decodedTheme?.tokens?.primary).toBe("286 84% 58%");
    expect(resolveDocsTheme(hydratedTheme).config.color.preset).toBe("dusk");
    expect(resolveDocsTheme(hydratedTheme).config.layout.density).toBe("compact");
    expect(resolveDocsTheme(hydratedTheme).tokens.primary).toBe("286 84% 58%");
  });
});
