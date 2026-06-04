import type { Category } from "@/lib/types";

type CategoryTone = {
  card: string;
  thumbnail: string;
  pill: string;
  eyebrow: string;
};

const tones: Record<Category, CategoryTone> = {
  "Original Thinking": {
    card: "border-[#E5D7C8] bg-[#FFF8F1]",
    thumbnail: "border-[#E5D7C8] bg-[#F7F1EA]",
    pill: "border-[#D7C8B8] bg-[#FFF8F1] text-clay",
    eyebrow: "text-clay"
  },
  "Attention & Tech": {
    card: "border-[#DDE2E2] bg-[#F7F9F9]",
    thumbnail: "border-[#DDE2E2] bg-[#EEF3F3]",
    pill: "border-[#DDE2E2] bg-[#F7F9F9] text-[#5F6D72]",
    eyebrow: "text-[#5F6D72]"
  },
  "Meaning & Living": {
    card: "border-[#EAD8D1] bg-[#FFF5F2]",
    thumbnail: "border-[#EAD8D1] bg-[#F8ECE8]",
    pill: "border-[#EAD8D1] bg-[#FFF5F2] text-[#A86548]",
    eyebrow: "text-[#A86548]"
  },
  Creativity: {
    card: "border-[#DDE4D5] bg-[#F6F8F2]",
    thumbnail: "border-[#DDE4D5] bg-[#EEF3E8]",
    pill: "border-[#DDE4D5] bg-[#F6F8F2] text-sage",
    eyebrow: "text-sage"
  },
  Agency: {
    card: "border-[#E6D8C2] bg-[#FFF9ED]",
    thumbnail: "border-[#E6D8C2] bg-[#F7EEDC]",
    pill: "border-[#E6D8C2] bg-[#FFF9ED] text-[#8B6742]",
    eyebrow: "text-[#8B6742]"
  },
  Learning: {
    card: "border-[#E8E1D8] bg-[#FFFDF8]",
    thumbnail: "border-[#E8E1D8] bg-[#F4F1EC]",
    pill: "border-[#E8E1D8] bg-[#FFFDF8] text-clay",
    eyebrow: "text-clay"
  },
  Relationships: {
    card: "border-[#E8D8D8] bg-[#FFF7F7]",
    thumbnail: "border-[#E8D8D8] bg-[#F8EEEE]",
    pill: "border-[#E8D8D8] bg-[#FFF7F7] text-[#9B5F5B]",
    eyebrow: "text-[#9B5F5B]"
  },
  Ideas: {
    card: "border-rule bg-paper",
    thumbnail: "border-rule bg-surface-muted",
    pill: "border-rule bg-paper text-clay",
    eyebrow: "text-clay"
  }
};

export function getCategoryTone(category: Category): CategoryTone {
  return tones[category] ?? tones.Ideas;
}
