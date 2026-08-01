import { notFound } from "next/navigation";
import { DocsLayout } from "@agenetix/docs";
import DocumentLanguage from "@/components/DocumentLanguage";
import DocsRouteThemeBoundary from "@/components/DocsRouteThemeBoundary";
import { DocsThemeStudioSidebarCard } from "@/components/DocsThemeStudio";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { docsSource } from "@/lib/docs-source";
import { docsClassicTheme } from "@/lib/docs-themes";
import { searchDocsAction } from "@/app/doc-actions";
import { docsLocales, isSupportedDocsLocale } from "@/lib/site-i18n";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleDocsLayout({
  children,
  params,
}: LayoutProps) {
  const { locale } = await params;
  if (!isSupportedDocsLocale(locale)) {
    notFound();
  }

  return (
    <>
      <DocumentLanguage locale={locale} />
      <DocsRouteThemeBoundary defaults={docsClassicTheme}>
        <Header locale={locale} />
        <DocsLayout
          navigation={docsSource.getNavigation(locale)}
          searchAction={searchDocsAction}
          locale={locale}
          variant="embedded"
          languageSwitcher={
            <LanguageSwitcher locales={docsLocales} fallbackBasePath="/docs" />
          }
          sidebarHeader={<DocsThemeStudioSidebarCard />}
        >
          {children}
        </DocsLayout>
        <Footer locale={locale} />
      </DocsRouteThemeBoundary>
    </>
  );
}
