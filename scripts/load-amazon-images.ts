import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import * as fs from "fs";
import * as path from "path";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const mapFile = path.join(__dirname, "amazon-image-map.json");

  if (!fs.existsSync(mapFile)) {
    console.log("❌ amazon-image-map.json not found. Run fetch-all-amazon-images.sh first.");
    return;
  }

  const raw = fs.readFileSync(mapFile, "utf-8");
  const map = JSON.parse(raw) as Record<string, string | null>;

  console.log("🖼️  Loading Amazon images into database...\n");

  let updated = 0;
  let skipped = 0;

  for (const [name, imageUrl] of Object.entries(map)) {
    if (!imageUrl || name === "_end") continue;

    // Try exact name match first
    let result = await prisma.perfume.updateMany({
      where: { name, imageUrl: null },
      data: { imageUrl },
    });

    if (result.count === 0) {
      // Try case-insensitive / partial match
      const perfume = await prisma.perfume.findFirst({
        where: {
          name: { equals: name, mode: "insensitive" },
          imageUrl: null,
        },
      });

      if (perfume) {
        await prisma.perfume.update({
          where: { id: perfume.id },
          data: { imageUrl },
        });
        result = { count: 1 };
      }
    }

    if (result.count > 0) {
      console.log(`  ✓ ${name}`);
      updated++;
    } else {
      skipped++;
    }
  }

  const remaining = await prisma.perfume.count({ where: { imageUrl: null } });
  const total = await prisma.perfume.count();
  const withImage = total - remaining;

  console.log(`\n✅ Updated: ${updated} | Skipped: ${skipped}`);
  console.log(`📊 Total: ${withImage}/${total} perfumes with images (${Math.round(withImage / total * 100)}%)`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
