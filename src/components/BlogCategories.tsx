import Link from "next/link";
import { buildBlogDirectoryHref } from "./blog-utils";

export default function BlogCategories({
  baseHref,
  categories,
  selectedCategory,
  allCategoriesLabel,
  query,
}: {
  baseHref: string;
  categories: string[];
  selectedCategory: string;
  allCategoriesLabel: string;
  query?: string;
}) {
  const options = [
    { value: "all", label: allCategoriesLabel },
    ...categories.map((category) => ({ value: category, label: category })),
  ];

  return (
    <div className="emcydocs-blog-categories" role="list">
      {options.map((option) => {
        const isActive = option.value === selectedCategory;

        return (
          <Link
            key={`${option.value}-${option.label}`}
            href={buildBlogDirectoryHref({
              baseHref,
              query,
              category: option.value,
            })}
            className={[
              "emcydocs-blog-category-chip",
              isActive ? "is-active" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}
