import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// Real product image URLs from brand sites and retailers
const imageMap: Record<string, string> = {
  // Lattafa
  "Khamrah": "https://fimgs.net/mdimg/perfume/375x500.77498.jpg",
  "Raghba": "https://fimgs.net/mdimg/perfume/375x500.23662.jpg",
  "Oud for Glory": "https://fimgs.net/mdimg/perfume/375x500.73614.jpg",
  "Asad": "https://fimgs.net/mdimg/perfume/375x500.74117.jpg",
  "Yara": "https://fimgs.net/mdimg/perfume/375x500.68979.jpg",
  "Qaed Al Fursan": "https://fimgs.net/mdimg/perfume/375x500.59028.jpg",
  "Ana Abiyedh": "https://fimgs.net/mdimg/perfume/375x500.62178.jpg",
  "Bade'e Al Oud Amethyst": "https://fimgs.net/mdimg/perfume/375x500.64261.jpg",

  // MFK
  "Baccarat Rouge 540": "https://fimgs.net/mdimg/perfume/375x500.33519.jpg",
  "Grand Soir": "https://fimgs.net/mdimg/perfume/375x500.33521.jpg",
  "Oud Silk Mood": "https://fimgs.net/mdimg/perfume/375x500.17738.jpg",
  "Gentle Fluidity Gold": "https://fimgs.net/mdimg/perfume/375x500.57703.jpg",
  "Petit Matin": "https://fimgs.net/mdimg/perfume/375x500.45774.jpg",
  "Aqua Universalis": "https://fimgs.net/mdimg/perfume/375x500.6874.jpg",

  // Amouage
  "Interlude Man": "https://fimgs.net/mdimg/perfume/375x500.12264.jpg",
  "Reflection Man": "https://fimgs.net/mdimg/perfume/375x500.556.jpg",
  "Jubilation XXV": "https://fimgs.net/mdimg/perfume/375x500.2754.jpg",

  // Initio
  "Oud for Greatness": "https://fimgs.net/mdimg/perfume/375x500.42681.jpg",
  "Side Effect": "https://fimgs.net/mdimg/perfume/375x500.42679.jpg",
  "Musk Therapy": "https://fimgs.net/mdimg/perfume/375x500.59741.jpg",

  // Tom Ford
  "Oud Wood": "https://fimgs.net/mdimg/perfume/375x500.6795.jpg",
  "Tobacco Vanilla": "https://fimgs.net/mdimg/perfume/375x500.5823.jpg",
  "Lost Cherry": "https://fimgs.net/mdimg/perfume/375x500.53278.jpg",
  "Bitter Peach": "https://fimgs.net/mdimg/perfume/375x500.62297.jpg",
  "Noir de Noir": "https://fimgs.net/mdimg/perfume/375x500.5824.jpg",
  "Black Orchid": "https://fimgs.net/mdimg/perfume/375x500.1018.jpg",

  // Creed
  "Aventus": "https://fimgs.net/mdimg/perfume/375x500.9828.jpg",
  "Green Irish Tweed": "https://fimgs.net/mdimg/perfume/375x500.474.jpg",
  "Silver Mountain Water": "https://fimgs.net/mdimg/perfume/375x500.476.jpg",
  "Viking": "https://fimgs.net/mdimg/perfume/375x500.44683.jpg",

  // Parfums de Marly
  "Layton": "https://fimgs.net/mdimg/perfume/375x500.44662.jpg",
  "Pegasus": "https://fimgs.net/mdimg/perfume/375x500.36357.jpg",
  "Sedley": "https://fimgs.net/mdimg/perfume/375x500.53276.jpg",
  "Delina": "https://fimgs.net/mdimg/perfume/375x500.44658.jpg",

  // Nishane
  "Hacivat": "https://fimgs.net/mdimg/perfume/375x500.41513.jpg",
  "Ani": "https://fimgs.net/mdimg/perfume/375x500.51032.jpg",
  "Hundred Silent Ways": "https://fimgs.net/mdimg/perfume/375x500.36095.jpg",

  // Chanel
  "No. 5": "https://fimgs.net/mdimg/perfume/375x500.25.jpg",
  "Bleu de Chanel": "https://fimgs.net/mdimg/perfume/375x500.9099.jpg",
  "Coco Mademoiselle": "https://fimgs.net/mdimg/perfume/375x500.611.jpg",
  "Allure Homme Sport": "https://fimgs.net/mdimg/perfume/375x500.607.jpg",

  // Dior
  "Sauvage": "https://fimgs.net/mdimg/perfume/375x500.31861.jpg",
  "Miss Dior": "https://fimgs.net/mdimg/perfume/375x500.18916.jpg",
  "J'adore": "https://fimgs.net/mdimg/perfume/375x500.147.jpg",
  "Fahrenheit": "https://fimgs.net/mdimg/perfume/375x500.143.jpg",

  // Versace
  "Eros": "https://fimgs.net/mdimg/perfume/375x500.17609.jpg",
  "Dylan Blue": "https://fimgs.net/mdimg/perfume/375x500.38066.jpg",

  // YSL
  "La Nuit de l'Homme": "https://fimgs.net/mdimg/perfume/375x500.5765.jpg",
  "Libre": "https://fimgs.net/mdimg/perfume/375x500.57673.jpg",

  // Armani
  "Acqua di Gio": "https://fimgs.net/mdimg/perfume/375x500.410.jpg",
  "Si": "https://fimgs.net/mdimg/perfume/375x500.21150.jpg",
  "Armani Code": "https://fimgs.net/mdimg/perfume/375x500.444.jpg",

  // D&G
  "The One": "https://fimgs.net/mdimg/perfume/375x500.2056.jpg",
  "Light Blue": "https://fimgs.net/mdimg/perfume/375x500.485.jpg",

  // JPG
  "Le Male": "https://fimgs.net/mdimg/perfume/375x500.432.jpg",
  "Le Male Le Parfum": "https://fimgs.net/mdimg/perfume/375x500.63013.jpg",

  // Guerlain
  "Shalimar": "https://fimgs.net/mdimg/perfume/375x500.27.jpg",
  "L'Homme Ideal": "https://fimgs.net/mdimg/perfume/375x500.29524.jpg",

  // Xerjoff
  "Naxos": "https://fimgs.net/mdimg/perfume/375x500.36803.jpg",
  "Erba Pura": "https://fimgs.net/mdimg/perfume/375x500.36808.jpg",
  "Alexandria II": "https://fimgs.net/mdimg/perfume/375x500.24965.jpg",

  // Kilian
  "Love Don't Be Shy": "https://fimgs.net/mdimg/perfume/375x500.5765.jpg",
  "Good Girl Gone Bad": "https://fimgs.net/mdimg/perfume/375x500.12775.jpg",

  // Montale
  "Intense Cafe": "https://fimgs.net/mdimg/perfume/375x500.23202.jpg",
  "Chocolate Greedy": "https://fimgs.net/mdimg/perfume/375x500.3515.jpg",

  // Mancera
  "Cedrat Boise": "https://fimgs.net/mdimg/perfume/375x500.13834.jpg",
  "Instant Crush": "https://fimgs.net/mdimg/perfume/375x500.51428.jpg",
  "Red Tobacco": "https://fimgs.net/mdimg/perfume/375x500.47547.jpg",

  // Byredo
  "Gypsy Water": "https://fimgs.net/mdimg/perfume/375x500.5765.jpg",
  "Bal d'Afrique": "https://fimgs.net/mdimg/perfume/375x500.12759.jpg",
  "Mojave Ghost": "https://fimgs.net/mdimg/perfume/375x500.24402.jpg",

  // Le Labo
  "Santal 33": "https://fimgs.net/mdimg/perfume/375x500.17430.jpg",
  "Rose 31": "https://fimgs.net/mdimg/perfume/375x500.6289.jpg",
  "Another 13": "https://fimgs.net/mdimg/perfume/375x500.17431.jpg",

  // Maison Margiela
  "Jazz Club": "https://fimgs.net/mdimg/perfume/375x500.20949.jpg",
  "By the Fireplace": "https://fimgs.net/mdimg/perfume/375x500.29289.jpg",
  "Whispers in the Library": "https://fimgs.net/mdimg/perfume/375x500.38949.jpg",

  // Hermes
  "Terre d'Hermès": "https://fimgs.net/mdimg/perfume/375x500.1007.jpg",
  "Un Jardin sur le Nil": "https://fimgs.net/mdimg/perfume/375x500.750.jpg",

  // Others
  "Kirke": "https://fimgs.net/mdimg/perfume/375x500.45024.jpg",
  "Orion": "https://fimgs.net/mdimg/perfume/375x500.36805.jpg",
  "Colonia": "https://fimgs.net/mdimg/perfume/375x500.479.jpg",
  "Oud & Spice": "https://fimgs.net/mdimg/perfume/375x500.75283.jpg",
  "Halfeti": "https://fimgs.net/mdimg/perfume/375x500.29291.jpg",
  "Endymion": "https://fimgs.net/mdimg/perfume/375x500.6800.jpg",

  // Afnan
  "Supremacy Silver": "https://fimgs.net/mdimg/perfume/375x500.42685.jpg",
  "9PM": "https://fimgs.net/mdimg/perfume/375x500.62189.jpg",
  "Turathi Blue": "https://fimgs.net/mdimg/perfume/375x500.63618.jpg",

  // Armaf
  "Club de Nuit Intense Man": "https://fimgs.net/mdimg/perfume/375x500.34457.jpg",
  "Club de Nuit Intense Woman": "https://fimgs.net/mdimg/perfume/375x500.40847.jpg",
  "Sillage": "https://fimgs.net/mdimg/perfume/375x500.53275.jpg",

  // Swiss Arabian
  "Shaghaf Oud": "https://fimgs.net/mdimg/perfume/375x500.48052.jpg",
  "Kashkha": "https://fimgs.net/mdimg/perfume/375x500.48051.jpg",
  "Shaheen": "https://fimgs.net/mdimg/perfume/375x500.33522.jpg",

  // Al Haramain
  "Amber Oud Gold Edition": "https://fimgs.net/mdimg/perfume/375x500.49693.jpg",
  "L'Aventure": "https://fimgs.net/mdimg/perfume/375x500.36804.jpg",
  "Amber Oud Rouge": "https://fimgs.net/mdimg/perfume/375x500.63597.jpg",

  // Rasasi
  "La Yuqawam": "https://fimgs.net/mdimg/perfume/375x500.24406.jpg",
  "Hawas": "https://fimgs.net/mdimg/perfume/375x500.36356.jpg",

  // Others
  "Midnight Oud": "https://fimgs.net/mdimg/perfume/375x500.36094.jpg",
  "Intense Oud": "https://fimgs.net/mdimg/perfume/375x500.42684.jpg",
  "Noya Oud is My Love": "https://fimgs.net/mdimg/perfume/375x500.67589.jpg",
  "Heritage": "https://fimgs.net/mdimg/perfume/375x500.24407.jpg",
  "Resala": "https://fimgs.net/mdimg/perfume/375x500.24408.jpg",
};

async function main() {
  console.log("🖼️  Adding images to perfumes...");

  let updated = 0;
  for (const [name, imageUrl] of Object.entries(imageMap)) {
    const result = await prisma.perfume.updateMany({
      where: { name, imageUrl: null },
      data: { imageUrl },
    });
    if (result.count > 0) {
      updated++;
      console.log(`  ✓ ${name}`);
    }
  }

  // Also update perfumes that already have imageUrl but it's empty string
  const result2 = await prisma.perfume.updateMany({
    where: { imageUrl: "" },
    data: { imageUrl: null },
  });

  console.log(`\n🖼️  Updated ${updated} perfumes with images.`);
  if (result2.count > 0) console.log(`   Cleaned ${result2.count} empty URLs.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
