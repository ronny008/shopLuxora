export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-7 bg-slate-200 w-48" />
        <div className="h-10 bg-slate-200 w-32" />
      </div>

      {/* Table Skeleton */}
      <div className="bg-white border border-slate-200 p-6 space-y-4">
        <div className="h-10 bg-slate-200 w-64 mb-6" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-slate-100 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
