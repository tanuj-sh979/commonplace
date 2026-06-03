# Commonplace

Commonplace is a minimal, read-only editorial library for essays and newsletters. Articles are ranked by engagement gathered from places where the internet already discusses and sorts long-form writing: Hacker News, Reddit, and curated Substack sources.

## Local Setup

```bash
npm install
npm run ingest
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

## Ingestion

`npm run ingest` runs [scripts/ingest.ts](./scripts/ingest.ts), which:

- fetches public Hacker News Algolia story data;
- fetches public Reddit subreddit JSON where available;
- fetches curated Substack post APIs;
- canonicalizes and dedupes URLs;
- caches head-only metadata in `data/_meta-cache.json`;
- writes `data/articles.json`, `data/top100.json`, and `data/sources.json`.

The ranking is a blended engagement score:

```text
HN:       points + 2 * comments
Reddit:   upvotes + 2 * comments
Substack: likes + 3 * comments
```

Tune quality and breadth in [scripts/config.ts](./scripts/config.ts):

- `ALLOWLIST` controls which domains are admitted.
- `DOMAIN_CATEGORY` maps domains to display categories.
- `SUBSTACK_SOURCES` controls curated Substack sources.
- `SUBREDDITS` controls Reddit coverage.

The scraper stores only titles, excerpts, source metadata, engagement counts, and outbound links. It does not store article text.

## Deployment

This is a standard Next.js 14 App Router app and deploys cleanly on Vercel. The app reads committed JSON from `/data`, so production deploys are deterministic: refresh data, commit the generated JSON, and Vercel serves the updated static pages on the next deployment.

The included GitHub Action runs daily, executes `npm run ingest`, commits changed `/data` files, and pushes them back to the repository.
