import { ArticleEditorialInfo } from "@/components/article-editorial-info";
import { ArticleProof } from "@/components/article-proof";
import { ArticleThumbnail } from "@/components/article-thumbnail";
import { getCategoryTone } from "@/lib/category-style";
import type { Article } from "@/lib/types";

type FeaturedArticleCardProps = {
  article: Article;
  prominent?: boolean;
};

export function FeaturedArticleCard({
  article,
  prominent = false
}: FeaturedArticleCardProps) {
  const image = article.thumbnailUrl || article.coverImage;
  const tone = getCategoryTone(article.category);

  return (
    <article
      className={`group flex h-full min-h-full flex-col overflow-hidden rounded-[1.15rem] border border-rule bg-paper transition duration-200 hover:-translate-y-0.5 hover:border-strong ${
        prominent ? "md:col-span-2" : ""
      }`}
    >
      <ArticleThumbnail
        src={image}
        title={article.title}
        sourceName={article.sourceName}
        category={article.category}
        className={prominent ? "aspect-[16/9]" : "aspect-[16/10]"}
      />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-4">
          <span
            className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${tone.pill}`}
          >
            {article.category}
          </span>
        </div>

        <h3
          className={`line-clamp-3 font-sans font-bold tracking-[-0.03em] text-ink ${
            prominent
              ? "text-[2rem] leading-[1.08] sm:text-[2.65rem]"
              : "text-[1.55rem] leading-[1.12] sm:text-[1.9rem]"
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

        <div className="mt-4">
          <ArticleEditorialInfo article={article} />
        </div>

        <div className="mt-auto pt-4">
          <ArticleProof article={article} />
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex min-h-11 w-fit items-center rounded-full border border-clay bg-clay px-4 py-2 text-sm font-bold text-paper transition hover:border-[#6F4428] hover:bg-[#6F4428]"
          >
            Read article →
          </a>
        </div>
      </div>
    </article>
  );
}
