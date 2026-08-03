import type { ComponentType } from "react";
import Link from "next/link";
import Image from "next/image";
import type { BlogCardCopy, BlogEntry, BlogEntryMeta, BlogPostPageCopy } from "../types";
import { DocsMdx } from "../mdx";
import { formatBlogDate } from "./blog-utils";
import BlogCard from "./BlogCard";

export default async function BlogPostPage({
  entry,
  suggestedEntries = [],
  copy,
  locale,
  backHref,
  components,
}: {
  entry: BlogEntry;
  suggestedEntries?: BlogEntryMeta[];
  copy: BlogPostPageCopy;
  locale?: string;
  backHref: string;
  components?: Record<string, ComponentType<any>>;
}) {
  const formattedPublishedDate = formatBlogDate(entry.publishedAt, locale);
  const formattedUpdatedDate = formatBlogDate(entry.updatedAt, locale);
  const showUpdated = Boolean(entry.updatedAt && entry.updatedAt !== entry.publishedAt);
  const cardCopy: Partial<BlogCardCopy> = {
    readMoreLabel: copy.readMoreLabel,
    readingTimeSuffix: copy.readingTimeSuffix,
  };

  return (
    <div className="emcydocs-blog-post">
      <article className="emcydocs-blog-post-article">
        <Link href={backHref} className="emcydocs-blog-back-link">
          {copy.backLabel}
        </Link>

        <header className="emcydocs-blog-post-header">
          <div className="emcydocs-blog-post-meta">
            <span className="emcydocs-blog-post-category">{entry.category}</span>
            <span>
              {copy.publishedOnLabel} {formattedPublishedDate}
            </span>
            <span>
              {entry.readingTimeMinutes} {copy.readingTimeSuffix}
            </span>
          </div>

          <h1>{entry.title}</h1>
          {entry.description ? <p>{entry.description}</p> : null}

          <div className="emcydocs-blog-author">
            {entry.authorImage ? (
              <Image
                src={entry.authorImage}
                alt={entry.author}
                className="emcydocs-blog-author-image"
                width={48}
                height={48}
                unoptimized
              />
            ) : (
              <div className="emcydocs-blog-author-image is-fallback" aria-hidden="true">
                {entry.author.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="emcydocs-blog-author-copy">
              <span>{copy.writtenByLabel}</span>
              <strong>{entry.author}</strong>
              {entry.authorRole ? <p>{entry.authorRole}</p> : null}
              {showUpdated ? (
                <p>
                  {copy.updatedOnLabel} {formattedUpdatedDate}
                </p>
              ) : null}
            </div>
          </div>
        </header>

        {entry.image ? (
          <div className="emcydocs-blog-post-image-wrap">
            <Image
              src={entry.image}
              alt={entry.imageAlt || entry.title}
              className="emcydocs-blog-post-image"
              fill
              sizes="100vw"
              unoptimized
            />
          </div>
        ) : null}

        <div className="emcydocs-blog-post-content">
          <DocsMdx entry={entry} components={components} />
        </div>

        {entry.tags.length > 0 ? (
          <footer className="emcydocs-blog-post-footer">
            <span>{copy.tagsLabel}</span>
            <div className="emcydocs-blog-post-tags">
              {entry.tags.map((tag) => (
                <span key={tag} className="emcydocs-blog-post-tag">
                  {tag}
                </span>
              ))}
            </div>
          </footer>
        ) : null}
      </article>

      {suggestedEntries.length > 0 ? (
        <section className="emcydocs-blog-suggested">
          <div className="emcydocs-blog-suggested-header">
            <div>
              <h2>{copy.suggestedLabel}</h2>
              {copy.suggestedDescription ? <p>{copy.suggestedDescription}</p> : null}
            </div>
          </div>

          <div className="emcydocs-blog-grid">
            {suggestedEntries.map((post) => (
              <BlogCard key={`${post.slug}-${post.locale}`} post={post} copy={cardCopy} locale={locale} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
