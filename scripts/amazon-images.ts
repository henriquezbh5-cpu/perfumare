import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// Amazon ASINs for perfumes without images
// Image URL pattern: https://m.media-amazon.com/images/I/{imageId}._SL500_.jpg
const perfumeImages: Record<string, string> = {
  // Lattafa
  "Khamrah": "https://m.media-amazon.com/images/I/61lIaaNDDqL._SL500_.jpg",
  "Asad": "https://m.media-amazon.com/images/I/61Kt8U4PuML._SL500_.jpg",
  "Yara": "https://m.media-amazon.com/images/I/51cQP4xdWaL._SL500_.jpg",
  "Oud for Glory": "https://m.media-amazon.com/images/I/61m-x7F1SSL._SL500_.jpg",
  "Raghba": "https://m.media-amazon.com/images/I/51zQ-CJVDAL._SL500_.jpg",
  "Ana Abiyedh": "https://m.media-amazon.com/images/I/51oEm+GDOAL._SL500_.jpg",
  "Qaed Al Fursan": "https://m.media-amazon.com/images/I/51X7NfGnKrL._SL500_.jpg",
  "Bade'e Al Oud Amethyst": "https://m.media-amazon.com/images/I/51hZaJ0XqhL._SL500_.jpg",

  // Creed
  "Aventus": "https://m.media-amazon.com/images/I/51OJRqONoRL._SL500_.jpg",
  "Green Irish Tweed": "https://m.media-amazon.com/images/I/31iwJCBfNQL._SL500_.jpg",
  "Silver Mountain Water": "https://m.media-amazon.com/images/I/31eGqyO+VQL._SL500_.jpg",
  "Viking": "https://m.media-amazon.com/images/I/51Dj0bR9vGL._SL500_.jpg",

  // MFK
  "Baccarat Rouge 540": "https://m.media-amazon.com/images/I/51aET52nNsL._SL500_.jpg",
  "Grand Soir": "https://m.media-amazon.com/images/I/41Iv5VbNZ1L._SL500_.jpg",
  "Oud Silk Mood": "https://m.media-amazon.com/images/I/41sR5ggcYgL._SL500_.jpg",
  "Gentle Fluidity Gold": "https://m.media-amazon.com/images/I/41LqwGYNR8L._SL500_.jpg",
  "Petit Matin": "https://m.media-amazon.com/images/I/41wjLklqP+L._SL500_.jpg",
  "Aqua Universalis": "https://m.media-amazon.com/images/I/31KOt0Z9zVL._SL500_.jpg",

  // Tom Ford
  "Oud Wood": "https://m.media-amazon.com/images/I/51UGjstJq2L._SL500_.jpg",
  "Tobacco Vanilla": "https://m.media-amazon.com/images/I/41qNTrFgYjL._SL500_.jpg",
  "Lost Cherry": "https://m.media-amazon.com/images/I/51JDOvTINhL._SL500_.jpg",
  "Bitter Peach": "https://m.media-amazon.com/images/I/51Yj6vFpv0L._SL500_.jpg",
  "Noir de Noir": "https://m.media-amazon.com/images/I/41z3GWcPPmL._SL500_.jpg",
  "Black Orchid": "https://m.media-amazon.com/images/I/31a3rhKiOEL._SL500_.jpg",

  // Dior
  "Sauvage": "https://m.media-amazon.com/images/I/61TY+gNiNSL._SL500_.jpg",
  "Miss Dior": "https://m.media-amazon.com/images/I/51ek3jJHGSL._SL500_.jpg",
  "J'adore": "https://m.media-amazon.com/images/I/41Rr6LaIBtL._SL500_.jpg",
  "Fahrenheit": "https://m.media-amazon.com/images/I/41QNJLQig3L._SL500_.jpg",

  // Chanel
  "No. 5": "https://m.media-amazon.com/images/I/61iUGi0YMWL._SL500_.jpg",
  "Bleu de Chanel": "https://m.media-amazon.com/images/I/41J5yjHfvJL._SL500_.jpg",
  "Coco Mademoiselle": "https://m.media-amazon.com/images/I/51+XjYHB8rL._SL500_.jpg",
  "Allure Homme Sport": "https://m.media-amazon.com/images/I/41QVTfmhqAL._SL500_.jpg",

  // Versace
  "Eros": "https://m.media-amazon.com/images/I/41vQfbKhHGL._SL500_.jpg",
  "Dylan Blue": "https://m.media-amazon.com/images/I/41ofFv-2aHL._SL500_.jpg",

  // YSL
  "La Nuit de l'Homme": "https://m.media-amazon.com/images/I/41hMV05K2lL._SL500_.jpg",
  "Libre": "https://m.media-amazon.com/images/I/41Xn6b0+0IL._SL500_.jpg",

  // Giorgio Armani
  "Acqua di Gio": "https://m.media-amazon.com/images/I/31oRsztylPL._SL500_.jpg",
  "Si": "https://m.media-amazon.com/images/I/41ZiYiSo+jL._SL500_.jpg",
  "Armani Code": "https://m.media-amazon.com/images/I/41nscW1dBBL._SL500_.jpg",

  // D&G
  "The One": "https://m.media-amazon.com/images/I/41Q5Ml1FqCL._SL500_.jpg",
  "Light Blue": "https://m.media-amazon.com/images/I/31ViMiIE3QL._SL500_.jpg",

  // JPG
  "Le Male": "https://m.media-amazon.com/images/I/51UqmhXNGdL._SL500_.jpg",
  "Le Male Le Parfum": "https://m.media-amazon.com/images/I/41BibLkEnPL._SL500_.jpg",

  // Guerlain
  "Shalimar": "https://m.media-amazon.com/images/I/41TW5rB0SxL._SL500_.jpg",
  "L'Homme Ideal": "https://m.media-amazon.com/images/I/41W2zVH-VmL._SL500_.jpg",

  // PDM
  "Layton": "https://m.media-amazon.com/images/I/41sVA+qzLAL._SL500_.jpg",
  "Pegasus": "https://m.media-amazon.com/images/I/41oLNc2jfJL._SL500_.jpg",
  "Sedley": "https://m.media-amazon.com/images/I/41KA07vn3RL._SL500_.jpg",
  "Delina": "https://m.media-amazon.com/images/I/41lD7-WwEQL._SL500_.jpg",

  // Initio
  "Oud for Greatness": "https://m.media-amazon.com/images/I/41Y4Bi8FbRL._SL500_.jpg",
  "Side Effect": "https://m.media-amazon.com/images/I/41Rau7N48FL._SL500_.jpg",
  "Musk Therapy": "https://m.media-amazon.com/images/I/41MNt-Rj-nL._SL500_.jpg",

  // Xerjoff
  "Naxos": "https://m.media-amazon.com/images/I/41PH8YM6VIL._SL500_.jpg",
  "Erba Pura": "https://m.media-amazon.com/images/I/51UVuQ0GNBL._SL500_.jpg",
  "Alexandria II": "https://m.media-amazon.com/images/I/31QxfnSHFHL._SL500_.jpg",

  // Kilian
  "Love Don't Be Shy": "https://m.media-amazon.com/images/I/41LJ1k7TAOL._SL500_.jpg",
  "Good Girl Gone Bad": "https://m.media-amazon.com/images/I/31R++JDIAGL._SL500_.jpg",

  // Nishane
  "Hacivat": "https://m.media-amazon.com/images/I/41sXBagsKhL._SL500_.jpg",
  "Ani": "https://m.media-amazon.com/images/I/41eSfFoIwFL._SL500_.jpg",
  "Hundred Silent Ways": "https://m.media-amazon.com/images/I/41d-H3mmCRL._SL500_.jpg",

  // Montale
  "Intense Cafe": "https://m.media-amazon.com/images/I/31CgJnBjpGL._SL500_.jpg",
  "Chocolate Greedy": "https://m.media-amazon.com/images/I/31xyNPaBYQL._SL500_.jpg",

  // Mancera
  "Cedrat Boise": "https://m.media-amazon.com/images/I/41BtZMKIWPL._SL500_.jpg",
  "Instant Crush": "https://m.media-amazon.com/images/I/41gZPdfBVYL._SL500_.jpg",
  "Red Tobacco": "https://m.media-amazon.com/images/I/41pq7CqvANL._SL500_.jpg",

  // Byredo
  "Gypsy Water": "https://m.media-amazon.com/images/I/21lN5x+PpIL._SL500_.jpg",
  "Bal d'Afrique": "https://m.media-amazon.com/images/I/21U0hSrdmDL._SL500_.jpg",
  "Mojave Ghost": "https://m.media-amazon.com/images/I/21FjIFuHoyL._SL500_.jpg",

  // Le Labo
  "Santal 33": "https://m.media-amazon.com/images/I/31RqzEv37iL._SL500_.jpg",
  "Rose 31": "https://m.media-amazon.com/images/I/31jS4gSS4fL._SL500_.jpg",
  "Another 13": "https://m.media-amazon.com/images/I/31qp3c4vJKL._SL500_.jpg",

  // Maison Margiela
  "Jazz Club": "https://m.media-amazon.com/images/I/41x-bPHiZfL._SL500_.jpg",
  "By the Fireplace": "https://m.media-amazon.com/images/I/41LsXo+vGkL._SL500_.jpg",
  "Whispers in the Library": "https://m.media-amazon.com/images/I/41OWlTQC7fL._SL500_.jpg",

  // Hermes
  "Terre d'Hermès": "https://m.media-amazon.com/images/I/41JNwGPbDSL._SL500_.jpg",
  "Un Jardin sur le Nil": "https://m.media-amazon.com/images/I/41WlXDvhNTL._SL500_.jpg",

  // Amouage
  "Interlude Man": "https://m.media-amazon.com/images/I/41Dpa4qQkPL._SL500_.jpg",
  "Reflection Man": "https://m.media-amazon.com/images/I/41bWZ0r+i8L._SL500_.jpg",
  "Jubilation XXV": "https://m.media-amazon.com/images/I/41dQX1sHgeL._SL500_.jpg",

  // Afnan
  "9PM": "https://m.media-amazon.com/images/I/51xBXWwh7fL._SL500_.jpg",
  "Supremacy Silver": "https://m.media-amazon.com/images/I/51c2+4FWCQL._SL500_.jpg",
  "Turathi Blue": "https://m.media-amazon.com/images/I/51bCZzd8N7L._SL500_.jpg",

  // Armaf
  "Club de Nuit Intense Man": "https://m.media-amazon.com/images/I/41v6AI-WfPL._SL500_.jpg",
  "Club de Nuit Intense Woman": "https://m.media-amazon.com/images/I/51PXqzRgBYL._SL500_.jpg",
  "Sillage": "https://m.media-amazon.com/images/I/41UJBkpkbBL._SL500_.jpg",

  // Al Haramain
  "Amber Oud Gold Edition": "https://m.media-amazon.com/images/I/51EIkj1t+RL._SL500_.jpg",
  "Amber Oud Rouge": "https://m.media-amazon.com/images/I/51mP5NF3QFL._SL500_.jpg",
  "L'Aventure": "https://m.media-amazon.com/images/I/51eC2mTqCYL._SL500_.jpg",

  // Rasasi
  "La Yuqawam": "https://m.media-amazon.com/images/I/51X0LgGy1tL._SL500_.jpg",
  "Hawas": "https://m.media-amazon.com/images/I/41L7lE0v7eL._SL500_.jpg",

  // Swiss Arabian
  "Shaghaf Oud": "https://m.media-amazon.com/images/I/41nI5d6yG8L._SL500_.jpg",
  "Kashkha": "https://m.media-amazon.com/images/I/41P8-gMHG0L._SL500_.jpg",
  "Shaheen": "https://m.media-amazon.com/images/I/41QRKwv+NeL._SL500_.jpg",

  // Others
  "Tiziana Terenzi Kirke": "https://m.media-amazon.com/images/I/31kzLHFfUkL._SL500_.jpg",
  "Colonia": "https://m.media-amazon.com/images/I/41YzREHFJcL._SL500_.jpg",
  "Oud & Spice": "https://m.media-amazon.com/images/I/41G8K2H+t5L._SL500_.jpg",
  "Halfeti": "https://m.media-amazon.com/images/I/31eBTdYUfLL._SL500_.jpg",
  "Endymion": "https://m.media-amazon.com/images/I/41I-Fqly6sL._SL500_.jpg",
  "Heritage": "https://m.media-amazon.com/images/I/41j4vfbwuZL._SL500_.jpg",
  "Resala": "https://m.media-amazon.com/images/I/51l0HwhIhLL._SL500_.jpg",
  "Intense Oud": "https://m.media-amazon.com/images/I/41F3IBGA3tL._SL500_.jpg",
  "Midnight Oud": "https://m.media-amazon.com/images/I/51K2ztJPYML._SL500_.jpg",
  "Noya Oud is My Love": "https://m.media-amazon.com/images/I/41nhBfJYReL._SL500_.jpg",
};

async function main() {
  console.log("🖼️  Updating perfume images from Amazon...\n");

  let updated = 0;
  let notFound = 0;

  for (const [name, imageUrl] of Object.entries(perfumeImages)) {
    const result = await prisma.perfume.updateMany({
      where: { name, imageUrl: null },
      data: { imageUrl },
    });

    if (result.count > 0) {
      console.log(`  ✓ ${name}`);
      updated++;
    } else {
      // Try partial match for names like "Kirke" inside "Tiziana Terenzi Kirke"
      const cleanName = name.replace(/^.+ /, "");
      if (cleanName !== name) {
        const result2 = await prisma.perfume.updateMany({
          where: { name: cleanName, imageUrl: null },
          data: { imageUrl },
        });
        if (result2.count > 0) {
          console.log(`  ✓ ${cleanName} (matched from ${name})`);
          updated++;
        } else {
          notFound++;
        }
      } else {
        notFound++;
      }
    }
  }

  const remaining = await prisma.perfume.count({ where: { imageUrl: null } });
  console.log(`\n✅ Updated: ${updated} | Not matched: ${notFound} | Still without image: ${remaining}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
