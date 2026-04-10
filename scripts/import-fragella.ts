import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import * as fs from "fs";
import * as path from "path";

// ─── Database Setup ──────────────────────────────────
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const API_KEY = process.env.FRAGELLA_API_KEY!;
const BASE_URL = "https://api.fragella.com/api/v1";
const JSON_PATH = path.join(__dirname, "seed-data", "fragella-import.json");

// ─── Search Queries ──────────────────────────────────
const searches = [
  // Arabian brands
  { query: "Lattafa", limit: 50 },
  { query: "Amouage", limit: 30 },
  { query: "Swiss Arabian", limit: 20 },
  { query: "Al Haramain", limit: 30 },
  { query: "Rasasi", limit: 20 },
  { query: "Arabian Oud", limit: 20 },
  // Niche
  { query: "Maison Francis Kurkdjian", limit: 20 },
  { query: "Parfums de Marly", limit: 20 },
  { query: "Initio", limit: 15 },
  { query: "Montale", limit: 30 },
  { query: "Mancera", limit: 30 },
  { query: "Nishane", limit: 20 },
  // Designer
  { query: "Tom Ford", limit: 30 },
  { query: "Chanel", limit: 20 },
  { query: "Dior", limit: 20 },
  { query: "Creed", limit: 15 },
  { query: "Xerjoff", limit: 20 },
  { query: "Kilian", limit: 15 },
];

// ─── Mapping Helpers ─────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mapConcentration(oilType: string | undefined): string {
  if (!oilType) return "EDP";
  const lower = oilType.toLowerCase();
  if (lower.includes("extrait") || lower.includes("parfum") && !lower.includes("eau")) return "Extrait";
  if (lower.includes("eau de parfum") || lower === "edp") return "EDP";
  if (lower.includes("eau de toilette") || lower === "edt") return "EDT";
  if (lower.includes("eau de cologne") || lower === "edc") return "EDC";
  if (lower.includes("eau fraiche")) return "Eau Fraiche";
  if (lower.includes("parfum")) return "EDP";
  return "EDP";
}

function mapGender(gender: string | undefined): string {
  if (!gender) return "unisex";
  const lower = gender.toLowerCase();
  if (lower === "men" || lower === "male" || lower === "him" || lower === "masculine") return "male";
  if (lower === "women" || lower === "female" || lower === "her" || lower === "feminine") return "female";
  return "unisex";
}

function mapLongevity(longevity: string | undefined): number | null {
  if (!longevity) return null;
  const lower = longevity.toLowerCase();
  if (lower.includes("eternal")) return 10;
  if (lower.includes("very long")) return 9;
  if (lower.includes("long")) return 8;
  if (lower.includes("moderate")) return 6;
  if (lower.includes("weak")) return 4;
  if (lower.includes("poor") || lower.includes("very weak")) return 2;
  return null;
}

function mapSillage(sillage: string | undefined): string | null {
  if (!sillage) return null;
  const lower = sillage.toLowerCase();
  if (lower.includes("enormous")) return "Enormous";
  if (lower.includes("strong")) return "Strong";
  if (lower.includes("moderate")) return "Moderate";
  if (lower.includes("intimate") || lower.includes("soft") || lower.includes("gentle")) return "Intimate";
  return "Moderate";
}

function mapAccordIntensity(percentage: string | undefined): number {
  if (!percentage) return 50;
  const lower = percentage.toLowerCase();
  if (lower === "dominant") return 90;
  if (lower === "prominent") return 70;
  if (lower === "moderate") return 50;
  if (lower === "subtle") return 30;
  return 50;
}

// Default color for accords not in our existing list
const ACCORD_COLORS: Record<string, string> = {
  woody: "#8B6914",
  floral: "#E8A0BF",
  sweet: "#D4A574",
  "warm spicy": "#C4543E",
  vanilla: "#E8C98A",
  oud: "#5A3A1A",
  amber: "#D4944A",
  musky: "#B8A090",
  fresh: "#7CB9A8",
  citrus: "#E8D44A",
  aromatic: "#6B8E23",
  leather: "#654321",
  powdery: "#E8D8E8",
  smoky: "#696969",
  rose: "#C84B6A",
  fruity: "#E87461",
  balsamic: "#8B4513",
  gourmand: "#D2691E",
  green: "#4A7C59",
  aquatic: "#4A90D9",
  incense: "#8B7355",
  animalic: "#4A3728",
  earthy: "#6B5B3A",
  saffron: "#D4543A",
  resinous: "#A0522D",
  spicy: "#C4543E",
  oriental: "#C9A962",
  tobacco: "#7B5B3A",
  creamy: "#F5E6D3",
  nutty: "#A67C52",
  herbal: "#6B8E23",
  ozonic: "#87CEEB",
  marine: "#4682B4",
  tropical: "#FF6B35",
  coconut: "#F5F0E8",
  mossy: "#4A5D23",
  metallic: "#9E9E9E",
  "white floral": "#F0E6F6",
  honey: "#DAA520",
  coffee: "#6F4E37",
  chocolate: "#7B3F00",
  caramel: "#C68E17",
  patchouli: "#5C4033",
  iris: "#9370DB",
  lavender: "#967BB6",
  mineral: "#8F8F8F",
  cinnamon: "#D2691E",
  rum: "#8B4513",
};

function getAccordColor(name: string): string {
  return ACCORD_COLORS[name.toLowerCase()] ?? "#C9A962";
}

// Guess note family from note name
function guessNoteFamily(noteName: string): string {
  const lower = noteName.toLowerCase();
  // Floral
  if (/rose|jasmine|lily|iris|violet|peony|tuberose|magnolia|gardenia|neroli|ylang|osmanthus|orchid|freesia|geranium|heliotrope|carnation|chrysanthemum|frangipani|lotus|mimosa|orange blossom|champaca/.test(lower)) return "Floral";
  // Citrus
  if (/lemon|bergamot|orange|grapefruit|mandarin|lime|tangerine|yuzu|citron|pomelo|clementine|kumquat|blood orange/.test(lower)) return "Citrus";
  // Woody
  if (/cedar|sandalwood|oud|agarwood|pine|birch|teak|ebony|guaiac|rosewood|bamboo|driftwood|cypress|juniper|mahogany|oak/.test(lower)) return "Woody";
  // Spicy
  if (/cinnamon|pepper|clove|nutmeg|cardamom|ginger|saffron|cumin|coriander|star anise|anise|pink pepper|black pepper|white pepper/.test(lower)) return "Spicy";
  // Sweet / Gourmand
  if (/vanilla|caramel|chocolate|honey|toffee|praline|sugar|marshmallow|candy|cocoa|dulce|cookie|cake|cream|milk/.test(lower)) return "Gourmand";
  // Fruity
  if (/apple|peach|plum|berry|cherry|raspberry|strawberry|pear|apricot|fig|mango|pineapple|coconut|melon|banana|litchi|passion fruit|blackberry|blueberry|currant|pomegranate|grape|quince|date|watermelon/.test(lower)) return "Fruity";
  // Green / Herbal
  if (/basil|mint|thyme|rosemary|sage|tea|grass|leaf|green|bamboo|ivy|fig leaf|galbanum|violet leaf|tomato leaf/.test(lower)) return "Green";
  // Earthy / Mossy
  if (/moss|earth|vetiver|patchouli|mushroom|soil|truffle|forest/.test(lower)) return "Earthy";
  // Resinous / Balsamic
  if (/incense|frankincense|myrrh|benzoin|labdanum|olibanum|elemi|copal|resin|balsam|styrax|tolu/.test(lower)) return "Resinous";
  // Musky / Animalic
  if (/musk|ambergris|civet|castoreum|ambrette|ambroxan/.test(lower)) return "Musky";
  // Aquatic
  if (/ocean|sea|water|marine|aquatic|rain|ozone|seaweed|algae/.test(lower)) return "Aquatic";
  // Leather / Smoky
  if (/leather|suede|tobacco|smoke|birch tar|guaiac|cade/.test(lower)) return "Woody";
  // Aromatic
  if (/lavender|artemisia|tarragon|chamomile|absinthe|wormwood/.test(lower)) return "Aromatic";
  return "Woody"; // default fallback
}

// ─── API Fetch ───────────────────────────────────────

interface FragellaNote {
  name: string;
  imageUrl?: string;
}

interface FragellaPerfume {
  Name: string;
  Brand: string;
  Year?: string;
  rating?: string;
  Country?: string;
  "Image URL"?: string;
  Gender?: string;
  Price?: string;
  OilType?: string;
  Longevity?: string;
  Sillage?: string;
  "Main Accords"?: string[];
  "Main Accords Percentage"?: Record<string, string>;
  "Season Ranking"?: { name: string; score: number }[];
  Notes?: {
    Top?: FragellaNote[];
    Middle?: FragellaNote[];
    Base?: FragellaNote[];
  };
  "Image Fallbacks"?: string[];
  "Purchase URL"?: string;
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchFromAPI(): Promise<FragellaPerfume[]> {
  const allResults: FragellaPerfume[] = [];
  const seen = new Set<string>();

  console.log(`\n  Fetching from Fragella API (${searches.length} queries)...\n`);

  for (let i = 0; i < searches.length; i++) {
    const { query, limit } = searches[i];
    console.log(`  [${i + 1}/${searches.length}] Searching "${query}" (limit: ${limit})...`);

    try {
      const url = `${BASE_URL}/fragrances?search=${encodeURIComponent(query)}&limit=${limit}`;
      const response = await fetch(url, {
        headers: {
          "x-api-key": API_KEY,
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        console.error(`    ERROR: HTTP ${response.status} - ${response.statusText}`);
        const body = await response.text().catch(() => "");
        if (body) console.error(`    Response: ${body.substring(0, 200)}`);
        continue;
      }

      const data = await response.json();

      // API might return array directly or wrapped in an object
      const perfumes: FragellaPerfume[] = Array.isArray(data)
        ? data
        : data.results ?? data.data ?? data.fragrances ?? [];

      let newCount = 0;
      for (const perfume of perfumes) {
        const key = `${perfume.Brand}|${perfume.Name}`.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          allResults.push(perfume);
          newCount++;
        }
      }

      console.log(`    Found ${perfumes.length} results, ${newCount} new (total unique: ${allResults.length})`);
    } catch (err: any) {
      console.error(`    ERROR: ${err.message}`);
    }

    // Delay between requests to be respectful
    if (i < searches.length - 1) {
      await delay(2000);
    }
  }

  console.log(`\n  Total unique perfumes fetched: ${allResults.length}\n`);
  return allResults;
}

// ─── Data Transformation ─────────────────────────────

interface TransformedPerfume {
  name: string;
  slug: string;
  brand: string;
  brandSlug: string;
  brandCountry: string | null;
  year: number | null;
  gender: string;
  concentration: string;
  imageUrl: string | null;
  description: string | null;
  longevity: number | null;
  sillage: string | null;
  price: string | null;
  purchaseUrl: string | null;
  rating: number | null;
  accords: { name: string; color: string; intensity: number }[];
  notes: {
    top: { name: string; family: string; imageUrl: string | null }[];
    middle: { name: string; family: string; imageUrl: string | null }[];
    base: { name: string; family: string; imageUrl: string | null }[];
  };
  seasons: { name: string; score: number }[];
}

function transformPerfumes(raw: FragellaPerfume[]): TransformedPerfume[] {
  return raw.map((p) => {
    const brandName = p.Brand || "Unknown";
    const perfumeName = p.Name || "Unnamed";
    const slug = slugify(`${brandName.split(" ")[0]}-${perfumeName}`);

    // Map accords
    const accords: TransformedPerfume["accords"] = [];
    if (p["Main Accords"]) {
      const percentages = p["Main Accords Percentage"] ?? {};
      for (const accordName of p["Main Accords"]) {
        accords.push({
          name: accordName.charAt(0).toUpperCase() + accordName.slice(1).toLowerCase(),
          color: getAccordColor(accordName),
          intensity: mapAccordIntensity(percentages[accordName] ?? percentages[accordName.toLowerCase()]),
        });
      }
    }

    // Map notes
    const mapNotes = (noteList?: FragellaNote[]) =>
      (noteList ?? []).map((n) => ({
        name: n.name,
        family: guessNoteFamily(n.name),
        imageUrl: n.imageUrl ?? null,
      }));

    // Image: prefer main URL, fallback to first fallback
    let imageUrl = p["Image URL"] ?? null;
    if (!imageUrl && p["Image Fallbacks"]?.length) {
      imageUrl = p["Image Fallbacks"][0];
    }

    return {
      name: perfumeName,
      slug,
      brand: brandName,
      brandSlug: slugify(brandName),
      brandCountry: p.Country ?? null,
      year: p.Year ? parseInt(p.Year, 10) || null : null,
      gender: mapGender(p.Gender),
      concentration: mapConcentration(p.OilType),
      imageUrl,
      description: null,
      longevity: mapLongevity(p.Longevity),
      sillage: mapSillage(p.Sillage),
      price: p.Price ?? null,
      purchaseUrl: p["Purchase URL"] ?? null,
      rating: p.rating ? parseFloat(p.rating) || null : null,
      accords,
      notes: {
        top: mapNotes(p.Notes?.Top),
        middle: mapNotes(p.Notes?.Middle),
        base: mapNotes(p.Notes?.Base),
      },
      seasons: p["Season Ranking"] ?? [],
    };
  });
}

// ─── Database Import ─────────────────────────────────

async function importToDatabase(perfumes: TransformedPerfume[]) {
  console.log(`\n  Importing ${perfumes.length} perfumes to database...\n`);

  // 1. Collect unique brands, accords, notes
  const uniqueBrands = new Map<string, { name: string; slug: string; country: string | null }>();
  const uniqueAccords = new Map<string, { name: string; color: string }>();
  const uniqueNotes = new Map<string, { name: string; family: string; slug: string }>();

  for (const p of perfumes) {
    uniqueBrands.set(p.brandSlug, { name: p.brand, slug: p.brandSlug, country: p.brandCountry });

    for (const a of p.accords) {
      if (!uniqueAccords.has(a.name.toLowerCase())) {
        uniqueAccords.set(a.name.toLowerCase(), { name: a.name, color: a.color });
      }
    }

    for (const layer of [p.notes.top, p.notes.middle, p.notes.base]) {
      for (const n of layer) {
        const noteSlug = slugify(n.name);
        if (!uniqueNotes.has(noteSlug)) {
          uniqueNotes.set(noteSlug, { name: n.name, family: n.family, slug: noteSlug });
        }
      }
    }
  }

  // 2. Upsert brands
  console.log(`  Upserting ${uniqueBrands.size} brands...`);
  const brandMap = new Map<string, string>();
  for (const [slug, brand] of uniqueBrands) {
    try {
      const created = await prisma.brand.upsert({
        where: { slug },
        update: { name: brand.name, country: brand.country },
        create: {
          slug,
          name: brand.name,
          country: brand.country,
          category: guessCategory(brand.name),
        },
      });
      brandMap.set(slug, created.id);
    } catch (err: any) {
      console.error(`    Error upserting brand "${brand.name}": ${err.message}`);
    }
  }
  console.log(`    Done: ${brandMap.size} brands`);

  // 3. Upsert accords
  console.log(`  Upserting ${uniqueAccords.size} accords...`);
  const accordMap = new Map<string, string>();
  for (const [key, accord] of uniqueAccords) {
    try {
      const created = await prisma.accord.upsert({
        where: { name: accord.name },
        update: { color: accord.color },
        create: { name: accord.name, color: accord.color },
      });
      accordMap.set(key, created.id);
    } catch (err: any) {
      console.error(`    Error upserting accord "${accord.name}": ${err.message}`);
    }
  }
  console.log(`    Done: ${accordMap.size} accords`);

  // 4. Upsert notes
  console.log(`  Upserting ${uniqueNotes.size} notes...`);
  const noteMap = new Map<string, string>();
  for (const [slug, note] of uniqueNotes) {
    try {
      const created = await prisma.note.upsert({
        where: { slug },
        update: { name: note.name, family: note.family },
        create: { slug, name: note.name, family: note.family },
      });
      noteMap.set(slug, created.id);
    } catch (err: any) {
      console.error(`    Error upserting note "${note.name}": ${err.message}`);
    }
  }
  console.log(`    Done: ${noteMap.size} notes`);

  // 5. Upsert perfumes with relations
  console.log(`  Upserting ${perfumes.length} perfumes...`);
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (let i = 0; i < perfumes.length; i++) {
    const p = perfumes[i];
    const brandId = brandMap.get(p.brandSlug);
    if (!brandId) {
      console.warn(`    Skip "${p.name}": brand "${p.brand}" not found`);
      skipCount++;
      continue;
    }

    try {
      // Check for slug collision — append brand slug if needed
      let finalSlug = p.slug;
      const existing = await prisma.perfume.findUnique({ where: { slug: finalSlug } });
      if (existing && existing.name !== p.name) {
        finalSlug = slugify(`${p.brand}-${p.name}`);
      }

      const created = await prisma.perfume.upsert({
        where: { slug: finalSlug },
        update: {
          name: p.name,
          gender: p.gender,
          year: p.year,
          concentration: p.concentration,
          imageUrl: p.imageUrl,
          brandId,
        },
        create: {
          slug: finalSlug,
          name: p.name,
          gender: p.gender,
          year: p.year,
          concentration: p.concentration,
          imageUrl: p.imageUrl,
          brandId,
        },
      });

      // Upsert accords
      for (const accord of p.accords) {
        const accordId = accordMap.get(accord.name.toLowerCase());
        if (!accordId) continue;
        try {
          await prisma.perfumeAccord.upsert({
            where: { perfumeId_accordId: { perfumeId: created.id, accordId } },
            update: { intensity: accord.intensity },
            create: { perfumeId: created.id, accordId, intensity: accord.intensity },
          });
        } catch {}
      }

      // Upsert notes
      const layers: [string, typeof p.notes.top][] = [
        ["top", p.notes.top],
        ["middle", p.notes.middle],
        ["base", p.notes.base],
      ];
      for (const [layer, noteList] of layers) {
        for (const note of noteList) {
          const noteId = noteMap.get(slugify(note.name));
          if (!noteId) continue;
          try {
            await prisma.perfumeNote.upsert({
              where: { perfumeId_noteId: { perfumeId: created.id, noteId } },
              update: { layer },
              create: { perfumeId: created.id, noteId, layer },
            });
          } catch {}
        }
      }

      // Upsert affiliate link if purchase URL exists
      if (p.purchaseUrl) {
        try {
          // Check if link already exists for this perfume + retailer
          const existingLinks = await prisma.affiliateLink.findMany({
            where: { perfumeId: created.id, retailer: "FragranceNet" },
          });
          if (existingLinks.length === 0) {
            await prisma.affiliateLink.create({
              data: {
                perfumeId: created.id,
                retailer: "FragranceNet",
                url: p.purchaseUrl,
                price: p.price ? parseFloat(p.price) : undefined,
                currency: "USD",
              },
            });
          }
        } catch {}
      }

      successCount++;
      if ((i + 1) % 50 === 0 || i === perfumes.length - 1) {
        console.log(`    Progress: ${i + 1}/${perfumes.length} (${successCount} ok, ${skipCount} skip, ${errorCount} err)`);
      }
    } catch (err: any) {
      errorCount++;
      console.error(`    Error importing "${p.name}": ${err.message}`);
    }
  }

  console.log(`\n  Import complete!`);
  console.log(`    Success: ${successCount}`);
  console.log(`    Skipped: ${skipCount}`);
  console.log(`    Errors: ${errorCount}`);
}

function guessCategory(brandName: string): string {
  const arabian = [
    "lattafa", "amouage", "swiss arabian", "al haramain", "rasasi",
    "arabian oud", "ard al zaafaran", "afnan", "ajmal", "nabeel",
    "al rehab", "abdul samad al qurashi", "anfar", "armaf",
  ];
  const niche = [
    "maison francis kurkdjian", "parfums de marly", "initio", "montale",
    "mancera", "nishane", "xerjoff", "kilian", "byredo", "le labo",
    "diptyque", "frederic malle", "memo", "penhaligon", "serge lutens",
    "nasomatto", "tiziana terenzi", "boadicea the victorious", "roja",
    "clive christian", "creed",
  ];
  const lower = brandName.toLowerCase();
  if (arabian.some((b) => lower.includes(b))) return "Arabian";
  if (niche.some((b) => lower.includes(b))) return "Niche";
  return "Designer";
}

// ─── Main ────────────────────────────────────────────

async function main() {
  console.log("=== Fragella Import Script ===\n");

  if (!process.env.DATABASE_URL) {
    console.error("ERROR: DATABASE_URL environment variable is required.");
    process.exit(1);
  }

  let transformed: TransformedPerfume[];

  // Check if JSON cache exists
  if (fs.existsSync(JSON_PATH)) {
    console.log(`  Found cached data at ${JSON_PATH}`);
    console.log("  Skipping API calls, importing from cache...\n");
    const raw = JSON.parse(fs.readFileSync(JSON_PATH, "utf-8"));
    transformed = raw as TransformedPerfume[];
  } else {
    if (!API_KEY) {
      console.error("ERROR: FRAGELLA_API_KEY environment variable is required for first-time fetch.");
      process.exit(1);
    }

    // Fetch from API
    const rawPerfumes = await fetchFromAPI();

    if (rawPerfumes.length === 0) {
      console.log("  No perfumes fetched from API. Exiting.");
      process.exit(0);
    }

    // Transform
    console.log("  Transforming data...");
    transformed = transformPerfumes(rawPerfumes);

    // Save to JSON
    const dirPath = path.dirname(JSON_PATH);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(JSON_PATH, JSON.stringify(transformed, null, 2), "utf-8");
    console.log(`  Saved ${transformed.length} perfumes to ${JSON_PATH}`);
  }

  // Import to database
  await importToDatabase(transformed);

  console.log("\n=== Done! ===\n");
}

main()
  .catch((e) => {
    console.error("Fatal error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
