"use client";

import { useMemo, useState } from "react";
import { CompactArticleItem } from "@/components/compact-article-item";
import type { Article, Category } from "@/lib/types";

type SortMode = "top" | "latest";

type ArticleBrowserProps = {
  articles: Article[];
  topArticles: Article[];
  categories: Category[];
};

export function ArticleBrowser({
  articles,
  topArticles,
  categories
}: ArticleBrowserProps) {
  const [sortMode, setSortMode] = useState<SortMode>("top");
  const [category, setCategory] = useState<Category | "All">("All");

  const visibleArticles = useMemo(() => {
    const sourceArticles = sortMode === "top" ? topArticles : articles;

    return sourceArticles
      .filter((article) => category === "All" || article.category === category)
      .sort((a, b) => {
        if (sortMode === "latest") {
          return (
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
          );
        }

        return b.engagementScore - a.engagementScore;
      })
      .slice(0, sortMode === "top" ? 100 : sourceArticles.length);
  }, [articles, category, sortMode, topArticles]);

  return (
    <section aria-label="Article library" className="mt-8">
      <div className="rounded-2xl border border-rule bg-surface p-4 sm:p-5">
        <div className="flex flex-col gap-5">
          <div
            className="inline-flex w-fit rounded-full border border-rule bg-paper p-1 text-sm font-semibold"
            aria-label="Sort articles"
          >
            <button
              type="button"
              onClick={() => setSortMode("top")}
              className={toggleClass(sortMode === "top")}
            >
              Top 100
            </button>
            <button
              type="button"
              onClick={() => setSortMode("latest")}
              className={toggleClass(sortMode === "latest")}
            >
              Latest
            </button>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              Filter by theme
            </p>
            <div className="flex flex-wrap gap-2">
              {(["All", ...categories] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`min-h-10 rounded-full border px-3.5 py-2 text-xs font-semibold transition ${
                    category === item
                      ? "border-clay bg-clay text-paper"
                      : "border-rule bg-paper text-muted hover:border-clay hover:text-clay"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-7 rounded-2xl border border-rule bg-paper px-5 sm:px-6">
        {visibleArticles.map((article) => (
          <CompactArticleItem key={article.id} article={article} />
        ))}
      </div>

      {visibleArticles.length === 0 ? (
        <p className="border-t border-rule py-10 text-sm text-muted">
          {articles.length === 0 && topArticles.length === 0
            ? "No articles are indexed yet. Run npm run ingest to refresh the library."
            : "No articles match that filter."}
        </p>
      ) : null}
    </section>
  );
}

function toggleClass(active: boolean) {
  return `rounded-full px-4 py-2 transition ${
    active ? "bg-ink text-paper" : "text-muted hover:text-clay"
  }`;
}
