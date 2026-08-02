import { notFound } from "next/navigation";
import { BlogPostPage, type BlogPostPageCopy } from "@agenetix/docs";
import { blogSource } from "@/lib/blog-source";
import { getPageDictionary } from "@/lib/site-i18n";

export default async function SiteBlogPostPage({
  locale,
  slug,
}: {
  locale: string;
  slug: string;
}) {
  const entry = blogSource.getEntry(slug, locale);
  if (!entry) {
    notFound();
  }

  const pageCopy = getPageDictionary(locale, "blogPost");
  const copy: BlogPostPageCopy = {
    backLabel: pageCopy.backLabel,
    writtenByLabel: pageCopy.writtenByLabel,
    publishedOnLabel: pageCopy.publishedOnLabel,
    updatedOnLabel: pageCopy.updatedOnLabel,
    tagsLabel: pageCopy.tagsLabel,
    suggestedLabel: pageCopy.suggestedLabel,
    suggestedDescription: pageCopy.suggestedDescription,
    readMoreLabel: pageCopy.readMoreLabel,
    readingTimeSuffix: pageCopy.readingTimeSuffix,
  };

  return (
    <BlogPostPage
      entry={entry}
      suggestedEntries={blogSource.getSuggestedEntries(
        slug,
        { strategy: "related", limit: 3 },
        locale
      )}
      copy={copy}
      locale={locale}
      backHref={blogSource.getHref(undefined, locale)}
    />
  );
}
