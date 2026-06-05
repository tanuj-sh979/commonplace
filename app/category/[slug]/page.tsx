import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompactArticleItem } from "@/components/compact-article-item";
import { FeaturedArticleCard } from "@/components/featured-article-card";
import { SiteFooter } from "@/components/site-footer";
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
  const featuredArticles = categoryArticles.slice(0, 5);
  const remainingArticles = categoryArticles.slice(5);

  return (
    <>
      <header className="rounded-[1.5rem] border border-rule bg-surface px-5 py-8 sm:px-8">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-clay">
          Category
        </p>
        <h1 className="text-balance text-[2.75rem] font-extrabold leading-[1.04] tracking-[-0.05em] text-ink sm:text-7xl">
          {category}
        </h1>
        <p className="mt-6 max-w-3xl text-lg font-medium leading-8 text-secondary sm:text-xl sm:leading-9">
          {categoryDescriptions[category]}
        </p>
        <p className="mt-5 text-sm font-semibold uppercase tracking-[0.14em] text-sage">
          {categoryArticles.length} articles · sorted by reader signal
        </p>
      </header>

      {categoryArticles.length > 0 ? (
        <>
          <section className="mt-7 grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredArticles.map((article, index) => (
              <FeaturedArticleCard
                key={article.id}
                article={article}
                prominent={index === 0}
              />
            ))}
          </section>

          {remainingArticles.length > 0 ? (
            <section className="mt-8 rounded-2xl border border-rule bg-paper px-5 sm:px-6">
              {remainingArticles.map((article) => (
                <CompactArticleItem key={article.id} article={article} />
              ))}
            </section>
          ) : null}
        </>
      ) : (
        <p className="py-10 text-sm text-muted">
          No articles are indexed for this category yet.
        </p>
      )}

      <SiteFooter />
    </>
  );
}
