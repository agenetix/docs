"use client";

import { useEffect, useMemo, useState } from "react";
import type { DocsHeading } from "../types";

export default function DocsToc({
  headings,
  title = "On this page",
}: {
  headings: DocsHeading[];
  title?: string;
}) {
  const visibleHeadings = useMemo(
    () => headings.filter((heading) => heading.level >= 2 && heading.level <= 4),
    [headings]
  );
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (visibleHeadings.length === 0) {
      return;
    }

    const elements = visibleHeadings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const active = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top)[0];

        if (active) {
          setActiveId(active.target.id);
        }
      },
      {
        rootMargin: "-96px 0px -70% 0px",
        threshold: 0,
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [visibleHeadings]);

  if (visibleHeadings.length === 0) {
    return null;
  }

  return (
    <div className="agenetixdocs-toc">
      <p className="agenetixdocs-toc-title">{title}</p>
      <nav className="agenetixdocs-toc-nav">
        {visibleHeadings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className={[
              "agenetixdocs-toc-link",
              heading.level >= 3 ? "agenetixdocs-toc-link-sub" : "",
              activeId === heading.id ? "is-active" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {heading.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
