import { ArticleCard } from "@/components/article-card";
import type { Article } from "@/lib/types";

export function ArticleList({
  articles,
  compact = false
}: {
  articles: Article[];
  compact?: boolean;
}) {
  return (
    <div
      className={
        compact ? "mt-7 divide-y-0" : "mt-7 grid items-stretch gap-5 sm:grid-cols-2"
      }
    >
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} compact={compact} />
      ))}
    </div>
  );
}
