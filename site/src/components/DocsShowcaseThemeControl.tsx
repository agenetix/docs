"use client";

import { resolveDocsTheme, useDocsTheme } from "@agenetix/docs";
import { Moon, Palette, Sun } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useDocsRouteThemeUi } from "@/components/DocsRouteThemeBoundary";
import { buildThemeStylePreview } from "@/lib/docs-theme-studio";
import { docsShowcaseThemes } from "@/lib/docs-themes";
import { cn } from "@/lib/utils";

export default function DocsShowcaseThemeControl({
  className,
}: {
  className?: string;
}) {
  const { resolvedTheme, setTheme } = useDocsTheme();
  const { applyThemePreset, openStudio } = useDocsRouteThemeUi();

  const activeShowcaseThemeId = useMemo(
    () =>
      docsShowcaseThemes.find((theme) => {
        const resolvedPresetTheme = resolveDocsTheme(theme.config);

        return (
          resolvedPresetTheme.config.color.preset ===
            resolvedTheme.config.color.preset &&
          resolvedPresetTheme.config.color.mode ===
            resolvedTheme.config.color.mode &&
          resolvedPresetTheme.config.color.accentHue ===
            resolvedTheme.config.color.accentHue &&
          resolvedPresetTheme.config.color.surfaceStyle ===
            resolvedTheme.config.color.surfaceStyle &&
          resolvedPresetTheme.config.layout.density ===
            resolvedTheme.config.layout.density
        );
      })?.id ?? null,
    [resolvedTheme],
  );

  const toggleMode = () => {
    setTheme((currentTheme) => ({
      ...currentTheme,
      color: {
        ...(currentTheme.color ?? {}),
        mode: resolvedTheme.config.color.mode === "dark" ? "light" : "dark",
      },
    }));
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="hidden items-center gap-1 rounded-full border border-border bg-card/80 p-1 shadow-sm lg:flex">
        {docsShowcaseThemes.map((theme) => {
          const previewStyle = buildThemeStylePreview(theme.config);

          return (
            <button
              key={theme.id}
              type="button"
              aria-label={`Switch to ${theme.label}`}
              title={`${theme.label}: ${theme.description}`}
              onClick={() => applyThemePreset(theme.config)}
              className={cn(
                "h-8 w-8 rounded-full border transition-transform duration-150 hover:scale-105",
                activeShowcaseThemeId === theme.id
                  ? "border-foreground ring-2 ring-ring/30"
                  : "border-border",
              )}
              style={previewStyle}
            />
          );
        })}
      </div>

      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={toggleMode}
        aria-label={`Switch to ${
          resolvedTheme.config.color.mode === "dark" ? "light" : "dark"
        } mode`}
      >
        {resolvedTheme.config.color.mode === "dark" ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </Button>

      <Button type="button" variant="outline" size="sm" onClick={openStudio}>
        <Palette className="h-4 w-4" />
        <span className="hidden sm:inline">Theme Studio (Custom)</span>
        <span className="sm:hidden">Theme</span>
      </Button>
    </div>
  );
}
