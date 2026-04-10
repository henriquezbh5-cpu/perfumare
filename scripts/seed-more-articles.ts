import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const author = await prisma.user.findFirst({ where: { role: "admin" } });
  if (!author) { console.log("No admin user found"); return; }

  const articles = [
    {
      slug: "best-oud-perfumes-for-beginners",
      title: "Best Oud Perfumes for Beginners: 10 Accessible Scents",
      category: "Lists",
      tags: ["oud", "beginner", "recommendations", "top-10"],
      excerpt: "Oud can be intimidating. These 10 fragrances introduce oud gently, blending it with accessible notes for those new to this precious ingredient.",
      body: `## Why Oud Intimidates New Fragrance Lovers

Oud (agarwood) is one of the most expensive raw materials in perfumery. Its scent can range from smoky and animalic to sweet and woody. For beginners, pure oud can be overwhelming. These 10 fragrances introduce oud in a balanced, approachable way.

## The List

### 1. Tom Ford Oud Wood
The gateway oud. Smooth, sophisticated, barely animalic. If you can only try one, make it this.

### 2. Lattafa Khamrah
Not technically an oud-forward scent, but the oud base adds depth to its sweet-spicy profile. Incredibly approachable.

### 3. Al Haramain Amber Oud Gold Edition
Sweet amber dominates with oud providing a warm foundation. Very crowd-friendly.

### 4. Maison Francis Kurkdjian Oud Silk Mood
Rose and oud in perfect harmony. Elegant, refined, and never harsh.

### 5. Acqua di Parma Oud & Spice
Italian craftsmanship meets Arabian oud. Cardamom and pepper soften the oud beautifully.

### 6. Swiss Arabian Shaghaf Oud
A rose-oud combination that leans romantic. Budget-friendly entry into Arabian oud.

### 7. Initio Oud for Greatness
Bolder than the others, but the saffron-lavender opening makes it surprisingly wearable.

### 8. Nishane Hacivat
Fruity-woody with subtle oud undertones. Modern and versatile.

### 9. Armaf Club de Nuit Sillage
While not oud-centric, it has oud undertones that add complexity. Extremely affordable.

### 10. Rasasi La Yuqawam
A leather-oud combination inspired by Tom Ford Tuscan Leather. Rich but not overwhelming.

## Tips for Oud Beginners

- Start with blended ouds, not pure oud attars
- Apply sparingly — oud is potent
- Give it time — oud evolves dramatically over hours
- Try in cooler weather first — heat amplifies oud`,
    },
    {
      slug: "clone-vs-original-worth-it",
      title: "Clone vs. Original: When Is the Original Worth the Price?",
      category: "Guides",
      tags: ["clones", "dupes", "value", "comparison"],
      excerpt: "Lattafa Khamrah costs $25. Angels' Share costs $300. Are original perfumes ever worth 12x the price? A nuanced look at the clone debate.",
      body: `## The Great Clone Debate

The fragrance community is divided: some swear clones are 95% identical, others insist originals are irreplaceable. The truth is nuanced.

## When Clones Win

### Value-to-Performance Ratio
Many Arabian house clones (Lattafa, Armaf, Afnan) actually outperform their inspirations in longevity and projection. Lattafa Khamrah lasts 10+ hours while Angels' Share often fades after 6.

### Daily Drivers
If you need a scent for everyday wear, a $25 clone you can spray liberally beats a $300 original you are afraid to use.

### Exploration
Clones let you explore scent families without major investment. Try 10 clones for the price of one niche original.

## When Originals Win

### Unique DNA
Some fragrances — Baccarat Rouge 540, Aventus, Santal 33 — have a unique quality that clones cannot fully capture. The transitions between notes, the specific texture, the drydown subtlety.

### Consistency
Niche houses have strict quality control. Clone batches can vary significantly.

### Special Occasions
For signature scents and important moments, the original carries a certain confidence and exclusivity.

## The Smart Strategy

1. **Try the clone first** — If you love it, you might never need the original
2. **If the clone falls short** — Identify specifically what is missing
3. **Buy the original only when** — The difference justifies the price difference for YOUR lifestyle
4. **Build a mixed collection** — Clones for daily wear, originals for special occasions

## Notable Clone Comparisons

| Clone | Original | Clone Price | Original Price | Worth Upgrading? |
|-------|----------|-------------|----------------|------------------|
| Lattafa Khamrah | Kilian Angels' Share | $25 | $300 | Rarely |
| Armaf CDNIM | Creed Aventus | $30 | $400 | Sometimes |
| Afnan 9PM | JPG Ultra Male | $20 | $90 | No |
| Al Haramain Amber Oud Rouge | MFK BR540 | $40 | $325 | For collectors |`,
    },
    {
      slug: "perfume-seasons-guide",
      title: "The Complete Guide to Seasonal Fragrance Wearing",
      category: "Guides",
      tags: ["seasons", "weather", "guide", "tips"],
      excerpt: "Why your summer favorite fails in winter and vice versa. Learn the science of seasonal fragrance selection and build a year-round rotation.",
      body: `## Why Seasons Matter in Perfumery

Temperature directly affects how fragrance molecules behave on your skin. Heat amplifies projection and accelerates evaporation. Cold suppresses both.

## Spring (March-May)

**Profile:** Light florals, green notes, citrus, clean musks

**Why:** Moderate temperatures allow balanced projection without overwhelming.

**Top picks:**
- Bleu de Chanel EDP — versatile blue fragrance
- Acqua di Gio Profondo — aquatic freshness with depth
- Delina by Parfums de Marly — rose-lychee elegance

## Summer (June-August)

**Profile:** Citrus, aquatic, light woods, vetiver

**Why:** Heat amplifies everything — heavy fragrances become suffocating. Choose light, transparent scents.

**Top picks:**
- Versace Dylan Blue — reliable summer workhorse
- Light Blue by D&G — definition of summer freshness
- Sedley by Parfums de Marly — sophisticated mint freshness

## Fall (September-November)

**Profile:** Warm spices, amber, tobacco, leather, dried fruits

**Top picks:**
- Lattafa Khamrah — cinnamon-vanilla perfection for fall
- By the Fireplace by Maison Margiela — smoky autumn warmth
- Layton by Parfums de Marly — apple-vanilla-cardamom

## Winter (December-February)

**Profile:** Oud, vanilla, incense, heavy amber, gourmand

**Top picks:**
- Amouage Interlude Man — smoky-incense power
- Tom Ford Tobacco Vanilla — cozy tobacco-vanilla cocoon
- Initio Oud for Greatness — bold oud statement

## Year-Round All-Stars

- Baccarat Rouge 540 — ethereal and season-proof
- Dior Sauvage EDP — calibrated to work everywhere
- Nishane Hacivat — fruity-woody balance`,
    },
    {
      slug: "how-to-test-perfumes-like-a-pro",
      title: "How to Test Perfumes Like a Pro: Stop Wasting Money on Blind Buys",
      category: "Guides",
      tags: ["testing", "sampling", "tips", "beginner"],
      excerpt: "Before spending $100+ on a full bottle, learn how experts evaluate fragrances. From paper strips to skin chemistry, master the art of perfume testing.",
      body: `## The Problem with Blind Buying

Buying a perfume based solely on note lists, reviews, or YouTube recommendations is like buying a car based on the spec sheet. You need to experience it.

## Step 1: Paper Strip Test

Spray on a paper blotter from about 6 inches away. This gives you the opening — the first impression. Wait 30 seconds, then smell.

**What you are testing:** Do you even like the general direction? If the opening repulses you, move on.

## Step 2: Skin Test

Spray ONCE on one wrist. Do NOT rub your wrists together — this crushes the top notes.

**Wait times:**
- 15 minutes: top notes have settled
- 1 hour: heart notes emerge
- 3-4 hours: base/drydown reveals itself

## Step 3: The Walk-Away Test

After applying, go about your day. Come back to your wrist periodically. A great fragrance keeps surprising you hours later.

## Step 4: The Second Wearing

NEVER buy after one test. Your perception changes with mood, temperature, and expectations. Wear it at least twice, on different days.

## Step 5: The Compliment Check

Ask someone close to you — do they notice it? Do they like it? Your nose adapts (olfactory fatigue), but others smell you objectively.

## Where to Get Samples

1. **Decant shops** — MicroPerfumes, DecantX, ScentSplit
2. **Brand discovery sets** — MFK, PDM, Xerjoff all offer these
3. **Department stores** — Free samples, just ask
4. **Fragrance swaps** — Reddit r/fragranceswap

## Common Testing Mistakes

- Testing more than 3 fragrances at once (nose fatigue)
- Judging within the first 10 minutes (top notes lie)
- Testing on clothes instead of skin (different behavior)
- Skipping the drydown (the most important phase)
- Buying a full bottle after one good experience`,
    },
  ];

  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: { title: article.title, body: article.body, excerpt: article.excerpt, category: article.category, tags: article.tags },
      create: { ...article, authorId: author.id, publishedAt: new Date() },
    });
    console.log(`  ✓ ${article.title}`);
  }

  const total = await prisma.article.count();
  console.log(`\n✅ Done! Total articles: ${total}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
