import Link from "next/link";
import type { Metadata } from "next";
import { sources } from "@/lib/data";

export const metadata: Metadata = {
  title: "Sources"
};

export default function SourcesPage() {
  return (
    <>
      <header>
        <h1 className="font-serif text-5xl leading-tight sm:text-6xl">Sources</h1>
        <p className="mt-5 text-lg leading-8 text-ink/75">
          The blogs and newsletters currently represented in the library.
        </p>
      </header>

      <section className="mt-10 border-t border-rule">
        {sources.length > 0 ? sources.map((source) => (
          <article
            key={source.slug}
            className="grid gap-4 border-b border-rule py-6 sm:grid-cols-[1fr_auto]"
          >
            <div>
              <h2 className="font-serif text-3xl leading-tight">
                <Link
                  href={`/source/${source.slug}`}
                  className="transition-colors hover:text-clay"
                >
                  {source.name}
                </Link>
              </h2>
              <p className="mt-2 text-sm font-medium leading-6 text-muted">
                {[source.host, source.category, source.platform]
                  .filter(Boolean)
                  .join(" · ")}
                {typeof source.count === "number" ? ` · ${source.count} articles` : ""}
              </p>
            </div>
            <a
              href={source.subscribeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="self-start text-sm font-semibold text-clay underline decoration-clay/30 transition hover:decoration-clay"
            >
              Subscribe
            </a>
          </article>
        )) : (
          <p className="border-b border-rule py-10 text-sm text-muted">
            No sources are indexed yet. Run npm run ingest to refresh the library.
          </p>
        )}
      </section>
    </>
  );
}
