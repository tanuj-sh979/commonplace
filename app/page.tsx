import { ArticleBrowser } from "@/components/article-browser";
import { articles, categories, top100Articles } from "@/lib/data";

export default function HomePage() {
  return (
    <>
      <section className="pt-3">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-clay">
          Reading Library
        </p>
        <h1 className="font-serif text-6xl leading-none sm:text-7xl">
          Commonplace
        </h1>
        <p className="mt-6 max-w-2xl text-xl leading-8 text-ink/75 sm:text-2xl sm:leading-10">
          A curated index of essays and newsletters worth saving, ranked by the
          signal they gather elsewhere.
        </p>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted">
          Commonplace is a read-only library: every piece links out to its original
          publication.
        </p>
      </section>

      <ArticleBrowser
        articles={articles}
        topArticles={top100Articles}
        categories={categories}
      />
    </>
  );
}
