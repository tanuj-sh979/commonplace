import type { Metadata } from "next";
import { canon } from "@/lib/data";

export const metadata: Metadata = {
  title: "Canon"
};

export default function CanonPage() {
  const essayCount = canon.reduce((count, group) => count + group.items.length, 0);

  return (
    <>
      <header className="max-w-3xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-clay">
          Evergreen Shelf
        </p>
        <h1 className="font-serif text-6xl leading-none sm:text-7xl">Canon</h1>
        <p className="mt-6 text-xl leading-9 text-ink/75">
          A small canon of internet essays worth returning to. Handpicked across
          technology, ambition, creativity, money, meaning, and how to think.
        </p>
        <div className="mt-7 grid max-w-xl grid-cols-3 divide-x divide-rule rounded-md border border-rule bg-surface/60 text-center">
          <div className="px-4 py-3">
            <p className="font-serif text-3xl leading-none">{canon.length}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              Authors
            </p>
          </div>
          <div className="px-4 py-3">
            <p className="font-serif text-3xl leading-none">{essayCount}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              Essays
            </p>
          </div>
          <div className="px-4 py-3">
            <p className="font-serif text-3xl leading-none">6</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              Themes
            </p>
          </div>
        </div>
      </header>

      <section className="mt-12 space-y-5">
        {canon.length > 0 ? (
          canon.map((group) => (
            <article
              key={group.author}
              className="rounded-md border border-rule bg-surface/60 p-5 sm:p-6"
            >
              <div className="flex flex-col gap-2 border-b border-rule pb-4 sm:flex-row sm:items-end sm:justify-between">
                <h2 className="font-serif text-4xl leading-none">
                  {group.author}
                </h2>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage">
                  {group.items.length} essays
                </p>
              </div>
              <ul className="mt-5 space-y-4">
                {group.items.map((item) => (
                  <li
                    key={`${group.author}-${item.title}`}
                    className="grid gap-2 border-b border-rule/70 pb-4 last:border-0 last:pb-0 sm:grid-cols-[1fr_auto]"
                  >
                    <div>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-serif text-2xl leading-tight transition-colors hover:text-clay"
                      >
                        {item.title}
                      </a>
                      <p className="mt-1 text-sm font-medium text-muted">
                        {item.sourceName}
                      </p>
                    </div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="self-center text-sm font-semibold text-clay underline decoration-clay/25 transition hover:decoration-clay"
                    >
                      Read →
                    </a>
                  </li>
                ))}
              </ul>
            </article>
          ))
        ) : (
          <p className="border-b border-rule py-10 text-sm text-muted">
            No canon entries are available yet.
          </p>
        )}
      </section>
    </>
  );
}
