"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { DocsResolvedTheme, DocsThemeConfig } from "./types.js";
import { resolveDocsTheme } from "./theme.js";

interface DocsThemeContextValue {
  theme: DocsThemeConfig;
  resolvedTheme: DocsResolvedTheme;
  setTheme: Dispatch<SetStateAction<DocsThemeConfig>>;
  updateTheme: (updates: DocsThemeConfig) => void;
}

interface DocsThemeProviderProps {
  children: ReactNode;
  initialTheme?: DocsThemeConfig;
  value?: DocsThemeConfig;
  onChange?: (theme: DocsThemeConfig) => void;
}

const DocsThemeContext = createContext<DocsThemeContextValue | null>(null);

export function DocsThemeProvider({
  children,
  initialTheme,
  value,
  onChange,
}: DocsThemeProviderProps) {
  const [internalTheme, setInternalTheme] = useState<DocsThemeConfig>(
    initialTheme ?? {}
  );
  const theme = value ?? internalTheme;
  const resolvedTheme = useMemo(() => resolveDocsTheme(theme), [theme]);

  const setTheme = useCallback<Dispatch<SetStateAction<DocsThemeConfig>>>(
    (nextTheme) => {
      const resolvedNextTheme =
        typeof nextTheme === "function" ? nextTheme(theme) : nextTheme;

      if (value === undefined) {
        setInternalTheme(resolvedNextTheme);
      }

      onChange?.(resolvedNextTheme);
    },
    [onChange, theme, value]
  );

  const contextValue = useMemo<DocsThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      updateTheme: (updates) =>
        setTheme((currentTheme) => ({
          ...currentTheme,
          ...updates,
          color: {
            ...(currentTheme.color ?? {}),
            ...(updates.color ?? {}),
          },
          layout: {
            ...(currentTheme.layout ?? {}),
            ...(updates.layout ?? {}),
          },
          shape: {
            ...(currentTheme.shape ?? {}),
            ...(updates.shape ?? {}),
          },
          tokens: {
            ...(currentTheme.tokens ?? {}),
            ...(updates.tokens ?? {}),
          },
        })),
    }),
    [resolvedTheme, setTheme, theme]
  );

  return (
    <DocsThemeContext.Provider value={contextValue}>
      {children}
    </DocsThemeContext.Provider>
  );
}

export function useDocsTheme() {
  const context = useContext(DocsThemeContext);

  if (!context) {
    throw new Error("useDocsTheme must be used inside DocsThemeProvider.");
  }

  return context;
}

export function useOptionalDocsTheme() {
  return useContext(DocsThemeContext);
}
