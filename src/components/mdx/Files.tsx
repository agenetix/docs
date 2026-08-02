import type { ReactNode } from "react";

interface FilesProps {
  children: ReactNode;
  title?: string;
}

export default function Files({ children, title }: FilesProps) {
  return (
    <div className="agenetixdocs-files">
      {title ? <div className="agenetixdocs-files-title">{title}</div> : null}
      <div className="agenetixdocs-files-tree">{children}</div>
    </div>
  );
}

interface FolderProps {
  name: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function Folder({ name, children, defaultOpen = true }: FolderProps) {
  return (
    <details className="agenetixdocs-files-folder" open={defaultOpen}>
      <summary className="agenetixdocs-files-row agenetixdocs-files-row-folder">
        <span className="agenetixdocs-files-glyph">▾</span>
        <span>{name}</span>
      </summary>
      <div className="agenetixdocs-files-children">{children}</div>
    </details>
  );
}

interface FileProps {
  name: string;
  meta?: string;
}

export function File({ name, meta }: FileProps) {
  return (
    <div className="agenetixdocs-files-row agenetixdocs-files-row-file">
      <span className="agenetixdocs-files-glyph">•</span>
      <span>{name}</span>
      {meta ? <span className="agenetixdocs-files-meta">{meta}</span> : null}
    </div>
  );
}
