import type { DocsHeading, DocsNavItem, DocsNavSection } from "./types";

export function flattenNavItems(sections: DocsNavSection[]): DocsNavItem[] {
  return sections.flatMap((section) => [
    ...section.items,
    ...flattenNavItems(section.groups ?? []),
  ]);
}

export function normalizeSlugs(
  slugs?: string[] | string | null
): string[] {
  if (!slugs) {
    return [];
  }

  const parts = Array.isArray(slugs) ? slugs : slugs.split("/");
  return parts.map((part) => part.trim()).filter(Boolean);
}

export function normalizeDocsPath(pathname: string): string {
  if (!pathname || pathname === "/") {
    return "/";
  }

  const normalized = pathname.replace(/\/+$/, "");
  return normalized || "/";
}

export function isActiveDocsPath(pathname: string, href: string): boolean {
  return normalizeDocsPath(pathname) === normalizeDocsPath(href);
}

export function normalizeBasePath(basePath: string): string {
  if (!basePath) {
    return "";
  }

  const prefixed = basePath.startsWith("/") ? basePath : `/${basePath}`;
  return prefixed.replace(/\/+$/, "");
}

export function humanizeSlug(slug: string): string {
  if (!slug) {
    return "Documentation";
  }

  return slug
    .split(/[-_/]+/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[`~!@#$%^&*()+=[\]{}|\\:;"'<>,.?/]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/[*_>~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function withLocalePrefix(
  basePath: string,
  locale: string,
  defaultLocale: string,
  hideDefaultLocaleInUrl: boolean
): string {
  if (hideDefaultLocaleInUrl && locale === defaultLocale) {
    return basePath;
  }

  return `/${locale}${basePath}`;
}

export function buildDocsHref(args: {
  basePath: string;
  slugs?: string[];
  locale: string;
  defaultLocale: string;
  hideDefaultLocaleInUrl: boolean;
  docsIndexSlug: string;
}): string {
  const localizedBase = withLocalePrefix(
    args.basePath,
    args.locale,
    args.defaultLocale,
    args.hideDefaultLocaleInUrl
  );
  const slugs = (args.slugs ?? []).filter(Boolean);

  if (slugs.length === 0 || (slugs.length === 1 && slugs[0] === args.docsIndexSlug)) {
    return localizedBase;
  }

  return `${localizedBase}/${slugs.join("/")}`;
}

export function buildContentHref(args: {
  basePath: string;
  slug?: string;
  locale: string;
  defaultLocale: string;
  hideDefaultLocaleInUrl: boolean;
}): string {
  const localizedBase = withLocalePrefix(
    args.basePath,
    args.locale,
    args.defaultLocale,
    args.hideDefaultLocaleInUrl
  );
  const slug = args.slug?.trim();

  return slug ? `${localizedBase}/${slug}` : localizedBase;
}

export function buildBlogHref(args: {
  basePath: string;
  slug?: string;
  locale: string;
  defaultLocale: string;
  hideDefaultLocaleInUrl: boolean;
}): string {
  return buildContentHref(args);
}

export function findHeadingById(
  headings: DocsHeading[],
  id: string
): DocsHeading | undefined {
  return headings.find((heading) => heading.id === id);
}

export function calculateReadingTimeMinutes(content: string): number {
  const words = stripMarkdown(content).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
