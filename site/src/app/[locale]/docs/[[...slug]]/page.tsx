import { notFound, redirect } from "next/navigation";
import { DocsHomePage, DocsPage } from "@agenetix/docs";
import { docsSource } from "@/lib/docs-source";
import { getDocsPageDictionary } from "@/lib/site-i18n";

interface PageProps {
  params: Promise<{ locale: string; slug?: string[] }>;
}

export function generateStaticParams() {
  return docsSource.getLocaleStaticParams();
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = await params;
  return docsSource.getMetadata(slug, locale);
}

export default async function LocaleDocsRoutePage({ params }: PageProps) {
  const { locale, slug } = await params;
  const homeCopy = getDocsPageDictionary(locale, "docsClassicHome");
  if (!docsSource.getSupportedLocales().includes(locale)) {
    notFound();
  }

  if (locale === docsSource.getDefaultLocale()) {
    redirect(docsSource.getHref(slug, locale));
  }

  const resolved = docsSource.resolveRoute(slug, locale);
  if (resolved.type === "redirect" && resolved.href) {
    redirect(resolved.href);
  }

  if (resolved.type !== "entry" || !resolved.entry) {
    notFound();
  }

  if (resolved.entry.isHome) {
    return (
      <DocsHomePage
        entry={resolved.entry}
        navigation={docsSource.getNavigation(locale)}
        title={homeCopy.title}
        description={homeCopy.description}
      />
    );
  }

  return (
    <DocsPage
      entry={resolved.entry}
      previousEntry={resolved.previousEntry}
      nextEntry={resolved.nextEntry}
      backHref={docsSource.getHref([], locale)}
    />
  );
}
