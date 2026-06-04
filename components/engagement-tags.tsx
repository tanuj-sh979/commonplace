import { formatSignalBadges } from "@/lib/signals";
import type { Article } from "@/lib/types";

export function EngagementTags({ article }: { article: Article }) {
  const tags = formatSignalBadges(article);

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <SignalTag
          key={tag.label}
          href={tag.href}
          label={tag.label}
          title={tag.title}
        />
      ))}
    </div>
  );
}

function SignalTag({
  href,
  label,
  title
}: {
  href?: string;
  label: string;
  title: string;
}) {
  const className =
    "rounded-full border border-rule bg-paper/50 px-2 py-1 text-[11px] font-semibold text-muted transition hover:border-clay/50 hover:text-clay";

  if (!href) {
    return (
      <span className={className} title={title}>
        {label}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      title={title}
    >
      {label}
    </a>
  );
}
