import type {
  DocsResolvedTheme,
  DocsResolvedThemeConfig,
  DocsThemeAccentStrength,
  DocsThemeConfig,
  DocsThemeDensity,
  DocsThemeMode,
  DocsThemePreset,
  DocsThemeRadius,
  DocsThemeSurfaceStyle,
  DocsThemeTokens,
} from "./types";

type ThemeSeed = {
  backgroundHue: number;
  backgroundSaturation: number;
  backgroundLightness: number;
  foregroundHue: number;
  foregroundSaturation: number;
  foregroundLightness: number;
  cardHue: number;
  cardSaturation: number;
  cardLightness: number;
  mutedHue: number;
  mutedSaturation: number;
  mutedLightness: number;
  borderHue: number;
  borderSaturation: number;
  borderLightness: number;
  mutedForegroundHue: number;
  mutedForegroundSaturation: number;
  mutedForegroundLightness: number;
  shadowHue: number;
  shadowSaturation: number;
  shadowLightness: number;
};

type AccentProfile = {
  primarySaturation: number;
  primaryLightness: number;
  ringSaturation: number;
  ringLightness: number;
  accentSaturation: number;
  accentLightness: number;
  accentForegroundSaturation: number;
  accentForegroundLightness: number;
  accentSoftSaturation: number;
  accentSoftLightness: number;
  accentSoftAlpha: number;
};

const presetAccentHues = {
  neutral: 270,
  dusk: 266,
  ocean: 196,
  sqlos: 35,
} satisfies Record<DocsThemePreset, number>;

const radiusScale = {
  md: "0.875rem",
  lg: "1.125rem",
  xl: "1.5rem",
} satisfies Record<DocsThemeRadius, string>;

const densityScale = {
  comfortable: {
    headerHeight: "3.5rem",
    pagePadding: "1.5rem",
    sidebarPadding: "1rem",
    sectionGap: "1.25rem",
    navGap: "0.125rem",
    cardPadding: "1rem",
    controlPaddingY: "0.5rem",
    controlPaddingX: "0.75rem",
    tocPaddingY: "0.375rem",
    tocPaddingX: "0.75rem",
    pageGridGap: "2rem",
  },
  compact: {
    headerHeight: "3.125rem",
    pagePadding: "1rem",
    sidebarPadding: "0.75rem",
    sectionGap: "0.875rem",
    navGap: "0.0625rem",
    cardPadding: "0.875rem",
    controlPaddingY: "0.375rem",
    controlPaddingX: "0.625rem",
    tocPaddingY: "0.25rem",
    tocPaddingX: "0.625rem",
    pageGridGap: "1.5rem",
  },
} satisfies Record<
  DocsThemeDensity,
  {
    headerHeight: string;
    pagePadding: string;
    sidebarPadding: string;
    sectionGap: string;
    navGap: string;
    cardPadding: string;
    controlPaddingY: string;
    controlPaddingX: string;
    tocPaddingY: string;
    tocPaddingX: string;
    pageGridGap: string;
  }
>;

const defaultThemeConfig = {
  color: {
    preset: "neutral",
    mode: "light",
    accentHue: presetAccentHues.neutral,
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
} satisfies Omit<DocsResolvedThemeConfig, "tokens">;

const presetSeeds = {
  neutral: {
    light: {
      backgroundHue: 220,
      backgroundSaturation: 20,
      backgroundLightness: 99,
      foregroundHue: 240,
      foregroundSaturation: 18,
      foregroundLightness: 10,
      cardHue: 220,
      cardSaturation: 28,
      cardLightness: 100,
      mutedHue: 225,
      mutedSaturation: 18,
      mutedLightness: 96,
      borderHue: 225,
      borderSaturation: 16,
      borderLightness: 88,
      mutedForegroundHue: 240,
      mutedForegroundSaturation: 8,
      mutedForegroundLightness: 43,
      shadowHue: 240,
      shadowSaturation: 15,
      shadowLightness: 10,
    },
    dark: {
      backgroundHue: 240,
      backgroundSaturation: 18,
      backgroundLightness: 8,
      foregroundHue: 0,
      foregroundSaturation: 0,
      foregroundLightness: 97,
      cardHue: 240,
      cardSaturation: 18,
      cardLightness: 11,
      mutedHue: 240,
      mutedSaturation: 12,
      mutedLightness: 16,
      borderHue: 240,
      borderSaturation: 10,
      borderLightness: 23,
      mutedForegroundHue: 240,
      mutedForegroundSaturation: 7,
      mutedForegroundLightness: 71,
      shadowHue: 240,
      shadowSaturation: 12,
      shadowLightness: 4,
    },
  },
  dusk: {
    light: {
      backgroundHue: 265,
      backgroundSaturation: 54,
      backgroundLightness: 98,
      foregroundHue: 268,
      foregroundSaturation: 32,
      foregroundLightness: 16,
      cardHue: 266,
      cardSaturation: 52,
      cardLightness: 99,
      mutedHue: 266,
      mutedSaturation: 34,
      mutedLightness: 95,
      borderHue: 265,
      borderSaturation: 24,
      borderLightness: 84,
      mutedForegroundHue: 266,
      mutedForegroundSaturation: 16,
      mutedForegroundLightness: 40,
      shadowHue: 268,
      shadowSaturation: 28,
      shadowLightness: 18,
    },
    dark: {
      backgroundHue: 262,
      backgroundSaturation: 36,
      backgroundLightness: 10,
      foregroundHue: 258,
      foregroundSaturation: 44,
      foregroundLightness: 97,
      cardHue: 261,
      cardSaturation: 32,
      cardLightness: 13,
      mutedHue: 261,
      mutedSaturation: 24,
      mutedLightness: 17,
      borderHue: 262,
      borderSaturation: 18,
      borderLightness: 27,
      mutedForegroundHue: 259,
      mutedForegroundSaturation: 14,
      mutedForegroundLightness: 73,
      shadowHue: 262,
      shadowSaturation: 32,
      shadowLightness: 5,
    },
  },
  ocean: {
    light: {
      backgroundHue: 198,
      backgroundSaturation: 58,
      backgroundLightness: 98,
      foregroundHue: 203,
      foregroundSaturation: 42,
      foregroundLightness: 16,
      cardHue: 198,
      cardSaturation: 64,
      cardLightness: 99,
      mutedHue: 197,
      mutedSaturation: 34,
      mutedLightness: 95,
      borderHue: 198,
      borderSaturation: 28,
      borderLightness: 84,
      mutedForegroundHue: 203,
      mutedForegroundSaturation: 14,
      mutedForegroundLightness: 38,
      shadowHue: 203,
      shadowSaturation: 28,
      shadowLightness: 20,
    },
    dark: {
      backgroundHue: 202,
      backgroundSaturation: 34,
      backgroundLightness: 9,
      foregroundHue: 192,
      foregroundSaturation: 50,
      foregroundLightness: 97,
      cardHue: 201,
      cardSaturation: 28,
      cardLightness: 12,
      mutedHue: 202,
      mutedSaturation: 22,
      mutedLightness: 18,
      borderHue: 202,
      borderSaturation: 18,
      borderLightness: 27,
      mutedForegroundHue: 195,
      mutedForegroundSaturation: 18,
      mutedForegroundLightness: 72,
      shadowHue: 202,
      shadowSaturation: 32,
      shadowLightness: 5,
    },
  },
  sqlos: {
    light: {
      backgroundHue: 38,
      backgroundSaturation: 48,
      backgroundLightness: 97,
      foregroundHue: 24,
      foregroundSaturation: 30,
      foregroundLightness: 16,
      cardHue: 36,
      cardSaturation: 54,
      cardLightness: 99,
      mutedHue: 38,
      mutedSaturation: 30,
      mutedLightness: 93,
      borderHue: 34,
      borderSaturation: 24,
      borderLightness: 82,
      mutedForegroundHue: 28,
      mutedForegroundSaturation: 14,
      mutedForegroundLightness: 38,
      shadowHue: 24,
      shadowSaturation: 20,
      shadowLightness: 18,
    },
    dark: {
      backgroundHue: 28,
      backgroundSaturation: 24,
      backgroundLightness: 10,
      foregroundHue: 42,
      foregroundSaturation: 32,
      foregroundLightness: 96,
      cardHue: 28,
      cardSaturation: 20,
      cardLightness: 13,
      mutedHue: 28,
      mutedSaturation: 16,
      mutedLightness: 18,
      borderHue: 30,
      borderSaturation: 14,
      borderLightness: 27,
      mutedForegroundHue: 42,
      mutedForegroundSaturation: 14,
      mutedForegroundLightness: 72,
      shadowHue: 24,
      shadowSaturation: 18,
      shadowLightness: 5,
    },
  },
} satisfies Record<DocsThemePreset, Record<DocsThemeMode, ThemeSeed>>;

const accentProfiles = {
  light: {
    soft: {
      primarySaturation: 62,
      primaryLightness: 44,
      ringSaturation: 76,
      ringLightness: 52,
      accentSaturation: 88,
      accentLightness: 96,
      accentForegroundSaturation: 52,
      accentForegroundLightness: 28,
      accentSoftSaturation: 92,
      accentSoftLightness: 95,
      accentSoftAlpha: 0.42,
    },
    balanced: {
      primarySaturation: 74,
      primaryLightness: 42,
      ringSaturation: 82,
      ringLightness: 50,
      accentSaturation: 96,
      accentLightness: 95,
      accentForegroundSaturation: 66,
      accentForegroundLightness: 26,
      accentSoftSaturation: 96,
      accentSoftLightness: 94,
      accentSoftAlpha: 0.56,
    },
    bold: {
      primarySaturation: 84,
      primaryLightness: 40,
      ringSaturation: 90,
      ringLightness: 48,
      accentSaturation: 100,
      accentLightness: 93,
      accentForegroundSaturation: 76,
      accentForegroundLightness: 24,
      accentSoftSaturation: 100,
      accentSoftLightness: 92,
      accentSoftAlpha: 0.7,
    },
  },
  dark: {
    soft: {
      primarySaturation: 66,
      primaryLightness: 67,
      ringSaturation: 78,
      ringLightness: 72,
      accentSaturation: 54,
      accentLightness: 21,
      accentForegroundSaturation: 84,
      accentForegroundLightness: 91,
      accentSoftSaturation: 86,
      accentSoftLightness: 48,
      accentSoftAlpha: 0.2,
    },
    balanced: {
      primarySaturation: 76,
      primaryLightness: 69,
      ringSaturation: 84,
      ringLightness: 75,
      accentSaturation: 64,
      accentLightness: 24,
      accentForegroundSaturation: 90,
      accentForegroundLightness: 93,
      accentSoftSaturation: 90,
      accentSoftLightness: 54,
      accentSoftAlpha: 0.24,
    },
    bold: {
      primarySaturation: 86,
      primaryLightness: 72,
      ringSaturation: 92,
      ringLightness: 78,
      accentSaturation: 72,
      accentLightness: 28,
      accentForegroundSaturation: 94,
      accentForegroundLightness: 95,
      accentSoftSaturation: 94,
      accentSoftLightness: 58,
      accentSoftAlpha: 0.32,
    },
  },
} satisfies Record<
  DocsThemeMode,
  Record<DocsThemeAccentStrength, AccentProfile>
>;

export const docsThemeDefaultConfig: DocsThemeConfig = {
  color: {
    preset: defaultThemeConfig.color.preset,
    mode: defaultThemeConfig.color.mode,
    accentStrength: defaultThemeConfig.color.accentStrength,
    surfaceStyle: defaultThemeConfig.color.surfaceStyle,
  },
  layout: {
    density: defaultThemeConfig.layout.density,
    layoutWidth: defaultThemeConfig.layout.layoutWidth,
    contentWidth: defaultThemeConfig.layout.contentWidth,
    sidebarWidth: defaultThemeConfig.layout.sidebarWidth,
    tocWidth: defaultThemeConfig.layout.tocWidth,
  },
  shape: {
    radius: defaultThemeConfig.shape.radius,
  },
};

export const docsThemePresetAccentHues = presetAccentHues;

export function mergeDocsThemeConfig(
  baseTheme?: DocsThemeConfig,
  overrideTheme?: DocsThemeConfig
): DocsThemeConfig {
  return {
    color: {
      ...(baseTheme?.color ?? {}),
      ...(overrideTheme?.color ?? {}),
    },
    layout: {
      ...(baseTheme?.layout ?? {}),
      ...(overrideTheme?.layout ?? {}),
    },
    shape: {
      ...(baseTheme?.shape ?? {}),
      ...(overrideTheme?.shape ?? {}),
    },
    tokens: {
      ...(baseTheme?.tokens ?? {}),
      ...(overrideTheme?.tokens ?? {}),
    },
  };
}

export function resolveDocsTheme(theme?: DocsThemeConfig): DocsResolvedTheme {
  const mergedTheme = mergeDocsThemeConfig(docsThemeDefaultConfig, theme);
  const preset = mergedTheme.color?.preset ?? defaultThemeConfig.color.preset;
  const mode = mergedTheme.color?.mode ?? defaultThemeConfig.color.mode;
  const accentStrength =
    mergedTheme.color?.accentStrength ?? defaultThemeConfig.color.accentStrength;
  const surfaceStyle =
    mergedTheme.color?.surfaceStyle ?? defaultThemeConfig.color.surfaceStyle;
  const accentHue =
    mergedTheme.color?.accentHue ?? docsThemePresetAccentHues[preset];
  const density = mergedTheme.layout?.density ?? defaultThemeConfig.layout.density;
  const radius = mergedTheme.shape?.radius ?? defaultThemeConfig.shape.radius;

  const tokens = {
    ...createThemeTokens({
      preset,
      mode,
      accentHue,
      accentStrength,
      surfaceStyle,
    }),
    ...(mergedTheme.tokens ?? {}),
  };

  const config: DocsResolvedThemeConfig = {
    color: {
      preset,
      mode,
      accentHue,
      accentStrength,
      surfaceStyle,
    },
    layout: {
      density,
      layoutWidth:
        mergedTheme.layout?.layoutWidth ?? defaultThemeConfig.layout.layoutWidth,
      contentWidth:
        mergedTheme.layout?.contentWidth ?? defaultThemeConfig.layout.contentWidth,
      sidebarWidth:
        mergedTheme.layout?.sidebarWidth ?? defaultThemeConfig.layout.sidebarWidth,
      tocWidth: mergedTheme.layout?.tocWidth ?? defaultThemeConfig.layout.tocWidth,
    },
    shape: {
      radius,
    },
    tokens,
  };

  const densityVars = densityScale[density];
  const style: Record<string, string> = {
    "--emcydocs-background": tokens.background,
    "--emcydocs-foreground": tokens.foreground,
    "--emcydocs-card": tokens.card,
    "--emcydocs-card-foreground": tokens.cardForeground,
    "--emcydocs-popover": tokens.popover,
    "--emcydocs-popover-foreground": tokens.popoverForeground,
    "--emcydocs-primary": tokens.primary,
    "--emcydocs-primary-foreground": tokens.primaryForeground,
    "--emcydocs-secondary": tokens.secondary,
    "--emcydocs-secondary-foreground": tokens.secondaryForeground,
    "--emcydocs-muted": tokens.muted,
    "--emcydocs-muted-foreground": tokens.mutedForeground,
    "--emcydocs-accent": tokens.accent,
    "--emcydocs-accent-foreground": tokens.accentForeground,
    "--emcydocs-destructive": tokens.error,
    "--emcydocs-border": tokens.border,
    "--emcydocs-border-strong": tokens.borderStrong,
    "--emcydocs-input": tokens.input,
    "--emcydocs-ring": tokens.ring,
    "--emcydocs-info": tokens.info,
    "--emcydocs-info-soft": tokens.infoSoft,
    "--emcydocs-warning": tokens.warning,
    "--emcydocs-warning-soft": tokens.warningSoft,
    "--emcydocs-error": tokens.error,
    "--emcydocs-error-soft": tokens.errorSoft,
    "--emcydocs-success": tokens.success,
    "--emcydocs-success-soft": tokens.successSoft,
    "--emcydocs-surface": tokens.surface,
    "--emcydocs-bg": tokens.bg,
    "--emcydocs-accent-soft": tokens.accentSoft,
    "--emcydocs-shadow-sm": tokens.shadowSm,
    "--emcydocs-shadow-lg": tokens.shadowLg,
    "--emcydocs-code-bg": tokens.codeBg,
    "--emcydocs-code-border": tokens.codeBorder,
    "--emcydocs-layout-width": config.layout.layoutWidth,
    "--emcydocs-content-width": config.layout.contentWidth,
    "--emcydocs-sidebar-width": config.layout.sidebarWidth,
    "--emcydocs-toc-width": config.layout.tocWidth,
    "--emcydocs-header-height": densityVars.headerHeight,
    "--emcydocs-page-padding": densityVars.pagePadding,
    "--emcydocs-sidebar-padding": densityVars.sidebarPadding,
    "--emcydocs-section-gap": densityVars.sectionGap,
    "--emcydocs-nav-gap": densityVars.navGap,
    "--emcydocs-card-padding": densityVars.cardPadding,
    "--emcydocs-control-padding-y": densityVars.controlPaddingY,
    "--emcydocs-control-padding-x": densityVars.controlPaddingX,
    "--emcydocs-toc-padding-y": densityVars.tocPaddingY,
    "--emcydocs-toc-padding-x": densityVars.tocPaddingX,
    "--emcydocs-page-grid-gap": densityVars.pageGridGap,
    "--emcydocs-hue": `${accentHue}`,
    "--radius": radiusScale[radius],
  };

  return {
    config,
    tokens,
    attributes: {
      preset,
      mode,
      density,
      accentStrength,
      surfaceStyle,
    },
    style,
  };
}

function createThemeTokens({
  preset,
  mode,
  accentHue,
  accentStrength,
  surfaceStyle,
}: {
  preset: DocsThemePreset;
  mode: DocsThemeMode;
  accentHue: number;
  accentStrength: DocsThemeAccentStrength;
  surfaceStyle: DocsThemeSurfaceStyle;
}): DocsThemeTokens {
  const seed = presetSeeds[preset][mode];
  const accent = accentProfiles[mode][accentStrength];

  const tokens: DocsThemeTokens = {
    background: hslToken(
      seed.backgroundHue,
      seed.backgroundSaturation,
      seed.backgroundLightness
    ),
    foreground: hslToken(
      seed.foregroundHue,
      seed.foregroundSaturation,
      seed.foregroundLightness
    ),
    card: hslToken(seed.cardHue, seed.cardSaturation, seed.cardLightness),
    cardForeground: hslToken(
      seed.foregroundHue,
      seed.foregroundSaturation,
      seed.foregroundLightness
    ),
    popover: hslToken(seed.cardHue, seed.cardSaturation, seed.cardLightness),
    popoverForeground: hslToken(
      seed.foregroundHue,
      seed.foregroundSaturation,
      seed.foregroundLightness
    ),
    primary: hslToken(accentHue, accent.primarySaturation, accent.primaryLightness),
    primaryForeground:
      mode === "light"
        ? hslToken(0, 0, 100)
        : hslToken(seed.backgroundHue, 24, 8),
    secondary: hslToken(
      seed.mutedHue,
      clamp(seed.mutedSaturation + 6, 0, 100),
      clamp(
        seed.mutedLightness + (mode === "light" ? 1 : -1),
        0,
        100
      )
    ),
    secondaryForeground: hslToken(
      seed.foregroundHue,
      seed.foregroundSaturation,
      seed.foregroundLightness
    ),
    muted: hslToken(seed.mutedHue, seed.mutedSaturation, seed.mutedLightness),
    mutedForeground: hslToken(
      seed.mutedForegroundHue,
      seed.mutedForegroundSaturation,
      seed.mutedForegroundLightness
    ),
    accent: hslToken(accentHue, accent.accentSaturation, accent.accentLightness),
    accentForeground: hslToken(
      accentHue,
      accent.accentForegroundSaturation,
      accent.accentForegroundLightness
    ),
    border: hslToken(seed.borderHue, seed.borderSaturation, seed.borderLightness),
    borderStrong: hslToken(
      seed.borderHue,
      clamp(seed.borderSaturation + 5, 0, 100),
      clamp(
        seed.borderLightness + (mode === "light" ? -8 : 8),
        0,
        100
      )
    ),
    input: hslToken(
      seed.borderHue,
      clamp(seed.borderSaturation + 2, 0, 100),
      clamp(
        seed.borderLightness + (mode === "light" ? -2 : 2),
        0,
        100
      )
    ),
    ring: hslToken(accentHue, accent.ringSaturation, accent.ringLightness),
    accentSoft: hslToken(
      accentHue,
      accent.accentSoftSaturation,
      accent.accentSoftLightness,
      accent.accentSoftAlpha
    ),
    surface: hslToken(seed.cardHue, seed.cardSaturation, seed.cardLightness),
    bg: hslToken(
      seed.backgroundHue,
      seed.backgroundSaturation,
      seed.backgroundLightness
    ),
    codeBg: hslToken(
      seed.mutedHue,
      clamp(seed.mutedSaturation + 8, 0, 100),
      clamp(seed.mutedLightness + (mode === "light" ? -1 : -2), 0, 100)
    ),
    codeBorder: hslToken(
      seed.borderHue,
      clamp(seed.borderSaturation + 4, 0, 100),
      clamp(seed.borderLightness + (mode === "light" ? -5 : 4), 0, 100)
    ),
    info: hslToken(217, 90, mode === "light" ? 56 : 68),
    infoSoft: hslToken(217, 92, mode === "light" ? 92 : 46, mode === "light" ? 0.65 : 0.2),
    warning: hslToken(38, 92, mode === "light" ? 50 : 66),
    warningSoft: hslToken(38, 94, mode === "light" ? 88 : 44, mode === "light" ? 0.72 : 0.18),
    error: hslToken(0, 82, mode === "light" ? 58 : 68),
    errorSoft: hslToken(0, 86, mode === "light" ? 92 : 46, mode === "light" ? 0.68 : 0.2),
    success: hslToken(145, 72, mode === "light" ? 36 : 60),
    successSoft: hslToken(145, 74, mode === "light" ? 90 : 42, mode === "light" ? 0.64 : 0.18),
    shadowSm: createShadow(seed, mode === "light" ? 0.08 : 0.32, 1, 2),
    shadowLg: createShadow(seed, mode === "light" ? 0.14 : 0.5, 12, 42),
  };

  return applySurfaceStyle(tokens, mode, surfaceStyle);
}

function applySurfaceStyle(
  tokens: DocsThemeTokens,
  mode: DocsThemeMode,
  surfaceStyle: DocsThemeSurfaceStyle
): DocsThemeTokens {
  if (surfaceStyle === "flat") {
    return {
      ...tokens,
      card: tokens.background,
      popover: tokens.background,
      surface: tokens.background,
      muted: shiftLightness(tokens.muted, mode === "light" ? -1 : 1),
      borderStrong: shiftLightness(tokens.borderStrong, mode === "light" ? -2 : 2),
      shadowSm: createDirectShadow(tokens.foreground, mode === "light" ? 0.03 : 0.22, 1, 2),
      shadowLg: createDirectShadow(tokens.foreground, mode === "light" ? 0.06 : 0.3, 10, 28),
    };
  }

  if (surfaceStyle === "elevated") {
    return {
      ...tokens,
      card: shiftLightness(tokens.card, mode === "light" ? 1.5 : 2.5),
      popover: shiftLightness(tokens.popover, mode === "light" ? 2 : 3),
      surface: shiftLightness(tokens.surface, mode === "light" ? 1.5 : 2.5),
      muted: shiftLightness(tokens.muted, mode === "light" ? 0.5 : -1.5),
      borderStrong: shiftLightness(tokens.borderStrong, mode === "light" ? -4 : 5),
      codeBg: shiftLightness(tokens.codeBg, mode === "light" ? -0.5 : -2),
      shadowSm: createDirectShadow(tokens.foreground, mode === "light" ? 0.1 : 0.34, 2, 6),
      shadowLg: createDirectShadow(tokens.foreground, mode === "light" ? 0.18 : 0.58, 18, 54),
    };
  }

  return {
    ...tokens,
    card: mixTokens(tokens.card, tokens.accentSoft, mode === "light" ? 0.2 : 0.14),
    popover: mixTokens(tokens.popover, tokens.accentSoft, mode === "light" ? 0.16 : 0.12),
    surface: mixTokens(tokens.surface, tokens.accentSoft, mode === "light" ? 0.24 : 0.16),
    codeBg: mixTokens(tokens.codeBg, tokens.accentSoft, mode === "light" ? 0.14 : 0.1),
  };
}

function mixTokens(baseToken: string, tintToken: string, weight: number) {
  const base = parseHslToken(baseToken);
  const tint = parseHslToken(tintToken);

  return hslToken(
    mixValue(base.hue, tint.hue, weight),
    mixValue(base.saturation, tint.saturation, weight),
    mixValue(base.lightness, tint.lightness, weight)
  );
}

function shiftLightness(token: string, delta: number) {
  const parsed = parseHslToken(token);
  return hslToken(
    parsed.hue,
    parsed.saturation,
    clamp(parsed.lightness + delta, 0, 100)
  );
}

function createShadow(
  seed: ThemeSeed,
  alpha: number,
  y: number,
  blur: number
) {
  return `${0}px ${y}px ${blur}px hsl(${seed.shadowHue} ${seed.shadowSaturation}% ${seed.shadowLightness}% / ${alpha})`;
}

function createDirectShadow(
  colorToken: string,
  alpha: number,
  y: number,
  blur: number
) {
  const color = parseHslToken(colorToken);
  return `${0}px ${y}px ${blur}px hsl(${color.hue} ${color.saturation}% ${color.lightness}% / ${alpha})`;
}

function parseHslToken(value: string) {
  const match =
    value.match(
      /^\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)%\s+(-?\d+(?:\.\d+)?)%(?:\s*\/\s*(-?\d+(?:\.\d+)?))?\s*$/
    ) ?? [];

  return {
    hue: Number(match[1] ?? 0),
    saturation: Number(match[2] ?? 0),
    lightness: Number(match[3] ?? 0),
    alpha: match[4] ? Number(match[4]) : undefined,
  };
}

function hslToken(
  hue: number,
  saturation: number,
  lightness: number,
  alpha?: number
) {
  const base = `${round(hue)} ${round(saturation)}% ${round(lightness)}%`;

  if (typeof alpha !== "number") {
    return base;
  }

  return `${base} / ${trimNumber(alpha)}`;
}

function mixValue(start: number, end: number, weight: number) {
  return start + (end - start) * weight;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function round(value: number) {
  return Math.round(value * 10) / 10;
}

function trimNumber(value: number) {
  return `${Math.round(value * 1000) / 1000}`.replace(/\.0+$/, "").replace(/(\.\d*[1-9])0+$/, "$1");
}
