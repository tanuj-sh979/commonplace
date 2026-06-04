import Link from "next/link";

export function TopNav() {
  return (
    <header className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-rule pb-5 text-sm text-muted sm:mb-16">
      <Link
        href="/"
        className="group inline-flex min-h-10 items-center gap-2 text-2xl font-extrabold leading-none tracking-[-0.04em] text-ink transition-colors hover:text-clay sm:text-3xl"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-clay transition-colors group-hover:bg-sage" />
        Commonplace
      </Link>
      <nav className="flex min-h-10 items-center gap-3 text-xs font-semibold sm:gap-4 sm:text-sm">
        <Link className="rounded-full px-1 py-2 transition-colors hover:text-clay" href="/">
          Home
        </Link>
        <Link className="rounded-full px-1 py-2 transition-colors hover:text-clay" href="/canon">
          Canon
        </Link>
        <Link className="rounded-full px-1 py-2 transition-colors hover:text-clay" href="/sources">
          Sources
        </Link>
      </nav>
    </header>
  );
}
