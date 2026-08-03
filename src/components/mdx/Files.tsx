import type { ReactNode } from "react";

interface FilesProps {
  children: ReactNode;
  title?: string;
}

export default function Files({ children, title }: FilesProps) {
  return (
    <div className="emcydocs-files">
      {title ? <div className="emcydocs-files-title">{title}</div> : null}
      <div className="emcydocs-files-tree">{children}</div>
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
    <details className="emcydocs-files-folder" open={defaultOpen}>
      <summary className="emcydocs-files-row emcydocs-files-row-folder">
        <span className="emcydocs-files-glyph">▾</span>
        <span>{name}</span>
      </summary>
      <div className="emcydocs-files-children">{children}</div>
    </details>
  );
}

interface FileProps {
  name: string;
  meta?: string;
}

export function File({ name, meta }: FileProps) {
  return (
    <div className="emcydocs-files-row emcydocs-files-row-file">
      <span className="emcydocs-files-glyph">•</span>
      <span>{name}</span>
      {meta ? <span className="emcydocs-files-meta">{meta}</span> : null}
    </div>
  );
}
