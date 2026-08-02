import type { ComponentPropsWithoutRef, ReactNode } from "react";
import CopyCodeButton from "./CopyCodeButton";
import { LazyMermaid } from "./lazy";

interface CodeBlockProps {
  children: ReactNode;
  title?: string;
  language?: string;
  allowCopy?: boolean;
}

export default function CodeBlock({
  children,
  title,
  language,
  allowCopy = true,
}: CodeBlockProps) {
  const codeText = collectText(children).trimEnd();
  const detectedLanguage = language || inferLanguage(children);
  const shouldShowChrome = Boolean(title || detectedLanguage || allowCopy);

  return (
    <div className="agenetixdocs-codeblock">
      {shouldShowChrome ? (
        <div className="agenetixdocs-codeblock-header">
          <div className="agenetixdocs-codeblock-meta">
            <span className="agenetixdocs-codeblock-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            {title ? <span className="agenetixdocs-codeblock-title">{title}</span> : null}
            {!title && detectedLanguage ? (
              <span className="agenetixdocs-codeblock-title">
                {detectedLanguage.toUpperCase()}
              </span>
            ) : null}
          </div>
          {allowCopy && codeText ? <CopyCodeButton value={codeText} /> : null}
        </div>
      ) : null}
      <div className="agenetixdocs-codeblock-body">{children}</div>
    </div>
  );
}

export function Pre({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"pre">) {
  const dataLanguage = (props as { "data-language"?: unknown })["data-language"];
  const language = inferLanguage(children, {
    className,
    dataLanguage: typeof dataLanguage === "string" ? dataLanguage : undefined,
  });
  const codeText = collectText(children).trimEnd();

  if (language?.toLowerCase() === "mermaid") {
    return <LazyMermaid chart={codeText} />;
  }

  return (
    <CodeBlock language={language}>
      <pre className={className} {...props}>
        {children}
      </pre>
    </CodeBlock>
  );
}

function inferLanguage(
  children: ReactNode,
  preProps?: { className?: string; dataLanguage?: string }
) {
  if (preProps?.dataLanguage) {
    return preProps.dataLanguage;
  }

  if (typeof preProps?.className === "string") {
    const match = preProps.className.match(/language-([a-z0-9-]+)/i);
    if (match?.[1]) {
      return match[1];
    }
  }

  if (
    children &&
    typeof children === "object" &&
    "props" in children &&
    typeof
      (children as {
        props?: { className?: string; ["data-language"]?: string };
      }).props?.className === "string"
  ) {
    const childProps = (
      children as {
        props: { className?: string; ["data-language"]?: string };
      }
    ).props;
    if (typeof childProps["data-language"] === "string") {
      return childProps["data-language"];
    }

    const className = childProps.className ?? "";
    const match = className.match(/language-([a-z0-9-]+)/i);
    return match?.[1];
  }

  return undefined;
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
