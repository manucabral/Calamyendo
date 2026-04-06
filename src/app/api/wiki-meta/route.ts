import { NextResponse } from "next/server";

type WikiSource = "calamity" | "terraria";

interface WikiMetaRequestEntry {
  title: string;
  source: WikiSource;
}

interface WikiMetaPayload {
  entries?: WikiMetaRequestEntry[];
}

interface WikiMetaResult {
  title: string;
  source: WikiSource;
  pageUrl: string;
  imageUrl?: string;
  summary?: string;
  combatTip?: string;
  acquisitionHint?: string;
  acquisitionTags?: string[];
}

const HOSTS: Record<WikiSource, string> = {
  calamity: "https://calamitymod.wiki.gg",
  terraria: "https://terraria.wiki.gg",
};

const cache = new Map<string, WikiMetaResult>();

const IMAGE_BLOCKLIST = [
  "Desktop_only",
  "Console_only",
  "Mobile_only",
  "Switch_only",
  "Expert_Indicator",
  "Classic_mode",
  "Classic_Mode",
  "Expert_mode",
  "Master_mode",
  "Stack_digit",
  "Rarity_color",
  "Map_Icon",
  "Bestiary_",
  "Nintendo_Switch",
  "3DS",
  "Metadata_Indicator",
  "Master_Indicator",
  "borderless",
  "Inventory_Background",
  "Journey_Mode",
  "Journey_mode",
];

function keyFor(entry: WikiMetaRequestEntry): string {
  return `${entry.source}:${entry.title.toLowerCase()}`;
}

function normalizeTitleForImage(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[,'().:]/g, "")
    .replace(/\s+/g, "_")
    .toLowerCase();
}

function pickImageName(title: string, images: string[]): string | undefined {
  const preferred = normalizeTitleForImage(title);
  const sorted = images.filter(
    (name) => !IMAGE_BLOCKLIST.some((token) => name.includes(token)),
  );

  const exact = sorted.find(
    (name) =>
      normalizeTitleForImage(name.replace(/\.[^.]+$/, "")) === preferred,
  );
  if (exact) {
    return exact;
  }

  const startsWith = sorted.find((name) =>
    normalizeTitleForImage(name.replace(/\.[^.]+$/, "")).startsWith(preferred),
  );
  if (startsWith) {
    return startsWith;
  }

  return sorted.find((name) => /\.(png|gif|webp|jpg|jpeg)$/i.test(name));
}

function toAbsoluteImageUrl(src: string, host: string): string {
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }
  if (src.startsWith("/")) {
    return `${host}${src}`;
  }
  return `${host}/${src}`;
}

function extractImageFromHtml(html: string, host: string): string | undefined {
  const matches = Array.from(html.matchAll(/<img[^>]*src="([^"]+)"[^>]*>/gi));

  for (const match of matches) {
    const rawSrc = match[1] ?? "";
    const decodedSrc = decodeHtmlEntities(rawSrc);
    const absolute = toAbsoluteImageUrl(decodedSrc, host);

    const blocked = IMAGE_BLOCKLIST.some((token) =>
      absolute.toLowerCase().includes(token.toLowerCase()),
    );
    if (blocked) {
      continue;
    }

    if (!/\.(png|gif|webp|jpg|jpeg)(\?|$)/i.test(absolute)) {
      continue;
    }

    return absolute;
  }

  return undefined;
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function extractSummary(html: string): string | undefined {
  const paragraphs = html.match(/<p>[\s\S]*?<\/p>/gi) ?? [];

  for (const paragraph of paragraphs) {
    const noSup = paragraph.replace(/<sup[\s\S]*?<\/sup>/gi, "");
    const clean = decodeHtmlEntities(
      noSup
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim(),
    );
    if (clean.length > 45) {
      return clean.slice(0, 220);
    }
  }

  return undefined;
}

function extractFirstSentence(
  text: string,
  maxLen: number,
): string | undefined {
  const clean = decodeHtmlEntities(
    text
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
  if (!clean) return undefined;

  const firstSentence = clean.split(/(?<=[.!?])\s+/)[0] ?? clean;
  if (!firstSentence) return undefined;

  return firstSentence.length > maxLen
    ? `${firstSentence.slice(0, maxLen - 1).trimEnd()}...`
    : firstSentence;
}

function sectionRegex(id: string): RegExp {
  // Matches content after the heading until next h2/h3 section.
  return new RegExp(
    `<h[23][^>]*>[\\s\\S]*?<span[^>]*id=["']${id}["'][^>]*>[\\s\\S]*?<\\/h[23]>([\\s\\S]*?)(?=<h[23][^>]*>|$)`,
    "i",
  );
}

function extractCombatTipFromHtml(html: string): string | undefined {
  const tipSectionIds = [
    "Tips",
    "Strategy",
    "Strategies",
    "Behavior",
    "Attacks",
    "Tactics",
  ];

  for (const id of tipSectionIds) {
    const match = html.match(sectionRegex(id));
    const section = match?.[1];
    if (!section) continue;

    const paragraph = section.match(/<p>[\s\S]*?<\/p>/i)?.[0];
    if (!paragraph) continue;

    const sentence = extractFirstSentence(paragraph, 170);
    if (sentence && sentence.length >= 24) {
      return sentence;
    }
  }

  return undefined;
}

function extractAcquisitionFromHtml(
  html: string,
  summary?: string,
): { hint?: string; tags: string[] } {
  const corpus =
    `${summary ?? ""} ${decodeHtmlEntities(html.replace(/<[^>]+>/g, " "))}`.toLowerCase();
  const tags: string[] = [];

  if (/(crafted|crafting|crafted at|recipe)/i.test(corpus)) {
    tags.push("crafted");
  }
  if (/(dropped by|drop chance|drops from|dropped from)/i.test(corpus)) {
    tags.push("drop");
  }
  if (/(sold by|purchase|bought from|vendor|merchant)/i.test(corpus)) {
    tags.push("sold");
  }
  if (/(found in chest|chest|found in|loot)/i.test(corpus)) {
    tags.push("chest");
  }
  if (/(fishing|fished|caught while fishing)/i.test(corpus)) {
    tags.push("fishing");
  }
  if (/(quest|reward)/i.test(corpus)) {
    tags.push("reward");
  }

  const uniq = Array.from(new Set(tags));
  const hint = uniq.length ? `Acquisition: ${uniq.join(" / ")}` : undefined;
  return { hint, tags: uniq };
}

async function resolveWikiMeta(
  entry: WikiMetaRequestEntry,
): Promise<WikiMetaResult> {
  const cacheKey = keyFor(entry);
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const host = HOSTS[entry.source];
  const parseUrl = `${host}/api.php?action=parse&format=json&page=${encodeURIComponent(entry.title)}&prop=text|images`;

  const parseResponse = await fetch(parseUrl, {
    next: { revalidate: 3600 },
  });

  if (!parseResponse.ok) {
    const fallback: WikiMetaResult = {
      title: entry.title,
      source: entry.source,
      pageUrl: `${host}/wiki/${encodeURIComponent(entry.title.replace(/\s+/g, "_"))}`,
    };
    cache.set(cacheKey, fallback);
    return fallback;
  }

  const parseJson = (await parseResponse.json()) as {
    parse?: {
      title?: string;
      text?: { "*": string };
      images?: string[];
    };
  };

  const resolvedTitle = parseJson.parse?.title ?? entry.title;
  const pageUrl = `${host}/wiki/${encodeURIComponent(resolvedTitle.replace(/\s+/g, "_"))}`;
  const images = parseJson.parse?.images ?? [];
  const imageName = pickImageName(resolvedTitle, images);
  const html = parseJson.parse?.text?.["*"] ?? "";

  let imageUrl: string | undefined = html
    ? extractImageFromHtml(html, host)
    : undefined;
  if (imageName) {
    const imageInfoUrl = `${host}/api.php?action=query&format=json&titles=${encodeURIComponent(
      `File:${imageName}`,
    )}&prop=imageinfo&iiprop=url`;

    const imageInfoResponse = await fetch(imageInfoUrl, {
      next: { revalidate: 3600 },
    });

    if (imageInfoResponse.ok) {
      const imageInfoJson = (await imageInfoResponse.json()) as {
        query?: {
          pages?: Record<string, { imageinfo?: Array<{ url?: string }> }>;
        };
      };

      const pages = imageInfoJson.query?.pages ?? {};
      const firstPage = Object.values(pages)[0];
      imageUrl = imageUrl ?? firstPage?.imageinfo?.[0]?.url;
    }
  }

  const summary = html ? extractSummary(html) : undefined;
  const combatTip = html ? extractCombatTipFromHtml(html) : undefined;
  const acquisition = extractAcquisitionFromHtml(html, summary);

  const result: WikiMetaResult = {
    title: resolvedTitle,
    source: entry.source,
    pageUrl,
    imageUrl,
    summary,
    combatTip,
    acquisitionHint: acquisition.hint,
    acquisitionTags: acquisition.tags,
  };

  cache.set(cacheKey, result);
  return result;
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as WikiMetaPayload;
  const entries = Array.isArray(payload.entries) ? payload.entries : [];

  const uniqueEntries: WikiMetaRequestEntry[] = [];
  const seen = new Set<string>();

  for (const raw of entries) {
    const title = typeof raw?.title === "string" ? raw.title.trim() : "";
    const source = raw?.source;
    if (!title || (source !== "calamity" && source !== "terraria")) {
      continue;
    }

    const normalized: WikiMetaRequestEntry = { title, source };
    const key = keyFor(normalized);
    if (!seen.has(key)) {
      seen.add(key);
      uniqueEntries.push(normalized);
    }
  }

  const capped = uniqueEntries.slice(0, 120);
  const results = await Promise.all(
    capped.map((entry) => resolveWikiMeta(entry)),
  );

  return NextResponse.json({ results });
}
