import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompactArticleItem } from "@/components/compact-article-item";
import { FeaturedArticleCard } from "@/components/featured-article-card";
import { SiteFooter } from "@/components/site-footer";
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
  const featuredArticles = articles.slice(0, 3);
  const remainingArticles = articles.slice(3);

  return (
    <>
      <header className="rounded-[1.5rem] border border-rule bg-surface px-5 py-8 sm:px-8">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-clay">
          {source.category}
        </p>
        <h1 className="text-balance text-[2.75rem] font-extrabold leading-[1.04] tracking-[-0.05em] text-ink sm:text-7xl">
          {source.name}
        </h1>
        <p className="mt-6 text-lg font-medium leading-8 text-secondary">
          {[source.host, source.platform, `${source.count ?? articles.length} articles`]
            .filter(Boolean)
            .join(" · ")}
        </p>
        <a
          href={source.subscribeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex min-h-10 items-center text-sm font-semibold text-clay underline decoration-clay/30 transition hover:text-[#6F4428] hover:decoration-clay"
        >
          Subscribe
        </a>
      </header>

      {articles.length > 0 ? (
        <>
          <section className="mt-7 grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredArticles.map((article, index) => (
              <FeaturedArticleCard
                key={article.id}
                article={article}
                prominent={index === 0}
              />
            ))}
          </section>

          {remainingArticles.length > 0 ? (
            <section className="mt-8 rounded-2xl border border-rule bg-paper px-5 sm:px-6">
              {remainingArticles.map((article) => (
                <CompactArticleItem key={article.id} article={article} />
              ))}
            </section>
          ) : null}
        </>
      ) : (
        <p className="py-10 text-sm text-muted">
          No articles are indexed for this source yet.
        </p>
      )}

      <SiteFooter />
    </>
  );
}
