import {
  getArticleAboutLine,
  getArticleWhyLine,
  getSourceReadTimeLine
} from "@/lib/signals";
import type { Article } from "@/lib/types";

type ArticleEditorialInfoProps = {
  article: Article;
};

export function ArticleEditorialInfo({ article }: ArticleEditorialInfoProps) {
  return (
    <div className="space-y-3">
      <EditorialLine label="About" text={getArticleAboutLine(article)} />
      <EditorialLine label="Why read" text={getArticleWhyLine(article)} />
      <p className="pt-1 text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-muted">
        {getSourceReadTimeLine(article)}
      </p>
    </div>
  );
}

function EditorialLine({ label, text }: { label: string; text: string }) {
  return (
    <p className="line-clamp-2 text-[0.94rem] leading-7 text-secondary">
      <span className="mr-2 text-[0.68rem] font-bold uppercase tracking-[0.15em] text-muted">
        {label}
      </span>
      <span className="font-medium">{text}</span>
    </p>
  );
}
