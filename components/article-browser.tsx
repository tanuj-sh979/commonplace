"use client";

import { useMemo, useState } from "react";
import { EngagementTags } from "@/components/engagement-tags";
import { formatDate } from "@/lib/format";
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
  const [query, setQuery] = useState("");

  const visibleArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const sourceArticles = sortMode === "top" ? topArticles : articles;

    return sourceArticles
      .filter((article) => category === "All" || article.category === category)
      .filter((article) => {
        if (!normalizedQuery) {
          return true;
        }

        return [
          article.title,
          article.author,
          article.sourceName,
          article.category
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      })
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
  }, [articles, category, query, sortMode, topArticles]);

  return (
    <section aria-label="Article library" className="mt-10">
      <div className="flex flex-col gap-5 border-y border-rule py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div
            className="inline-flex w-fit rounded-full border border-rule p-1 text-sm font-medium"
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
          <label className="w-full sm:max-w-xs">
            <span className="sr-only">Search articles</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title, author, source"
              className="h-10 w-full rounded-md border border-rule bg-transparent px-3 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-clay"
              type="search"
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          {(["All", ...categories] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                category === item
                  ? "border-clay bg-clay text-paper"
                  : "border-rule text-muted hover:border-clay hover:text-clay"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-2">
        {visibleArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {visibleArticles.length === 0 ? (
        <p className="border-t border-rule py-10 text-sm text-muted">
          {articles.length === 0 && topArticles.length === 0
            ? "No articles are indexed yet. Run npm run ingest to refresh the library."
            : "No articles match that search."}
        </p>
      ) : null}
    </section>
  );
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="border-b border-rule py-7 sm:py-8">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-rule px-2.5 py-1 text-xs font-semibold text-muted">
          {article.category}
        </span>
        <EngagementTags article={article} />
      </div>

      <h2 className="font-serif text-3xl leading-tight sm:text-4xl">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-clay"
        >
          {article.title}
        </a>
      </h2>

      <p className="mt-3 text-sm font-medium leading-6 text-muted">
        {[article.author, article.sourceName, formatDate(article.publishedAt)]
          .filter(Boolean)
          .join(" · ")}
        {article.readingMinutes ? ` · ${article.readingMinutes} min read` : ""}
      </p>

      <p className="mt-4 text-base leading-7 text-ink/80 sm:text-lg sm:leading-8">
        {article.excerpt}
      </p>
    </article>
  );
}

function toggleClass(active: boolean) {
  return `rounded-full px-4 py-2 transition ${
    active ? "bg-ink text-paper" : "text-muted hover:text-clay"
  }`;
}
