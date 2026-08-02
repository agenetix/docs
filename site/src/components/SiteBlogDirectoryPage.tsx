import {
  BlogDirectoryPage,
  type BlogCardCopy,
  type BlogDirectoryCopy,
  type BlogPaginationCopy,
} from "@agenetix/docs";
import { blogSource } from "@/lib/blog-source";
import { getPageDictionary } from "@/lib/site-i18n";

export default function SiteBlogDirectoryPage({
  locale,
  searchParams,
}: {
  locale: string;
  searchParams?: {
    q?: string;
    category?: string;
    page?: string;
  };
}) {
  const directoryCopy = getPageDictionary(locale, "blogDirectory");
  const postCopy = getPageDictionary(locale, "blogPost");
  const directory = blogSource.getDirectory({
    locale,
    query: searchParams?.q,
    category: searchParams?.category,
    page: searchParams?.page ? Number.parseInt(searchParams.page, 10) || 1 : 1,
    pageSize: 3,
  });

  const copy: BlogDirectoryCopy = {
    title: directoryCopy.title,
    description: directoryCopy.description,
    categoriesLabel: directoryCopy.categoriesLabel,
    searchLabel: directoryCopy.searchLabel,
    searchPlaceholder: directoryCopy.searchPlaceholder,
    allCategoriesLabel: directoryCopy.allCategoriesLabel,
    noResultsTitle: directoryCopy.noResultsTitle,
    noResultsDescription: directoryCopy.noResultsDescription,
  };

  const cardCopy: BlogCardCopy = {
    readMoreLabel: postCopy.readMoreLabel,
    readingTimeSuffix: postCopy.readingTimeSuffix,
  };

  const paginationCopy: BlogPaginationCopy = {
    previousLabel: directoryCopy.previousLabel,
    nextLabel: directoryCopy.nextLabel,
    pageLabel: directoryCopy.pageLabel,
  };

  return (
    <BlogDirectoryPage
      directory={directory}
      baseHref={blogSource.getHref(undefined, locale)}
      copy={copy}
      cardCopy={cardCopy}
      paginationCopy={paginationCopy}
      locale={locale}
    />
  );
}
