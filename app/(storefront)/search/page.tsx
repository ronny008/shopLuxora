import { api } from '@/lib/services/api';
import { ProductCard } from '@/components/shared/ProductCard';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || '';
  
  const allProducts = await api.products.getAll();
  
  // Basic search filter (name or description)
  const searchResults = allProducts.filter(p => {
    if (!query) return false;
    const lowerQuery = query.toLowerCase();
    return p.name.toLowerCase().includes(lowerQuery) || 
           (p.description && p.description.toLowerCase().includes(lowerQuery));
  });

  return (
    <div className="bg-white min-h-[70vh]">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-2xl md:text-3xl font-extrabold uppercase tracking-widest text-black mb-4 text-center">
          Search Results
        </h1>
        {query && (
          <p className="text-center text-sm font-medium text-black/60 mb-12 uppercase tracking-wider">
            Showing results for &quot;{query}&quot;
          </p>
        )}

        {!query ? (
          <div className="text-center text-black/50 py-16 font-medium text-sm">
            Please enter a search term to find products.
          </div>
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {searchResults.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center text-black/50 py-16 font-medium text-sm flex flex-col items-center gap-4">
            <p>No products found matching &quot;{query}&quot;.</p>
            <p>Try checking your spelling or use more general terms.</p>
          </div>
        )}
      </div>
    </div>
  );
}
