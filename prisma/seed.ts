import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import * as fs from "fs";
import * as path from "path";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readJSON(filename: string) {
  const filePath = path.join(process.cwd(), "scripts", "seed-data", filename);
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

async function main() {
  console.log("🌱 Starting seed...");

  const accords = readJSON("accords.json");
  const notes = readJSON("notes.json");
  const brands = readJSON("brands.json");
  const perfumers = readJSON("perfumers.json");
  const perfumes = readJSON("perfumes.json");

  // 1. Seed Accords
  console.log("  → Seeding accords...");
  const accordMap = new Map<string, string>();
  for (const accord of accords) {
    const created = await prisma.accord.upsert({
      where: { name: accord.name },
      update: { color: accord.color },
      create: { name: accord.name, color: accord.color },
    });
    accordMap.set(accord.name, created.id);
  }
  console.log(`    ✓ ${accords.length} accords`);

  // 2. Seed Notes
  console.log("  → Seeding notes...");
  const noteMap = new Map<string, string>();
  for (const note of notes) {
    const created = await prisma.note.upsert({
      where: { slug: slugify(note.name) },
      update: { name: note.name, family: note.family, description: note.description },
      create: {
        slug: slugify(note.name),
        name: note.name,
        family: note.family,
        description: note.description,
      },
    });
    noteMap.set(note.name, created.id);
  }
  console.log(`    ✓ ${notes.length} notes`);

  // 3. Seed Brands
  console.log("  → Seeding brands...");
  const brandMap = new Map<string, string>();
  for (const brand of brands) {
    const created = await prisma.brand.upsert({
      where: { slug: slugify(brand.name) },
      update: { name: brand.name, country: brand.country, category: brand.category, founded: brand.founded, description: brand.description },
      create: {
        slug: slugify(brand.name),
        name: brand.name,
        country: brand.country,
        category: brand.category,
        founded: brand.founded,
        description: brand.description,
      },
    });
    brandMap.set(brand.name, created.id);
  }
  console.log(`    ✓ ${brands.length} brands`);

  // 4. Seed Perfumers
  console.log("  → Seeding perfumers...");
  const perfumerMap = new Map<string, string>();
  for (const perfumer of perfumers) {
    const created = await prisma.perfumer.upsert({
      where: { slug: slugify(perfumer.name) },
      update: { name: perfumer.name, nationality: perfumer.nationality, bio: perfumer.bio },
      create: {
        slug: slugify(perfumer.name),
        name: perfumer.name,
        nationality: perfumer.nationality,
        bio: perfumer.bio,
      },
    });
    perfumerMap.set(perfumer.name, created.id);
  }
  console.log(`    ✓ ${perfumers.length} perfumers`);

  // 5. Seed Perfumes with relations
  console.log("  → Seeding perfumes...");
  for (const perfume of perfumes) {
    const brandId = brandMap.get(perfume.brand);
    if (!brandId) { console.warn(`    ⚠ Brand not found: ${perfume.brand}`); continue; }

    const perfumerId = perfume.perfumer ? perfumerMap.get(perfume.perfumer) : null;
    const slug = slugify(`${perfume.brand.split(" ")[0]}-${perfume.name}`);

    const created = await prisma.perfume.upsert({
      where: { slug },
      update: { name: perfume.name, description: perfume.description, gender: perfume.gender, year: perfume.year, concentration: perfume.concentration, brandId, perfumerId: perfumerId || undefined },
      create: { slug, name: perfume.name, description: perfume.description, gender: perfume.gender, year: perfume.year, concentration: perfume.concentration, brandId, perfumerId: perfumerId || undefined },
    });

    // Seed notes
    for (const [layer, noteNames] of Object.entries(perfume.notes)) {
      for (const noteName of noteNames as string[]) {
        const noteId = noteMap.get(noteName);
        if (!noteId) { console.warn(`    ⚠ Note not found: ${noteName}`); continue; }
        await prisma.perfumeNote.upsert({
          where: { perfumeId_noteId: { perfumeId: created.id, noteId } },
          update: { layer },
          create: { perfumeId: created.id, noteId, layer },
        });
      }
    }

    // Seed accords
    for (const [accordName, intensity] of Object.entries(perfume.accords)) {
      const accordId = accordMap.get(accordName);
      if (!accordId) { console.warn(`    ⚠ Accord not found: ${accordName}`); continue; }
      await prisma.perfumeAccord.upsert({
        where: { perfumeId_accordId: { perfumeId: created.id, accordId } },
        update: { intensity: intensity as number },
        create: { perfumeId: created.id, accordId, intensity: intensity as number },
      });
    }
  }
  console.log(`    ✓ ${perfumes.length} perfumes with notes and accords`);

  // 6. Seed Forum Categories
  console.log("  → Seeding forum categories...");
  const forumCategories = [
    { name: "General Discussion", slug: "general", description: "Talk about anything fragrance-related", sortOrder: 1 },
    { name: "Tips for Men", slug: "tips-men", description: "Fragrance advice and recommendations for men", sortOrder: 2 },
    { name: "Tips for Women", slug: "tips-women", description: "Fragrance advice and recommendations for women", sortOrder: 3 },
    { name: "Arabian Fragrances", slug: "arabian", description: "Discuss oud, attar, bakhoor and Middle Eastern perfumery", sortOrder: 4 },
    { name: "Scent of the Day", slug: "sotd", description: "Share what you're wearing today", sortOrder: 5 },
    { name: "Deals & Finds", slug: "deals", description: "Share discounts, sales, and hidden gems", sortOrder: 6 },
    { name: "New to Fragrances", slug: "beginners", description: "Questions and guidance for fragrance newcomers", sortOrder: 7 },
  ];

  for (const cat of forumCategories) {
    await prisma.forumCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, sortOrder: cat.sortOrder },
      create: cat,
    });
  }
  console.log(`    ✓ ${forumCategories.length} forum categories`);

  // 7. Seed Badges
  console.log("  → Seeding badges...");
  const badges = [
    { name: "First Review", description: "Wrote your first perfume review" },
    { name: "Collector", description: "Added 10 perfumes to your wardrobe" },
    { name: "Oud Expert", description: "Reviewed 5 Arabian fragrances" },
    { name: "Founding Member", description: "Joined during the launch period" },
    { name: "Top Reviewer", description: "Wrote 50 or more reviews" },
    { name: "Community Star", description: "Made 100 forum posts" },
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { name: badge.name },
      update: { description: badge.description },
      create: badge,
    });
  }
  console.log(`    ✓ ${badges.length} badges`);

  // 8. Seed Articles
  console.log("  → Seeding articles...");

  // Create system author for articles
  const systemAuthor = await prisma.user.upsert({
    where: { email: "editorial@perfumare.com" },
    update: {},
    create: {
      email: "editorial@perfumare.com",
      name: "Perfumare Editorial",
      username: "editorial",
      role: "admin",
    },
  });

  const articles = [
    {
      slug: "beginners-guide-to-arabian-perfumery",
      title: "A Beginner's Guide to Arabian Perfumery",
      category: "Guides",
      tags: ["arabian", "oud", "beginner", "guide"],
      excerpt: "Discover the rich world of Arabian fragrances — from traditional oud and bakhoor to modern oriental masterpieces that have captivated the West.",
      body: `## The Roots of Arabian Perfumery

Arabian perfumery is one of the oldest fragrance traditions in the world, dating back thousands of years. The use of oud, rose, musk, and amber has been central to Middle Eastern culture, spirituality, and daily life.

## Key Ingredients

### Oud (Agarwood)
Often called "liquid gold," oud is derived from the Aquilaria tree when it becomes infected with a specific mold. The resin produced creates one of the most complex and valuable raw materials in perfumery. Expect smoky, woody, animalic, and sometimes sweet notes.

### Bakhoor
Bakhoor refers to woodchips soaked in fragrant oils, typically burned as incense. It's a cornerstone of Arabian hospitality — guests are welcomed with bakhoor smoke.

### Rose
Taif rose from Saudi Arabia is considered among the finest rose varieties for perfumery. Its rich, honeyed character differs significantly from Turkish or Bulgarian roses.

### Musk & Amber
Traditional Arabian musk (now synthetic for ethical reasons) and amber provide warmth, depth, and longevity that Arabian fragrances are famous for.

## Modern Arabian Houses to Explore

- **Lattafa Perfumes** — Exceptional value, known for inspired compositions
- **Swiss Arabian** — Heritage house blending traditional and modern
- **Al Haramain** — Wide range from traditional attars to contemporary EDPs
- **Arabian Oud** — The largest retailer of oud-based fragrances in the world
- **Amouage** — Luxury niche house from Oman, often considered the pinnacle of Arabian perfumery

## Where to Start

If you're new to Arabian fragrances, try these approachable picks:
1. **Lattafa Khamrah** — Sweet, spicy, vanilla-oud hybrid
2. **Swiss Arabian Shaghaf Oud** — Accessible rose-oud
3. **Al Haramain Amber Oud Gold** — Warm, sweet amber

The beauty of Arabian perfumery lies in its boldness and complexity. Don't be afraid to explore!`,
    },
    {
      slug: "top-10-niche-fragrances-2024",
      title: "Top 10 Niche Fragrances That Defined Modern Perfumery",
      category: "Lists",
      tags: ["niche", "top-10", "luxury", "recommendations"],
      excerpt: "From Baccarat Rouge 540 to Aventus, these are the niche fragrances that changed the game and continue to influence the industry.",
      body: `## The Niche Revolution

The fragrance industry has seen a massive shift toward niche perfumery. What was once a small corner of the market now drives trends that mainstream houses rush to follow.

## The Definitive List

### 1. Baccarat Rouge 540 — Maison Francis Kurkdjian
The fragrance that launched a thousand clones. Its ethereal blend of saffron, jasmine, and ambergris created an entirely new olfactory category.

### 2. Aventus — Creed
Arguably the most discussed fragrance of the 21st century. Its fresh, fruity, smoky profile became the blueprint for masculine sophistication.

### 3. Oud Wood — Tom Ford
The fragrance that introduced oud to mainstream Western perfumery. Its refined, approachable take on oud opened doors for an entire category.

### 4. Santal 33 — Le Labo
The scent of every cool hotel lobby and creative agency. Its leather-sandalwood-cardamom blend became a cultural phenomenon.

### 5. Hacivat — Nishane
A Turkish house's tribute to fresh, fruity fragrances with incredible performance. Often compared to Aventus but with its own distinct personality.

### 6. Layton — Parfums de Marly
A masterful blend of apple, vanilla, and cardamom that bridges the gap between fresh and warm. A true crowd-pleaser with substance.

### 7. By the Fireplace — Maison Margiela
Captures the essence of a winter evening by the fire. Smoky, sweet, and incredibly evocative.

### 8. Interlude Man — Amouage
Controlled chaos in a bottle. Its smoky-incense profile is unlike anything else in perfumery.

### 9. Erba Pura — Xerjoff
A fruity-vanilla bomb that proved Italian niche houses could compete with French dominance.

### 10. Lost Cherry — Tom Ford
A provocative cherry-almond-tonka composition that became an instant icon and spawned countless imitators.

## What Makes These Special

Each of these fragrances didn't just smell good — they created movements. They inspired clones, influenced mainstream releases, and changed how people think about perfume.`,
    },
    {
      slug: "how-to-build-a-fragrance-wardrobe",
      title: "How to Build a Fragrance Wardrobe: A Strategic Approach",
      category: "Guides",
      tags: ["wardrobe", "collection", "strategy", "beginner"],
      excerpt: "Building a versatile fragrance collection doesn't mean buying everything. Here's a strategic framework for covering every occasion with fewer bottles.",
      body: `## The Problem with Collecting

It's easy to fall into the trap of buying every new release that catches your attention. But a great fragrance wardrobe isn't about quantity — it's about strategic coverage.

## The 5-Pillar Framework

Think of your wardrobe in terms of five categories that cover virtually every scenario:

### 1. Fresh Daily Driver
**For:** Office, casual outings, warm weather
**Profile:** Citrus, aquatic, or light green
**Examples:** Bleu de Chanel, Acqua di Gio, Dylan Blue

### 2. Warm Evening Scent
**For:** Dinner dates, night out, cooler weather
**Profile:** Amber, vanilla, spicy
**Examples:** Tobacco Vanilla, La Nuit de l'Homme, The One

### 3. Signature Statement
**For:** Special occasions, making an impression
**Profile:** Unique, memorable, conversation-starting
**Examples:** Baccarat Rouge 540, Aventus, Interlude Man

### 4. Cold Weather Beast
**For:** Winter, low temperatures, projection needed
**Profile:** Heavy oriental, oud, intense
**Examples:** Khamrah, Grand Soir, Oud for Greatness

### 5. Crowd-Pleaser
**For:** Social events, compliment-getter
**Profile:** Sweet but balanced, universally appealing
**Examples:** Layton, Eros, 9PM

## Budget Tiers

### Starter ($100-200 total)
Pick one from each pillar using affordable alternatives. Arabian houses like Lattafa and Armaf offer incredible value.

### Intermediate ($500-800 total)
Mix mid-range niche with smart designer picks. Parfums de Marly, MFK discovery sets are great investments.

### Enthusiast ($1,500+ total)
Build depth within pillars. Add seasonal variants and special occasion pieces.

## The Golden Rule

Before buying, ask: "Which pillar does this fill?" If it doesn't fill an empty slot or significantly upgrade an existing one, you probably don't need it.`,
    },
    {
      slug: "understanding-fragrance-notes-pyramid",
      title: "Understanding the Fragrance Notes Pyramid",
      category: "Guides",
      tags: ["notes", "education", "pyramid", "composition"],
      excerpt: "Top, middle, base — the three layers of every perfume. Learn how fragrance notes work together to create a complete olfactory experience.",
      body: `## The Architecture of Scent

Every perfume tells a story in three acts. The notes pyramid is the fundamental framework that perfumers use to structure their creations.

## Top Notes (0-30 minutes)

Top notes are your first impression. They're the lightest, most volatile molecules that hit your nose immediately upon spraying.

**Common top notes:**
- Citrus (bergamot, lemon, orange)
- Light herbs (lavender, basil)
- Light fruits (apple, pear)
- Spice accents (pink pepper, cardamom)

**What to know:** Top notes fade quickly. Don't judge a fragrance in the first 10 minutes — you're only getting the introduction.

## Middle Notes (30 min - 4 hours)

Also called "heart notes," these form the core identity of the fragrance. They emerge as top notes fade and typically last several hours.

**Common middle notes:**
- Florals (rose, jasmine, iris)
- Warm spices (cinnamon, nutmeg)
- Rich fruits (date, plum)
- Aromatics (frankincense, geranium)

**What to know:** This is where you'll spend most of your time with a fragrance. The heart is what defines the scent's character.

## Base Notes (4+ hours)

Base notes provide the foundation. They're the heaviest molecules, often detectable for 8-24 hours on skin and even longer on clothes.

**Common base notes:**
- Woods (sandalwood, cedar, oud)
- Resins (amber, benzoin, labdanum)
- Musks (white musk, skin musks)
- Vanilla and tonka bean

**What to know:** Base notes create the "dry down" — how the fragrance smells after hours of wear. Many enthusiasts argue this is where the real magic happens.

## How Notes Interact

The pyramid isn't just about layers — it's about interaction. A great perfumer designs notes to complement and enhance each other across all three stages. The transition between layers should feel seamless, like a story flowing naturally from beginning to end.

## Practical Application

When reading a fragrance's note breakdown on Perfumare:
1. **Top notes** tell you what to expect on first spray
2. **Heart notes** reveal the fragrance's true personality
3. **Base notes** determine longevity and the lasting impression`,
    },
    {
      slug: "lattafa-best-fragrances-guide",
      title: "Lattafa Perfumes: The Complete Guide to Their Best Creations",
      category: "Reviews",
      tags: ["lattafa", "arabian", "budget", "reviews"],
      excerpt: "Lattafa has become the most talked-about Arabian fragrance house. Here's our comprehensive guide to their best offerings and which ones are worth your money.",
      body: `## The Lattafa Phenomenon

No house has disrupted the fragrance world quite like Lattafa. Based in the UAE, they've become synonymous with "luxury scent, accessible price." But with dozens of releases, which ones actually deserve the hype?

## Tier 1: Must-Haves

### Khamrah
**Profile:** Sweet, spicy, vanilla-oud
**Inspired by:** Angels' Share by Kilian
**Verdict:** Perhaps the best value in all of perfumery. Rich, complex, long-lasting, and a fraction of the price of its inspiration. An absolute must-own.

### Asad
**Profile:** Tobacco, honey, amber
**Inspired by:** Sauvage Elixir by Dior
**Verdict:** Beast mode projection and longevity. A cold-weather powerhouse that smells significantly more expensive than it is.

### Yara
**Profile:** Sweet, fruity, gourmand
**Target:** Feminine/unisex sweet fragrance lovers
**Verdict:** The viral TikTok sensation. Incredibly appealing tropical-gourmand scent with serious lasting power.

## Tier 2: Excellent Picks

### Oud for Glory (Bade'e Al Oud)
**Profile:** Oud, vanilla, saffron
**Inspired by:** Oud for Greatness by Initio
**Verdict:** A remarkably faithful take on the Initio classic. Smoky, bold, sophisticated.

### Qaed Al Fursan
**Profile:** Sweet, amber, tobacco
**Verdict:** An original composition that stands on its own. Warm, inviting, with excellent longevity.

### Ana Abiyedh
**Profile:** Clean, musky, fresh
**Verdict:** The "clean skin" scent. Perfect for those who prefer understated elegance.

## Tier 3: Worth Trying

### Raghba
**Profile:** Sweet vanilla, caramel
**Verdict:** Pure gourmand heaven. Not complex, but incredibly comforting and addictive.

### Bade'e Al Oud Amethyst
**Profile:** Berry, oud, vanilla
**Verdict:** A unique berry-oud combination. Interesting and conversation-starting.

## Where to Buy

Lattafa is widely available on Amazon, FragranceNet, and most Arabian perfume retailers. Prices typically range from $15-40 USD, making them perfect for building a diverse collection without breaking the bank.

## The Bottom Line

Lattafa proves that great fragrance doesn't require a luxury price tag. Start with Khamrah and Asad — you won't be disappointed.`,
    },
    {
      slug: "fragrance-longevity-sillage-explained",
      title: "Longevity & Sillage: Why Your Perfume Doesn't Last (And How to Fix It)",
      category: "Guides",
      tags: ["longevity", "sillage", "tips", "performance"],
      excerpt: "Your expensive perfume fades in an hour? The problem might not be the fragrance. Learn the science behind longevity and sillage, plus proven tricks to maximize performance.",
      body: `## The Two Metrics That Matter

### Longevity
How long the fragrance remains detectable on your skin. Measured in hours.

### Sillage
The "trail" your fragrance leaves. How far from your body others can smell it. Think of it as the fragrance's radius of influence.

A fragrance can have great longevity but poor sillage (you can smell it on your wrist but nobody else notices), or great sillage but poor longevity (everyone notices for an hour, then it vanishes).

## Why Your Fragrance Might Not Last

### 1. Dry Skin
Fragrance molecules need oil to bind to. Dry skin lets them evaporate quickly.

**Fix:** Apply unscented moisturizer or Vaseline to pulse points before spraying.

### 2. Olfactory Fatigue
After 20-30 minutes, your nose adapts and stops registering the scent. You think it's gone, but others can still smell it.

**Fix:** Ask someone else. Or spray on a cloth and smell it periodically.

### 3. Wrong Application Points
Spraying into the air and walking through it wastes fragrance.

**Fix:** Apply to pulse points: wrists (don't rub!), neck, behind ears, chest.

### 4. Concentration Matters
- **EDT (Eau de Toilette):** 5-15% concentration, 4-6 hours
- **EDP (Eau de Parfum):** 15-20%, 6-10 hours
- **Parfum/Extrait:** 20-40%, 10+ hours

### 5. Weather and Temperature
Heat amplifies fragrance but also accelerates evaporation. Cold weather mutes projection but can extend longevity.

## Pro Tips for Maximum Performance

1. **Layer your fragrance** — Use matching shower gel or body lotion
2. **Spray on clothes** — Fabric holds scent longer than skin (test for staining first)
3. **Hair is a diffuser** — One spray on your hairbrush, then brush through
4. **Don't over-apply** — 4-6 sprays is usually plenty
5. **Store properly** — Cool, dark place. Heat and light degrade fragrance molecules

## The Longevity Spectrum

| Category | Longevity | Examples |
|----------|-----------|----------|
| Light | 2-4 hours | Most colognes, citrus-dominant |
| Moderate | 4-8 hours | Designer EDTs, light EDPs |
| Strong | 8-12 hours | Niche EDPs, oriental |
| Beast Mode | 12-24+ hours | Amouage, heavy oud, extraits |

Understanding these factors helps you set realistic expectations and get the most out of every spray.`,
    },
  ];

  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {
        title: article.title,
        body: article.body,
        excerpt: article.excerpt,
        category: article.category,
        tags: article.tags,
        authorId: systemAuthor.id,
        publishedAt: new Date(),
      },
      create: {
        ...article,
        authorId: systemAuthor.id,
        publishedAt: new Date(),
      },
    });
  }
  console.log(`    ✓ ${articles.length} articles`);

  console.log("🌱 Seed complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
