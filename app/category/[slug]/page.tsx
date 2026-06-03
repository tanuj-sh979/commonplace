import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleList } from "@/components/article-list";
import {
  categories,
  categoryDescriptions,
  getArticlesByCategory,
  getCategoryBySlug,
  slugifyCategory
} from "@/lib/data";

type CategoryPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return categories.map((category) => ({
    slug: slugifyCategory(category)
  }));
}

export function generateMetadata({ params }: CategoryPageProps): Metadata {
  const category = getCategoryBySlug(params.slug);

  if (!category) {
    return {
      title: "Category"
    };
  }

  return {
    title: category,
    description: `${categoryDescriptions[category]} Curated on Commonplace.`
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = getCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  const categoryArticles = getArticlesByCategory(category);

  return (
    <>
      <header className="border-b border-rule pb-8">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-clay">
          Category
        </p>
        <h1 className="font-serif text-6xl leading-none sm:text-7xl">
          {category}
        </h1>
        <p className="mt-6 max-w-3xl text-xl leading-9 text-ink/75">
          {categoryDescriptions[category]}
        </p>
        <p className="mt-5 text-sm font-semibold uppercase tracking-[0.14em] text-sage">
          {categoryArticles.length} articles · sorted by signal
        </p>
      </header>

      {categoryArticles.length > 0 ? (
        <ArticleList articles={categoryArticles} compact />
      ) : (
        <p className="py-10 text-sm text-muted">
          No articles are indexed for this category yet.
        </p>
      )}
    </>
  );
}
