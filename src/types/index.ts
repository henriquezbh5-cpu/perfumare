export type Gender = "male" | "female" | "unisex";
export type Concentration = "EDP" | "EDT" | "Parfum" | "Cologne" | "Oil";
export type NoteLayer = "top" | "middle" | "base";
export type SillageLevel = "intimate" | "moderate" | "strong" | "enormous";
export type Season = "spring" | "summer" | "fall" | "winter";
export type TimeOfDay = "day" | "night";
export type WardrobeStatus = "have" | "want" | "had";
export type BrandCategory = "Designer" | "Niche" | "Arabian" | "Independent";
export type NoteFamily =
  | "Floral"
  | "Woody"
  | "Oriental"
  | "Fresh"
  | "Spicy"
  | "Citrus"
  | "Gourmand"
  | "Aquatic"
  | "Green"
  | "Earthy"
  | "Musky";
export type UserRole = "user" | "moderator" | "admin";

export interface PerfumeWithRelations {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  gender: Gender;
  year: number | null;
  concentration: Concentration;
  imageUrl: string | null;
  brand: { name: string; slug: string };
  perfumer: { name: string; slug: string } | null;
  notes: {
    note: { name: string; slug: string; family: NoteFamily };
    layer: NoteLayer;
    voteCount: number;
  }[];
  accords: {
    accord: { name: string; color: string };
    intensity: number;
  }[];
  _count: { reviews: number };
  avgRating: number | null;
}

export interface BrandWithCount {
  id: string;
  slug: string;
  name: string;
  country: string | null;
  category: BrandCategory;
  logoUrl: string | null;
  _count: { perfumes: number };
}

export interface NoteWithCount {
  id: string;
  slug: string;
  name: string;
  family: NoteFamily;
  imageUrl: string | null;
  _count: { perfumes: number };
}

export interface SearchResult {
  type: "perfume" | "brand" | "note" | "perfumer";
  slug: string;
  name: string;
  subtitle: string;
}
