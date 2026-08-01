import { DocsLayout } from "@agenetix/docs";
import DocumentLanguage from "@/components/DocumentLanguage";
import DocsRouteThemeBoundary from "@/components/DocsRouteThemeBoundary";
import { DocsThemeStudioSidebarCard } from "@/components/DocsThemeStudio";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { searchDocsAction } from "@/app/doc-actions";
import { docsSource } from "@/lib/docs-source";
import { docsClassicTheme } from "@/lib/docs-themes";
import { defaultSiteLocale, docsLocales } from "@/lib/site-i18n";

export default function DocsRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DocumentLanguage locale={defaultSiteLocale} />
      <DocsRouteThemeBoundary defaults={docsClassicTheme}>
        <Header locale={defaultSiteLocale} />
        <DocsLayout
          navigation={docsSource.getNavigation()}
          searchAction={searchDocsAction}
          locale={defaultSiteLocale}
          variant="embedded"
          languageSwitcher={
            <LanguageSwitcher locales={docsLocales} fallbackBasePath="/docs" />
          }
          sidebarHeader={<DocsThemeStudioSidebarCard />}
        >
          {children}
        </DocsLayout>
        <Footer locale={defaultSiteLocale} />
      </DocsRouteThemeBoundary>
    </>
  );
}
