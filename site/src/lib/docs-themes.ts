import type { DocsThemeConfig } from "@agenetix/docs";

export interface DocsShowcaseThemePreset {
  id: string;
  label: string;
  description: string;
  swatches: string[];
  config: DocsThemeConfig;
}

export const docsClassicTheme: DocsThemeConfig = {
  color: {
    preset: "ocean",
    mode: "light",
    accentHue: 178,
    accentStrength: "balanced",
    surfaceStyle: "tinted",
  },
  layout: {
    density: "comfortable",
    layoutWidth: "1440px",
    contentWidth: "48rem",
    sidebarWidth: "260px",
    tocWidth: "220px",
  },
  shape: {
    radius: "lg",
  },
};

export const docsAuroraTheme: DocsThemeConfig = {
  color: {
    preset: "ocean",
    mode: "dark",
    accentHue: 178,
    accentStrength: "bold",
    surfaceStyle: "tinted",
  },
  layout: {
    density: "comfortable",
    layoutWidth: "1480px",
    contentWidth: "50rem",
    sidebarWidth: "272px",
    tocWidth: "232px",
  },
  shape: {
    radius: "lg",
  },
};

export const docsShowcaseThemes: DocsShowcaseThemePreset[] = [
  {
    id: "classic-canvas",
    label: "Classic Canvas",
    description: "Aurora cyan surfaces with glass sidebar and command search.",
    swatches: ["#ecfeff", "#5eead4", "#0d9488"],
    config: docsClassicTheme,
  },
  {
    id: "aurora-night",
    label: "Aurora Night",
    description: "Deep space docs with cyan–violet glow and glass chrome.",
    swatches: ["#0a0f1a", "#22d3ee", "#a78bfa"],
    config: docsAuroraTheme,
  },
  {
    id: "mission-control",
    label: "Mission Control",
    description: "Dense, elevated dark docs for technical products and release notes.",
    swatches: ["#120d1e", "#352355", "#b58dff"],
    config: {
      color: {
        preset: "dusk",
        mode: "dark",
        accentHue: 286,
        accentStrength: "bold",
        surfaceStyle: "elevated",
      },
      layout: {
        density: "compact",
        layoutWidth: "1600px",
        contentWidth: "52rem",
        sidebarWidth: "292px",
        tocWidth: "248px",
      },
      shape: {
        radius: "xl",
      },
    },
  },
  {
    id: "sea-glass",
    label: "Sea Glass",
    description: "Bright product docs with crisp ocean surfaces and calmer chrome.",
    swatches: ["#e7fbff", "#8dd7eb", "#0d89ad"],
    config: {
      color: {
        preset: "ocean",
        mode: "light",
        accentHue: 188,
        accentStrength: "soft",
        surfaceStyle: "flat",
      },
      layout: {
        density: "comfortable",
        layoutWidth: "1480px",
        contentWidth: "50rem",
        sidebarWidth: "270px",
        tocWidth: "232px",
      },
      shape: {
        radius: "md",
      },
    },
  },
  {
    id: "sql-ops",
    label: "SQL Ops",
    description: "Warm, branded docs with stronger accent treatment and polished panels.",
    swatches: ["#fff7ea", "#f6c46c", "#d06717"],
    config: {
      color: {
        preset: "sqlos",
        mode: "dark",
        accentHue: 32,
        accentStrength: "bold",
        surfaceStyle: "tinted",
      },
      layout: {
        density: "comfortable",
        layoutWidth: "1520px",
        contentWidth: "49rem",
        sidebarWidth: "276px",
        tocWidth: "228px",
      },
      shape: {
        radius: "lg",
      },
    },
  },
];
