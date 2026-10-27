import type { DocsEntry, DocsHeading, DocsSearchResponse, DocsSearchResult } from "../types.js";
import { stripMarkdown } from "../utils.js";

interface RankedDocsSearchResult extends DocsSearchResult {
  score: number;
}

interface SectionSlice {
  heading: string;
  anchor: string;
  content: string;
}

export function searchEntries(
  entries: DocsEntry[],
  query: string,
  limit: number
): DocsSearchResponse {
  const trimmedQuery = query.trim();

  if (trimmedQuery.length < 2) {
    return {
      query: trimmedQuery,
      total: 0,
      results: [],
    };
  }

  const normalizedQuery = trimmedQuery.toLowerCase();
  const queryTerms = getQueryTerms(trimmedQuery);
  const results = entries
    .filter((entry) => !entry.isHome)
    .map((entry) => scoreEntry(entry, normalizedQuery, queryTerms))
    .filter((result): result is RankedDocsSearchResult => result !== null)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.title.localeCompare(right.title);
    });

  return {
    query: trimmedQuery,
    total: results.length,
    results: results.slice(0, limit).map(({ score: _score, ...result }) => result),
  };
}

function scoreEntry(
  entry: DocsEntry,
  normalizedQuery: string,
  queryTerms: string[]
): RankedDocsSearchResult | null {
  const title = entry.title.trim();
  const description = entry.description.trim();
  const contentText = stripMarkdown(entry.content);
  const normalizedTitle = title.toLowerCase();
  const normalizedDescription = description.toLowerCase();
  const normalizedContent = contentText.toLowerCase();

  let score = 0;
  const matchedFields = new Set<DocsSearchResult["matchedFields"][number]>();

  if (normalizedTitle.includes(normalizedQuery)) {
    score += 140;
    matchedFields.add("title");
  }

  if (normalizedDescription.includes(normalizedQuery)) {
    score += 64;
    matchedFields.add("description");
  }

  if (normalizedContent.includes(normalizedQuery)) {
    score += 36;
    matchedFields.add("content");
  }

  let matchedTermCount = 0;
  for (const term of queryTerms) {
    const titleMatches = countMatches(normalizedTitle, term);
    const descriptionMatches = countMatches(normalizedDescription, term);
    const contentMatches = Math.min(6, countMatches(normalizedContent, term));

    if (titleMatches || descriptionMatches || contentMatches) {
      matchedTermCount += 1;
    }

    if (titleMatches > 0) {
      score += 30 + (titleMatches - 1) * 8;
      matchedFields.add("title");
    }

    if (descriptionMatches > 0) {
      score += 15 + (descriptionMatches - 1) * 4;
      matchedFields.add("description");
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
    score += 20;
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
    slugs: entry.slugs,
    href: section ? `${entry.href}#${section.anchor}` : entry.href,
    title,
    description,
    section: entry.section,
    sectionLabel: entry.sectionLabel,
    snippet,
    matchedFields: Array.from(matchedFields),
    sectionTitle: section?.heading,
    sectionAnchor: section?.anchor,
    locale: entry.locale,
    contentLocale: entry.contentLocale,
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
      index: lines.findIndex((line) => line.trim().replace(/^#+\s+/, "") === heading.text),
    }))
    .filter((item) => item.index >= 0);

  return located.map((item, index) => {
    const next = located[index + 1];
    const contentSlice = lines
      .slice(item.index, next ? next.index : undefined)
      .join("\n")
      .trim();

    return {
      heading: item.heading.text,
      anchor: item.heading.id,
      content: contentSlice,
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
    return preferredEnd;
  }

  return Math.min(...punctuationMatches) + 1;
}

function trimSnippet(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trimEnd()}...`;
}

function countMatches(text: string, term: string): number {
  if (!term) {
    return 0;
  }

  let count = 0;
  let searchIndex = 0;
  while (true) {
    const matchIndex = text.indexOf(term, searchIndex);
    if (matchIndex < 0) {
      return count;
    }

    count += 1;
    searchIndex = matchIndex + term.length;
  }
}

function getQueryTerms(query: string): string[] {
  const terms = query
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .map((term) => term.trim())
    .filter((term) => term.length >= 2);

  return Array.from(new Set(terms.length > 0 ? terms : [query.toLowerCase()]));
}
