import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// Well-known clone/inspired-by relationships in fragrance community
const inspiredByMap: Record<string, string> = {
  // Lattafa clones
  "Khamrah": "Angels' Share by Kilian",
  "Asad": "Sauvage Elixir by Dior",
  "Oud for Glory": "Oud for Greatness by Initio",
  "Yara": "Mon Paris by YSL",
  "Qaed Al Fursan": "Original composition",
  "Ana Abiyedh": "Clean Reserve Skin by Clean",
  "Raghba": "Original composition",
  "Bade'e Al Oud Amethyst": "Original composition",
  // Afnan
  "9PM": "Jean Paul Gaultier Ultra Male",
  "Supremacy Silver": "Silver Mountain Water by Creed",
  "Turathi Blue": "Bleu de Chanel by Chanel",
  // Armaf
  "Club de Nuit Intense Man": "Aventus by Creed",
  "Club de Nuit Intense Woman": "Coco Mademoiselle by Chanel",
  "Sillage": "Baccarat Rouge 540 by MFK",
  // Al Haramain
  "L'Aventure": "Aventus by Creed",
  "Amber Oud Rouge": "Baccarat Rouge 540 by MFK",
  // Rasasi
  "La Yuqawam": "Tuscan Leather by Tom Ford",
  "Hawas": "Invictus Aqua by Paco Rabanne",
  // Swiss Arabian
  "Shaghaf Oud": "Original Arabian oud composition",
  "Kashkha": "Original Arabian composition",
};

async function main() {
  console.log("🔄 Updating inspiredBy data...");

  for (const [name, inspiredBy] of Object.entries(inspiredByMap)) {
    if (inspiredBy === "Original composition" || inspiredBy === "Original Arabian composition" || inspiredBy === "Original Arabian oud composition") {
      continue; // Skip originals
    }

    const result = await prisma.perfume.updateMany({
      where: { name },
      data: { inspiredBy },
    });

    if (result.count > 0) {
      console.log(`  ✓ ${name} → ${inspiredBy}`);
    }
  }

  console.log("✅ Done!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
