import type { CanonGroup } from "@/lib/types";

export function CanonSection({ group }: { group: CanonGroup }) {
  return (
    <article className="rounded-2xl border border-rule bg-paper p-5 sm:p-7">
      <div className="flex flex-col gap-3 border-b border-rule pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-sage">
            Commonplace Canon
          </p>
          <h2 className="text-4xl font-extrabold leading-[1.05] tracking-[-0.04em] text-ink sm:text-5xl">
            {group.author}
          </h2>
        </div>
        <p className="w-fit rounded-full border border-clay/20 bg-clay-soft/45 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-clay">
          Editor’s Pick · {group.items.length} essays
        </p>
      </div>

      <ul className="mt-5 divide-y divide-rule/75">
        {group.items.map((item) => (
          <li
            key={`${group.author}-${item.title}`}
            className="grid gap-3 py-4 first:pt-0 last:pb-0 sm:grid-cols-[1fr_auto]"
          >
            <div>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl font-bold leading-tight tracking-[-0.025em] text-ink transition-colors hover:text-clay sm:text-2xl"
              >
                {item.title}
              </a>
              <p className="mt-1 text-sm font-medium leading-6 text-muted">
                {item.sourceName}
              </p>
            </div>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="self-center text-sm font-semibold text-clay underline decoration-clay/25 transition hover:text-[#6F4428] hover:decoration-clay"
            >
              Read →
            </a>
          </li>
        ))}
      </ul>
    </article>
  );
}
