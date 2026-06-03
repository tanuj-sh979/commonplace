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
    <div className="mt-7 space-y-4">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} compact={compact} />
      ))}
    </div>
  );
}
