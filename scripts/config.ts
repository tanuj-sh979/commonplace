import type { Category } from "../lib/types";

export const ALLOWLIST = [
  "paulgraham.com",
  "waitbutwhy.com",
  "aeon.co",
  "nautil.us",
  "quantamagazine.org",
  "noemamag.com",
  "lesswrong.com",
  "astralcodexten.com",
  "slatestarcodex.com",
  "experimental-history.com",
  "henrikkarlsson.xyz",
  "moretothat.com",
  "home.moretothat.com",
  "avabear.xyz",
  "honest-broker.com",
  "freyaindia.co.uk",
  "ribbonfarm.com",
  "themarginalian.org",
  "collabfund.com",
  "jamesclear.com",
  "fs.blog",
  "nesslabs.com",
  "theparisreview.org",
  "longreads.com",
  "edge.org",
  "theatlantic.com",
  "newyorker.com"
] as const;

export const DOMAIN_CATEGORY: Record<string, Category> = {
  "paulgraham.com": "Original Thinking",
  "waitbutwhy.com": "Original Thinking",
  "aeon.co": "Meaning & Living",
  "nautil.us": "Learning",
  "quantamagazine.org": "Learning",
  "noemamag.com": "Original Thinking",
  "lesswrong.com": "Learning",
  "astralcodexten.com": "Original Thinking",
  "slatestarcodex.com": "Original Thinking",
  "experimental-history.com": "Original Thinking",
  "henrikkarlsson.xyz": "Meaning & Living",
  "moretothat.com": "Meaning & Living",
  "home.moretothat.com": "Meaning & Living",
  "avabear.xyz": "Relationships",
  "honest-broker.com": "Creativity",
  "freyaindia.co.uk": "Attention & Tech",
  "ribbonfarm.com": "Original Thinking",
  "themarginalian.org": "Meaning & Living",
  "collabfund.com": "Agency",
  "jamesclear.com": "Agency",
  "fs.blog": "Learning",
  "nesslabs.com": "Learning",
  "theparisreview.org": "Creativity",
  "longreads.com": "Creativity",
  "edge.org": "Original Thinking",
  "theatlantic.com": "Ideas",
  "newyorker.com": "Ideas"
};

export const SUBSTACK_SOURCES = [
  {
    name: "Escaping Flatland",
    author: "Henrik Karlsson",
    baseUrl: "https://www.henrikkarlsson.xyz"
  },
  {
    name: "More To That",
    author: "Lawrence Yeo",
    baseUrl: "https://home.moretothat.com"
  },
  {
    name: "Experimental History",
    author: "Adam Mastroianni",
    baseUrl: "https://www.experimental-history.com"
  },
  {
    name: "bookbear express",
    author: "Ava",
    baseUrl: "https://www.avabear.xyz"
  },
  {
    name: "The Honest Broker",
    author: "Ted Gioia",
    baseUrl: "https://www.honest-broker.com"
  },
  {
    name: "GIRLS",
    author: "Freya India",
    baseUrl: "https://www.freyaindia.co.uk"
  }
] as const;

export const SUBREDDITS = [
  "TrueReddit",
  "foodforthought",
  "philosophy",
  "Essays",
  "slatestarcodex",
  "longform"
] as const;
