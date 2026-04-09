import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";

export default async function AdminUsersPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { reviews: true, forumPosts: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif text-bark-500 text-glow">Users</h1>
        <p className="text-sm text-cream-600">{users.length} total</p>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cream-300/10 text-left">
              <th className="px-4 py-3 text-xs text-cream-600 uppercase tracking-wider">User</th>
              <th className="px-4 py-3 text-xs text-cream-600 uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-xs text-cream-600 uppercase tracking-wider">Role</th>
              <th className="px-4 py-3 text-xs text-cream-600 uppercase tracking-wider">Reviews</th>
              <th className="px-4 py-3 text-xs text-cream-600 uppercase tracking-wider">Posts</th>
              <th className="px-4 py-3 text-xs text-cream-600 uppercase tracking-wider">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-300/10">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-cream-200/10 transition-colors">
                <td className="px-4 py-3">
                  <p className="text-bark-400 font-medium">{u.name ?? u.username ?? "—"}</p>
                  {u.username && <p className="text-xs text-cream-600">@{u.username}</p>}
                </td>
                <td className="px-4 py-3 text-cream-600">{u.email}</td>
                <td className="px-4 py-3">
                  <Badge variant={u.role === "admin" ? "gold" : "default"}>
                    {u.role}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-cream-600">{u._count.reviews}</td>
                <td className="px-4 py-3 text-cream-600">{u._count.forumPosts}</td>
                <td className="px-4 py-3 text-cream-600 text-xs">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
