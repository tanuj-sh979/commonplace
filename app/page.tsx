import Link from "next/link";
import { ArticleBrowser } from "@/components/article-browser";
import { CompactArticleItem } from "@/components/compact-article-item";
import { FeaturedArticleCard } from "@/components/featured-article-card";
import { SectionHeader } from "@/components/section-header";
import { SiteFooter } from "@/components/site-footer";
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
  const featuredArticles = top100Articles.slice(0, 5);
  const archiveArticles = top100Articles.slice(5, 17);

  return (
    <>
      <section className="relative overflow-hidden rounded-[1.5rem] border border-rule bg-surface px-5 py-8 sm:px-8 sm:py-12 lg:px-10">
        <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-clay">
          Internet Canon
        </p>
        <h1 className="text-balance max-w-4xl text-[2.9rem] font-extrabold leading-[1.02] tracking-[-0.055em] text-ink sm:text-7xl lg:text-[5.7rem]">
          The internet’s most thoughtful essays, quietly collected.
        </h1>
        <p className="mt-7 max-w-3xl text-lg font-medium leading-8 text-secondary sm:text-2xl sm:leading-10">
          Commonplace is a curated index of essays worth returning to across
          technology, ambition, creativity, money, meaning, and how to think.
        </p>
        <p className="mt-5 max-w-3xl text-base font-medium leading-7 text-muted">
          Collected from Hacker News, Reddit, Substack, trusted publications, and
          the Commonplace Canon.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold text-muted">
          <span className="rounded-full border border-rule bg-paper px-3 py-1.5">
            {top100Articles.length || articles.length} ranked essays
          </span>
          <span className="rounded-full border border-rule bg-paper px-3 py-1.5">
            outbound links only
          </span>
          <span className="rounded-full border border-rule bg-paper px-3 py-1.5 text-sage">
            no feeds, no accounts
          </span>
        </div>
      </section>

      <section className="mt-16 sm:mt-24">
        <SectionHeader
          eyebrow="Featured reads"
          title="Start Here"
          copy="The highest-signal pieces in the library right now, presented as a small front table of essays."
        />

        {featuredArticles.length > 0 ? (
          <div className="mt-7 grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredArticles.map((article, index) => (
              <FeaturedArticleCard
                key={article.id}
                article={article}
                prominent={index === 0}
              />
            ))}
          </div>
        ) : (
          <p className="border-b border-rule py-10 text-sm text-muted">
            No featured articles are indexed yet. Run npm run ingest to refresh
            the library.
          </p>
        )}
      </section>

      <section className="mt-20 space-y-16 sm:mt-24 sm:space-y-24">
        {homepageSections.map((section) => {
          const sectionArticles = getArticlesByCategory(section.category).slice(0, 5);
          const href = `/category/${slugifyCategory(section.category)}`;

          return (
            <section
              key={section.category}
              aria-labelledby={slugifyCategory(section.category)}
            >
              <SectionHeader
                eyebrow="Reading shelf"
                title={section.category}
                copy={section.copy || categoryDescriptions[section.category]}
                action={
                  <Link
                    href={href}
                    className="w-fit text-sm font-semibold text-clay underline decoration-clay/25 transition hover:text-[#6F4428] hover:decoration-clay"
                  >
                    Read more articles →
                  </Link>
                }
              />
              <h2 id={slugifyCategory(section.category)} className="sr-only">
                {section.category}
              </h2>

              {sectionArticles.length > 0 ? (
                <div className="mt-7 grid items-start gap-6 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)]">
                  <FeaturedArticleCard article={sectionArticles[0]} />
                  <div className="self-start rounded-2xl border border-rule bg-paper px-5 sm:px-6">
                    {sectionArticles.slice(1).map((article) => (
                      <CompactArticleItem key={article.id} article={article} />
                    ))}
                  </div>
                </div>
              ) : (
                <p className="border-b border-rule py-8 text-sm text-muted">
                  No articles are indexed for this category yet.
                </p>
              )}
            </section>
          );
        })}
      </section>

      {archiveArticles.length > 0 ? (
        <section className="mt-20 sm:mt-24">
          <SectionHeader
            eyebrow="Archive"
            title="More Worth Saving"
            copy="A quick list of highly ranked essays beyond the featured shelf."
          />
          <div className="mt-7 rounded-2xl border border-rule bg-paper px-5 sm:px-6">
            {archiveArticles.map((article) => (
              <CompactArticleItem key={article.id} article={article} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-20 sm:mt-24">
        <SectionHeader
          eyebrow="Index"
          title="Browse the Library"
          copy="Filter the full index by theme, then choose between the ranked Top 100 or the latest additions."
        />
        <ArticleBrowser
          articles={articles}
          topArticles={top100Articles}
          categories={categories}
        />
      </section>

      <SiteFooter />
    </>
  );
}
