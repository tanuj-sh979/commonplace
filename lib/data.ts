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
const top100Data = readDataFile<Article[]>("top100.json", []);
export const top100Articles = top100Data.length
  ? top100Data
  : getTopArticles(articles);
export const canon = readDataFile<CanonGroup[]>("canon.json", []);

export const categoryDescriptions: Record<Category, string> = {
  "Original Thinking":
    "Essays on building, ambition, taste, technology, and independent thought.",
  "Attention & Tech":
    "Essays on focus, media, platforms, AI, and the texture of modern attention.",
  "Meaning & Living":
    "Essays on time, relationships, attention, money, and how to live.",
  Creativity:
    "Essays on art, writing, practice, taste, and the conditions for original work.",
  Agency:
    "Essays on discipline, leverage, decisions, habits, and acting with intent.",
  Learning:
    "Essays on knowledge, science, education, memory, and better ways to understand.",
  Relationships:
    "Essays on friendship, intimacy, family, social life, and the work of being with others.",
  Ideas:
    "Essays and arguments that resist easy categorization but reward a patient read."
};

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

export function slugifyCategory(category: Category) {
  return category
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => {
    const categorySlug = slugifyCategory(category);
    const legacySlug = category
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    return categorySlug === slug || legacySlug === slug;
  });
}

export function getArticlesByCategory(category: Category) {
  return [...articles]
    .filter((article) => article.category === category)
    .sort((a, b) => b.engagementScore - a.engagementScore);
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
