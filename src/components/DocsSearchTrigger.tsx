"use client";

/** Compact search icon button for mobile chrome — opens the palette dialog via shared state in DocsShell. */
export default function DocsSearchTrigger({
  onClick,
  label = "Search",
}: {
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      className="emcydocs-search-trigger-compact"
      onClick={onClick}
      aria-label={label}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    </button>
  );
}
