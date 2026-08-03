"use client";

import type { DocsHeading } from "../types";
import InlineToc from "./mdx/InlineToc";

export default function DocsPageMobileToc({
  headings,
  title = "On this page",
}: {
  headings: DocsHeading[];
  title?: string;
}) {
  const visibleHeadings = headings.filter(
    (heading) => heading.level >= 2 && heading.level <= 4
  );

  if (visibleHeadings.length === 0) {
    return null;
  }

  return (
    <div className="emcydocs-mobile-toc">
      <InlineToc
        title={title}
        items={visibleHeadings.map((heading) => ({
          label: heading.text,
          href: `#${heading.id}`,
          level: heading.level - 1,
        }))}
      />
    </div>
  );
}
