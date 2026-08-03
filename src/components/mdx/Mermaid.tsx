"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

interface MermaidProps {
  chart?: string;
  caption?: string;
  children?: ReactNode;
}

export default function Mermaid({ chart, caption, children }: MermaidProps) {
  const id = useId().replace(/:/g, "-");
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");
  const chartSource = (chart ?? collectText(children)).trim();

  useEffect(() => {
    let cancelled = false;

    async function render() {
      if (!chartSource) {
        setSvg("");
        setError("Missing Mermaid chart content");
        return;
      }

      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "neutral",
          fontFamily: "inherit",
          securityLevel: "loose",
        });
        const { svg: rendered } = await mermaid.render(
          `mermaid-${id}`,
          chartSource
        );
        if (!cancelled) {
          setSvg(rendered);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to render diagram");
        }
      }
    }

    render();

    return () => {
      cancelled = true;
    };
  }, [chartSource, id]);

  if (error) {
    return (
      <div className="emcydocs-mermaid emcydocs-mermaid-error">
        <p>Diagram error: {error}</p>
      </div>
    );
  }

  return (
    <figure className="emcydocs-mermaid">
      <div
        ref={containerRef}
        className="emcydocs-mermaid-svg"
        dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
      />
      {caption ? (
        <figcaption className="emcydocs-mermaid-caption">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

function collectText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") {
    return "";
  }

  if (typeof node === "string" || typeof node === "number") {
    return `${node}`;
  }

  if (Array.isArray(node)) {
    return node.map(collectText).join("");
  }

  if (typeof node === "object" && "props" in node) {
    return collectText((node as { props?: { children?: ReactNode } }).props?.children);
  }

  return "";
}
