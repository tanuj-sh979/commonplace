import type { Article, PlatformSignals } from "@/lib/types";

export type ReadingSignal = {
  primaryBadge:
    | "Widely discussed"
    | "Reader favourite"
    | "Highly shared"
    | "Internet classic"
    | "Editor’s Pick"
    | "From trusted publication"
    | "Deep read"
    | "Fresh find";
  reasonLabel: string;
  metricLine: string;
  sourceLine: string;
};

export type ReadableEngagement = {
  primarySignal: ReadingSignal["primaryBadge"];
  metricLine: string;
};

export function getArticleAboutLine(article: Article) {
  if (article.excerpt) {
    return article.excerpt.replace(/\s+/g, " ").trim();
  }

  switch (article.category) {
    case "Attention & Tech":
      return "An essay on attention, identity, technology, and modern life.";
    case "Meaning & Living":
      return "A thoughtful read on time, relationships, and how to live.";
    case "Original Thinking":
      return "A sharp idea for builders, thinkers, and curious readers.";
    case "Creativity":
      return "A read on taste, creativity, and making better work.";
    case "Learning":
      return "A practical essay on learning, clarity, and mental models.";
    case "Relationships":
      return "A human read on relationships, communication, and attention.";
    case "Agency":
      return "A clear read on agency, behavior, and decision-making.";
    case "Ideas":
    default:
      return "A thoughtful essay selected for curious readers.";
  }
}

export function getArticleWhyLine(article: Article) {
  const signal = getReadableEngagement(article);

  if (signal.primarySignal === "Internet classic") {
    return "A timeless idea people keep returning to.";
  }

  if (signal.primarySignal === "Widely discussed") {
    return "Worth reading if you like essays that spark serious discussion.";
  }

  switch (article.category) {
    case "Attention & Tech":
      return "A strong read if you care about attention, identity, and the internet.";
    case "Original Thinking":
      return "Good for builders, creators, and curious readers.";
    case "Creativity":
      return "Useful if you want sharper taste and better creative judgment.";
    case "Learning":
      return "Useful if you want to think more clearly and learn with intent.";
    case "Meaning & Living":
    case "Relationships":
      return "Useful if you want to think more clearly about modern life.";
    case "Agency":
      return "Worth reading if you like essays that change how you see a familiar topic.";
    case "Ideas":
    default:
      return "Worth reading if you like essays that make familiar ideas feel new.";
  }
}

export function getReadableEngagement(article: Article): ReadableEngagement {
  const signal = getReadingSignal(article);

  return {
    primarySignal: signal.primaryBadge,
    metricLine: signal.metricLine
  };
}

export function getSourceReadTimeLine(article: Article) {
  return [
    article.sourceName,
    article.readingMinutes ? `${article.readingMinutes} min read` : undefined
  ]
    .filter(Boolean)
    .join(" · ");
}

export function getReadingSignal(article: Article): ReadingSignal {
  const hn = article.platforms?.hn;
  const reddit = article.platforms?.reddit;
  const substack = article.platforms?.substack;
  const sourceLine = formatSourceLine(article);
  const sourceName = article.sourceName || "trusted publication";

  if (hn && hnScore(hn) >= Math.max(redditScore(reddit), substackScore(substack))) {
    return {
      primaryBadge: "Widely discussed",
      reasonLabel:
        "Sparked a strong discussion among builders and technologists",
      metricLine: [
        `${formatCompact(hn.points)} Hacker News upvotes`,
        hn.comments > 0
          ? `${formatCompact(hn.comments)} people joined the discussion`
          : undefined
      ]
        .filter(Boolean)
        .join(" · "),
      sourceLine
    };
  }

  if (
    substack &&
    substackScore(substack) >= Math.max(hnScore(hn), redditScore(reddit))
  ) {
    return {
      primaryBadge: "Reader favourite",
      reasonLabel: "Loved by readers on Substack",
      metricLine: [
        `${formatCompact(substack.likes)} Substack readers liked this`,
        substack.comments > 0
          ? `${formatCompact(substack.comments)} comments`
          : undefined
      ]
        .filter(Boolean)
        .join(" · "),
      sourceLine
    };
  }

  if (reddit) {
    return {
      primaryBadge: "Highly shared",
      reasonLabel: "Shared widely by online communities",
      metricLine: [
        `${formatCompact(reddit.ups)} Reddit upvotes`,
        reddit.comments > 0
          ? `${formatCompact(reddit.comments)} people joined the discussion`
          : undefined
      ]
        .filter(Boolean)
        .join(" · "),
      sourceLine
    };
  }

  if (isCanonLike(article)) {
    return {
      primaryBadge: "Internet classic",
      reasonLabel: "A timeless essay selected for the Commonplace Canon",
      metricLine: "Commonplace Canon · Editor’s Pick",
      sourceLine
    };
  }

  if (isFresh(article)) {
    return {
      primaryBadge: "Fresh find",
      reasonLabel: "A recent essay added to the Commonplace reading room",
      metricLine: `Curated from ${sourceName}`,
      sourceLine
    };
  }

  if (article.readingMinutes && article.readingMinutes >= 12) {
    return {
      primaryBadge: "Deep read",
      reasonLabel: "A substantial essay worth setting aside time for",
      metricLine: `Curated from ${sourceName}`,
      sourceLine
    };
  }

  return {
    primaryBadge: "From trusted publication",
    reasonLabel: "Selected from a trusted long-form publication",
    metricLine: `Curated from ${sourceName}`,
    sourceLine
  };
}

export function getCompactReadingSignal(article: Article) {
  const signal = getReadableEngagement(article);
  return `${signal.primarySignal} · ${signal.metricLine}`;
}

export function formatCompact(value: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1
  })
    .format(value)
    .toLowerCase();
}

function formatSourceLine(article: Article) {
  return getSourceReadTimeLine(article);
}

function hnScore(signal?: NonNullable<PlatformSignals["hn"]>) {
  if (!signal) {
    return 0;
  }

  return signal.points + 2 * signal.comments;
}

function redditScore(signal?: NonNullable<PlatformSignals["reddit"]>) {
  if (!signal) {
    return 0;
  }

  return signal.ups + 2 * signal.comments;
}

function substackScore(signal?: NonNullable<PlatformSignals["substack"]>) {
  if (!signal) {
    return 0;
  }

  return signal.likes + 3 * signal.comments;
}

function isCanonLike(article: Article) {
  return /commonplace canon|editor/i.test(
    `${article.sourceName} ${article.category} ${article.author}`
  );
}

function isFresh(article: Article) {
  const published = new Date(article.publishedAt).getTime();
  if (Number.isNaN(published)) {
    return false;
  }

  const daysOld = (Date.now() - published) / (1000 * 60 * 60 * 24);
  return daysOld >= 0 && daysOld <= 45;
}
