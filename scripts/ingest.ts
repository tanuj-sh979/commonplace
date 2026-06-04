import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { load } from "cheerio";
import {
  ALLOWLIST,
  DOMAIN_CATEGORY,
  DOMAIN_DISPLAY_NAME,
  SUBREDDITS,
  SUBSTACK_SOURCES
} from "./config";
import type { Article, Category, PlatformSignals, Source } from "../lib/types";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data");
const META_CACHE_PATH = path.join(DATA_DIR, "_meta-cache.json");
const USER_AGENT =
  "commonplace/0.1 (+https://commonplace.local; editorial link index)";
const BROWSER_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36 commonplace/0.1";
const TRACKING_PARAMS = [
  "fbclid",
  "gclid",
  "igshid",
  "mc_cid",
  "mc_eid",
  "mkt_tok",
  "ref",
  "source"
];

type Stats = {
  fetched: number;
  kept: number;
  errors: number;
};

type MetaCache = Record<string, HeadMetadata & { fetchedAt: string }>;

type HeadMetadata = {
  title?: string;
  excerpt?: string;
  author?: string;
  sourceName?: string;
  coverImage?: string;
  canonical?: string;
};

type CandidateInput = {
  title?: string;
  excerpt?: string;
  author?: string;
  sourceName?: string;
  url: string;
  publishedAt?: string;
  coverImage?: string;
  preferredHost?: string;
  platform: "hn" | "reddit" | "substack";
  hn?: NonNullable<PlatformSignals["hn"]>;
  reddit?: NonNullable<PlatformSignals["reddit"]>;
  substack?: NonNullable<PlatformSignals["substack"]>;
};

type WorkingArticle = Article & {
  _host: string;
  _preferredHost?: string;
};

const allowlist = new Set<string>(ALLOWLIST);

async function main() {
  const stats: Record<string, Stats> = {
    hnBroad: emptyStats(),
    hnTargeted: emptyStats(),
    reddit: emptyStats(),
    substack: emptyStats(),
    metadata: emptyStats()
  };
  const articles = new Map<string, WorkingArticle>();
  const seenHnIds = new Set<string>();
  const seenRedditIds = new Set<string>();

  await fetchHackerNewsBroad(articles, seenHnIds, stats.hnBroad);
  await fetchHackerNewsTargeted(articles, seenHnIds, stats.hnTargeted);
  await fetchReddit(articles, seenRedditIds, stats.reddit);
  await fetchSubstack(articles, stats.substack);

  const cache = await readMetaCache();
  const enriched = await enrichWithMetadata(
    Array.from(articles.values()),
    cache,
    stats.metadata
  );
  const finalArticles = finalizeArticles(enriched);
  const sources = deriveSources(finalArticles);

  await writeJson(path.join(DATA_DIR, "articles.json"), finalArticles);
  await writeJson(path.join(DATA_DIR, "top100.json"), finalArticles.slice(0, 100));
  await writeJson(path.join(DATA_DIR, "sources.json"), sources);
  await writeJson(META_CACHE_PATH, cache);

  console.table(stats);
  console.log(
    `Wrote ${finalArticles.length} articles, ${Math.min(
      finalArticles.length,
      100
    )} top articles, and ${sources.length} sources.`
  );
}

async function fetchHackerNewsBroad(
  articles: Map<string, WorkingArticle>,
  seenHnIds: Set<string>,
  stats: Stats
) {
  for (let page = 0; page <= 5; page += 1) {
    const url = new URL("https://hn.algolia.com/api/v1/search");
    url.searchParams.set("tags", "story");
    url.searchParams.set("numericFilters", "points>=80");
    url.searchParams.set("hitsPerPage", "100");
    url.searchParams.set("page", String(page));

    try {
      const json = await fetchJson<{ hits?: HnHit[] }>(url.toString());
      stats.fetched += json.hits?.length ?? 0;
      for (const hit of json.hits ?? []) {
        if (addHnHit(articles, seenHnIds, hit)) {
          stats.kept += 1;
        }
      }
    } catch (error) {
      stats.errors += 1;
      logError("HN broad", url.toString(), error);
    }
  }
}

async function fetchHackerNewsTargeted(
  articles: Map<string, WorkingArticle>,
  seenHnIds: Set<string>,
  stats: Stats
) {
  for (const domain of ALLOWLIST) {
    const url = new URL("https://hn.algolia.com/api/v1/search");
    url.searchParams.set("query", domain);
    url.searchParams.set("restrictSearchableAttributes", "url");
    url.searchParams.set("tags", "story");
    url.searchParams.set("numericFilters", "points>=20");
    url.searchParams.set("hitsPerPage", "50");

    try {
      const json = await fetchJson<{ hits?: HnHit[] }>(url.toString());
      stats.fetched += json.hits?.length ?? 0;
      for (const hit of json.hits ?? []) {
        if (addHnHit(articles, seenHnIds, hit)) {
          stats.kept += 1;
        }
      }
    } catch (error) {
      stats.errors += 1;
      logError("HN targeted", domain, error);
    }
  }
}

async function fetchReddit(
  articles: Map<string, WorkingArticle>,
  seenRedditIds: Set<string>,
  stats: Stats
) {
  for (const subreddit of SUBREDDITS) {
    for (const period of ["year", "all"] as const) {
      const url = `https://www.reddit.com/r/${subreddit}/top.json?t=${period}&limit=100`;
      try {
        const json = await fetchJson<RedditResponse>(url, {
          headers: {
            "User-Agent": USER_AGENT
          }
        });
        const posts = json.data?.children ?? [];
        stats.fetched += posts.length;
        for (const post of posts) {
          if (addRedditPost(articles, seenRedditIds, post.data)) {
            stats.kept += 1;
          }
        }
      } catch (error) {
        stats.errors += 1;
        logError("Reddit", `${subreddit}/${period}`, error);
      }
      await sleep(1000);
    }
  }
}

async function fetchSubstack(articles: Map<string, WorkingArticle>, stats: Stats) {
  for (const source of SUBSTACK_SOURCES) {
    for (const offset of [0, 50]) {
      const url = `${source.baseUrl.replace(
        /\/$/,
        ""
      )}/api/v1/posts?sort=new&limit=50&offset=${offset}`;
      try {
        const response = await fetchJson<SubstackPost[] | { posts?: SubstackPost[] }>(
          url
        );
        const posts = Array.isArray(response) ? response : response.posts ?? [];
        stats.fetched += posts.length;
        for (const post of posts.slice(0, Math.max(0, 80 - offset))) {
          const postUrl =
            post.canonical_url || post.web_url || post.url || post.share_url;
          if (!postUrl) {
            continue;
          }

          addCandidate(articles, {
            title: post.title,
            excerpt:
              post.subtitle ||
              post.description ||
              post.search_engine_description,
            author: source.author,
            sourceName: source.name,
            url: postUrl,
            publishedAt: post.post_date,
            coverImage: post.cover_image,
            preferredHost: getHost(source.baseUrl, { preservePrefix: true }),
            platform: "substack",
            substack: {
              likes: Number(post.reaction_count ?? 0),
              comments: Number(post.comment_count ?? 0)
            }
          });
          stats.kept += 1;
        }

        if (posts.length < 50 || offset >= 50) {
          break;
        }
      } catch (error) {
        stats.errors += 1;
        logError("Substack", source.name, error);
        break;
      }
    }
  }
}

function addHnHit(
  articles: Map<string, WorkingArticle>,
  seenHnIds: Set<string>,
  hit: HnHit
) {
  if (!hit.url || !hit.objectID || seenHnIds.has(hit.objectID)) {
    return false;
  }

  const host = getHost(hit.url);
  if (!host || !allowlist.has(host)) {
    return false;
  }

  seenHnIds.add(hit.objectID);
  addCandidate(articles, {
    title: hit.title,
    author: hit.author,
    sourceName: nameFromHost(host),
    url: hit.url,
    publishedAt: hit.created_at,
    platform: "hn",
    hn: {
      points: Number(hit.points ?? 0),
      comments: Number(hit.num_comments ?? 0),
      itemUrl: `https://news.ycombinator.com/item?id=${hit.objectID}`
    }
  });
  return true;
}

function addRedditPost(
  articles: Map<string, WorkingArticle>,
  seenRedditIds: Set<string>,
  post: RedditPost
) {
  const postUrl = post.url_overridden_by_dest || post.url;
  if (post.is_self || !postUrl || !post.id || seenRedditIds.has(post.id)) {
    return false;
  }

  const host = getHost(postUrl);
  if (!host || !allowlist.has(host)) {
    return false;
  }

  seenRedditIds.add(post.id);
  addCandidate(articles, {
    title: post.title,
    sourceName: nameFromHost(host),
    url: postUrl,
    publishedAt: new Date(Number(post.created_utc ?? 0) * 1000).toISOString(),
    platform: "reddit",
    reddit: {
      ups: Number(post.ups ?? 0),
      comments: Number(post.num_comments ?? 0),
      subreddit: post.subreddit,
      permalink: `https://reddit.com${post.permalink}`
    }
  });
  return true;
}

function addCandidate(
  articles: Map<string, WorkingArticle>,
  input: CandidateInput
) {
  let key: string;
  try {
    key = canonicalUrl(input.url);
  } catch {
    return;
  }

  const host = getHost(key);
  if (!host) {
    return;
  }
  const outboundUrl = toOutboundUrl(input.url, input.preferredHost);

  const current =
    articles.get(key) ??
    ({
      id: idFromCanonicalUrl(key),
      title: cleanText(input.title) || "Untitled",
      excerpt: cleanText(input.excerpt) || "",
      author: cleanText(input.author) || "",
      sourceSlug: slugForHost(host),
      sourceName: cleanText(input.sourceName) || nameFromHost(host),
      url: outboundUrl,
      publishedAt: input.publishedAt || new Date().toISOString(),
      category: categoryForHost(host),
      readingMinutes: undefined,
      likes: 0,
      comments: 0,
      engagementScore: 0,
      coverImage: input.coverImage,
      platforms: {},
      _host: host,
      _preferredHost: input.preferredHost
    } satisfies WorkingArticle);

  current.title = richerText(current.title, cleanText(input.title), "title");
  current.excerpt = richerText(
    current.excerpt,
    cleanText(input.excerpt),
    "excerpt"
  );
  current.author = richerText(current.author, cleanText(input.author), "short");
  current.sourceName = richerText(
    current.sourceName,
    cleanText(input.sourceName),
    "short"
  );
  current.coverImage = current.coverImage || input.coverImage;
  current._preferredHost = current._preferredHost || input.preferredHost;

  if (input.platform === "substack") {
    current.author = cleanText(input.author) || current.author;
    current.sourceName = cleanText(input.sourceName) || current.sourceName;
    current.coverImage = input.coverImage || current.coverImage;
    current.url = outboundUrl;
    current._preferredHost = input.preferredHost || current._preferredHost;
  }

  if (input.publishedAt && isAfter(input.publishedAt, current.publishedAt)) {
    current.publishedAt = input.publishedAt;
  }

  mergePlatformSignals(current, input);
  articles.set(key, current);
}

async function enrichWithMetadata(
  articles: WorkingArticle[],
  cache: MetaCache,
  stats: Stats
) {
  const enriched = await mapLimit(articles, 5, async (article) => {
  const key = canonicalUrl(article.url);
    const cached = cache[key];

    if (cached) {
      stats.kept += 1;
      return applyMetadata(article, cached);
    }

    stats.fetched += 1;
    try {
      const meta = await fetchHeadMetadata(article.url);
      cache[key] = {
        ...meta,
        fetchedAt: new Date().toISOString()
      };
      stats.kept += 1;
      return applyMetadata(article, meta);
    } catch (error) {
      stats.errors += 1;
      logError("Metadata", article.url, error);
      cache[key] = {
        fetchedAt: new Date().toISOString()
      };
      return article;
    }
  });

  const deduped = new Map<string, WorkingArticle>();
  for (const article of enriched) {
    const key = canonicalUrl(article.url);
    const existing = deduped.get(key);
    if (existing) {
      mergeWorkingArticle(existing, article);
    } else {
      deduped.set(key, article);
    }
  }

  return Array.from(deduped.values());
}

async function fetchHeadMetadata(url: string): Promise<HeadMetadata> {
  const response = await fetchWithTimeout(url, {
    headers: {
      "User-Agent": BROWSER_USER_AGENT,
      Accept: "text/html,application/xhtml+xml"
    },
    redirect: "follow",
    timeoutMs: 8000
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const html = await response.text();
  const head = html.match(/<head[\s\S]*?<\/head>/i)?.[0] ?? html.slice(0, 80000);
  const $ = load(head);
  const canonical = absolutize(
    $("link[rel='canonical']").attr("href"),
    response.url || url
  );

  return {
    title:
      meta($, "property", "og:title") ||
      meta($, "name", "twitter:title") ||
      $("title").first().text(),
    excerpt:
      meta($, "property", "og:description") ||
      meta($, "name", "description") ||
      meta($, "name", "twitter:description"),
    coverImage: absolutize(
      meta($, "property", "og:image") || meta($, "name", "twitter:image"),
      response.url || url
    ),
    sourceName: meta($, "property", "og:site_name"),
    author:
      meta($, "property", "article:author") ||
      meta($, "name", "author") ||
      meta($, "name", "parsely-author"),
    canonical
  };
}

function applyMetadata(article: WorkingArticle, meta: HeadMetadata) {
  const next = { ...article };
  const outboundUrl = meta.canonical
    ? toOutboundUrl(meta.canonical, article._preferredHost)
    : article.url;
  const canonical = canonicalUrl(outboundUrl);
  const host = getHost(canonical) || article._host;

  next.url = canonical;
  next.url = outboundUrl;
  next._host = host;
  next.sourceSlug = slugForHost(host);
  next.category = categoryForHost(host);
  next.title = richerText(article.title, cleanText(meta.title), "title");
  next.excerpt = truncate(
    richerText(article.excerpt, cleanText(meta.excerpt), "excerpt"),
    320
  );
  next.author = richerText(article.author, cleanText(meta.author), "short");
  next.sourceName = richerText(
    article.sourceName,
    cleanText(meta.sourceName),
    "short"
  );
  next.coverImage = article.coverImage || meta.coverImage;
  next.id = idFromCanonicalUrl(next.url);

  return next;
}

function finalizeArticles(articles: WorkingArticle[]) {
  return articles
    .map((article) => {
      const host = getHost(article.url) || article._host;
      const platforms = article.platforms ?? {};
      const likes =
        (platforms.hn?.points ?? 0) +
        (platforms.reddit?.ups ?? 0) +
        (platforms.substack?.likes ?? 0);
      const comments =
        (platforms.hn?.comments ?? 0) +
        (platforms.reddit?.comments ?? 0) +
        (platforms.substack?.comments ?? 0);
      const engagementScore =
        (platforms.hn ? platforms.hn.points + 2 * platforms.hn.comments : 0) +
        (platforms.reddit
          ? platforms.reddit.ups + 2 * platforms.reddit.comments
          : 0) +
        (platforms.substack
          ? platforms.substack.likes + 3 * platforms.substack.comments
          : 0);

      return {
        id: idFromCanonicalUrl(article.url),
        title: article.title,
        excerpt: article.excerpt,
        author: article.author || article.sourceName,
        sourceSlug: slugForHost(host),
        sourceName: article.sourceName || nameFromHost(host),
        url: article.url,
        publishedAt: article.publishedAt,
        category: categoryForHost(host),
        readingMinutes: estimateReadingMinutes(article),
        likes,
        comments,
        engagementScore,
        ...(article.coverImage ? { coverImage: article.coverImage } : {}),
        platforms
      } satisfies Article;
    })
    .filter((article) => article.url && article.title && article.engagementScore > 0)
    .sort((a, b) => b.engagementScore - a.engagementScore);
}

function deriveSources(articles: Article[]) {
  const sources = new Map<string, Source>();

  for (const source of SUBSTACK_SOURCES) {
    const host = getHost(source.baseUrl);
    if (!host) {
      continue;
    }

    sources.set(slugForHost(host), {
      slug: slugForHost(host),
      name: source.name,
      author: source.author,
      platform: "substack",
      baseUrl: source.baseUrl,
      subscribeUrl: `${source.baseUrl.replace(/\/$/, "")}/subscribe`,
      category: categoryForHost(host),
      host,
      count: 0
    });
  }

  for (const article of articles) {
    const host = getHost(article.url);
    if (!host) {
      continue;
    }

    const slug = slugForHost(host);
    const existing = sources.get(slug);
    if (existing) {
      existing.count = (existing.count ?? 0) + 1;
      existing.name = DOMAIN_DISPLAY_NAME[host] || existing.name;
      continue;
    }

    sources.set(slug, {
      slug,
      name: DOMAIN_DISPLAY_NAME[host] || article.sourceName || nameFromHost(host),
      author: article.author || nameFromHost(host),
      platform: "rss",
      baseUrl: `https://${host}`,
      subscribeUrl: `https://${host}`,
      category: categoryForHost(host),
      host,
      count: 1
    });
  }

  return Array.from(sources.values()).sort((a, b) => {
    const countDiff = (b.count ?? 0) - (a.count ?? 0);
    return countDiff || a.name.localeCompare(b.name);
  });
}

function mergeWorkingArticle(target: WorkingArticle, incoming: WorkingArticle) {
  target.title = richerText(target.title, incoming.title, "title");
  target.excerpt = richerText(target.excerpt, incoming.excerpt, "excerpt");
  target.author = richerText(target.author, incoming.author, "short");
  target.sourceName = richerText(target.sourceName, incoming.sourceName, "short");
  target.coverImage = target.coverImage || incoming.coverImage;
  if (isAfter(incoming.publishedAt, target.publishedAt)) {
    target.publishedAt = incoming.publishedAt;
  }

  if (incoming.platforms?.hn) {
    mergeHn(target, incoming.platforms.hn);
  }
  if (incoming.platforms?.reddit) {
    mergeReddit(target, incoming.platforms.reddit);
  }
  if (incoming.platforms?.substack) {
    mergeSubstack(target, incoming.platforms.substack);
  }
}

function mergePlatformSignals(article: WorkingArticle, input: CandidateInput) {
  if (input.hn) {
    mergeHn(article, input.hn);
  }
  if (input.reddit) {
    mergeReddit(article, input.reddit);
  }
  if (input.substack) {
    mergeSubstack(article, input.substack);
  }
}

function mergeHn(article: WorkingArticle, signal: NonNullable<PlatformSignals["hn"]>) {
  const current = article.platforms?.hn;
  article.platforms = article.platforms ?? {};
  article.platforms.hn = {
    points: (current?.points ?? 0) + signal.points,
    comments: (current?.comments ?? 0) + signal.comments,
    itemUrl:
      hnScore(signal) > (current ? hnScore(current) : 0)
        ? signal.itemUrl
        : current?.itemUrl ?? signal.itemUrl
  };
}

function mergeReddit(
  article: WorkingArticle,
  signal: NonNullable<PlatformSignals["reddit"]>
) {
  const current = article.platforms?.reddit;
  article.platforms = article.platforms ?? {};
  article.platforms.reddit = {
    ups: (current?.ups ?? 0) + signal.ups,
    comments: (current?.comments ?? 0) + signal.comments,
    subreddit:
      redditScore(signal) > (current ? redditScore(current) : 0)
        ? signal.subreddit
        : current?.subreddit ?? signal.subreddit,
    permalink:
      redditScore(signal) > (current ? redditScore(current) : 0)
        ? signal.permalink
        : current?.permalink ?? signal.permalink
  };
}

function mergeSubstack(
  article: WorkingArticle,
  signal: NonNullable<PlatformSignals["substack"]>
) {
  const current = article.platforms?.substack;
  article.platforms = article.platforms ?? {};
  article.platforms.substack = {
    likes: (current?.likes ?? 0) + signal.likes,
    comments: (current?.comments ?? 0) + signal.comments
  };
}

function canonicalUrl(value: string) {
  const url = new URL(value);
  url.protocol = "https:";
  url.hostname = normalizeHost(url.hostname);
  url.hash = "";

  for (const key of Array.from(url.searchParams.keys())) {
    const lower = key.toLowerCase();
    if (lower.startsWith("utm_") || TRACKING_PARAMS.includes(lower)) {
      url.searchParams.delete(key);
    }
  }

  url.searchParams.sort();

  const withoutTrailingSlash = url.toString().replace(/\/$/, "");
  return withoutTrailingSlash;
}

function toOutboundUrl(value: string, preferredHost?: string) {
  const url = new URL(value);
  url.protocol = "https:";
  url.hostname = preferredHost
    ? preferredHost.toLowerCase()
    : url.hostname.toLowerCase();
  url.hash = "";

  for (const key of Array.from(url.searchParams.keys())) {
    const lower = key.toLowerCase();
    if (lower.startsWith("utm_") || TRACKING_PARAMS.includes(lower)) {
      url.searchParams.delete(key);
    }
  }

  url.searchParams.sort();
  return url.toString().replace(/\/$/, "");
}

function getHost(
  value: string,
  options: {
    preservePrefix?: boolean;
  } = {}
) {
  try {
    const host = new URL(value).hostname.toLowerCase();
    return options.preservePrefix ? host : normalizeHost(host);
  } catch {
    return undefined;
  }
}

function normalizeHost(host: string) {
  return host.toLowerCase().replace(/^www\./, "").replace(/^m\./, "");
}

function categoryForHost(host: string): Category {
  return DOMAIN_CATEGORY[normalizeHost(host)] ?? "Ideas";
}

function slugForHost(host: string) {
  return normalizeHost(host).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function idFromCanonicalUrl(value: string) {
  return slugForHost(value.replace(/^https?:\/\//, ""));
}

function nameFromHost(host: string) {
  const normalizedHost = normalizeHost(host);
  if (DOMAIN_DISPLAY_NAME[normalizedHost]) {
    return DOMAIN_DISPLAY_NAME[normalizedHost];
  }

  const withoutTld = normalizedHost.split(".").slice(0, -1).join(" ");
  return withoutTld
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function cleanText(value?: string | null) {
  return value?.replace(/\s+/g, " ").trim() ?? "";
}

function richerText(
  current: string | undefined,
  incoming: string | undefined,
  mode: "title" | "excerpt" | "short"
) {
  const oldValue = cleanText(current);
  const newValue = cleanText(incoming);
  if (!newValue) {
    return oldValue;
  }
  if (!oldValue || oldValue === "Untitled") {
    return newValue;
  }
  if (mode === "short") {
    return oldValue.length <= newValue.length ? oldValue : newValue;
  }
  if (mode === "title") {
    return newValue.length > oldValue.length && newValue.length < 140
      ? newValue
      : oldValue;
  }
  return newValue.length > oldValue.length ? newValue : oldValue;
}

function truncate(value: string, length: number) {
  if (value.length <= length) {
    return value;
  }
  return `${value.slice(0, length - 1).trim()}…`;
}

function estimateReadingMinutes(article: WorkingArticle) {
  const words = `${article.title} ${article.excerpt}`.split(/\s+/).filter(Boolean)
    .length;
  return Math.max(3, Math.min(18, Math.round(words / 35) + 4));
}

function isAfter(value: string, current: string) {
  return new Date(value).getTime() > new Date(current).getTime();
}

function hnScore(signal: NonNullable<PlatformSignals["hn"]>) {
  return signal.points + 2 * signal.comments;
}

function redditScore(signal: NonNullable<PlatformSignals["reddit"]>) {
  return signal.ups + 2 * signal.comments;
}

function meta(
  $: ReturnType<typeof load>,
  attr: "name" | "property",
  value: string
) {
  return cleanText($(`meta[${attr}='${value}']`).attr("content"));
}

function absolutize(value: string | undefined, base: string) {
  if (!value) {
    return undefined;
  }
  try {
    return new URL(value, base).toString();
  } catch {
    return undefined;
  }
}

async function fetchJson<T>(url: string, init?: RequestInit) {
  const response = await fetchWithTimeout(url, {
    ...init,
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "application/json",
      ...(init?.headers ?? {})
    },
    timeoutMs: 12000
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return (await response.json()) as T;
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit & { timeoutMs: number }
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), init.timeoutMs);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function readMetaCache(): Promise<MetaCache> {
  try {
    return JSON.parse(await readFile(META_CACHE_PATH, "utf8")) as MetaCache;
  } catch {
    return {};
  }
}

async function writeJson(filePath: string, value: unknown) {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

async function mapLimit<T, R>(
  values: T[],
  limit: number,
  worker: (value: T) => Promise<R>
) {
  const results: R[] = [];
  let nextIndex = 0;

  async function run() {
    while (nextIndex < values.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await worker(values[index]);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, values.length) }, () => run())
  );
  return results;
}

function emptyStats(): Stats {
  return {
    fetched: 0,
    kept: 0,
    errors: 0
  };
}

function logError(source: string, detail: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.warn(`[${source}] ${detail}: ${message}`);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type HnHit = {
  title?: string;
  url?: string;
  points?: number;
  num_comments?: number;
  author?: string;
  created_at?: string;
  objectID?: string;
};

type RedditResponse = {
  data?: {
    children?: Array<{
      data: RedditPost;
    }>;
  };
};

type RedditPost = {
  id?: string;
  title?: string;
  is_self?: boolean;
  url?: string;
  url_overridden_by_dest?: string;
  ups?: number;
  num_comments?: number;
  created_utc?: number;
  permalink?: string;
  subreddit: string;
};

type SubstackPost = {
  title?: string;
  subtitle?: string;
  description?: string;
  search_engine_description?: string;
  canonical_url?: string;
  web_url?: string;
  url?: string;
  share_url?: string;
  post_date?: string;
  reaction_count?: number;
  comment_count?: number;
  cover_image?: string;
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
