import type { ReactNode } from "react";

export interface DocsHeading {
  id: string;
  text: string;
  level: number;
}

export interface DocsSearchResult {
  slug: string;
  slugs: string[];
  href: string;
  title: string;
  description: string;
  section: string | null;
  sectionLabel: string;
  snippet: string;
  matchedFields: Array<"title" | "description" | "content">;
  sectionTitle?: string;
  sectionAnchor?: string;
  locale: string;
  contentLocale: string;
}

export interface DocsSearchResponse {
  query: string;
  total: number;
  results: DocsSearchResult[];
}

export interface DocsEntryMeta {
  slug: string;
  slugs: string[];
  href: string;
  title: string;
  description: string;
  order: number;
  section: string | null;
  sectionLabel: string;
  group: string | null;
  groupLabel: string | null;
  sidebar: boolean;
  locale: string;
  contentLocale: string;
  availableLocales: string[];
  isHome: boolean;
}

export interface DocsEntry extends DocsEntryMeta {
  content: string;
  headings: DocsHeading[];
  filePath: string;
}

export interface DocsNavItem extends DocsEntryMeta {}

export interface DocsNavSection {
  key: string;
  label: string;
  items: DocsNavItem[];
  groups: DocsNavSection[];
}

export interface DocsRouteResolution {
  type: "entry" | "redirect" | "notFound";
  entry?: DocsEntry;
  href?: string;
  previousEntry?: DocsNavItem | null;
  nextEntry?: DocsNavItem | null;
}

export interface DocsMetadata {
  title: string;
  description: string;
}

export interface BlogMetadata {
  title: string;
  description: string;
}

export interface DocsSourceConfig {
  contentDir: string;
  basePath: string;
  defaultLocale?: string;
  locales?: string[];
  hideDefaultLocaleInUrl?: boolean;
  docsIndexSlug?: string;
  homeRedirect?: string[] | string;
  siteTitle?: string;
  titleSuffix?: string;
  sectionLabels?: Record<string, string>;
  sectionOrder?: string[];
  groupLabels?: Record<string, string>;
  searchLimit?: number;
}

export interface DocsSource {
  config: Required<
    Omit<
      DocsSourceConfig,
      | "siteTitle"
      | "titleSuffix"
      | "sectionLabels"
      | "sectionOrder"
      | "groupLabels"
      | "homeRedirect"
    >
  > & {
    homeRedirectSlugs: string[];
    siteTitle?: string;
    titleSuffix?: string;
    sectionLabels: Record<string, string>;
    sectionOrder: string[];
    groupLabels: Record<string, string>;
  };
  getSupportedLocales(): string[];
  getDefaultLocale(): string;
  getAllEntries(locale?: string): DocsEntry[];
  getNavigation(locale?: string): DocsNavSection[];
  getEntry(slugs?: string[] | string, locale?: string): DocsEntry | null;
  getHomeEntry(locale?: string): DocsEntry | null;
  getSectionLanding(section: string, locale?: string): DocsNavItem | null;
  getAdjacentEntries(slugs?: string[] | string, locale?: string): {
    previousEntry: DocsNavItem | null;
    nextEntry: DocsNavItem | null;
  };
  search(query: string, locale?: string): DocsSearchResponse;
  getHref(slugs?: string[] | string, locale?: string): string;
  resolveRoute(slugs?: string[] | string, locale?: string): DocsRouteResolution;
  getMetadata(slugs?: string[] | string, locale?: string): DocsMetadata;
  getStaticParams(locale?: string): Array<{ slug?: string[] }>;
  getLocaleStaticParams(): Array<{ locale: string; slug?: string[] }>;
}

export interface BlogEntryMeta {
  slug: string;
  href: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  authorRole?: string;
  authorImage?: string;
  image?: string;
  imageAlt?: string;
  category: string;
  tags: string[];
  readingTimeMinutes: number;
  locale: string;
  contentLocale: string;
  availableLocales: string[];
}

export interface BlogEntry extends BlogEntryMeta {
  content: string;
  headings: DocsHeading[];
  filePath: string;
  relatedSlugs: string[];
}

export interface BlogSearchResult {
  slug: string;
  href: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  snippet: string;
  matchedFields: Array<"title" | "description" | "category" | "tags" | "content">;
  locale: string;
  contentLocale: string;
  publishedAt: string;
  updatedAt: string;
  sectionTitle?: string;
  sectionAnchor?: string;
}

export interface BlogSearchResponse {
  query: string;
  total: number;
  results: BlogSearchResult[];
}

export interface BlogDirectoryResponse {
  query: string;
  selectedCategory: string;
  categories: string[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  items: BlogEntryMeta[];
}

export interface BlogSourceConfig {
  contentDir: string;
  basePath: string;
  defaultLocale?: string;
  locales?: string[];
  hideDefaultLocaleInUrl?: boolean;
  siteTitle?: string;
  titleSuffix?: string;
  searchLimit?: number;
}

export type BlogSuggestionStrategy = "related" | "recent" | "manual";

export interface BlogDirectoryQuery {
  query?: string;
  category?: string;
  page?: number;
  pageSize?: number;
  locale?: string;
}

export interface BlogSuggestionOptions {
  strategy?: BlogSuggestionStrategy;
  limit?: number;
}

export interface BlogSource {
  config: Required<Omit<BlogSourceConfig, "siteTitle" | "titleSuffix">> & {
    siteTitle?: string;
    titleSuffix?: string;
  };
  getSupportedLocales(): string[];
  getDefaultLocale(): string;
  getAllEntries(locale?: string): BlogEntry[];
  getEntry(slug: string, locale?: string): BlogEntry | null;
  getCategories(locale?: string): string[];
  getDirectory(query?: BlogDirectoryQuery): BlogDirectoryResponse;
  search(query: string, locale?: string): BlogSearchResponse;
  getSuggestedEntries(
    slug: string,
    options?: BlogSuggestionOptions,
    locale?: string
  ): BlogEntryMeta[];
  getHref(slug?: string, locale?: string): string;
  getMetadata(slug?: string, locale?: string): BlogMetadata;
  getStaticParams(locale?: string): Array<{ slug: string }>;
  getLocaleStaticParams(): Array<{ locale: string; slug: string }>;
}

export interface DocsLayoutLink {
  href: string;
  label: string;
}

export interface DocsHeaderSlotProps {
  navigation: DocsNavSection[];
  brand?: ReactNode;
  topLinks?: DocsLayoutLink[];
  languageSwitcher?: ReactNode;
  themeSwitcher?: ReactNode;
  searchAction?: DocsSearchAction;
  locale?: string;
  currentTitle: string;
  isMobile: boolean;
  isNavigationOpen: boolean;
  openNavigation: () => void;
  closeNavigation: () => void;
  toggleNavigation: () => void;
}

export interface DocsSidebarSlotProps {
  navigation: DocsNavSection[];
  locale?: string;
  currentTitle: string;
  isMobile: boolean;
  closeNavigation: () => void;
}

export type DocsLayoutSlot<Props> =
  | ReactNode
  | ((props: Props) => ReactNode)
  | null;

export type DocsThemePreset = "neutral" | "dusk" | "ocean" | "sqlos";
export type DocsThemeMode = "light" | "dark";
export type DocsThemeRadius = "md" | "lg" | "xl";
export type DocsThemeDensity = "comfortable" | "compact";
export type DocsThemeAccentStrength = "soft" | "balanced" | "bold";
export type DocsThemeSurfaceStyle = "flat" | "tinted" | "elevated";

export interface DocsThemeColorConfig {
  preset?: DocsThemePreset;
  mode?: DocsThemeMode;
  accentHue?: number;
  accentStrength?: DocsThemeAccentStrength;
  surfaceStyle?: DocsThemeSurfaceStyle;
}

export interface DocsThemeLayoutConfig {
  density?: DocsThemeDensity;
  layoutWidth?: string;
  contentWidth?: string;
  sidebarWidth?: string;
  tocWidth?: string;
}

export interface DocsThemeShapeConfig {
  radius?: DocsThemeRadius;
}

export interface DocsThemeTokens {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  border: string;
  borderStrong: string;
  input: string;
  ring: string;
  accentSoft: string;
  surface: string;
  bg: string;
  codeBg: string;
  codeBorder: string;
  info: string;
  infoSoft: string;
  warning: string;
  warningSoft: string;
  error: string;
  errorSoft: string;
  success: string;
  successSoft: string;
  shadowSm: string;
  shadowLg: string;
}

export interface DocsThemeConfig {
  color?: DocsThemeColorConfig;
  layout?: DocsThemeLayoutConfig;
  shape?: DocsThemeShapeConfig;
  tokens?: Partial<DocsThemeTokens>;
}

export interface DocsResolvedThemeConfig {
  color: Required<DocsThemeColorConfig>;
  layout: Required<DocsThemeLayoutConfig>;
  shape: Required<DocsThemeShapeConfig>;
  tokens: DocsThemeTokens;
}

export interface DocsResolvedTheme {
  config: DocsResolvedThemeConfig;
  tokens: DocsThemeTokens;
  attributes: {
    preset: DocsThemePreset;
    mode: DocsThemeMode;
    density: DocsThemeDensity;
    accentStrength: DocsThemeAccentStrength;
    surfaceStyle: DocsThemeSurfaceStyle;
  };
  style: Record<string, string>;
}

export type DocsSearchAction = (
  query: string,
  locale?: string
) => Promise<DocsSearchResponse>;

export type DocsLayoutVariant = "full" | "embedded";

export interface DocsLayoutCommonProps {
  navigation: DocsNavSection[];
  children: ReactNode;
  /**
   * Layout variant:
   * - "full": Renders complete docs shell with header (default)
   * - "embedded": No header, designed to be wrapped by your site's header/footer
   */
  variant?: DocsLayoutVariant;
  brand?: ReactNode;
  topLinks?: DocsLayoutLink[];
  header?: DocsLayoutSlot<DocsHeaderSlotProps>;
  sidebar?: DocsLayoutSlot<DocsSidebarSlotProps>;
  /** Content rendered above the sidebar navigation (e.g., search box) */
  sidebarHeader?: ReactNode;
  /** Content rendered below the sidebar navigation (e.g., theme editor) */
  sidebarFooter?: ReactNode;
  languageSwitcher?: ReactNode;
  themeSwitcher?: ReactNode;
  searchAction?: DocsSearchAction;
  locale?: string;
  theme?: DocsThemeConfig;
  className?: string;
}

export interface BlogDirectoryCopy {
  title: string;
  description?: string;
  categoriesLabel: string;
  searchLabel: string;
  searchPlaceholder: string;
  allCategoriesLabel: string;
  noResultsTitle: string;
  noResultsDescription: string;
}

export interface BlogCardCopy {
  readMoreLabel: string;
  readingTimeSuffix: string;
}

export interface BlogPaginationCopy {
  previousLabel: string;
  nextLabel: string;
  pageLabel: string;
}

export interface BlogPostPageCopy {
  backLabel: string;
  writtenByLabel: string;
  publishedOnLabel: string;
  updatedOnLabel: string;
  tagsLabel: string;
  suggestedLabel: string;
  suggestedDescription?: string;
  readMoreLabel: string;
  readingTimeSuffix: string;
}
