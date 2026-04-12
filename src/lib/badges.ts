import { db } from "./db";

export const BADGE_DEFINITIONS = [
  {
    name: "First Review",
    description: "Wrote your first perfume review",
    criteria: { type: "review_count", threshold: 1 },
  },
  {
    name: "Reviewer",
    description: "Wrote 10 perfume reviews",
    criteria: { type: "review_count", threshold: 10 },
  },
  {
    name: "Critic",
    description: "Wrote 50 perfume reviews",
    criteria: { type: "review_count", threshold: 50 },
  },
  {
    name: "Master Critic",
    description: "Wrote 100 perfume reviews",
    criteria: { type: "review_count", threshold: 100 },
  },
  {
    name: "Collector",
    description: "Added 10 perfumes to your wardrobe",
    criteria: { type: "wardrobe_count", threshold: 10 },
  },
  {
    name: "Connoisseur",
    description: "Added 50 perfumes to your wardrobe",
    criteria: { type: "wardrobe_count", threshold: 50 },
  },
  {
    name: "Oud Expert",
    description: "Reviewed 5 perfumes with oud notes",
    criteria: { type: "note_reviews", note: "oud", threshold: 5 },
  },
  {
    name: "Community Voice",
    description: "Created 10 forum posts",
    criteria: { type: "post_count", threshold: 10 },
  },
  {
    name: "Founding Member",
    description: "Joined during the first month of Perfumare",
    criteria: { type: "founding_member" },
  },
  {
    name: "Helpful",
    description: "Received 10 helpful votes on reviews",
    criteria: { type: "helpful_count", threshold: 10 },
  },
];

export async function checkAndAwardBadges(userId: string) {
  const badges = await db.badge.findMany();
  const existingBadges = await db.userBadge.findMany({
    where: { userId },
    select: { badgeId: true },
  });
  const existingIds = new Set(existingBadges.map((b) => b.badgeId));

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      createdAt: true,
      _count: {
        select: {
          reviews: true,
          wardrobe: true,
          forumPosts: true,
        },
      },
    },
  });

  if (!user) return;

  const reviewHelpful = await db.review.aggregate({
    where: { userId },
    _sum: { helpfulCount: true },
  });

  const awarded: string[] = [];

  for (const badge of badges) {
    if (existingIds.has(badge.id)) continue;

    const criteria = badge.criteria as Record<string, unknown> | null;
    if (!criteria) continue;

    let qualifies = false;

    switch (criteria.type) {
      case "review_count":
        qualifies = user._count.reviews >= (criteria.threshold as number);
        break;
      case "wardrobe_count":
        qualifies = user._count.wardrobe >= (criteria.threshold as number);
        break;
      case "post_count":
        qualifies = user._count.forumPosts >= (criteria.threshold as number);
        break;
      case "helpful_count":
        qualifies =
          (reviewHelpful._sum.helpfulCount ?? 0) >=
          (criteria.threshold as number);
        break;
      case "founding_member": {
        const launchDate = new Date("2026-05-01");
        qualifies = user.createdAt < launchDate;
        break;
      }
    }

    if (qualifies) {
      await db.userBadge.create({
        data: { userId, badgeId: badge.id },
      });
      awarded.push(badge.name);
    }
  }

  return awarded;
}
