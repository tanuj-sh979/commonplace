import type { Metadata } from "next";
import { canon } from "@/lib/data";

export const metadata: Metadata = {
  title: "Canon"
};

export default function CanonPage() {
  return (
    <>
      <header>
        <h1 className="font-serif text-5xl leading-tight sm:text-6xl">Canon</h1>
        <p className="mt-5 text-lg leading-8 text-ink/75">
          Evergreen pieces grouped by author, for reading lists that outlast the
          week.
        </p>
      </header>

      <section className="mt-10 border-t border-rule">
        {canon.length > 0 ? canon.map((group) => (
          <article key={group.author} className="border-b border-rule py-7">
            <h2 className="font-serif text-3xl leading-tight">{group.author}</h2>
            <ul className="mt-5 space-y-4">
              {group.items.map((item) => (
                <li
                  key={`${group.author}-${item.title}`}
                  className="grid gap-2 sm:grid-cols-[1fr_auto]"
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
                    className="self-center text-sm font-semibold text-clay underline decoration-clay/30 transition hover:decoration-clay"
                  >
                    Read →
                  </a>
                </li>
              ))}
            </ul>
          </article>
        )) : (
          <p className="border-b border-rule py-10 text-sm text-muted">
            No canon entries are available yet.
          </p>
        )}
      </section>
    </>
  );
}
