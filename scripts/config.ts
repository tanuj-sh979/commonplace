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
  "sive.rs",
  "kk.org",
  "patrickcollison.com",
  "a16z.com",
  "pmarchive.com",
  "cdixon.org",
  "worrydream.com",
  "gwern.net",
  "markmanson.net",
  "marginalrevolution.com",
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
  "sive.rs": "Agency",
  "kk.org": "Original Thinking",
  "patrickcollison.com": "Agency",
  "a16z.com": "Agency",
  "pmarchive.com": "Agency",
  "cdixon.org": "Original Thinking",
  "worrydream.com": "Creativity",
  "gwern.net": "Learning",
  "markmanson.net": "Meaning & Living",
  "marginalrevolution.com": "Ideas",
  "nesslabs.com": "Learning",
  "theparisreview.org": "Creativity",
  "longreads.com": "Creativity",
  "edge.org": "Original Thinking",
  "theatlantic.com": "Ideas",
  "newyorker.com": "Ideas"
};

export const DOMAIN_DISPLAY_NAME: Record<string, string> = {
  "paulgraham.com": "Paul Graham",
  "waitbutwhy.com": "Wait But Why",
  "aeon.co": "Aeon",
  "nautil.us": "Nautilus",
  "quantamagazine.org": "Quanta Magazine",
  "noemamag.com": "NOEMA",
  "lesswrong.com": "LessWrong",
  "astralcodexten.com": "Astral Codex Ten",
  "slatestarcodex.com": "Slate Star Codex",
  "experimental-history.com": "Experimental History",
  "henrikkarlsson.xyz": "Escaping Flatland",
  "moretothat.com": "More To That",
  "home.moretothat.com": "More To That",
  "avabear.xyz": "bookbear express",
  "honest-broker.com": "The Honest Broker",
  "freyaindia.co.uk": "GIRLS",
  "ribbonfarm.com": "Ribbonfarm",
  "themarginalian.org": "The Marginalian",
  "collabfund.com": "Collaborative Fund",
  "jamesclear.com": "James Clear",
  "fs.blog": "Farnam Street",
  "sive.rs": "Derek Sivers",
  "kk.org": "Kevin Kelly / The Technium",
  "patrickcollison.com": "Patrick Collison",
  "a16z.com": "Andreessen Horowitz",
  "pmarchive.com": "Marc Andreessen Archive",
  "cdixon.org": "Chris Dixon",
  "worrydream.com": "Bret Victor",
  "gwern.net": "Gwern",
  "markmanson.net": "Mark Manson",
  "marginalrevolution.com": "Marginal Revolution",
  "nesslabs.com": "Ness Labs",
  "theparisreview.org": "The Paris Review",
  "longreads.com": "Longreads",
  "edge.org": "Edge",
  "theatlantic.com": "The Atlantic",
  "newyorker.com": "The New Yorker"
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
