import Link from "next/link";
import type { BlogPaginationCopy } from "../types";
import { buildBlogDirectoryHref } from "./blog-utils";

export default function BlogPagination({
  baseHref,
  page,
  totalPages,
  query,
  category,
  copy,
}: {
  baseHref: string;
  page: number;
  totalPages: number;
  query?: string;
  category?: string;
  copy?: Partial<BlogPaginationCopy>;
}) {
  if (totalPages <= 1) {
    return null;
  }

  const previousLabel = copy?.previousLabel ?? "Previous";
  const nextLabel = copy?.nextLabel ?? "Next";
  const pageLabel = copy?.pageLabel ?? "Page";

  return (
    <nav className="agenetixdocs-blog-pagination" aria-label="Blog pagination">
      {page > 1 ? (
        <Link
          href={buildBlogDirectoryHref({
            baseHref,
            query,
            category,
            page: page - 1,
          })}
          className="agenetixdocs-blog-pagination-link"
        >
          {previousLabel}
        </Link>
      ) : (
        <span className="agenetixdocs-blog-pagination-link is-disabled">{previousLabel}</span>
      )}

      <span className="agenetixdocs-blog-pagination-status">
        {pageLabel} {page} / {totalPages}
      </span>

      {page < totalPages ? (
        <Link
          href={buildBlogDirectoryHref({
            baseHref,
            query,
            category,
            page: page + 1,
          })}
          className="agenetixdocs-blog-pagination-link"
        >
          {nextLabel}
        </Link>
      ) : (
        <span className="agenetixdocs-blog-pagination-link is-disabled">{nextLabel}</span>
      )}
    </nav>
  );
}
