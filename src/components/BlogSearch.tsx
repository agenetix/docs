export default function BlogSearch({
  actionHref,
  query,
  category,
  placeholder,
}: {
  actionHref: string;
  query?: string;
  category?: string;
  placeholder: string;
}) {
  return (
    <form action={actionHref} method="get" className="emcydocs-blog-search-form">
      <div className="emcydocs-blog-search-input-wrap">
        <svg
          className="emcydocs-blog-search-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder={placeholder}
          className="emcydocs-blog-search-input"
        />
      </div>
      {category && category !== "all" ? <input type="hidden" name="category" value={category} /> : null}
    </form>
  );
}
