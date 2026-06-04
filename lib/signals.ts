import type { Article } from "@/lib/types";

export type SignalBadge = {
  href?: string;
  label: string;
  title: string;
};

export function formatSignalBadges(article: Article): SignalBadge[] {
  const platforms = article.platforms;
  const badges: SignalBadge[] = [];

  if (platforms?.hn) {
    badges.push({
      href: platforms.hn.itemUrl,
      label: `${formatCompact(platforms.hn.points)} Hacker News upvotes`,
      title: "Featured on Hacker News"
    });
    if (platforms.hn.comments > 0) {
      badges.push({
        href: platforms.hn.itemUrl,
        label: `${formatCompact(platforms.hn.comments)} reader comments`,
        title: "Discussed on Hacker News"
      });
    }
  }

  if (platforms?.reddit) {
    badges.push({
      href: platforms.reddit.permalink,
      label: `${formatCompact(platforms.reddit.ups)} Reddit upvotes`,
      title: "Popular on Reddit"
    });
    if (platforms.reddit.comments > 0) {
      badges.push({
        href: platforms.reddit.permalink,
        label: `${formatCompact(platforms.reddit.comments)} reader comments`,
        title: "Discussed on Reddit"
      });
    }
  }

  if (platforms?.substack) {
    badges.push({
      href: article.url,
      label: `${formatCompact(platforms.substack.likes)} Substack likes`,
      title: "Reader-loved on Substack"
    });
    if (platforms.substack.comments > 0) {
      badges.push({
        href: article.url,
        label: `${formatCompact(platforms.substack.comments)} reader comments`,
        title: "Discussed on Substack"
      });
    }
  }

  if (badges.length === 0) {
    badges.push({
      href: article.url,
      label: `Curated from ${article.sourceName}`,
      title: "From trusted publications"
    });
  }

  return badges;
}

export function formatCompact(value: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1
  })
    .format(value)
    .toLowerCase();
}
