import Link from "next/link";
import { getCategoryTone } from "@/lib/category-style";
import type { Source } from "@/lib/types";

export function SourceCard({ source }: { source: Source }) {
  const tone = getCategoryTone(source.category);

  return (
    <article className="flex h-full flex-col rounded-2xl border border-rule bg-paper p-5 transition duration-200 hover:-translate-y-0.5 hover:border-strong">
      <div className="flex items-start justify-between gap-4">
        <span
          className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${tone.pill}`}
        >
          {source.category}
        </span>
        <span className="text-sm font-semibold text-muted">
          {source.count ?? 0}
        </span>
      </div>

      <h2 className="mt-5 text-3xl font-extrabold leading-[1.05] tracking-[-0.04em] text-ink">
        <Link href={`/source/${source.slug}`} className="transition hover:text-clay">
          {source.name}
        </Link>
      </h2>
      <p className="mt-3 text-sm font-medium leading-6 text-secondary">
        {source.host}
      </p>
      <p className="mt-1 text-sm leading-6 text-muted">
        {source.platform === "substack" ? "Substack publication" : "Trusted source"}
      </p>

      <div className="mt-auto flex items-center justify-between gap-4 border-t border-rule/80 pt-5">
        <p className="text-sm font-semibold text-muted">
          {source.count ?? 0} {(source.count ?? 0) === 1 ? "article" : "articles"}
        </p>
        <a
          href={source.subscribeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-clay underline decoration-clay/25 transition hover:text-[#6F4428] hover:decoration-clay"
        >
          Visit →
        </a>
      </div>
    </article>
  );
}
