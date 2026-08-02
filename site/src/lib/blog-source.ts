import path from "node:path";
import { createBlogSource } from "@agenetix/docs";
import {
  defaultSiteLocale,
  hideDefaultSiteLocaleInUrl,
  routeLocales,
} from "@/lib/site-i18n";

const contentDir = path.join(process.cwd(), "site/content/blog");

export const blogSource = createBlogSource({
  contentDir,
  basePath: "/blog",
  defaultLocale: defaultSiteLocale,
  locales: [...routeLocales],
  hideDefaultLocaleInUrl: hideDefaultSiteLocaleInUrl,
  siteTitle: "MCP Stack Docs",
  titleSuffix: "MCP Stack Docs",
});
