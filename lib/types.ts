export type Category =
  | "Original Thinking"
  | "Attention & Tech"
  | "Meaning & Living"
  | "Creativity"
  | "Agency"
  | "Learning"
  | "Relationships"
  | "Ideas";

export type PlatformSignals = {
  hn?: {
    points: number;
    comments: number;
    itemUrl: string;
  };
  reddit?: {
    ups: number;
    comments: number;
    subreddit: string;
    permalink: string;
  };
  substack?: {
    likes: number;
    comments: number;
  };
};

export type Source = {
  slug: string;
  name: string;
  author: string;
  platform: "substack" | "rss";
  baseUrl: string;
  subscribeUrl: string;
  category: Category;
  host?: string;
  count?: number;
};

export type Article = {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  sourceSlug: string;
  sourceName: string;
  url: string;
  publishedAt: string;
  category: Category;
  readingMinutes?: number;
  likes: number;
  comments: number;
  engagementScore: number;
  coverImage?: string;
  platforms?: PlatformSignals;
};

export type CanonItem = {
  title: string;
  url: string;
  sourceName: string;
};

export type CanonGroup = {
  author: string;
  items: CanonItem[];
};
