"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  Code2,
  Layers,
  Palette,
  Search,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  buildLocalizedHref,
  getPageDictionary,
  type RouteLocale,
} from "@/lib/site-i18n";

const featureIcons = [Zap, BookOpen, Layers, Search, Palette, Sparkles];
const layoutIcons = [BookOpen, Palette, Layers, Sparkles];

export default function MarketingHomePage({ locale }: { locale: RouteLocale }) {
  const copy = getPageDictionary(locale, "marketingHome");
  const docsHref = buildLocalizedHref("/docs", locale);
  const githubUrl = "https://github.com/ross-slaney/agenetix-docs";
  const npmUrl = "https://www.npmjs.com/package/@agenetix/docs";

  return (
    <div className="marketing-page">
      <div className="marketing-mesh" aria-hidden="true" />
      <div className="marketing-orb marketing-orb-a" aria-hidden="true" />
      <div className="marketing-orb marketing-orb-b" aria-hidden="true" />

      {/* Hero */}
      <section className="relative px-6 pb-12 pt-24 sm:pb-16 sm:pt-32">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            <div className="text-center lg:text-left">
              <Badge
                variant="outline"
                className="mb-6 animate-fadeIn border-primary/30 bg-primary/10 text-primary"
              >
                {copy.heroBadge}
              </Badge>

              <h1 className="animate-fadeUp text-4xl font-bold tracking-tight sm:text-5xl lg:text-[3.25rem] lg:leading-[1.05]">
                {copy.heroTitlePrimary}{" "}
                <span className="bg-gradient-to-r from-teal-500 via-cyan-500 to-violet-500 bg-clip-text text-transparent">
                  {copy.heroTitleAccent}
                </span>
              </h1>

              <p className="animate-fadeUp mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground lg:mx-0 [animation-delay:80ms]">
                {copy.heroDescription}
              </p>

              <div className="animate-fadeUp mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start [animation-delay:160ms]">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-teal-600 to-cyan-600 shadow-lg shadow-teal-500/20 hover:from-teal-500 hover:to-cyan-500"
                >
                  <Link href={docsHref}>
                    {copy.primaryCta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="marketing-glass" asChild>
                  <a href={githubUrl} target="_blank" rel="noreferrer">
                    {copy.secondaryCta}
                  </a>
                </Button>
              </div>

              <InstallCommand command={copy.installCommand} label={copy.terminalLabel} />

              <div className="animate-fadeUp mt-10 grid grid-cols-3 gap-3 [animation-delay:240ms]">
                {copy.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="marketing-stat rounded-xl px-3 py-4 text-center lg:text-left"
                  >
                    <div className="font-mono text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="animate-fadeUp [animation-delay:200ms]">
              <DocsPreview command={copy.installCommand} />
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section className="marketing-marquee-wrap" aria-hidden="true">
        <div className="marketing-marquee-track">
          {[...copy.marquee, ...copy.marquee].map((item, index) => (
            <span key={`${item}-${index}`} className="marketing-marquee-item">
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* Developer composability */}
      <section className="relative px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
                Composable API
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{copy.devHeading}</h2>
              <p className="mt-4 text-lg text-muted-foreground">{copy.devDescription}</p>
              <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
                {[
                  "createDocsSource() — routes, nav, search, metadata",
                  "DocsLayout slots — header, sidebar, theme, searchAction",
                  "getDefaultMdxComponents() — split core vs interactive",
                  "DocsThemeConfig — preset, hue, density, radius, tokens",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2">
                    <Code2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="marketing-glass marketing-code-window rounded-2xl p-1">
              <pre className="marketing-terminal overflow-x-auto rounded-xl bg-[#0a0f1a] p-5 text-[13px] leading-relaxed text-slate-300">
                <code>{`import { DocsLayout, createDocsSource } from "@agenetix/docs";

export const docs = createDocsSource({
  contentDir: "./content/docs",
  basePath: "/docs",
});

export default function Layout({ children }) {
  return (
    <DocsLayout
      navigation={docs.getNavigation()}
      searchAction={searchDocs}
      theme={{ color: { accentHue: 178 } }}
    >
      {children}
    </DocsLayout>
  );
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="border-t border-border/60 bg-muted/30 px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">{copy.stepsHeading}</h2>
            <p className="mt-3 text-muted-foreground">{copy.stepsDescription}</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {copy.steps.map((step, index) => (
              <Card key={step.title} className="marketing-glass border-primary/10">
                <CardContent className="p-6">
                  <div className="marketing-step-num">{index + 1}</div>
                  <h3 className="mt-4 font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Layout cards */}
      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">{copy.layoutsHeading}</h2>
            <p className="mt-3 text-muted-foreground">{copy.layoutsDescription}</p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {copy.layoutCards.map((card, index) => {
              const Icon = layoutIcons[index] ?? Layers;
              return (
                <Card
                  key={card.title}
                  className="marketing-glass relative overflow-hidden transition-all hover:-translate-y-1 hover:border-primary/30"
                >
                  {card.badge ? (
                    <Badge className="absolute right-3 top-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
                      {card.badge}
                    </Badge>
                  ) : null}
                  <CardContent className="p-5">
                    <Icon className="mb-3 h-5 w-5 text-primary" />
                    <h3 className="font-semibold">{card.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{card.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features bento */}
      <section className="border-t border-border/60 px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">{copy.featuresHeading}</h2>
            <p className="mt-3 text-muted-foreground">{copy.featuresDescription}</p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {copy.features.map((feature, index) => {
              const Icon = featureIcons[index] ?? Sparkles;
              return (
                <Card
                  key={feature.title}
                  className={`marketing-glass transition-all hover:-translate-y-1 hover:border-primary/25 ${
                    index === 0 ? "lg:col-span-2 lg:row-span-1" : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-primary/20 to-violet-500/10 p-2.5 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24 pt-8 sm:pb-32">
        <div className="mx-auto max-w-4xl">
          <div className="marketing-glass rounded-3xl px-8 py-14 text-center sm:px-12">
            <Terminal className="mx-auto h-8 w-8 text-primary" />
            <h2 className="mt-4 text-3xl font-bold tracking-tight">{copy.ctaHeading}</h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">{copy.ctaDescription}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-teal-600 to-cyan-600 shadow-lg shadow-teal-500/20"
              >
                <Link href={docsHref}>{copy.ctaPrimary}</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href={githubUrl} target="_blank" rel="noreferrer">
                  {copy.ctaSecondary}
                </a>
              </Button>
              <Button variant="ghost" size="lg" asChild>
                <a href={npmUrl} target="_blank" rel="noreferrer">
                  {copy.exploreLabel} npm →
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function InstallCommand({ command, label }: { command: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  };

  return (
    <div className="animate-fadeUp mx-auto mt-8 max-w-md lg:mx-0 [animation-delay:200ms]">
      <p className="mb-2 flex items-center gap-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <Terminal className="h-3.5 w-3.5" />
        {label}
      </p>
      <button
        type="button"
        onClick={handleCopy}
        className="marketing-glass flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3.5 text-left text-sm transition-all hover:border-primary/40"
      >
        <code className="marketing-terminal text-foreground">
          <span className="text-primary">$</span> {command}
        </code>
        {copied ? (
          <Check className="h-4 w-4 shrink-0 text-primary" />
        ) : (
          <span className="shrink-0 rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground">
            Copy
          </span>
        )}
      </button>
    </div>
  );
}

function DocsPreview({ command }: { command: string }) {
  return (
    <div className="marketing-glass marketing-code-window overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/90" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/90" />
          <span className="ml-2 font-mono text-[10px] text-muted-foreground">agenetixdocs — docs</span>
        </div>
        <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 font-mono text-[10px] text-primary">
          ⌘K
        </span>
      </div>
      <div className="flex min-h-[300px]">
        <aside className="hidden w-44 border-r border-border/60 bg-muted/20 p-3 sm:block">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Navigate
          </p>
          <nav className="space-y-1 text-xs">
            {["Getting started", "Components", "Theme", "Search"].map((item, i) => (
              <div
                key={item}
                className={`rounded-md px-2 py-1.5 ${
                  i === 0
                    ? "border-l-2 border-primary bg-primary/10 font-medium text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item}
              </div>
            ))}
          </nav>
        </aside>
        <div className="flex flex-1 flex-col p-5">
          <p className="text-xs font-medium text-primary">Getting started</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">Install the package</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Server-rendered MDX with search, TOC, and a theme you can actually tune.
          </p>
          <pre className="marketing-terminal mt-4 rounded-lg bg-[#0a0f1a]/80 p-3 text-xs text-cyan-100/90">
            <code>{command}</code>
          </pre>
          <div className="mt-auto flex gap-2 pt-6">
            <span className="rounded-md border border-primary/20 bg-primary/5 px-2 py-1 text-[10px] text-primary">
              RSC
            </span>
            <span className="rounded-md border border-border px-2 py-1 text-[10px] text-muted-foreground">
              SSG
            </span>
            <span className="rounded-md border border-border px-2 py-1 text-[10px] text-muted-foreground">
              i18n
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
