import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import BrandLogo from "@/components/BrandLogo";
import {
  buildLocalizedHref,
  getSiteChromeDictionary,
  type RouteLocale,
} from "@/lib/site-i18n";

export default function Footer({ locale }: { locale: RouteLocale }) {
  const currentYear = new Date().getFullYear();
  const copy = getSiteChromeDictionary(locale);
  const marketingHomeHref = buildLocalizedHref("/", locale);
  const docsHomeHref = buildLocalizedHref("/docs", locale);
  const blogHref = buildLocalizedHref("/blog", locale);

  return (
    <footer className="relative border-t border-primary/10 bg-background">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-[1400px] px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href={marketingHomeHref}
              className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-90"
            >
              <BrandLogo className="h-7 w-7" />
              <span className="font-semibold">{copy.common.brand}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {copy.footer.tagline}
            </p>
            <p className="mt-4 font-mono text-xs text-primary/80">
              npm i @agenetix/docs
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-tight">
              {copy.footer.sections.resources}
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href={docsHomeHref}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {copy.footer.links.documentation}
                </Link>
              </li>
              <li>
                <Link
                  href={blogHref}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {copy.footer.links.blog}
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/ross-slaney/agenetix-docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {copy.common.github}
                </a>
              </li>
              <li>
                <a
                  href="https://www.npmjs.com/package/@agenetix/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {copy.common.npm}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-tight">
              {copy.footer.sections.legal}
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <span className="text-sm text-muted-foreground">
                  {copy.footer.links.license}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-10 bg-border/60" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} {copy.footer.copyright}
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/ross-slaney/agenetix-docs"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-border/80 p-2 text-muted-foreground transition-all hover:border-primary/30 hover:text-primary"
              aria-label="GitHub"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
