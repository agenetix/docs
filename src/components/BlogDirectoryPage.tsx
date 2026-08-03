import type {
  BlogCardCopy,
  BlogDirectoryCopy,
  BlogDirectoryResponse,
  BlogPaginationCopy,
} from "../types";
import BlogCard from "./BlogCard";
import BlogCategories from "./BlogCategories";
import BlogPagination from "./BlogPagination";
import BlogSearch from "./BlogSearch";

export default function BlogDirectoryPage({
  directory,
  baseHref,
  copy,
  cardCopy,
  paginationCopy,
  locale,
}: {
  directory: BlogDirectoryResponse;
  baseHref: string;
  copy: BlogDirectoryCopy;
  cardCopy?: Partial<BlogCardCopy>;
  paginationCopy?: Partial<BlogPaginationCopy>;
  locale?: string;
}) {
  return (
    <div className="emcydocs-blog-directory">
      <section className="emcydocs-blog-directory-hero">
        <div>
          <h1>{copy.title}</h1>
          {copy.description ? <p>{copy.description}</p> : null}
        </div>
      </section>

      <section className="emcydocs-blog-directory-controls">
        <div className="emcydocs-blog-directory-panel">
          <div className="emcydocs-blog-directory-heading">
            <h2>{copy.categoriesLabel}</h2>
          </div>
          <BlogCategories
            baseHref={baseHref}
            categories={directory.categories}
            selectedCategory={directory.selectedCategory}
            allCategoriesLabel={copy.allCategoriesLabel}
            query={directory.query}
          />
        </div>

        <div className="emcydocs-blog-directory-panel">
          <div className="emcydocs-blog-directory-heading">
            <h2>{copy.searchLabel}</h2>
          </div>
          <BlogSearch
            actionHref={baseHref}
            query={directory.query}
            category={directory.selectedCategory}
            placeholder={copy.searchPlaceholder}
          />
        </div>
      </section>

      {directory.items.length > 0 ? (
        <>
          <section className="emcydocs-blog-grid">
            {directory.items.map((post) => (
              <BlogCard key={`${post.slug}-${post.locale}`} post={post} copy={cardCopy} locale={locale} />
            ))}
          </section>

          <BlogPagination
            baseHref={baseHref}
            page={directory.page}
            totalPages={directory.totalPages}
            query={directory.query}
            category={directory.selectedCategory}
            copy={paginationCopy}
          />
        </>
      ) : (
        <section className="emcydocs-blog-empty">
          <h2>{copy.noResultsTitle}</h2>
          <p>{copy.noResultsDescription}</p>
        </section>
      )}
    </div>
  );
}
