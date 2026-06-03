import Link from "next/link";

export function TopNav() {
  return (
    <header className="mb-14 flex items-center justify-between gap-4 border-b border-rule/80 pb-5 text-sm text-muted sm:mb-20">
      <Link
        href="/"
        className="group inline-flex items-center gap-2 font-serif text-2xl leading-none text-ink transition-colors hover:text-clay sm:text-3xl"
      >
        <span className="h-2 w-2 rounded-full bg-clay transition-colors group-hover:bg-sage" />
        Commonplace
      </Link>
      <nav className="flex items-center gap-2 text-xs font-medium sm:gap-3 sm:text-sm">
        <Link className="transition-colors hover:text-clay" href="/">
          Home
        </Link>
        <span aria-hidden="true">·</span>
        <Link className="transition-colors hover:text-clay" href="/canon">
          Canon
        </Link>
        <span aria-hidden="true">·</span>
        <Link className="transition-colors hover:text-clay" href="/sources">
          Sources
        </Link>
      </nav>
    </header>
  );
}
