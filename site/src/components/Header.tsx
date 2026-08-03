"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import BrandLogo from "@/components/BrandLogo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import {
  buildLocalizedHref,
  getLocaleFromPathname,
  getSiteChromeDictionary,
  isSupportedMarketingLocale,
  routeLocales,
  type RouteLocale,
} from "@/lib/site-i18n";
import { cn } from "@/lib/utils";

interface HeaderProps {
  locale?: RouteLocale;
}

interface HeaderContentProps {
  copy: ReturnType<typeof getSiteChromeDictionary>;
  homeHref: string;
  docsHref: string;
  blogHref: string;
}

export default function Header({ locale }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname() ?? "/";
  const currentLocale = locale ?? getLocaleFromPathname(pathname);
  const copy = getSiteChromeDictionary(currentLocale);

  const docsHref = buildLocalizedHref("/docs", currentLocale);
  const blogHref = buildLocalizedHref("/blog", currentLocale);
  const homeHref = isSupportedMarketingLocale(currentLocale)
    ? buildLocalizedHref("/", currentLocale)
    : docsHref;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-primary/10 bg-background/75 shadow-[0_8px_32px_hsl(var(--glow)/0.06)] backdrop-blur-xl supports-[backdrop-filter]:bg-background/55"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <HeaderContent
        key={pathname}
        copy={copy}
        homeHref={homeHref}
        docsHref={docsHref}
        blogHref={blogHref}
      />
    </header>
  );
}

function HeaderContent({
  copy,
  homeHref,
  docsHref,
  blogHref,
}: HeaderContentProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <div className="mx-auto flex h-14 w-full max-w-[1400px] items-center justify-between px-6">
        <Link
          href={homeHref}
          className="group flex items-center gap-2.5 font-semibold text-foreground transition-opacity hover:opacity-90"
        >
          <BrandLogo className="h-7 w-7 transition-transform group-hover:scale-105" />
          <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            {copy.common.brand}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
            <Link href={docsHref}>{copy.header.nav.docs}</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
            <Link href={blogHref}>{copy.header.nav.blog}</Link>
          </Button>
          <LanguageSwitcher locales={routeLocales} fallbackBasePath="/" />
          <ThemeSwitcher />
          <Button variant="ghost" size="icon" asChild>
            <a
              href="https://github.com/ross-slaney/mcpstack-docs"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="text-muted-foreground hover:text-foreground"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
          </Button>
          <Button
            asChild
            size="sm"
            className="bg-gradient-to-r from-teal-600 to-cyan-600 shadow-md shadow-teal-500/15 hover:from-teal-500 hover:to-cyan-500"
          >
            <Link href={docsHref}>{copy.header.cta}</Link>
          </Button>
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen((current) => !current)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {isMenuOpen ? (
        <div className="border-t border-primary/10 bg-background/95 p-4 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-2">
            <Button variant="ghost" className="justify-start" asChild>
              <Link href={docsHref} onClick={closeMenu}>
                {copy.header.nav.docs}
              </Link>
            </Button>
            <Button variant="ghost" className="justify-start" asChild>
              <Link href={blogHref} onClick={closeMenu}>
                {copy.header.nav.blog}
              </Link>
            </Button>
            <Button variant="ghost" className="justify-start" asChild>
              <a
                href="https://github.com/ross-slaney/mcpstack-docs"
                target="_blank"
                rel="noreferrer"
                onClick={closeMenu}
              >
                GitHub
              </a>
            </Button>
            <div className="flex items-center gap-2 pt-2">
              <LanguageSwitcher
                locales={routeLocales}
                fallbackBasePath="/"
                onNavigate={closeMenu}
              />
              <ThemeSwitcher />
            </div>
            <Button
              asChild
              className="mt-2 bg-gradient-to-r from-teal-600 to-cyan-600"
            >
              <Link href={docsHref} onClick={closeMenu}>
                {copy.header.cta}
              </Link>
            </Button>
          </nav>
        </div>
      ) : null}
    </>
  );
}
