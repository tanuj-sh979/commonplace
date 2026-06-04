import type { Metadata } from "next";
import { CanonSection } from "@/components/canon-section";
import { SiteFooter } from "@/components/site-footer";
import { canon } from "@/lib/data";

export const metadata: Metadata = {
  title: "Canon"
};

export default function CanonPage() {
  const essayCount = canon.reduce((count, group) => count + group.items.length, 0);

  return (
    <>
      <header className="max-w-3xl">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-clay">
          Evergreen Shelf
        </p>
        <h1 className="text-balance text-[3rem] font-extrabold leading-[1.02] tracking-[-0.05em] text-ink sm:text-7xl">
          Canon
        </h1>
        <p className="mt-6 text-lg font-medium leading-8 text-secondary sm:text-xl sm:leading-9">
          A small canon of internet essays worth returning to. Handpicked across
          technology, ambition, creativity, money, meaning, and how to think.
        </p>
        <div className="mt-7 grid max-w-xl grid-cols-3 divide-x divide-rule rounded-xl border border-rule bg-surface text-center">
          <div className="px-4 py-3">
            <p className="text-3xl font-extrabold leading-none tracking-[-0.04em]">{canon.length}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              Authors
            </p>
          </div>
          <div className="px-4 py-3">
            <p className="text-3xl font-extrabold leading-none tracking-[-0.04em]">{essayCount}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              Essays
            </p>
          </div>
          <div className="px-4 py-3">
            <p className="text-3xl font-extrabold leading-none tracking-[-0.04em]">6</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              Themes
            </p>
          </div>
        </div>
      </header>

      <section className="mt-12 grid gap-5 lg:grid-cols-2">
        {canon.length > 0 ? (
          canon.map((group) => <CanonSection key={group.author} group={group} />)
        ) : (
          <p className="border-b border-rule py-10 text-sm text-muted">
            No canon entries are available yet.
          </p>
        )}
      </section>

      <SiteFooter />
    </>
  );
}
