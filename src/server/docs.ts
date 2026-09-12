import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";
import type {
  DocsEntry,
  DocsMetadata,
  DocsNavItem,
  DocsNavSection,
  DocsRouteResolution,
  DocsSource,
  DocsSourceConfig,
  DocsHeading,
} from "../types";
import {
  buildDocsHref,
  flattenNavItems,
  humanizeSlug,
  normalizeBasePath,
  normalizeSlugs,
  slugifyHeading,
} from "../utils";
import { searchEntries } from "./search";

interface ContentRecord {
  slugs: string[];
  localizedFiles: Map<string, string>;
  legacyFile?: string;
}

interface ParsedFrontmatter {
  title?: string;
  description?: string;
  order?: number;
  section?: string;
  sectionLabel?: string;
  group?: string;
  groupLabel?: string;
  sidebar?: boolean;
}

interface NavigationBucket {
  ungrouped: DocsNavItem[];
  groups: Map<string, DocsNavItem[]>;
}

export function createDocsSource(input: DocsSourceConfig): DocsSource {
  const config = {
    contentDir: path.resolve(input.contentDir),
    basePath: normalizeBasePath(input.basePath),
    defaultLocale: input.defaultLocale ?? "en",
    locales: Array.from(new Set(input.locales?.length ? input.locales : ["en"])),
    hideDefaultLocaleInUrl: input.hideDefaultLocaleInUrl ?? true,
    docsIndexSlug: input.docsIndexSlug ?? "docs-index",
    homeRedirectSlugs: normalizeSlugs(input.homeRedirect),
    siteTitle: input.siteTitle,
    titleSuffix: input.titleSuffix ?? input.siteTitle,
    sectionLabels: input.sectionLabels ?? {},
    sectionOrder: input.sectionOrder ?? [],
    groupLabels: input.groupLabels ?? {},
    searchLimit: input.searchLimit ?? 8,
  };

  if (!config.locales.includes(config.defaultLocale)) {
    config.locales.unshift(config.defaultLocale);
  }

  let contentRecords: ContentRecord[] | null = null;
  const entriesByLocale = new Map<string, DocsEntry[]>();

  const readRecords = () => {
    if (!contentRecords) {
      contentRecords = discoverContentRecords(config.contentDir, config.locales);
    }

    return contentRecords;
  };

  const materializeEntries = (locale: string) =>
    readRecords()
      .map((record) => materializeRecord(record, locale, config))
      .filter((entry): entry is DocsEntry => entry !== null)
      .sort(compareEntries(config.sectionOrder));

  const getAllEntries = (locale: string = config.defaultLocale) => {
    const cached = entriesByLocale.get(locale);
    if (cached) {
      return cached;
    }

    const entries = materializeEntries(locale);
    entriesByLocale.set(locale, entries);
    return entries;
  };

  const getEntry = (slugs?: string[] | string, locale: string = config.defaultLocale) => {
    const normalized = normalizeSlugs(slugs);
    const isHomeRequest = normalized.length === 0;

    return (
      getAllEntries(locale).find((entry) =>
        isHomeRequest
          ? entry.isHome
          : entry.slugs.join("/") === normalized.join("/")
      ) ?? null
    );
  };

  const getNavigation = (locale: string = config.defaultLocale): DocsNavSection[] => {
    const sections = new Map<string, NavigationBucket>();

    for (const entry of getAllEntries(locale)) {
      if (entry.isHome || !entry.sidebar) {
        continue;
      }

      const key = entry.section ?? "";
      const bucket: NavigationBucket = sections.get(key) ?? {
        ungrouped: [],
        groups: new Map(),
      };
      const item = toNavItem(entry);

      if (entry.group) {
        const groupItems = bucket.groups.get(entry.group) ?? ([] as DocsNavItem[]);
        groupItems.push(item);
        bucket.groups.set(entry.group, groupItems);
      } else {
        bucket.ungrouped.push(item);
      }

      sections.set(key, bucket);
    }

    const keys = Array.from(sections.keys()).sort((left, right) => {
      const leftIndex = config.sectionOrder.indexOf(left);
      const rightIndex = config.sectionOrder.indexOf(right);

      if (leftIndex >= 0 || rightIndex >= 0) {
        if (leftIndex < 0) return 1;
        if (rightIndex < 0) return -1;
        return leftIndex - rightIndex;
      }

      return left.localeCompare(right);
    });

    return keys.map((key) => {
      const bucket: NavigationBucket = sections.get(key) ?? {
        ungrouped: [],
        groups: new Map(),
      };
      const items = bucket.ungrouped.sort(compareEntries(config.sectionOrder));
      const groups = Array.from(bucket.groups.entries())
        .map(([groupKey, groupItems]) => {
          const sortedItems = groupItems.sort(compareEntries(config.sectionOrder));
          return {
            key: groupKey,
            label: resolveGroupLabel(key, groupKey, sortedItems, config),
            items: sortedItems,
            groups: [],
          };
        })
        .sort(compareGroups(key, config.sectionOrder));
      const label =
        config.sectionLabels[key] ||
        items[0]?.sectionLabel ||
        groups[0]?.items[0]?.sectionLabel ||
        (key ? humanizeSlug(key) : "Guides");

      return {
        key,
        label,
        items,
        groups,
      };
    });
  };

  const getSectionLanding = (section: string, locale: string = config.defaultLocale) => {
    const navSection = getNavigation(locale).find((item) => item.key === section);
    return navSection ? flattenNavItems([navSection])[0] ?? null : null;
  };

  const getAdjacentEntries = (
    slugs?: string[] | string,
    locale: string = config.defaultLocale
  ) => {
    const normalized = normalizeSlugs(slugs).join("/");
    const flat = flattenNavItems(getNavigation(locale));
    const index = flat.findIndex((entry) => entry.slugs.join("/") === normalized);

    return {
      previousEntry: index > 0 ? flat[index - 1] : null,
      nextEntry: index >= 0 && index < flat.length - 1 ? flat[index + 1] : null,
    };
  };

  const getHomeEntry = (locale: string = config.defaultLocale) =>
    getAllEntries(locale).find((entry) => entry.isHome) ?? null;

  const getHomeRedirectEntry = (locale: string = config.defaultLocale) => {
    if (config.homeRedirectSlugs.length === 0) {
      return null;
    }

    const entry = getEntry(config.homeRedirectSlugs, locale);
    return entry && !entry.isHome ? entry : null;
  };

  const getHref = (slugs?: string[] | string, locale: string = config.defaultLocale) =>
    buildDocsHref({
      basePath: config.basePath,
      slugs: normalizeSlugs(slugs),
      locale,
      defaultLocale: config.defaultLocale,
      hideDefaultLocaleInUrl: config.hideDefaultLocaleInUrl,
      docsIndexSlug: config.docsIndexSlug,
    });

  const resolveRoute = (
    slugs?: string[] | string,
    locale: string = config.defaultLocale
  ): DocsRouteResolution => {
    const normalized = normalizeSlugs(slugs);

    if (normalized.length === 0) {
      const redirectEntry = getHomeRedirectEntry(locale);
      if (redirectEntry) {
        return {
          type: "redirect",
          href: redirectEntry.href,
        };
      }
    }

    const entry = getEntry(normalized, locale);

    if (entry) {
      return {
        type: "entry",
        entry,
        ...getAdjacentEntries(normalized, locale),
      };
    }

    if (normalized.length === 1) {
      const landing = getSectionLanding(normalized[0], locale);
      if (landing) {
        return {
          type: "redirect",
          href: landing.href,
        };
      }
    }

    return { type: "notFound" };
  };

  const getMetadata = (
    slugs?: string[] | string,
    locale: string = config.defaultLocale
  ): DocsMetadata => {
    const normalized = normalizeSlugs(slugs);
    if (normalized.length === 0) {
      const redirectEntry = getHomeRedirectEntry(locale);
      if (redirectEntry) {
        return {
          title: config.titleSuffix
            ? `${redirectEntry.title} | ${config.titleSuffix}`
            : redirectEntry.title,
          description: redirectEntry.description,
        };
      }
    }

    const entry = getEntry(normalized, locale);

    if (!entry) {
      return {
        title: config.siteTitle ? `${config.siteTitle} | Not Found` : "Not Found",
        description: "The requested document could not be found.",
      };
    }

    if (entry.isHome) {
      return {
        title: config.siteTitle ?? entry.title,
        description: entry.description,
      };
    }

    return {
      title: config.titleSuffix ? `${entry.title} | ${config.titleSuffix}` : entry.title,
      description: entry.description,
    };
  };

  const getStaticParams = (locale: string = config.defaultLocale) => {
    const params = getAllEntries(locale).map((entry) => ({
      slug: entry.isHome ? [] : entry.slugs,
    }));

    if (params.some((param) => param.slug.length === 0) || !getHomeRedirectEntry(locale)) {
      return params;
    }

    return [{ slug: [] }, ...params];
  };

  const getLocaleStaticParams = () =>
    config.locales
      .filter((locale) => locale !== config.defaultLocale)
      .flatMap((locale) =>
        getStaticParams(locale).map((entry) => ({
          locale,
          slug: entry.slug,
        }))
      );

  return {
    config,
    getSupportedLocales: () => [...config.locales],
    getDefaultLocale: () => config.defaultLocale,
    getAllEntries,
    getNavigation,
    getEntry,
    getHomeEntry,
    getSectionLanding,
    getAdjacentEntries,
    search: (query: string, locale: string = config.defaultLocale) =>
      searchEntries(getAllEntries(locale), query, config.searchLimit),
    getHref,
    resolveRoute,
    getMetadata,
    getStaticParams,
    getLocaleStaticParams,
  };
}

function discoverContentRecords(contentDir: string, locales: string[]): ContentRecord[] {
  if (!fs.existsSync(contentDir)) {
    return [];
  }

  const records: ContentRecord[] = [];

  function walk(dir: string, slugs: string[] = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const localizedFiles = new Map<string, string>();

    for (const entry of entries) {
      if (!entry.isFile()) {
        continue;
      }

      const match = entry.name.match(/^([^.]+)\.(md|mdx)$/);
      if (!match) {
        continue;
      }

      const candidateLocale = match[1];
      if (locales.includes(candidateLocale)) {
        localizedFiles.set(candidateLocale, path.join(dir, entry.name));
      }
    }

    if (localizedFiles.size > 0) {
      records.push({ slugs, localizedFiles });
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath, [...slugs, entry.name]);
        continue;
      }

      if (entry.isFile() && /\.(md|mdx)$/.test(entry.name)) {
        const basename = entry.name.replace(/\.(md|mdx)$/, "");
        records.push({
          slugs: [...slugs, basename],
          localizedFiles: new Map(),
          legacyFile: fullPath,
        });
      }
    }
  }

  walk(contentDir);
  return records;
}

function materializeRecord(
  record: ContentRecord,
  requestedLocale: string,
  config: DocsSource["config"]
): DocsEntry | null {
  let filePath: string | undefined;
  let contentLocale = requestedLocale;
  const availableLocales = Array.from(record.localizedFiles.keys()).sort();

  if (record.localizedFiles.size > 0) {
    filePath =
      record.localizedFiles.get(requestedLocale) ??
      record.localizedFiles.get(config.defaultLocale) ??
      availableLocales.map((locale) => record.localizedFiles.get(locale)).find(Boolean);

    if (!filePath) {
      return null;
    }

    contentLocale =
      record.localizedFiles.get(requestedLocale) !== undefined
        ? requestedLocale
        : record.localizedFiles.get(config.defaultLocale) !== undefined
          ? config.defaultLocale
          : availableLocales[0];
  } else {
    filePath = record.legacyFile;
    contentLocale = config.defaultLocale;
  }

  if (!filePath) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);
  const frontmatter = data as ParsedFrontmatter;
  const isHome =
    record.slugs.length === 0 ||
    (record.slugs.length === 1 && record.slugs[0] === config.docsIndexSlug);
  const section = isHome
    ? null
    : frontmatter.section ?? (record.slugs.length > 1 ? record.slugs[0] : "");
  const sectionLabel =
    (section !== null && config.sectionLabels[section]) ||
    frontmatter.sectionLabel ||
    (section ? humanizeSlug(section) : config.sectionLabels[""] || "Guides");
  const group = isHome
    ? null
    : normalizeGroupKey(frontmatter.group) ??
      (record.slugs.length > 2 ? record.slugs[1] : null);
  const groupLabel = group
    ? resolveGroupLabel(section ?? "", group, [], config, frontmatter.groupLabel)
    : null;
  const sidebar = isHome ? false : frontmatter.sidebar !== false;
  const headings = extractHeadings(content);
  const href = buildDocsHref({
    basePath: config.basePath,
    slugs: record.slugs,
    locale: requestedLocale,
    defaultLocale: config.defaultLocale,
    hideDefaultLocaleInUrl: config.hideDefaultLocaleInUrl,
    docsIndexSlug: config.docsIndexSlug,
  });

  return {
    slug: record.slugs.join("/"),
    slugs: record.slugs,
    href,
    title:
      frontmatter.title ||
      (isHome ? config.siteTitle ?? "Documentation" : humanizeSlug(record.slugs.at(-1) ?? "")),
    description: frontmatter.description || "",
    order: typeof frontmatter.order === "number" ? frontmatter.order : 999,
    section,
    sectionLabel,
    group,
    groupLabel,
    sidebar,
    locale: requestedLocale,
    contentLocale,
    availableLocales: availableLocales.length > 0 ? availableLocales : [config.defaultLocale],
    isHome,
    content,
    headings,
    filePath,
  };
}

export function toNavItem(entry: DocsEntry): DocsNavItem {
  return {
    slug: entry.slug,
    slugs: entry.slugs,
    href: entry.href,
    title: entry.title,
    description: entry.description,
    order: entry.order,
    section: entry.section,
    sectionLabel: entry.sectionLabel,
    group: entry.group,
    groupLabel: entry.groupLabel,
    sidebar: entry.sidebar,
    locale: entry.locale,
    contentLocale: entry.contentLocale,
    availableLocales: entry.availableLocales,
    isHome: entry.isHome,
  };
}

export { flattenNavItems };

function normalizeGroupKey(value?: string): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function resolveGroupLabel(
  section: string,
  group: string,
  items: DocsNavItem[],
  config: DocsSource["config"],
  frontmatterLabel?: string
): string {
  return (
    config.groupLabels[`${section}/${group}`] ||
    config.groupLabels[group] ||
    frontmatterLabel ||
    items.find((item) => item.groupLabel)?.groupLabel ||
    humanizeSlug(group)
  );
}

function compareGroups(section: string, sectionOrder: string[]) {
  return (left: DocsNavSection, right: DocsNavSection) => {
    const leftIndex = sectionOrder.indexOf(`${section}/${left.key}`);
    const rightIndex = sectionOrder.indexOf(`${section}/${right.key}`);

    if (leftIndex >= 0 || rightIndex >= 0) {
      if (leftIndex < 0) return 1;
      if (rightIndex < 0) return -1;
      if (leftIndex !== rightIndex) {
        return leftIndex - rightIndex;
      }
    }

    return left.label.localeCompare(right.label);
  };
}

function compareEntries(sectionOrder: string[]) {
  return (left: DocsEntry | DocsNavItem, right: DocsEntry | DocsNavItem) => {
    const leftSectionIndex = sectionOrder.indexOf(left.section ?? "");
    const rightSectionIndex = sectionOrder.indexOf(right.section ?? "");

    if (leftSectionIndex >= 0 || rightSectionIndex >= 0) {
      if (leftSectionIndex < 0) return 1;
      if (rightSectionIndex < 0) return -1;
      if (leftSectionIndex !== rightSectionIndex) {
        return leftSectionIndex - rightSectionIndex;
      }
    }

    if (left.order !== right.order) {
      return left.order - right.order;
    }

    return left.title.localeCompare(right.title);
  };
}

export function extractHeadings(content: string): DocsHeading[] {
  const tree = unified().use(remarkParse).use(remarkMdx).parse(content);
  const headings: DocsHeading[] = [];

  visit(tree, "heading", (node: any) => {
    if (node.depth < 1 || node.depth > 4) {
      return;
    }

    const text = flattenNodeText(node).trim();
    if (!text) {
      return;
    }

    headings.push({
      id: slugifyHeading(text),
      text,
      level: node.depth,
    });
  });

  return headings;
}

function flattenNodeText(node: any): string {
  if (!node) {
    return "";
  }

  if (typeof node.value === "string") {
    return node.value;
  }

  if (Array.isArray(node.children)) {
    return node.children.map(flattenNodeText).join("");
  }

  return "";
}
