"use client";

import { useDocsTheme } from "@agenetix/docs";
import {
  Check,
  Copy,
  Link2,
  RotateCcw,
  Settings2,
  SlidersHorizontal,
} from "lucide-react";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDocsRouteThemeUi } from "@/components/DocsRouteThemeBoundary";
import {
  createDocsThemeShareUrl,
  docsThemeAccentStrengthOptions,
  docsThemeAccentSwatches,
  docsThemeDensityOptions,
  docsThemeLayoutPresets,
  docsThemeModeOptions,
  docsThemePresetOptions,
  docsThemeRadiusOptions,
  docsThemeSurfaceStyleOptions,
  docsThemeTokenControls,
  getPresetAccentHue,
  hexToHslToken,
  hslTokenToHex,
  normalizeDocsThemeConfig,
} from "@/lib/docs-theme-studio";
import { docsShowcaseThemes } from "@/lib/docs-themes";
import { cn } from "@/lib/utils";

export default function DocsThemeStudio() {
  const pathname = usePathname();
  const { theme, resolvedTheme, updateTheme, setTheme } = useDocsTheme();
  const {
    defaults,
    isStudioOpen,
    closeStudio,
    openStudio,
    resetTheme,
    applyThemePreset,
  } = useDocsRouteThemeUi();
  const [copiedState, setCopiedState] = useState<"config" | "share" | null>(null);

  const normalizedTheme = useMemo(
    () => normalizeDocsThemeConfig(theme),
    [theme]
  );
  const normalizedThemeJson = useMemo(
    () => JSON.stringify(normalizedTheme, null, 2),
    [normalizedTheme]
  );
  const sharePath = useMemo(
    () =>
      createDocsThemeShareUrl(
        pathname || "/docs",
        typeof window === "undefined" ? "" : window.location.search,
        theme,
        defaults
      ),
    [defaults, pathname, theme]
  );

  const copyValue = async (value: string, kind: "config" | "share") => {
    await navigator.clipboard.writeText(value);
    setCopiedState(kind);
    window.setTimeout(() => setCopiedState(null), 1500);
  };

  return (
    <Dialog open={isStudioOpen} onOpenChange={(open) => (open ? openStudio() : closeStudio())}>
      <DialogContent className="max-h-[90vh] max-w-[min(1100px,calc(100vw-1rem))] overflow-hidden border-border bg-background p-0 shadow-2xl">
        <div className="grid max-h-[90vh] grid-cols-1 overflow-hidden lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="overflow-y-auto">
            <DialogHeader className="border-b border-border px-6 py-5 text-left">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <DialogTitle>Docs Theme Studio</DialogTitle>
                  <DialogDescription className="mt-2 max-w-2xl">
                    Tune the shell, surfaces, spacing, and accent system with the
                    same theme object consumers pass to <code>DocsLayout</code>.
                  </DialogDescription>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={resetTheme}
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => copyValue(normalizedThemeJson, "config")}
                  >
                    {copiedState === "config" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    Copy JSON
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyValue(
                        `${window.location.origin}${sharePath}`,
                        "share"
                      )
                    }
                  >
                    {copiedState === "share" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Link2 className="h-4 w-4" />
                    )}
                    Copy Share URL
                  </Button>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-8 px-6 py-6">
              <StudioSection
                icon={<SlidersHorizontal className="h-4 w-4" />}
                title="Showcase Presets"
                description="Use these to jump between very different docs personalities in one click."
              >
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {docsShowcaseThemes.map((showcaseTheme) => {
                    const isActive =
                      showcaseTheme.id ===
                      docsShowcaseThemes.find((themeOption) => {
                        const option = normalizeDocsThemeConfig(themeOption.config);
                        return (
                          option.color?.preset === resolvedTheme.config.color.preset &&
                          option.color?.mode === resolvedTheme.config.color.mode &&
                          option.color?.accentHue ===
                            resolvedTheme.config.color.accentHue &&
                          option.color?.accentStrength ===
                            resolvedTheme.config.color.accentStrength &&
                          option.color?.surfaceStyle ===
                            resolvedTheme.config.color.surfaceStyle &&
                          option.layout?.density ===
                            resolvedTheme.config.layout.density &&
                          option.shape?.radius ===
                            resolvedTheme.config.shape.radius
                        );
                      })?.id;

                    return (
                      <button
                        key={showcaseTheme.id}
                        type="button"
                        onClick={() => applyThemePreset(showcaseTheme.config)}
                        className={cn(
                          "rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:border-foreground/40 hover:shadow-md",
                          isActive
                            ? "border-foreground/70 bg-accent/70"
                            : "border-border bg-card"
                        )}
                      >
                        <div className="mb-3 flex items-center gap-2">
                          {showcaseTheme.swatches.map((swatch) => (
                            <span
                              key={swatch}
                              className="h-5 w-5 rounded-full border border-black/10"
                              style={{ backgroundColor: swatch }}
                            />
                          ))}
                        </div>
                        <div className="text-sm font-semibold text-foreground">
                          {showcaseTheme.label}
                        </div>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          {showcaseTheme.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </StudioSection>

              <StudioSection
                icon={<PaletteToken />}
                title="Color System"
                description="Preset, mode, hue, accent energy, and surface treatment."
              >
                <div className="space-y-5">
                  <OptionGroup label="Preset">
                    {docsThemePresetOptions.map((option) => (
                      <ChipButton
                        key={option.id}
                        active={resolvedTheme.config.color.preset === option.id}
                        onClick={() =>
                          updateTheme({
                            color: {
                              preset: option.id,
                              accentHue: getPresetAccentHue(option.id),
                            },
                          })
                        }
                      >
                        {option.label}
                      </ChipButton>
                    ))}
                  </OptionGroup>

                  <OptionGroup label="Mode">
                    {docsThemeModeOptions.map((mode) => (
                      <ChipButton
                        key={mode}
                        active={resolvedTheme.config.color.mode === mode}
                        onClick={() => updateTheme({ color: { mode } })}
                      >
                        {mode}
                      </ChipButton>
                    ))}
                  </OptionGroup>

                  <OptionGroup label="Accent Hue">
                    <div className="space-y-3">
                      <input
                        type="range"
                        min={0}
                        max={359}
                        value={resolvedTheme.config.color.accentHue}
                        onChange={(event) =>
                          updateTheme({
                            color: {
                              accentHue: Number(event.target.value),
                            },
                          })
                        }
                        className="w-full accent-[hsl(var(--primary))]"
                      />
                      <div className="flex flex-wrap gap-2">
                        {docsThemeAccentSwatches.map((swatch) => (
                          <button
                            key={swatch.hue}
                            type="button"
                            title={swatch.label}
                            aria-label={`Set accent hue to ${swatch.label}`}
                            onClick={() =>
                              updateTheme({
                                color: {
                                  accentHue: swatch.hue,
                                },
                              })
                            }
                            className={cn(
                              "h-8 w-8 rounded-full border transition-transform hover:scale-105",
                              resolvedTheme.config.color.accentHue === swatch.hue
                                ? "border-foreground ring-2 ring-ring/30"
                                : "border-border"
                            )}
                            style={{
                              background:
                                `linear-gradient(135deg, hsl(${swatch.hue} 90% 64%), hsl(${swatch.hue} 82% 46%))`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </OptionGroup>

                  <OptionGroup label="Accent Strength">
                    {docsThemeAccentStrengthOptions.map((strength) => (
                      <ChipButton
                        key={strength}
                        active={resolvedTheme.config.color.accentStrength === strength}
                        onClick={() =>
                          updateTheme({
                            color: {
                              accentStrength: strength,
                            },
                          })
                        }
                      >
                        {strength}
                      </ChipButton>
                    ))}
                  </OptionGroup>

                  <OptionGroup label="Surface Style">
                    {docsThemeSurfaceStyleOptions.map((surfaceStyle) => (
                      <ChipButton
                        key={surfaceStyle}
                        active={resolvedTheme.config.color.surfaceStyle === surfaceStyle}
                        onClick={() =>
                          updateTheme({
                            color: {
                              surfaceStyle,
                            },
                          })
                        }
                      >
                        {surfaceStyle}
                      </ChipButton>
                    ))}
                  </OptionGroup>
                </div>
              </StudioSection>

              <StudioSection
                icon={<Settings2 className="h-4 w-4" />}
                title="Layout and Shape"
                description="Make the shell tighter, wider, softer, or more compact."
              >
                <div className="space-y-5">
                  <OptionGroup label="Density">
                    {docsThemeDensityOptions.map((density) => (
                      <ChipButton
                        key={density}
                        active={resolvedTheme.config.layout.density === density}
                        onClick={() =>
                          updateTheme({
                            layout: {
                              density,
                            },
                          })
                        }
                      >
                        {density}
                      </ChipButton>
                    ))}
                  </OptionGroup>

                  <OptionGroup label="Radius">
                    {docsThemeRadiusOptions.map((radius) => (
                      <ChipButton
                        key={radius}
                        active={resolvedTheme.config.shape.radius === radius}
                        onClick={() =>
                          updateTheme({
                            shape: {
                              radius,
                            },
                          })
                        }
                      >
                        {radius}
                      </ChipButton>
                    ))}
                  </OptionGroup>

                  <div>
                    <div className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      Layout Presets
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                      {docsThemeLayoutPresets.map((layoutPreset) => {
                        const isActive =
                          resolvedTheme.config.layout.layoutWidth ===
                            layoutPreset.layout.layoutWidth &&
                          resolvedTheme.config.layout.contentWidth ===
                            layoutPreset.layout.contentWidth &&
                          resolvedTheme.config.layout.sidebarWidth ===
                            layoutPreset.layout.sidebarWidth &&
                          resolvedTheme.config.layout.tocWidth ===
                            layoutPreset.layout.tocWidth &&
                          resolvedTheme.config.layout.density ===
                            layoutPreset.layout.density;

                        return (
                          <button
                            key={layoutPreset.id}
                            type="button"
                            onClick={() =>
                              updateTheme({
                                layout: layoutPreset.layout,
                              })
                            }
                            className={cn(
                              "rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:border-foreground/40 hover:shadow-md",
                              isActive
                                ? "border-foreground/70 bg-accent/70"
                                : "border-border bg-card"
                            )}
                          >
                            <div className="text-sm font-semibold text-foreground">
                              {layoutPreset.label}
                            </div>
                            <p className="mt-1 text-xs leading-5 text-muted-foreground">
                              {layoutPreset.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </StudioSection>

              <StudioSection
                icon={<SlidersHorizontal className="h-4 w-4" />}
                title="Advanced Token Overrides"
                description="Override a few high-leverage semantic colors when the preset needs a final brand pass."
              >
                <div className="grid gap-4 md:grid-cols-2">
                  {docsThemeTokenControls.map((tokenControl) => {
                    const currentValue =
                      theme.tokens?.[tokenControl.key] ??
                      resolvedTheme.tokens[tokenControl.key];
                    const isOverridden =
                      theme.tokens?.[tokenControl.key] !== undefined;

                    return (
                      <div
                        key={tokenControl.key}
                        className="rounded-2xl border border-border bg-card p-4"
                      >
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div>
                            <div className="text-sm font-medium text-foreground">
                              {tokenControl.label}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {currentValue}
                            </div>
                          </div>
                          {isOverridden ? (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setTheme((currentTheme) => {
                                  const nextTokens = { ...(currentTheme.tokens ?? {}) };
                                  delete nextTokens[tokenControl.key];

                                  return {
                                    ...currentTheme,
                                    tokens: nextTokens,
                                  };
                                });
                              }}
                            >
                              Auto
                            </Button>
                          ) : null}
                        </div>

                        <input
                          type="color"
                          value={hslTokenToHex(currentValue)}
                          onChange={(event) =>
                            updateTheme({
                              tokens: {
                                [tokenControl.key]: hexToHslToken(event.target.value),
                              },
                            })
                          }
                          className="h-12 w-full cursor-pointer rounded-xl border border-border bg-transparent"
                        />
                      </div>
                    );
                  })}
                </div>
              </StudioSection>
            </div>
          </div>

          <aside className="border-l border-border bg-card/70">
            <div className="sticky top-0 space-y-6 p-6">
              <div>
                <div className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Live Theme Summary
                </div>
                <div className="mt-3 rounded-3xl border border-border bg-background p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        {resolvedTheme.config.color.preset} / {resolvedTheme.config.color.mode}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {resolvedTheme.config.color.accentStrength} accent,{" "}
                        {resolvedTheme.config.color.surfaceStyle} surfaces
                      </div>
                    </div>
                    <div
                      className="h-12 w-12 rounded-2xl border border-border"
                      style={{
                        background:
                          `linear-gradient(135deg, hsl(${resolvedTheme.tokens.primary}), hsl(${resolvedTheme.tokens.accent}))`,
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {["background", "card", "primary"].map((tokenKey) => (
                      <div
                        key={tokenKey}
                        className="space-y-2 rounded-2xl border border-border bg-card p-3"
                      >
                        <div
                          className="h-10 rounded-xl border border-black/10"
                          style={{
                            backgroundColor: `hsl(${
                              resolvedTheme.tokens[tokenKey as "background" | "card" | "primary"]
                            })`,
                          }}
                        />
                        <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                          {tokenKey}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Normalized Config
                </div>
                <pre className="mt-3 max-h-[50vh] overflow-auto rounded-3xl border border-border bg-background p-4 text-[11px] leading-6 text-muted-foreground shadow-sm">
                  <code>{normalizedThemeJson}</code>
                </pre>
              </div>
            </div>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function DocsThemeStudioSidebarCard() {
  const { resolvedTheme } = useDocsTheme();
  const { openStudio } = useDocsRouteThemeUi();

  return (
    <button
      type="button"
      onClick={openStudio}
      className="group w-full rounded-2xl border border-[hsl(var(--border)/0.72)] bg-[hsl(var(--background)/0.74)] px-3 py-2.5 text-left shadow-none backdrop-blur-sm transition-colors duration-200 hover:border-[hsl(var(--border))] hover:bg-[hsl(var(--background)/0.94)]"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[hsl(var(--border)/0.7)] bg-[hsl(var(--muted)/0.32)] text-muted-foreground transition-colors group-hover:text-foreground">
          <Settings2 className="h-3.5 w-3.5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-foreground">
            Theme Studio
          </div>
          <div className="truncate text-[11px] text-muted-foreground">
            {resolvedTheme.config.color.preset} / {resolvedTheme.config.color.mode}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {(["background", "primary", "accent"] as const).map((tokenKey) => (
            <span
              key={tokenKey}
              className="h-2.5 w-2.5 rounded-full border border-black/5"
              style={{
                backgroundColor: `hsl(${resolvedTheme.tokens[tokenKey]})`,
              }}
            />
          ))}
        </div>
      </div>
    </button>
  );
}

function StudioSection({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 rounded-full border border-border bg-card p-2 text-muted-foreground shadow-sm">
          {icon}
        </span>
        <div>
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      <div>{children}</div>
    </section>
  );
}

function OptionGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function ChipButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "border-foreground bg-foreground text-background shadow-sm"
          : "border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

function PaletteToken() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className="h-4 w-4"
    >
      <path d="M12 3a9 9 0 1 0 0 18h1.25a2.75 2.75 0 0 0 0-5.5H12a1.5 1.5 0 0 1 0-3h3.25a4.75 4.75 0 0 0 0-9.5H12Z" />
      <circle cx="7.5" cy="10" r="1" />
      <circle cx="9" cy="6.5" r="1" />
      <circle cx="15.5" cy="7.5" r="1" />
    </svg>
  );
}
