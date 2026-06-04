import Link from "next/link";
import type { Metadata } from "next";
import { getSourceGroups, sources } from "@/lib/data";

export const metadata: Metadata = {
  title: "Sources"
};

export default function SourcesPage() {
  const sourceGroups = getSourceGroups();

  return (
    <>
      <header className="max-w-3xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-clay">
          Directory
        </p>
        <h1 className="font-serif text-6xl leading-none sm:text-7xl">Sources</h1>
        <p className="mt-6 text-xl leading-9 text-ink/75">
          A curated directory of the publications and domains that keep producing
          essays worth saving.
        </p>
      </header>

      <section className="mt-12 grid gap-4 sm:grid-cols-2">
        {sourceGroups.map((group) => (
          <article
            key={group.name}
            className="rounded-md border border-rule bg-surface/70 p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage">
              Source group
            </p>
            <h2 className="mt-3 font-serif text-3xl leading-none">
              {group.name}
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              {group.description}
            </p>
            <div className="mt-5 border-t border-rule pt-4">
              <p className="text-sm font-semibold text-muted">
                {group.count} {group.count === 1 ? "article" : "articles"}
              </p>
              {group.examples.length > 0 ? (
                <p className="mt-2 text-sm leading-6 text-muted">
                  Examples: {group.examples.join(", ")}
                </p>
              ) : null}
            </div>
          </article>
        ))}
      </section>

      <section className="mt-12">
        <div className="border-b border-rule pb-5">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-clay">
            Publications
          </p>
          <h2 className="font-serif text-5xl leading-none">Directory</h2>
        </div>
      </section>

      <section className="mt-5 grid gap-4 sm:grid-cols-2">
        {sources.length > 0 ? (
          sources.map((source) => (
            <article
              key={source.slug}
              className="rounded-md border border-rule bg-surface/60 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-clay/40 hover:bg-surface"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage">
                {source.category}
              </p>
              <h2 className="mt-3 font-serif text-3xl leading-none">
                <Link
                  href={`/source/${source.slug}`}
                  className="transition-colors hover:text-clay"
                >
                  {source.name}
                </Link>
              </h2>
              <p className="mt-3 text-sm font-medium leading-6 text-muted">
                {source.host}
              </p>
              <div className="mt-5 flex items-center justify-between gap-4 border-t border-rule pt-4">
                <p className="text-sm font-semibold text-muted">
                  {source.count ?? 0} articles
                </p>
                <a
                  href={source.subscribeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-clay underline decoration-clay/25 transition hover:decoration-clay"
                >
                  Visit →
                </a>
              </div>
            </article>
          ))
        ) : (
          <p className="border-b border-rule py-10 text-sm text-muted">
            No sources are indexed yet. Run npm run ingest to refresh the library.
          </p>
        )}
      </section>
    </>
  );
}
