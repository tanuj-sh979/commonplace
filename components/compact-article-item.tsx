import { ArticleProof } from "@/components/article-proof";
import {
  getArticleAboutLine,
  getSourceReadTimeLine
} from "@/lib/signals";
import type { Article } from "@/lib/types";

export function CompactArticleItem({ article }: { article: Article }) {
  return (
    <article className="group border-b border-rule py-5 last:border-b-0 sm:py-6">
      <h3 className="text-[1.2rem] font-bold leading-[1.22] tracking-[-0.025em] text-ink sm:text-[1.45rem]">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors group-hover:text-clay"
        >
          {article.title}
        </a>
      </h3>

      <p className="mt-2 line-clamp-2 text-[0.92rem] font-medium leading-6 text-secondary">
        {getArticleAboutLine(article)}
      </p>

      <p className="mt-2 line-clamp-2 text-[0.82rem] font-semibold leading-6 text-muted">
        {getSourceReadTimeLine(article)} · <ArticleProof article={article} compact />
      </p>
    </article>
  );
}
