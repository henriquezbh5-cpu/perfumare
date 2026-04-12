import { PrismaClient } from "@prisma/client";
import { BADGE_DEFINITIONS } from "../src/lib/badges";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding badges...");

  for (const badge of BADGE_DEFINITIONS) {
    await prisma.badge.upsert({
      where: { name: badge.name },
      update: {
        description: badge.description,
        criteria: badge.criteria as object,
      },
      create: {
        name: badge.name,
        description: badge.description,
        criteria: badge.criteria as object,
      },
    });
    console.log(`  ✓ ${badge.name}`);
  }

  console.log(`Seeded ${BADGE_DEFINITIONS.length} badges.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
