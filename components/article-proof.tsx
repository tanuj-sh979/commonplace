import { getReadableEngagement } from "@/lib/signals";
import type { Article } from "@/lib/types";

type ArticleProofProps = {
  article: Article;
  compact?: boolean;
};

export function ArticleProof({ article, compact = false }: ArticleProofProps) {
  const proof = getReadableEngagement(article);

  if (compact) {
    return (
      <span className="text-muted">
        {proof.primarySignal} · {proof.metricLine}
      </span>
    );
  }

  return (
    <div className="border-t border-rule pt-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-clay/20 bg-clay-soft/70 px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-clay">
          {proof.primarySignal}
        </span>
        <span className="text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-muted">
          Reading signal
        </span>
      </div>
      <p className="mt-2 line-clamp-2 text-[0.86rem] font-semibold leading-6 text-secondary">
        {proof.metricLine}
      </p>
    </div>
  );
}
