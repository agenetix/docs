/*
 * `@agenetix/docs/source`: the content side of the library with no framework
 * attached. It reads a content folder with Node (`node:fs`, gray-matter,
 * remark) and gives back routes, navigation, headings, metadata and search.
 *
 * Nothing here imports Next.js, React DOM or a component, so any server that
 * runs Node can resolve the same `content/docs/<slug>/<locale>.mdx` folders:
 * a Next.js App Router page through `@agenetix/docs`, or an Expo Router
 * loader, an Express handler, a build script. The Next.js shell in the root
 * entry builds on exactly these functions.
 */
export { createDocsSource, extractHeadings, flattenNavItems, toNavItem } from "./server/docs.js";
export { createBlogSource } from "./server/blog.js";
export { searchEntries } from "./server/search.js";
export {
  buildBlogHref,
  buildContentHref,
  buildDocsHref,
  calculateReadingTimeMinutes,
  findHeadingById,
  humanizeSlug,
  isActiveDocsPath,
  normalizeBasePath,
  normalizeDocsPath,
  normalizeSlugs,
  slugifyHeading,
  stripMarkdown,
  withLocalePrefix,
} from "./utils.js";
export type {
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
  BlogSuggestionStrategy,
  DocsEntry,
  DocsEntryMeta,
  DocsHeading,
  DocsMetadata,
  DocsNavItem,
  DocsNavSection,
  DocsRouteResolution,
  DocsSearchResponse,
  DocsSearchResult,
  DocsSource,
  DocsSourceConfig,
} from "./types.js";
