import { useMemo, useState } from 'react';
import { ArrowUpDown, RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import { MaterialCard } from '../components/MaterialCard';
import { QuoteModal } from '../components/QuoteModal';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  MATERIAL_CATEGORIES,
  MaterialCategory,
  MaterialListing,
} from '../types/marketplace';
import { normalizeToKg } from '../utils/matching';

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'qty-desc';

export function MarketplacePage() {
  const { listings, navigate, setRole } = useMarketplace();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MaterialCategory | 'All'>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [gradeFilter, setGradeFilter] = useState('');
  const [minQtyTon, setMinQtyTon] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [quoteMaterial, setQuoteMaterial] = useState<MaterialListing | null>(null);

  const activeListings = useMemo(
    () => listings.filter((item) => item.status === 'Active'),
    [listings]
  );

  const availableCities = useMemo(() => {
    const set = new Set(activeListings.map((item) => item.location.trim()));
    return Array.from(set).sort();
  }, [activeListings]);

  const filteredListings = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const g = gradeFilter.trim().toLowerCase();
    const minKg = minQtyTon ? Number(minQtyTon) * 1000 : 0;

    const list = activeListings.filter((item) => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
      if (selectedCity !== 'All' && item.location !== selectedCity) return false;
      if (g && !item.grade.toLowerCase().includes(g)) return false;
      if (minKg > 0 && normalizeToKg(item.quantity, item.unit) < minKg) return false;

      if (q) {
        const haystack =
          `${item.name} ${item.category} ${item.type} ${item.grade} ${item.location} ${item.supplierName} ${item.description}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'price-asc') {
        const pa = a.expectedPrice ?? Number.MAX_SAFE_INTEGER;
        const pb = b.expectedPrice ?? Number.MAX_SAFE_INTEGER;
        return pa - pb;
      }
      if (sortBy === 'price-desc') {
        const pa = a.expectedPrice ?? -1;
        const pb = b.expectedPrice ?? -1;
        return pb - pa;
      }
      return normalizeToKg(b.quantity, b.unit) - normalizeToKg(a.quantity, a.unit);
    });
  }, [activeListings, searchQuery, selectedCategory, selectedCity, gradeFilter, minQtyTon, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All' ||
    selectedCity !== 'All' ||
    gradeFilter.trim() !== '' ||
    minQtyTon !== '';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedCity('All');
    setGradeFilter('');
    setMinQtyTon('');
    setSortBy('newest');
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-8 border-b border-slate-200">
        <div>
          <p className="text-xs font-medium text-[#0D3B2E]">
            B2B Secondary Raw Materials Exchange
          </p>
          <h1 className="font-display text-3xl font-bold text-[#0F172A] tracking-tight mt-1">
            Material Marketplace
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl">
            Browse recoverable industrial scrap, manufacturing offcuts, and surplus raw materials.
            Preloaded listings are clearly labeled as Sample Data; any listing created in Supplier
            Hub appears here immediately.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              setRole('buyer');
              navigate('post-requirement');
            }}
            className="px-4 py-2.5 text-sm font-semibold text-[#0F172A] bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Post Material Requirement
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('supplier');
              navigate('add-listing');
            }}
            className="px-4 py-2.5 text-sm font-semibold text-white bg-[#0D3B2E] hover:bg-[#114D3C] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            + List Material
          </button>
        </div>
      </div>

      {/* Search & Filter Control Panel */}
      <div className="mt-6 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
          {/* Primary Search */}
          <div className="lg:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search material name, alloy, grade, supplier, or city..."
              aria-label="Search materials"
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
            />
          </div>

          {/* Category Filter */}
          <div className="lg:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as MaterialCategory | 'All')}
              aria-label="Filter by material category"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="All">All Material Categories</option>
              {MATERIAL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* City Filter */}
          <div className="lg:col-span-2">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              aria-label="Filter by city"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="All">All Cities</option>
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="lg:col-span-2 relative">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              aria-label="Sort listings"
              className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="newest">Newest Listed</option>
              <option value="qty-desc">Highest Quantity</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Secondary Precision Filters: Grade & Min Quantity */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Refinements:
            </span>
            <input
              type="text"
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              placeholder="Filter grade (e.g. 6061, IS 2062, Clear)"
              aria-label="Filter by quality or grade"
              className="px-3 py-1.5 text-xs border border-slate-300 rounded-md w-60 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            <div className="flex items-center gap-1.5">
              <label htmlFor="min-qty" className="text-xs text-slate-500">
                Min Qty (TON):
              </label>
              <input
                id="min-qty"
                type="number"
                min="0"
                step="0.5"
                value={minQtyTon}
                onChange={(e) => setMinQtyTon(e.target.value)}
                placeholder="Any"
                className="px-2.5 py-1.5 text-xs font-mono tabular-nums border border-slate-300 rounded-md w-24 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-600">
            <span className="tabular-nums">
              Showing <strong className="text-[#0F172A]">{filteredListings.length}</strong> of{' '}
              <strong className="text-[#0F172A]">{activeListings.length}</strong> active listings
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-[#0D3B2E] font-semibold hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Quick-Filter Segmented Strip */}
      <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1">
        {(['All', ...MATERIAL_CATEGORIES] as const).map((cat) => {
          const active = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                active
                  ? 'bg-[#0F172A] text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-[#0F172A]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Material Listings Grid */}
      {filteredListings.length === 0 ? (
        <div className="mt-8 bg-white border border-slate-200 rounded-xl p-12 text-center">
          <h2 className="font-display text-lg font-bold text-[#0F172A]">
            No matching materials found
          </h2>
          <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
            No active listings match your current filter combination. Clear filters or post a
            custom Material Requirement so suppliers know what you need.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 text-sm font-semibold text-[#0F172A] border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Clear Filters
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('buyer');
                navigate('post-requirement');
              }}
              className="px-4 py-2 text-sm font-semibold text-white bg-[#059669] hover:bg-[#047857] rounded-lg cursor-pointer"
            >
              Post Material Requirement
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <MaterialCard
              key={listing.id}
              listing={listing}
              onRequestQuote={(item) => setQuoteMaterial(item)}
            />
          ))}
        </div>
      )}

      {quoteMaterial && (
        <QuoteModal material={quoteMaterial} onClose={() => setQuoteMaterial(null)} />
      )}
    </div>
  );
}
