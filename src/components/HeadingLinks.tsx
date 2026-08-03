"use client";

import { useEffect } from "react";

export default function HeadingLinks() {
  useEffect(() => {
    const highlight = (id: string, smooth: boolean) => {
      if (!id) {
        return;
      }

      const element = document.getElementById(id);
      if (!element) {
        return;
      }

      if (smooth) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      element.classList.add("emcydocs-highlight");
      window.setTimeout(() => {
        element.classList.remove("emcydocs-highlight");
      }, 1600);
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest("[data-docs-anchor]");
      if (!(anchor instanceof HTMLAnchorElement)) {
        return;
      }

      event.preventDefault();

      const hash = anchor.getAttribute("href");
      if (!hash) {
        return;
      }

      const id = hash.replace(/^#/, "");
      const url = `${window.location.origin}${window.location.pathname}${hash}`;

      window.history.pushState(null, "", hash);
      void navigator.clipboard?.writeText(url);
      highlight(id, true);
    };

    const handleHashChange = () => {
      highlight(window.location.hash.replace(/^#/, ""), false);
    };

    document.addEventListener("click", handleClick);
    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return null;
}
