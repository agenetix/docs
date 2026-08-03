import Link from "next/link";
import Image from "next/image";
import type { BlogCardCopy, BlogEntryMeta } from "../types";
import { formatBlogDate } from "./blog-utils";

export default function BlogCard({
  post,
  copy,
  locale,
}: {
  post: BlogEntryMeta;
  copy?: Partial<BlogCardCopy>;
  locale?: string;
}) {
  const readMoreLabel = copy?.readMoreLabel ?? "Read more";
  const readingTimeSuffix = copy?.readingTimeSuffix ?? "min read";

  return (
    <article className="emcydocs-blog-card">
      <Link href={post.href} className="emcydocs-blog-card-link">
        {post.image ? (
          <div className="emcydocs-blog-card-image-wrap">
            <Image
              src={post.image}
              alt={post.imageAlt || post.title}
              className="emcydocs-blog-card-image"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
            />
          </div>
        ) : null}

        <div className="emcydocs-blog-card-body">
          <div className="emcydocs-blog-card-meta">
            <span className="emcydocs-blog-card-category">{post.category}</span>
            <span>{formatBlogDate(post.publishedAt, locale)}</span>
            <span>
              {post.readingTimeMinutes} {readingTimeSuffix}
            </span>
          </div>

          <h3>{post.title}</h3>
          {post.description ? <p>{post.description}</p> : null}

          {post.tags.length > 0 ? (
            <div className="emcydocs-blog-card-tags">
              {post.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="emcydocs-blog-card-tag">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          <span className="emcydocs-blog-card-cta">{readMoreLabel}</span>
        </div>
      </Link>
    </article>
  );
}
