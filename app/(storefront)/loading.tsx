export default function StorefrontLoading() {
  return (
    <div className="container mx-auto px-4 py-12 animate-pulse space-y-8">
      {/* Hero Banner Skeleton */}
      <div className="w-full h-64 md:h-96 bg-slate-200" />

      {/* Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-3">
            <div className="w-full aspect-square bg-slate-200" />
            <div className="h-4 bg-slate-200 w-3/4 mx-auto" />
            <div className="h-4 bg-slate-200 w-1/2 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
