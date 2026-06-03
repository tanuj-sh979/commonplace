import { EngagementTags } from "@/components/engagement-tags";
import { formatDate, formatNumber } from "@/lib/format";
import type { Article } from "@/lib/types";

export function ArticleList({ articles }: { articles: Article[] }) {
  return (
    <div className="mt-8">
      {articles.map((article) => (
        <article key={article.id} className="border-b border-rule py-7">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-rule px-2.5 py-1 text-xs font-semibold text-muted">
              {article.category}
            </span>
            <EngagementTags article={article} />
          </div>
          <h2 className="font-serif text-3xl leading-tight">
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
            {article.platforms ? "" : ` · ♥ ${formatNumber(article.likes)} · 💬 ${formatNumber(article.comments)}`}
          </p>
          <p className="mt-4 text-base leading-7 text-ink/80">{article.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
