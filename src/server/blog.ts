import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type {
  BlogDirectoryQuery,
  BlogDirectoryResponse,
  BlogEntry,
  BlogEntryMeta,
  BlogMetadata,
  BlogSearchResponse,
  BlogSearchResult,
  BlogSource,
  BlogSourceConfig,
  BlogSuggestionOptions,
  DocsHeading,
} from "../types.js";
import {
  buildBlogHref,
  calculateReadingTimeMinutes,
  humanizeSlug,
  normalizeBasePath,
  slugifyHeading,
  stripMarkdown,
} from "../utils.js";
import { extractHeadings } from "./docs.js";

interface ContentRecord {
  slug: string;
  localizedFiles: Map<string, string>;
  legacyFile?: string;
}

interface ParsedBlogFrontmatter {
  title?: string;
  description?: string;
  excerpt?: string;
  publishedAt?: string;
  updatedAt?: string;
  date?: string;
  author?: string;
  authorRole?: string;
  authorImage?: string;
  authorPhoto?: string;
  image?: string;
  imageAlt?: string;
  previewImage?: string;
  imagePreview?: string;
  category?: string;
  tags?: string[] | string;
  relatedSlugs?: string[] | string;
}

interface RankedBlogSearchResult extends BlogSearchResult {
  score: number;
}

interface SectionSlice {
  heading: string;
  anchor: string;
  content: string;
}

export function createBlogSource(input: BlogSourceConfig): BlogSource {
  const config = {
    contentDir: path.resolve(input.contentDir),
    basePath: normalizeBasePath(input.basePath),
    defaultLocale: input.defaultLocale ?? "en",
    locales: Array.from(new Set(input.locales?.length ? input.locales : ["en"])),
    hideDefaultLocaleInUrl: input.hideDefaultLocaleInUrl ?? true,
    siteTitle: input.siteTitle,
    titleSuffix: input.titleSuffix ?? input.siteTitle,
    searchLimit: input.searchLimit ?? 8,
  };

  if (!config.locales.includes(config.defaultLocale)) {
    config.locales.unshift(config.defaultLocale);
  }

  let contentRecords: ContentRecord[] | null = null;

  const readRecords = () => {
    if (!contentRecords) {
      contentRecords = discoverContentRecords(config.contentDir, config.locales);
    }

    return contentRecords;
  };

  const materializeEntries = (locale: string) =>
    readRecords()
      .map((record) => materializeRecord(record, locale, config))
      .filter((entry): entry is BlogEntry => entry !== null)
      .sort(compareBlogEntries);

  const getAllEntries = (locale: string = config.defaultLocale) => materializeEntries(locale);

  const getEntry = (slug: string, locale: string = config.defaultLocale) =>
    getAllEntries(locale).find((entry) => entry.slug === slug) ?? null;

  const getCategories = (locale: string = config.defaultLocale) =>
    Array.from(new Set(getAllEntries(locale).map((entry) => entry.category)))
      .filter(Boolean)
      .sort((left, right) => left.localeCompare(right));

  const getHref = (slug?: string, locale: string = config.defaultLocale) =>
    buildBlogHref({
      basePath: config.basePath,
      slug,
      locale,
      defaultLocale: config.defaultLocale,
      hideDefaultLocaleInUrl: config.hideDefaultLocaleInUrl,
    });

  const search = (query: string, locale: string = config.defaultLocale): BlogSearchResponse => {
    const results = rankBlogEntries(getAllEntries(locale), query);

    return {
      query: query.trim(),
      total: results.length,
      results: results.slice(0, config.searchLimit).map(({ score: _score, ...result }) => result),
    };
  };

  const getDirectory = (query: BlogDirectoryQuery = {}): BlogDirectoryResponse => {
    const locale = query.locale ?? config.defaultLocale;
    const trimmedQuery = query.query?.trim() ?? "";
    const selectedCategory = query.category?.trim() || "all";
    const pageSize = Math.max(1, query.pageSize ?? 9);
    const page = Math.max(1, query.page ?? 1);
    const categories = getCategories(locale);
    const categoryFiltered = selectedCategory === "all"
      ? getAllEntries(locale)
      : getAllEntries(locale).filter((entry) => entry.category === selectedCategory);

    const filteredItems = trimmedQuery
      ? rankBlogEntries(categoryFiltered, trimmedQuery).map((result) => {
          const entry = categoryFiltered.find((candidate) => candidate.slug === result.slug);
          return entry ? stripBlogEntry(entry) : null;
        }).filter((entry): entry is BlogEntryMeta => entry !== null)
      : categoryFiltered.map(stripBlogEntry);

    const totalItems = filteredItems.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const safePage = Math.min(page, totalPages);
    const startIndex = (safePage - 1) * pageSize;

    return {
      query: trimmedQuery,
      selectedCategory,
      categories,
      page: safePage,
      pageSize,
      totalItems,
      totalPages,
      items: filteredItems.slice(startIndex, startIndex + pageSize),
    };
  };

  const getSuggestedEntries = (
    slug: string,
    options: BlogSuggestionOptions = {},
    locale: string = config.defaultLocale
  ) => {
    const entry = getEntry(slug, locale);
    if (!entry) {
      return [];
    }

    const limit = Math.max(1, options.limit ?? 3);
    const strategy = options.strategy ?? "related";
    const allEntries = getAllEntries(locale).filter((candidate) => candidate.slug !== slug);

    if (strategy === "recent") {
      return allEntries.slice(0, limit).map(stripBlogEntry);
    }

    const relatedPool = rankRelatedEntries(entry, allEntries);

    if (strategy === "manual") {
      const selected = new Map<string, BlogEntryMeta>();

      for (const relatedSlug of entry.relatedSlugs) {
        if (selected.size >= limit) {
          break;
        }

        const match = allEntries.find((candidate) => candidate.slug === relatedSlug);
        if (match) {
          selected.set(match.slug, stripBlogEntry(match));
        }
      }

      for (const candidate of relatedPool) {
        if (selected.size >= limit) {
          break;
        }

        if (!selected.has(candidate.slug)) {
          selected.set(candidate.slug, stripBlogEntry(candidate));
        }
      }

      return Array.from(selected.values()).slice(0, limit);
    }

    return relatedPool.slice(0, limit).map(stripBlogEntry);
  };

  const getMetadata = (slug?: string, locale: string = config.defaultLocale): BlogMetadata => {
    if (!slug) {
      return {
        title: config.titleSuffix ? `Blog | ${config.titleSuffix}` : "Blog",
        description: config.siteTitle
          ? `Articles and updates from ${config.siteTitle}.`
          : "Articles and updates.",
      };
    }

    const entry = getEntry(slug, locale);
    if (!entry) {
      return {
        title: config.siteTitle ? `${config.siteTitle} | Post Not Found` : "Post Not Found",
        description: "The requested blog post could not be found.",
      };
    }

    return {
      title: config.titleSuffix ? `${entry.title} | ${config.titleSuffix}` : entry.title,
      description: entry.description,
    };
  };

  const getStaticParams = (locale: string = config.defaultLocale) =>
    getAllEntries(locale).map((entry) => ({ slug: entry.slug }));

  const getLocaleStaticParams = () =>
    config.locales
      .filter((locale) => locale !== config.defaultLocale)
      .flatMap((locale) =>
        getAllEntries(locale).map((entry) => ({
          locale,
          slug: entry.slug,
        }))
      );

  return {
    config,
    getSupportedLocales: () => [...config.locales],
    getDefaultLocale: () => config.defaultLocale,
    getAllEntries,
    getEntry,
    getCategories,
    getDirectory,
    search,
    getSuggestedEntries,
    getHref,
    getMetadata,
    getStaticParams,
    getLocaleStaticParams,
  };
}

function discoverContentRecords(contentDir: string, locales: string[]): ContentRecord[] {
  if (!fs.existsSync(contentDir)) {
    return [];
  }

  return fs
    .readdirSync(contentDir, { withFileTypes: true })
    .flatMap((entry) => {
      const fullPath = path.join(contentDir, entry.name);

      if (entry.isFile() && /\.(md|mdx)$/.test(entry.name)) {
        return [
          {
            slug: entry.name.replace(/\.(md|mdx)$/, ""),
            localizedFiles: new Map<string, string>(),
            legacyFile: fullPath,
          },
        ];
      }

      if (!entry.isDirectory()) {
        return [];
      }

      const localizedFiles = new Map<string, string>();
      for (const file of fs.readdirSync(fullPath, { withFileTypes: true })) {
        if (!file.isFile()) {
          continue;
        }

        const match = file.name.match(/^([^.]+)\.(md|mdx)$/);
        if (!match) {
          continue;
        }

        const candidateLocale = match[1];
        if (locales.includes(candidateLocale)) {
          localizedFiles.set(candidateLocale, path.join(fullPath, file.name));
        }
      }

      if (localizedFiles.size === 0) {
        return [];
      }

      return [{ slug: entry.name, localizedFiles }];
    })
    .sort((left, right) => left.slug.localeCompare(right.slug));
}

function materializeRecord(
  record: ContentRecord,
  requestedLocale: string,
  config: BlogSource["config"]
): BlogEntry | null {
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
  const frontmatter = data as ParsedBlogFrontmatter;
  const publishedAt = frontmatter.publishedAt || frontmatter.date || "";
  const updatedAt = frontmatter.updatedAt || publishedAt;
  const image = frontmatter.image || frontmatter.previewImage || frontmatter.imagePreview;
  const authorImage = frontmatter.authorImage || frontmatter.authorPhoto;
  const headings = extractHeadings(content);

  return {
    slug: record.slug,
    href: buildBlogHref({
      basePath: config.basePath,
      slug: record.slug,
      locale: requestedLocale,
      defaultLocale: config.defaultLocale,
      hideDefaultLocaleInUrl: config.hideDefaultLocaleInUrl,
    }),
    title: frontmatter.title || humanizeSlug(record.slug),
    description: frontmatter.description || frontmatter.excerpt || "",
    publishedAt,
    updatedAt,
    author: frontmatter.author || "Unknown author",
    authorRole: frontmatter.authorRole,
    authorImage,
    image,
    imageAlt: frontmatter.imageAlt,
    category: frontmatter.category || "General",
    tags: normalizeStringArray(frontmatter.tags),
    readingTimeMinutes: calculateReadingTimeMinutes(content),
    locale: requestedLocale,
    contentLocale,
    availableLocales: availableLocales.length > 0 ? availableLocales : [config.defaultLocale],
    content,
    headings,
    filePath,
    relatedSlugs: normalizeStringArray(frontmatter.relatedSlugs),
  };
}

function stripBlogEntry(entry: BlogEntry): BlogEntryMeta {
  const {
    content: _content,
    headings: _headings,
    filePath: _filePath,
    relatedSlugs: _relatedSlugs,
    ...meta
  } = entry;

  return meta;
}

function normalizeStringArray(value?: string[] | string): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => item.trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function compareBlogEntries(left: BlogEntry, right: BlogEntry) {
  const dateDelta = toDateValue(right.publishedAt) - toDateValue(left.publishedAt);
  if (dateDelta !== 0) {
    return dateDelta;
  }

  return left.title.localeCompare(right.title);
}

function rankRelatedEntries(current: BlogEntry, candidates: BlogEntry[]) {
  const currentTags = new Set(current.tags.map((tag) => tag.toLowerCase()));

  return [...candidates].sort((left, right) => {
    const leftCategory = Number(left.category === current.category);
    const rightCategory = Number(right.category === current.category);
    if (rightCategory !== leftCategory) {
      return rightCategory - leftCategory;
    }

    const leftSharedTags = left.tags.filter((tag) => currentTags.has(tag.toLowerCase())).length;
    const rightSharedTags = right.tags.filter((tag) => currentTags.has(tag.toLowerCase())).length;
    if (rightSharedTags !== leftSharedTags) {
      return rightSharedTags - leftSharedTags;
    }

    const dateDelta = toDateValue(right.publishedAt) - toDateValue(left.publishedAt);
    if (dateDelta !== 0) {
      return dateDelta;
    }

    return left.title.localeCompare(right.title);
  });
}

function rankBlogEntries(entries: BlogEntry[], query: string): RankedBlogSearchResult[] {
  const trimmedQuery = query.trim();
  if (trimmedQuery.length < 2) {
    return [];
  }

  const normalizedQuery = trimmedQuery.toLowerCase();
  const queryTerms = getQueryTerms(trimmedQuery);

  return entries
    .map((entry) => scoreBlogEntry(entry, normalizedQuery, queryTerms))
    .filter((result): result is RankedBlogSearchResult => result !== null)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      const dateDelta = toDateValue(right.publishedAt) - toDateValue(left.publishedAt);
      if (dateDelta !== 0) {
        return dateDelta;
      }

      return left.title.localeCompare(right.title);
    });
}

function scoreBlogEntry(
  entry: BlogEntry,
  normalizedQuery: string,
  queryTerms: string[]
): RankedBlogSearchResult | null {
  const title = entry.title.trim();
  const description = entry.description.trim();
  const category = entry.category.trim();
  const tags = entry.tags.join(" ");
  const contentText = stripMarkdown(entry.content);
  const normalizedTitle = title.toLowerCase();
  const normalizedDescription = description.toLowerCase();
  const normalizedCategory = category.toLowerCase();
  const normalizedTags = tags.toLowerCase();
  const normalizedContent = contentText.toLowerCase();

  let score = 0;
  const matchedFields = new Set<BlogSearchResult["matchedFields"][number]>();

  if (normalizedTitle.includes(normalizedQuery)) {
    score += 160;
    matchedFields.add("title");
  }

  if (normalizedDescription.includes(normalizedQuery)) {
    score += 96;
    matchedFields.add("description");
  }

  if (normalizedCategory.includes(normalizedQuery)) {
    score += 88;
    matchedFields.add("category");
  }

  if (normalizedTags.includes(normalizedQuery)) {
    score += 80;
    matchedFields.add("tags");
  }

  if (normalizedContent.includes(normalizedQuery)) {
    score += 40;
    matchedFields.add("content");
  }

  let matchedTermCount = 0;
  for (const term of queryTerms) {
    const titleMatches = countMatches(normalizedTitle, term);
    const descriptionMatches = countMatches(normalizedDescription, term);
    const categoryMatches = countMatches(normalizedCategory, term);
    const tagMatches = countMatches(normalizedTags, term);
    const contentMatches = Math.min(6, countMatches(normalizedContent, term));

    if (titleMatches || descriptionMatches || categoryMatches || tagMatches || contentMatches) {
      matchedTermCount += 1;
    }

    if (titleMatches > 0) {
      score += 32 + (titleMatches - 1) * 10;
      matchedFields.add("title");
    }

    if (descriptionMatches > 0) {
      score += 18 + (descriptionMatches - 1) * 5;
      matchedFields.add("description");
    }

    if (categoryMatches > 0) {
      score += 20 + (categoryMatches - 1) * 5;
      matchedFields.add("category");
    }

    if (tagMatches > 0) {
      score += 18 + (tagMatches - 1) * 4;
      matchedFields.add("tags");
    }

    if (contentMatches > 0) {
      score += 8 + (contentMatches - 1) * 2;
      matchedFields.add("content");
    }
  }

  if (matchedFields.size === 0) {
    return null;
  }

  if (matchedTermCount === queryTerms.length) {
    score += 24;
  }

  const section = findMatchingSection(entry.content, entry.headings, normalizedQuery);
  const snippet = createSnippet({
    contentText: section ? stripMarkdown(section.content) : contentText,
    description,
    normalizedQuery,
    queryTerms,
  });

  return {
    slug: entry.slug,
    href: section ? `${entry.href}#${section.anchor}` : entry.href,
    title,
    description,
    category,
    tags: entry.tags,
    snippet,
    matchedFields: Array.from(matchedFields),
    locale: entry.locale,
    contentLocale: entry.contentLocale,
    publishedAt: entry.publishedAt,
    updatedAt: entry.updatedAt,
    sectionTitle: section?.heading,
    sectionAnchor: section?.anchor,
    score,
  };
}

function findMatchingSection(
  content: string,
  headings: DocsHeading[],
  normalizedQuery: string
): SectionSlice | undefined {
  const sections = extractSections(content, headings);
  if (sections.length === 0) {
    return undefined;
  }

  const matched = sections
    .map((section) => ({
      section,
      score:
        (section.heading.toLowerCase().includes(normalizedQuery) ? 40 : 0) +
        (stripMarkdown(section.content).toLowerCase().includes(normalizedQuery) ? 16 : 0),
    }))
    .filter((candidate) => candidate.score > 0)
    .sort((left, right) => right.score - left.score)[0];

  return matched?.section;
}

function extractSections(content: string, headings: DocsHeading[]): SectionSlice[] {
  const sectionHeadings = headings.filter((heading) => heading.level >= 2 && heading.level <= 4);
  if (sectionHeadings.length === 0) {
    return [];
  }

  const lines = content.split("\n");
  const located = sectionHeadings
    .map((heading) => ({
      heading,
      index: lines.findIndex((line) => {
        const normalizedLine = line.trim();
        if (!normalizedLine) {
          return false;
        }

        if (/^#{1,6}\s+/.test(normalizedLine)) {
          return normalizedLine.replace(/^#{1,6}\s+/, "") === heading.text;
        }

        const htmlHeadingMatch = normalizedLine.match(/^<h[1-6][^>]*>(.*?)<\/h[1-6]>$/i);
        if (htmlHeadingMatch) {
          return stripMarkdown(htmlHeadingMatch[1]).trim() === heading.text;
        }

        return false;
      }),
    }))
    .filter((item) => item.index >= 0);

  return located.map((item, index) => {
    const next = located[index + 1];
    return {
      heading: item.heading.text,
      anchor: item.heading.id || slugifyHeading(item.heading.text),
      content: lines.slice(item.index, next ? next.index : undefined).join("\n").trim(),
    };
  });
}

function createSnippet({
  contentText,
  description,
  normalizedQuery,
  queryTerms,
}: {
  contentText: string;
  description: string;
  normalizedQuery: string;
  queryTerms: string[];
}): string {
  const fallbackText = description || contentText;
  if (!contentText) {
    return trimSnippet(fallbackText, 180);
  }

  const normalizedContent = contentText.toLowerCase();
  const phraseIndex = normalizedContent.indexOf(normalizedQuery);
  const termIndexes = queryTerms
    .map((term) => normalizedContent.indexOf(term))
    .filter((index) => index >= 0);
  const matchIndex =
    phraseIndex >= 0
      ? phraseIndex
      : termIndexes.length > 0
        ? Math.min(...termIndexes)
        : -1;

  if (matchIndex < 0) {
    return trimSnippet(fallbackText, 180);
  }

  const preferredStart = Math.max(0, matchIndex - 92);
  const preferredEnd = Math.min(contentText.length, matchIndex + 156);
  const sentenceStart = findSnippetStart(contentText, preferredStart);
  const sentenceEnd = findSnippetEnd(contentText, preferredEnd);

  let snippet = contentText.slice(sentenceStart, sentenceEnd).trim();
  if (sentenceStart > 0) {
    snippet = `...${snippet}`;
  }

  if (sentenceEnd < contentText.length) {
    snippet = `${snippet}...`;
  }

  return trimSnippet(snippet, 220);
}

function findSnippetStart(text: string, preferredStart: number): number {
  const punctuationIndex = Math.max(
    text.lastIndexOf(". ", preferredStart),
    text.lastIndexOf(": ", preferredStart),
    text.lastIndexOf("? ", preferredStart),
    text.lastIndexOf("! ", preferredStart)
  );

  return punctuationIndex >= 0 ? punctuationIndex + 2 : preferredStart;
}

function findSnippetEnd(text: string, preferredEnd: number): number {
  const punctuationMatches = [
    text.indexOf(". ", preferredEnd),
    text.indexOf("? ", preferredEnd),
    text.indexOf("! ", preferredEnd),
  ].filter((index) => index >= 0);

  if (punctuationMatches.length === 0) {
    return Math.min(text.length, preferredEnd);
  }

  return Math.min(...punctuationMatches) + 1;
}

function trimSnippet(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1).trimEnd()}...`;
}

function countMatches(value: string, term: string) {
  if (!term) {
    return 0;
  }

  let count = 0;
  let index = 0;

  while (index >= 0) {
    index = value.indexOf(term, index);
    if (index >= 0) {
      count += 1;
      index += term.length;
    }
  }

  return count;
}

function getQueryTerms(query: string) {
  return query
    .toLowerCase()
    .split(/\s+/)
    .map((term) => term.trim())
    .filter(Boolean);
}

function toDateValue(value: string) {
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}
