import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-rule py-8 sm:mt-28">
      <div className="flex flex-col gap-5 text-sm leading-6 text-muted sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-2xl font-extrabold leading-none tracking-[-0.04em] text-ink">Commonplace</p>
          <p className="mt-2 max-w-xl">
            A curated index of essays worth returning to.
          </p>
        </div>
        <nav className="flex items-center gap-4 font-semibold text-clay">
          <Link className="transition hover:text-[#6F4428]" href="/">
            Home
          </Link>
          <Link className="transition hover:text-[#6F4428]" href="/canon">
            Canon
          </Link>
          <Link className="transition hover:text-[#6F4428]" href="/sources">
            Sources
          </Link>
        </nav>
      </div>
    </footer>
  );
}
