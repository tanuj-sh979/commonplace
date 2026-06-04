import { CompactArticleItem } from "@/components/compact-article-item";
import { FeaturedArticleCard } from "@/components/featured-article-card";
import type { Article } from "@/lib/types";

type ArticleCardProps = {
  article: Article;
  compact?: boolean;
};

export function ArticleCard({ article, compact = false }: ArticleCardProps) {
  return compact ? (
    <CompactArticleItem article={article} />
  ) : (
    <FeaturedArticleCard article={article} />
  );
}
