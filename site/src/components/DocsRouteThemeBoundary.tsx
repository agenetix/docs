"use client";

import {
  DocsThemeProvider,
  useDocsTheme,
  type DocsThemeConfig,
  type DocsThemeTokens,
} from "@agenetix/docs";
import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import DocsThemeStudio from "@/components/DocsThemeStudio";
import {
  createDocsThemeShareUrl,
  createDocsThemeStorageValue,
  DOCS_THEME_PARAM_KEY,
  DOCS_THEME_STORAGE_KEY,
  resolveStudioThemeValue,
} from "@/lib/docs-theme-studio";

interface DocsRouteThemeBoundaryProps {
  children: ReactNode;
  defaults: DocsThemeConfig;
}

interface DocsRouteThemeUiContextValue {
  defaults: DocsThemeConfig;
  isStudioOpen: boolean;
  openStudio: () => void;
  closeStudio: () => void;
  resetTheme: () => void;
  applyThemePreset: (theme: DocsThemeConfig) => void;
}

const DocsRouteThemeUiContext =
  createContext<DocsRouteThemeUiContextValue | null>(null);

export default function DocsRouteThemeBoundary({
  children,
  defaults,
}: DocsRouteThemeBoundaryProps) {
  return (
    <DocsThemeProvider initialTheme={defaults}>
      <DocsRouteThemeBoundaryInner defaults={defaults}>
        {children}
      </DocsRouteThemeBoundaryInner>
    </DocsThemeProvider>
  );
}

export function useDocsRouteThemeUi() {
  const context = useContext(DocsRouteThemeUiContext);

  if (!context) {
    throw new Error(
      "useDocsRouteThemeUi must be used inside DocsRouteThemeBoundary."
    );
  }

  return context;
}

function DocsRouteThemeBoundaryInner({
  children,
  defaults,
}: DocsRouteThemeBoundaryProps) {
  const pathname = usePathname();
  const { theme, resolvedTheme, setTheme } = useDocsTheme();
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const didLoadStoredThemeRef = useRef(false);
  const canPersistThemeRef = useRef(false);

  useEffect(() => {
    if (didLoadStoredThemeRef.current || typeof window === "undefined") {
      return;
    }

    const nextTheme = resolveStudioThemeValue(
      defaults,
      new URLSearchParams(window.location.search).get(DOCS_THEME_PARAM_KEY),
      window.localStorage.getItem(DOCS_THEME_STORAGE_KEY)
    );

    let cancelled = false;
    const frame = window.requestAnimationFrame(() => {
      if (cancelled || didLoadStoredThemeRef.current) {
        return;
      }

      didLoadStoredThemeRef.current = true;
      canPersistThemeRef.current = true;
      setTheme(nextTheme);
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
  }, [defaults, setTheme]);

  useEffect(() => {
    if (!canPersistThemeRef.current || typeof window === "undefined") {
      return;
    }

    const storageValue = createDocsThemeStorageValue(theme, defaults);

    if (storageValue === "{}") {
      window.localStorage.removeItem(DOCS_THEME_STORAGE_KEY);
    } else {
      window.localStorage.setItem(DOCS_THEME_STORAGE_KEY, storageValue);
    }

    const nextUrl = createDocsThemeShareUrl(
      pathname || window.location.pathname,
      window.location.search,
      theme,
      defaults
    );

    if (nextUrl !== `${window.location.pathname}${window.location.search}`) {
      window.history.replaceState(window.history.state, "", nextUrl);
    }
  }, [defaults, pathname, theme]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const root = document.documentElement;
    const body = document.body;
    const previousColorScheme = root.style.colorScheme;
    const previousBodyBackground = body.style.backgroundColor;
    const previousBodyColor = body.style.color;

    root.style.colorScheme = resolvedTheme.attributes.mode;
    body.style.backgroundColor = `hsl(${resolvedTheme.tokens.background})`;
    body.style.color = `hsl(${resolvedTheme.tokens.foreground})`;

    return () => {
      root.style.colorScheme = previousColorScheme;
      body.style.backgroundColor = previousBodyBackground;
      body.style.color = previousBodyColor;
    };
  }, [resolvedTheme]);

  const routeStyle = useMemo(
    () => buildDocsRouteThemeStyle(resolvedTheme.style, resolvedTheme.tokens),
    [resolvedTheme.style, resolvedTheme.tokens]
  );

  const uiValue = useMemo<DocsRouteThemeUiContextValue>(
    () => ({
      defaults,
      isStudioOpen,
      openStudio: () => setIsStudioOpen(true),
      closeStudio: () => setIsStudioOpen(false),
      resetTheme: () => {
        setTheme(defaults);
      },
      applyThemePreset: (nextTheme) => {
        setTheme(nextTheme);
      },
    }),
    [defaults, isStudioOpen, setTheme]
  );

  return (
    <DocsRouteThemeUiContext.Provider value={uiValue}>
      <div
        className="min-h-screen bg-background text-foreground transition-colors"
        data-agenetixdocs-route-theme="true"
        data-agenetixdocs-preset={resolvedTheme.attributes.preset}
        data-agenetixdocs-mode={resolvedTheme.attributes.mode}
        style={routeStyle}
      >
        {children}
        <DocsThemeStudio />
      </div>
    </DocsRouteThemeUiContext.Provider>
  );
}

function buildDocsRouteThemeStyle(
  themeStyle: Record<string, string>,
  tokens: DocsThemeTokens
) {
  return {
    ...themeStyle,
    "--background": tokens.background,
    "--foreground": tokens.foreground,
    "--card": tokens.card,
    "--card-foreground": tokens.cardForeground,
    "--popover": tokens.popover,
    "--popover-foreground": tokens.popoverForeground,
    "--primary": tokens.primary,
    "--primary-foreground": tokens.primaryForeground,
    "--secondary": tokens.secondary,
    "--secondary-foreground": tokens.secondaryForeground,
    "--muted": tokens.muted,
    "--muted-foreground": tokens.mutedForeground,
    "--accent": tokens.accent,
    "--accent-foreground": tokens.accentForeground,
    "--destructive": tokens.error,
    "--destructive-foreground": tokens.primaryForeground,
    "--border": tokens.border,
    "--input": tokens.input,
    "--ring": tokens.ring,
  } as CSSProperties;
}
