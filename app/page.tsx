import Link from "next/link";
import { ArticleBrowser } from "@/components/article-browser";
import { ArticleList } from "@/components/article-list";
import {
  articles,
  categories,
  categoryDescriptions,
  getArticlesByCategory,
  slugifyCategory,
  top100Articles
} from "@/lib/data";
import type { Category } from "@/lib/types";

const homepageSections: Array<{
  category: Category;
  copy: string;
}> = [
  {
    category: "Original Thinking",
    copy: "Essays on building, ambition, taste, technology, and independent thought."
  },
  {
    category: "Meaning & Living",
    copy: "Essays on time, relationships, attention, money, and how to live."
  }
];

export default function HomePage() {
  return (
    <>
      <section className="relative pt-2 sm:pt-8">
        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-clay">
          Internet Canon
        </p>
        <h1 className="max-w-4xl font-serif text-6xl leading-[0.96] text-ink sm:text-8xl">
          The internet’s most thoughtful essays, quietly collected.
        </h1>
        <p className="mt-7 max-w-3xl text-xl leading-9 text-ink/75 sm:text-2xl sm:leading-10">
          Commonplace is a small, handpicked index of essays worth returning to
          across technology, ambition, creativity, money, meaning, and how to
          think.
        </p>
        <p className="mt-5 max-w-3xl text-base leading-7 text-muted">
          Collected from Hacker News, Reddit, Substack, trusted publications, and
          the Commonplace Canon.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold text-muted">
          <span className="rounded-full border border-rule bg-surface/60 px-3 py-1.5">
            {top100Articles.length || articles.length} ranked essays
          </span>
          <span className="rounded-full border border-rule bg-surface/60 px-3 py-1.5">
            outbound links only
          </span>
          <span className="rounded-full border border-rule bg-surface/60 px-3 py-1.5 text-sage">
            no feeds, no accounts
          </span>
        </div>
      </section>

      <section className="mt-16 space-y-20 sm:mt-24 sm:space-y-24">
        {homepageSections.map((section) => {
          const sectionArticles = getArticlesByCategory(section.category).slice(0, 6);
          const href = `/category/${slugifyCategory(section.category)}`;

          return (
            <section
              key={section.category}
              aria-labelledby={slugifyCategory(section.category)}
            >
              <div className="flex flex-col gap-5 border-b border-rule pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-clay">
                    Reading Shelf
                  </p>
                  <h2
                    id={slugifyCategory(section.category)}
                    className="font-serif text-5xl leading-none sm:text-6xl"
                  >
                    {section.category}
                  </h2>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
                    {section.copy || categoryDescriptions[section.category]}
                  </p>
                </div>
                <Link
                  href={href}
                  className="w-fit text-sm font-semibold text-clay underline decoration-clay/25 transition hover:decoration-clay"
                >
                  Read more articles →
                </Link>
              </div>

              {sectionArticles.length > 0 ? (
                <ArticleList articles={sectionArticles} compact />
              ) : (
                <p className="border-b border-rule py-8 text-sm text-muted">
                  No articles are indexed for this category yet.
                </p>
              )}
            </section>
          );
        })}
      </section>

      <section className="mt-20 sm:mt-24">
        <div className="border-b border-rule pb-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-clay">
            Index
          </p>
          <h2 className="font-serif text-5xl leading-none sm:text-6xl">
            Browse the Library
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
            Search across the full index or filter by category when you want a
            more specific trail.
          </p>
        </div>
        <ArticleBrowser
          articles={articles}
          topArticles={top100Articles}
          categories={categories}
        />
      </section>
    </>
  );
}
