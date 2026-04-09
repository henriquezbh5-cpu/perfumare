import { db } from "@/lib/db";

export default async function AdminDashboard() {
  const [perfumeCount, brandCount, userCount, reviewCount, articleCount, reportCount] =
    await Promise.all([
      db.perfume.count(),
      db.brand.count(),
      db.user.count(),
      db.review.count({ where: { deletedAt: null } }),
      db.article.count(),
      db.report.count({ where: { status: "pending" } }),
    ]);

  const stats = [
    { label: "Perfumes", value: perfumeCount, color: "text-gold-500" },
    { label: "Brands", value: brandCount, color: "text-gold-400" },
    { label: "Users", value: userCount, color: "text-blue-400" },
    { label: "Reviews", value: reviewCount, color: "text-green-400" },
    { label: "Articles", value: articleCount, color: "text-purple-400" },
    { label: "Pending Reports", value: reportCount, color: "text-red-400" },
  ];

  const recentReviews = await db.review.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      user: { select: { name: true, username: true } },
      perfume: { select: { name: true, slug: true } },
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-serif text-bark-500 text-glow">Dashboard</h1>
        <p className="text-sm text-cream-600 mt-1">Overview of your fragrance encyclopedia</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card p-4 text-center">
            <p className={`text-3xl font-serif ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-cream-600 uppercase tracking-wider mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Recent reviews */}
      <div>
        <h2 className="section-title mb-4">Recent Reviews</h2>
        <div className="glass-card divide-y divide-cream-300/10">
          {recentReviews.length > 0 ? (
            recentReviews.map((review) => (
              <div key={review.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-bark-400">
                    <span className="text-gold-500">
                      {review.user.name ?? review.user.username}
                    </span>
                    {" reviewed "}
                    <span className="text-bark-500 font-medium">
                      {review.perfume.name}
                    </span>
                  </p>
                  <p className="text-xs text-cream-600">
                    {new Date(review.createdAt).toLocaleString()} &middot; {review.rating}/5
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-8 text-center text-cream-500 text-sm">
              No reviews yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
