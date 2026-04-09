import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Rating } from "@/components/ui/rating";
import Link from "next/link";
import { getInitials } from "@/lib/utils";

type Props = { params: Promise<{ username: string }> };

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params;

  const user = await db.user.findFirst({
    where: { username },
    select: {
      id: true,
      username: true,
      name: true,
      bio: true,
      image: true,
      createdAt: true,
      _count: { select: { reviews: true } },
      wardrobe: {
        where: { status: "have" },
        select: { perfumeId: true },
      },
      reviews: {
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          rating: true,
          createdAt: true,
          perfume: { select: { slug: true, name: true } },
        },
      },
    },
  });

  if (!user) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-20 h-20 rounded-full bg-gold-100 border-2 border-gold-400 flex items-center justify-center overflow-hidden">
          {user.image ? (
            <img src={user.image} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl font-serif text-gold-500">
              {getInitials(user.name ?? user.username ?? "U")}
            </span>
          )}
        </div>
        <div>
          <h1 className="font-serif text-2xl text-bark-500">
            {user.name ?? user.username}
          </h1>
          <p className="text-sm text-bark-200">@{user.username}</p>
          <p className="text-xs text-cream-600 mt-1">
            Member since {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      {/* Bio */}
      {user.bio && (
        <p className="text-bark-300 mb-6">{user.bio}</p>
      )}

      {/* Stats */}
      <div className="flex gap-6 mb-8 py-4 border-y border-cream-300/20">
        <div className="text-center">
          <p className="text-xl font-serif text-bark-500">{user.wardrobe.length}</p>
          <p className="text-xs text-cream-600 uppercase tracking-wider">Collection</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-serif text-bark-500">{user._count.reviews}</p>
          <p className="text-xs text-cream-600 uppercase tracking-wider">Reviews</p>
        </div>
      </div>

      {/* Recent Reviews */}
      {user.reviews.length > 0 && (
        <div>
          <h2 className="font-serif text-lg text-bark-500 mb-4">Recent Reviews</h2>
          <div className="flex flex-col gap-3">
            {user.reviews.map((review) => (
              <Link
                key={review.id}
                href={`/perfumes/${review.perfume.slug}`}
                className="bg-cream-200/30 backdrop-blur-sm border border-cream-300/20 rounded-lg p-4 hover:shadow-card transition-shadow"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gold-500">
                    {review.perfume.name}
                  </span>
                  <Rating value={review.rating} size="sm" />
                </div>
                <p className="text-sm text-bark-400">{review.title}</p>
                <p className="text-xs text-cream-600 mt-1">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
