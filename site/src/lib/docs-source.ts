import path from "node:path";
import { createDocsSource } from "@agenetix/docs";
import {
  defaultSiteLocale,
  docsLocales,
  hideDefaultSiteLocaleInUrl,
} from "@/lib/site-i18n";

const contentDir = path.join(process.cwd(), "site/content/docs");

const sharedConfig = {
  contentDir,
  defaultLocale: defaultSiteLocale,
  locales: [...docsLocales],
  hideDefaultLocaleInUrl: hideDefaultSiteLocaleInUrl,
  siteTitle: "MCP Stack Docs",
  titleSuffix: "MCP Stack Docs",
  sectionOrder: ["", "guides", "layouts", "internationalization", "reference"],
};

export const docsSource = createDocsSource({
  ...sharedConfig,
  basePath: "/docs",
  homeRedirect: "getting-started",
});
