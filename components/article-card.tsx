import { EngagementTags } from "@/components/engagement-tags";
import { formatDate } from "@/lib/format";
import type { Article } from "@/lib/types";

type ArticleCardProps = {
  article: Article;
  compact?: boolean;
};

export function ArticleCard({ article, compact = false }: ArticleCardProps) {
  const meta = [
    article.author,
    article.sourceName,
    formatDate(article.publishedAt),
    article.readingMinutes ? `${article.readingMinutes} min read` : undefined
  ].filter(Boolean);

  return (
    <article className="group rounded-md border border-rule/90 bg-surface/70 p-5 shadow-[0_18px_45px_rgba(31,28,24,0.035)] transition duration-200 hover:-translate-y-0.5 hover:border-clay/40 hover:bg-surface sm:p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <span className="rounded-full border border-rule bg-paper/70 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-sage">
          {article.category}
        </span>
        <EngagementTags article={article} />
      </div>

      <h3
        className={`font-serif leading-[1.02] text-ink ${
          compact ? "text-3xl" : "text-3xl sm:text-4xl"
        }`}
      >
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors group-hover:text-clay"
        >
          {article.title}
        </a>
      </h3>

      <p className="mt-3 text-sm font-medium leading-6 text-muted">
        {meta.join(" · ")}
      </p>

      {article.excerpt ? (
        <p
          className={`mt-4 text-ink/75 ${
            compact ? "text-base leading-7" : "text-[17px] leading-8"
          }`}
        >
          {article.excerpt}
        </p>
      ) : null}

      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex text-sm font-semibold text-clay underline decoration-clay/25 transition hover:decoration-clay"
      >
        Read original →
      </a>
    </article>
  );
}
