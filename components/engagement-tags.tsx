import { formatNumber } from "@/lib/format";
import type { Article } from "@/lib/types";

export function EngagementTags({ article }: { article: Article }) {
  const platforms = article.platforms;
  const tags = [
    platforms?.hn
      ? {
          label: `▲ ${formatCompact(platforms.hn.points)} HN`,
          href: platforms.hn.itemUrl
        }
      : null,
    platforms?.reddit
      ? {
          label: `⬆ ${formatCompact(platforms.reddit.ups)} Reddit`,
          href: platforms.reddit.permalink
        }
      : null,
    platforms?.substack
      ? {
          label: `♥ ${formatCompact(platforms.substack.likes)}`,
          href: article.url
        }
      : null
  ].filter(Boolean) as Array<{ label: string; href: string }>;

  if (tags.length === 0) {
    return (
      <span className="text-xs font-medium text-muted">
        ♥ {formatNumber(article.likes)} · 💬 {formatNumber(article.comments)}
      </span>
    );
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <a
          key={tag.label}
          href={tag.href}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-rule px-2 py-1 text-xs font-semibold text-muted transition hover:border-clay hover:text-clay"
        >
          {tag.label}
        </a>
      ))}
    </div>
  );
}

function formatCompact(value: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1
  })
    .format(value)
    .toLowerCase();
}
