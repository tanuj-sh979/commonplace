import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SourceCard } from "@/components/source-card";
import { getSourceGroups, sources } from "@/lib/data";

export const metadata: Metadata = {
  title: "Sources"
};

export default function SourcesPage() {
  const sourceGroups = getSourceGroups();

  return (
    <>
      <header className="max-w-3xl">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-clay">
          Directory
        </p>
        <h1 className="text-balance text-[3rem] font-extrabold leading-[1.02] tracking-[-0.05em] text-ink sm:text-7xl">
          Sources
        </h1>
        <p className="mt-6 text-lg font-medium leading-8 text-secondary sm:text-xl sm:leading-9">
          A curated directory of the publications and domains that keep producing
          essays worth saving.
        </p>
      </header>

      <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sourceGroups.map((group) => (
          <article
            key={group.name}
            className="flex h-full flex-col rounded-2xl border border-rule bg-surface p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage">
              Source group
            </p>
            <h2 className="mt-3 text-3xl font-extrabold leading-[1.05] tracking-[-0.04em] text-ink">
              {group.name}
            </h2>
            <p className="mt-3 text-sm font-medium leading-6 text-secondary">
              {group.description}
            </p>
            <div className="mt-auto border-t border-rule pt-4">
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

      <section className="mt-14">
        <div className="border-b border-rule pb-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-clay">
            Publications
          </p>
          <h2 className="text-[2.5rem] font-extrabold leading-[1.04] tracking-[-0.045em]">Directory</h2>
        </div>
      </section>

      <section className="mt-5 grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sources.length > 0 ? (
          sources.map((source) => <SourceCard key={source.slug} source={source} />)
        ) : (
          <p className="border-b border-rule py-10 text-sm text-muted">
            No sources are indexed yet. Run npm run ingest to refresh the library.
          </p>
        )}
      </section>

      <SiteFooter />
    </>
  );
}
