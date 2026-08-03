interface InlineTocItem {
  href: string;
  label: string;
  level?: number;
}

interface InlineTocProps {
  items?: InlineTocItem[] | string;
  title?: string;
}

export default function InlineToc({
  items,
  title = "On this page",
}: InlineTocProps) {
  const resolvedItems = resolveItems(items);
  if (resolvedItems.length === 0) {
    return null;
  }

  return (
    <nav className="emcydocs-inline-toc" aria-label={title}>
      <div className="emcydocs-inline-toc-title">{title}</div>
      <div className="emcydocs-inline-toc-list">
        {resolvedItems.map((item) => (
          <a
            key={`${item.href}-${item.label}`}
            href={item.href}
            className="emcydocs-inline-toc-link"
            style={
              item.level && item.level > 1
                ? { paddingLeft: `${(item.level - 1) * 0.9}rem` }
                : undefined
            }
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

function resolveItems(items?: InlineTocItem[] | string): InlineTocItem[] {
  if (!items) {
    return [];
  }

  if (Array.isArray(items)) {
    return items;
  }

  try {
    const parsed = JSON.parse(items);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
