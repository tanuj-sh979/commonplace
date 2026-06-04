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
    <div className="rounded-2xl border border-rule bg-[#FAF6F1] p-4">
      <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-muted">
        Proof
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-clay/20 bg-clay-soft px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-clay">
          {proof.primarySignal}
        </span>
      </div>
      <p className="mt-3 line-clamp-2 text-[0.82rem] font-semibold leading-6 text-secondary">
        {proof.metricLine}
      </p>
    </div>
  );
}
