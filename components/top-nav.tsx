import Link from "next/link";

export function TopNav() {
  return (
    <header className="mb-14 flex items-baseline justify-between gap-5 text-sm text-muted sm:mb-20">
      <Link
        href="/"
        className="font-serif text-2xl leading-none text-ink transition-colors hover:text-clay"
      >
        Commonplace
      </Link>
      <nav className="flex items-center gap-3 font-medium">
        <Link className="transition-colors hover:text-clay" href="/sources">
          Sources
        </Link>
        <span aria-hidden="true">·</span>
        <Link className="transition-colors hover:text-clay" href="/canon">
          Canon
        </Link>
      </nav>
    </header>
  );
}
