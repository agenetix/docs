import {
  docsThemePresetAccentHues,
  mergeDocsThemeConfig,
  resolveDocsTheme,
  type DocsThemeAccentStrength,
  type DocsThemeConfig,
  type DocsThemeDensity,
  type DocsThemeMode,
  type DocsThemePreset,
  type DocsThemeRadius,
  type DocsThemeSurfaceStyle,
  type DocsThemeTokens,
} from "@agenetix/docs";

export const DOCS_THEME_STORAGE_KEY = "agenetixdocs-docs-theme-v2";
export const DOCS_THEME_PARAM_KEY = "docsTheme";

export const docsThemePresetOptions: Array<{
  id: DocsThemePreset;
  label: string;
  description: string;
}> = [
  {
    id: "neutral",
    label: "Neutral",
    description: "Clean, balanced docs surfaces for product and API content.",
  },
  {
    id: "dusk",
    label: "Dusk",
    description: "Richer purple-tinted panels for darker editorial or release-focused docs.",
  },
  {
    id: "ocean",
    label: "Ocean",
    description: "Sharper blue-cyan chrome for technical or infrastructure docs.",
  },
  {
    id: "sqlos",
    label: "SqlOS",
    description: "Warm branded surfaces with more product personality.",
  },
];

export const docsThemeModeOptions: DocsThemeMode[] = ["light", "dark"];
export const docsThemeDensityOptions: DocsThemeDensity[] = [
  "comfortable",
  "compact",
];
export const docsThemeRadiusOptions: DocsThemeRadius[] = ["md", "lg", "xl"];
export const docsThemeAccentStrengthOptions: DocsThemeAccentStrength[] = [
  "soft",
  "balanced",
  "bold",
];
export const docsThemeSurfaceStyleOptions: DocsThemeSurfaceStyle[] = [
  "flat",
  "tinted",
  "elevated",
];

export const docsThemeLayoutPresets = [
  {
    id: "compact",
    label: "Compact",
    description: "Dense navigation and tighter reading measure.",
    layout: {
      density: "compact" as const,
      layoutWidth: "1320px",
      contentWidth: "44rem",
      sidebarWidth: "230px",
      tocWidth: "204px",
    },
  },
  {
    id: "balanced",
    label: "Balanced",
    description: "Roomy enough for prose without wasting shell space.",
    layout: {
      density: "comfortable" as const,
      layoutWidth: "1440px",
      contentWidth: "48rem",
      sidebarWidth: "260px",
      tocWidth: "220px",
    },
  },
  {
    id: "wide",
    label: "Wide",
    description: "Bigger shell and rails for technical docs or design systems.",
    layout: {
      density: "comfortable" as const,
      layoutWidth: "1600px",
      contentWidth: "52rem",
      sidebarWidth: "300px",
      tocWidth: "248px",
    },
  },
];

export const docsThemeAccentSwatches = [
  { label: "Violet", hue: 270 },
  { label: "Indigo", hue: 245 },
  { label: "Blue", hue: 216 },
  { label: "Cyan", hue: 192 },
  { label: "Teal", hue: 170 },
  { label: "Emerald", hue: 145 },
  { label: "Amber", hue: 38 },
  { label: "Rose", hue: 350 },
];

export const docsThemeTokenControls: Array<{
  key: keyof Pick<
    DocsThemeTokens,
    "background" | "foreground" | "card" | "border" | "primary" | "accent" | "codeBg"
  >;
  label: string;
}> = [
  { key: "background", label: "Background" },
  { key: "foreground", label: "Foreground" },
  { key: "card", label: "Card" },
  { key: "border", label: "Border" },
  { key: "primary", label: "Primary" },
  { key: "accent", label: "Accent Surface" },
  { key: "codeBg", label: "Code Surface" },
];

export function resolveStudioThemeValue(
  defaults: DocsThemeConfig,
  searchParamValue: string | null,
  storedValue: string | null
) {
  const themeFromUrl = decodeDocsThemeParam(searchParamValue);
  if (themeFromUrl) {
    return mergeDocsThemeConfig(defaults, themeFromUrl);
  }

  if (storedValue) {
    try {
      const parsed = JSON.parse(storedValue) as DocsThemeConfig;
      return mergeDocsThemeConfig(defaults, parsed);
    } catch {
      return defaults;
    }
  }

  return defaults;
}

export function normalizeDocsThemeConfig(theme: DocsThemeConfig) {
  const resolved = resolveDocsTheme(theme);

  return compactDocsThemeConfig({
    color: {
      ...resolved.config.color,
    },
    layout: {
      ...resolved.config.layout,
    },
    shape: {
      ...resolved.config.shape,
    },
    tokens: {
      ...resolved.config.tokens,
    },
  });
}

export function encodeDocsThemeParam(
  theme: DocsThemeConfig,
  defaults: DocsThemeConfig
) {
  const diff = diffDocsThemeConfig(defaults, theme);
  const normalizedDiff = compactDocsThemeConfig(diff);

  if (isEmptyThemeConfig(normalizedDiff)) {
    return "";
  }

  return toBase64Url(JSON.stringify(normalizedDiff));
}

export function createDocsThemeStorageValue(
  theme: DocsThemeConfig,
  defaults: DocsThemeConfig
) {
  return JSON.stringify(compactDocsThemeConfig(diffDocsThemeConfig(defaults, theme)));
}

export function decodeDocsThemeParam(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(fromBase64Url(value)) as DocsThemeConfig;
  } catch {
    return null;
  }
}

export function createDocsThemeShareUrl(
  pathname: string,
  currentSearch: string,
  theme: DocsThemeConfig,
  defaults: DocsThemeConfig
) {
  const url = new URL(pathname + currentSearch, "http://agenetixdocs.local");
  const encoded = encodeDocsThemeParam(theme, defaults);

  if (encoded) {
    url.searchParams.set(DOCS_THEME_PARAM_KEY, encoded);
  } else {
    url.searchParams.delete(DOCS_THEME_PARAM_KEY);
  }

  return `${url.pathname}${url.search}`;
}

export function buildThemeStylePreview(theme: DocsThemeConfig) {
  const resolved = resolveDocsTheme(theme);

  return {
    background: `linear-gradient(135deg, hsl(${resolved.tokens.primary}) 0%, hsl(${resolved.tokens.accent}) 100%)`,
    borderColor: `hsl(${resolved.tokens.border})`,
    color: `hsl(${resolved.tokens.foreground})`,
  };
}

export function getPresetAccentHue(preset: DocsThemePreset) {
  return docsThemePresetAccentHues[preset];
}

export function hslTokenToHex(token: string) {
  const [hue, saturation, lightness] = parseHslToken(token);
  return hslToHex(hue, saturation, lightness);
}

export function hexToHslToken(hex: string) {
  const [hue, saturation, lightness] = hexToHsl(hex);
  return `${round(hue)} ${round(saturation)}% ${round(lightness)}%`;
}

export function compactDocsThemeConfig(theme: DocsThemeConfig): DocsThemeConfig {
  return {
    ...(theme.color && Object.keys(theme.color).length > 0
      ? { color: theme.color }
      : {}),
    ...(theme.layout && Object.keys(theme.layout).length > 0
      ? { layout: theme.layout }
      : {}),
    ...(theme.shape && Object.keys(theme.shape).length > 0
      ? { shape: theme.shape }
      : {}),
    ...(theme.tokens && Object.keys(theme.tokens).length > 0
      ? { tokens: theme.tokens }
      : {}),
  };
}

function diffDocsThemeConfig(
  defaults: DocsThemeConfig,
  value: DocsThemeConfig
): DocsThemeConfig {
  const normalizedDefaults = normalizeDocsThemeConfig(defaults);
  const normalizedValue = normalizeDocsThemeConfig(value);

  const diff: DocsThemeConfig = {
    color: diffSection(normalizedDefaults.color, normalizedValue.color),
    layout: diffSection(normalizedDefaults.layout, normalizedValue.layout),
    shape: diffSection(normalizedDefaults.shape, normalizedValue.shape),
    tokens: diffSection(normalizedDefaults.tokens, normalizedValue.tokens),
  };

  return compactDocsThemeConfig(diff);
}

function diffSection<TSection extends object | undefined>(
  defaults: TSection,
  value: TSection
) {
  const base = (defaults ?? {}) as Record<string, string | number | undefined>;
  const next = (value ?? {}) as Record<string, string | number | undefined>;
  const diff: Record<string, string | number> = {};

  Object.entries(next).forEach(([key, currentValue]) => {
    if (currentValue === undefined) {
      return;
    }

    if (base[key] !== currentValue) {
      diff[key] = currentValue;
    }
  });

  return Object.keys(diff).length > 0 ? (diff as unknown as TSection) : undefined;
}

function isEmptyThemeConfig(theme: DocsThemeConfig) {
  return (
    !theme.color &&
    !theme.layout &&
    !theme.shape &&
    !theme.tokens
  );
}

function parseHslToken(token: string) {
  const match =
    token.match(
      /^\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)%\s+(-?\d+(?:\.\d+)?)%/
    ) ?? [];

  return [
    Number(match[1] ?? 0),
    Number(match[2] ?? 0),
    Number(match[3] ?? 0),
  ] as const;
}

function toBase64Url(value: string) {
  const encoded = encodeBase64(value);
  return encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  return decodeBase64(`${normalized}${padding}`);
}

function hslToHex(hue: number, saturation: number, lightness: number) {
  const s = saturation / 100;
  const l = lightness / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = l - c / 2;

  let red = 0;
  let green = 0;
  let blue = 0;

  if (hue < 60) {
    red = c;
    green = x;
  } else if (hue < 120) {
    red = x;
    green = c;
  } else if (hue < 180) {
    green = c;
    blue = x;
  } else if (hue < 240) {
    green = x;
    blue = c;
  } else if (hue < 300) {
    red = x;
    blue = c;
  } else {
    red = c;
    blue = x;
  }

  return `#${[red, green, blue]
    .map((channel) => Math.round((channel + m) * 255).toString(16).padStart(2, "0"))
    .join("")}`;
}

function hexToHsl(hex: string) {
  const normalized = hex.replace("#", "");
  const bigint = parseInt(normalized, 16);
  const red = ((bigint >> 16) & 255) / 255;
  const green = ((bigint >> 8) & 255) / 255;
  const blue = (bigint & 255) / 255;

  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  const lightness = (max + min) / 2;

  let hue = 0;
  let saturation = 0;

  if (delta !== 0) {
    saturation = delta / (1 - Math.abs(2 * lightness - 1));

    switch (max) {
      case red:
        hue = 60 * (((green - blue) / delta) % 6);
        break;
      case green:
        hue = 60 * ((blue - red) / delta + 2);
        break;
      default:
        hue = 60 * ((red - green) / delta + 4);
        break;
    }
  }

  if (hue < 0) {
    hue += 360;
  }

  return [hue, saturation * 100, lightness * 100] as const;
}

function round(value: number) {
  return Math.round(value * 10) / 10;
}

function encodeBase64(value: string) {
  if (typeof window !== "undefined" && typeof window.btoa === "function") {
    return window.btoa(unescape(encodeURIComponent(value)));
  }

  return Buffer.from(value, "utf8").toString("base64");
}

function decodeBase64(value: string) {
  if (typeof window !== "undefined" && typeof window.atob === "function") {
    return decodeURIComponent(escape(window.atob(value)));
  }

  return Buffer.from(value, "base64").toString("utf8");
}
