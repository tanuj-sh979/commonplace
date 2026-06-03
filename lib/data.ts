import { readFileSync } from "node:fs";
import path from "node:path";
import type { Article, CanonGroup, Category, Source } from "@/lib/types";

export const categories: Category[] = [
  "Original Thinking",
  "Attention & Tech",
  "Meaning & Living",
  "Creativity",
  "Agency",
  "Learning",
  "Relationships",
  "Ideas"
];

export const sources = readDataFile<Source[]>("sources.json", []);
export const articles = readDataFile<Article[]>("articles.json", []);
export const top100Articles = readDataFile<Article[]>("top100.json", []).length
  ? readDataFile<Article[]>("top100.json", [])
  : getTopArticles(articles);
export const canon = readDataFile<CanonGroup[]>("canon.json", []);

export function getTopArticles(items: Article[] = articles) {
  return [...items]
    .sort((a, b) => b.engagementScore - a.engagementScore)
    .slice(0, 100);
}

export function getLatestArticles(items: Article[] = articles) {
  return [...items].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getSourceBySlug(slug: string) {
  return sources.find((source) => source.slug === slug);
}

export function getArticlesBySource(slug: string) {
  return getTopArticles(articles.filter((article) => article.sourceSlug === slug));
}

function readDataFile<T>(fileName: string, fallback: T) {
  try {
    const filePath = path.join(process.cwd(), "data", fileName);
    const raw = readFileSync(filePath, "utf8").trim();

    if (!raw) {
      return fallback;
    }

    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
