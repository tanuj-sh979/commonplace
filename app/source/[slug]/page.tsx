import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleList } from "@/components/article-list";
import { getArticlesBySource, getSourceBySlug, sources } from "@/lib/data";

type SourcePageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return sources.map((source) => ({ slug: source.slug }));
}

export function generateMetadata({ params }: SourcePageProps): Metadata {
  const source = getSourceBySlug(params.slug);

  if (!source) {
    return {
      title: "Source"
    };
  }

  return {
    title: source.name,
    description: `${source.name}, curated on Commonplace.`
  };
}

export default function SourcePage({ params }: SourcePageProps) {
  const source = getSourceBySlug(params.slug);

  if (!source) {
    notFound();
  }

  const articles = getArticlesBySource(source.slug);

  return (
    <>
      <header className="border-b border-rule pb-8">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-clay">
          {source.category}
        </p>
        <h1 className="font-serif text-6xl leading-none sm:text-7xl">
          {source.name}
        </h1>
        <p className="mt-6 text-lg leading-8 text-ink/75">
          {[source.host, source.platform, `${source.count ?? articles.length} articles`]
            .filter(Boolean)
            .join(" · ")}
        </p>
        <a
          href={source.subscribeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex text-sm font-semibold text-clay underline decoration-clay/30 transition hover:decoration-clay"
        >
          Subscribe
        </a>
      </header>

      {articles.length > 0 ? (
        <ArticleList articles={articles} compact />
      ) : (
        <p className="py-10 text-sm text-muted">
          No articles are indexed for this source yet.
        </p>
      )}
    </>
  );
}
