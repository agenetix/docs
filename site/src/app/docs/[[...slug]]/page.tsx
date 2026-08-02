import { notFound, redirect } from "next/navigation";
import { DocsHomePage, DocsPage } from "@agenetix/docs";
import { docsSource } from "@/lib/docs-source";
import { defaultSiteLocale, getDocsPageDictionary } from "@/lib/site-i18n";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export function generateStaticParams() {
  return docsSource.getStaticParams();
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return docsSource.getMetadata(slug);
}

export default async function DocsRoutePage({ params }: PageProps) {
  const { slug } = await params;
  const homeCopy = getDocsPageDictionary(defaultSiteLocale, "docsClassicHome");
  const resolved = docsSource.resolveRoute(slug);

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
        navigation={docsSource.getNavigation()}
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
      backHref={docsSource.getHref()}
    />
  );
}
