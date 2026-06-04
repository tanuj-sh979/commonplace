"use client";

/* eslint-disable @next/next/no-img-element */
import { useMemo, useState } from "react";
import { getCategoryTone } from "@/lib/category-style";
import type { Category } from "@/lib/types";

type ArticleThumbnailProps = {
  src?: string;
  title: string;
  sourceName: string;
  category: Category;
  className?: string;
};

export function ArticleThumbnail({
  src,
  title,
  sourceName,
  category,
  className = ""
}: ArticleThumbnailProps) {
  const [failed, setFailed] = useState(false);
  const initials = useMemo(() => sourceInitials(sourceName || title), [sourceName, title]);
  const imageSrc = src && !failed ? src : undefined;
  const tone = getCategoryTone(category);

  return (
    <div className={`relative overflow-hidden border ${tone.thumbnail} ${className}`}>
      {imageSrc ? (
        <img
          src={imageSrc}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.015]"
        />
      ) : (
        <div className="flex h-full min-h-40 w-full items-center justify-center px-6 text-center">
          <div>
            <p className="text-4xl font-extrabold leading-none tracking-[-0.04em] text-clay/80">
              {initials}
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              {category}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function sourceInitials(value: string) {
  const parts = value
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return "C";
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
