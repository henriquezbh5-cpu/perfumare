import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { ReportActions } from "./report-actions";

export default async function AdminReportsPage() {
  const reports = await db.report.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      reporter: { select: { name: true, username: true } },
    },
  });

  const statusBadge = (status: string) => {
    if (status === "pending") return "default";
    if (status === "resolved") return "gold";
    return "arabian";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif text-bark-500 text-glow">Reports</h1>
        <p className="text-sm text-cream-600">
          {reports.filter((r) => r.status === "pending").length} pending
        </p>
      </div>

      {reports.length > 0 ? (
        <div className="glass-card divide-y divide-cream-300/10">
          {reports.map((report) => (
            <div key={report.id} className="px-4 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={statusBadge(report.status) as "default" | "gold" | "arabian"}>
                      {report.status}
                    </Badge>
                    <span className="text-xs text-cream-600">
                      {report.targetType} &middot; {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-bark-400">{report.reason}</p>
                  <p className="text-xs text-cream-600 mt-1">
                    Reported by{" "}
                    <span className="text-gold-500/80">
                      {report.reporter.name ?? report.reporter.username}
                    </span>
                  </p>
                </div>
                <ReportActions reportId={report.id} currentStatus={report.status} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card text-center py-12">
          <p className="text-cream-500">No reports. Everything looks clean!</p>
        </div>
      )}
    </div>
  );
}
