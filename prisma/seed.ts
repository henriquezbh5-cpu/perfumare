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

  console.log("🌱 Seed complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
