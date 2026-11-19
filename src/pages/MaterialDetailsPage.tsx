import { useState } from 'react';
import {
  ArrowLeft,
  Bookmark,
  Building2,
  Calendar,
  MapPin,
  ShieldAlert,
} from 'lucide-react';
import { MaterialImage } from '../components/MaterialImage';
import { QuoteModal } from '../components/QuoteModal';
import { useMarketplace } from '../context/MarketplaceContext';
import { formatCurrencyINR, formatRelativeDate } from '../utils/matching';

export function MaterialDetailsPage() {
  const {
    listings,
    selectedMaterialId,
    navigate,
    savedIds,
    toggleSavedMaterial,
    quotes,
  } = useMarketplace();
  const [quoteOpen, setQuoteOpen] = useState(false);

  const material =
    listings.find((item) => item.id === selectedMaterialId) ?? listings[0] ?? null;

  if (!material) {
    return (
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="font-display text-2xl font-bold text-[#0F172A]">Material not found</h1>
        <p className="mt-2 text-sm text-slate-600">
          This listing may have been removed in the current demo session.
        </p>
        <button
          type="button"
          onClick={() => navigate('marketplace')}
          className="mt-6 px-4 py-2.5 text-sm font-semibold text-white bg-[#0D3B2E] rounded-lg cursor-pointer"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  const isSaved = savedIds.includes(material.id);
  const existingQuotesForMaterial = quotes.filter((q) => q.materialId === material.id);

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb Back Action */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6">
        <button
          type="button"
          onClick={() => navigate('marketplace')}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#0F172A] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Material Marketplace
        </button>

        <div className="text-xs text-slate-500">
          Marketplace / {material.category} / <span className="text-[#0F172A]">{material.name}</span>
        </div>
      </div>

      {/* Main Split Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Large Photography & Detailed Description */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="aspect-[16/10] bg-slate-100">
              <MaterialImage
                src={material.imageUrl}
                alt={material.name}
                category={material.category}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="font-display text-lg font-bold text-[#0F172A]">
                Material Description
              </h2>
              <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed">
                {material.description}
              </p>
            </div>

            <div className="pt-6 border-t border-slate-200">
              <h2 className="font-display text-lg font-bold text-[#0F172A] mb-4">
                Technical Specifications (Supplier-Provided)
              </h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div className="pb-3 border-b border-slate-100">
                  <dt className="text-xs text-slate-500">Material Category</dt>
                  <dd className="font-semibold text-[#0F172A] mt-0.5">{material.category}</dd>
                </div>
                <div className="pb-3 border-b border-slate-100">
                  <dt className="text-xs text-slate-500">Material Type</dt>
                  <dd className="font-semibold text-[#0F172A] mt-0.5">{material.type}</dd>
                </div>
                <div className="pb-3 border-b border-slate-100">
                  <dt className="text-xs text-slate-500">Grade / Quality</dt>
                  <dd className="font-semibold text-[#0F172A] mt-0.5">{material.grade}</dd>
                </div>
                <div className="pb-3 border-b border-slate-100">
                  <dt className="text-xs text-slate-500">Available Quantity</dt>
                  <dd className="font-mono font-semibold tabular-nums text-[#0F172A] mt-0.5">
                    {material.quantity} {material.unit}
                  </dd>
                </div>
                <div className="pb-3 border-b border-slate-100">
                  <dt className="text-xs text-slate-500">Condition</dt>
                  <dd className="font-medium text-slate-800 mt-0.5">
                    {material.specifications?.condition ?? 'Clean recoverable industrial lot'}
                  </dd>
                </div>
                <div className="pb-3 border-b border-slate-100">
                  <dt className="text-xs text-slate-500">Packaging / Storage</dt>
                  <dd className="font-medium text-slate-800 mt-0.5">
                    {material.specifications?.packaging ?? 'Standard industrial pallet / crate'}
                  </dd>
                </div>
                <div className="pb-3 border-b border-slate-100">
                  <dt className="text-xs text-slate-500">Estimated Dispatch</dt>
                  <dd className="font-medium text-slate-800 mt-0.5">
                    {material.specifications?.dispatchWindow ?? 'Coordinated upon confirmation'}
                  </dd>
                </div>
                <div className="pb-3 border-b border-slate-100">
                  <dt className="text-xs text-slate-500">Classification</dt>
                  <dd className="font-medium text-slate-800 mt-0.5">
                    {material.specifications?.hazardClassification ??
                      'Declared non-hazardous recoverable material'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Right: Commercial Summary, Supplier Info & Quote CTA */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
              <span>
                <strong className="text-[#0D3B2E] font-semibold">{material.category}</strong> ·{' '}
                {material.isSampleData ? 'Sample Data' : 'Demo Listing'} · {material.status}
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatRelativeDate(material.createdAt)}
              </span>
            </div>

            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
                {material.name}
              </h1>
              <p className="mt-1.5 text-sm text-slate-600">{material.type}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-200">
              <div>
                <span className="text-xs text-slate-500 block">Available Quantity</span>
                <span className="font-mono text-xl font-bold tabular-nums text-[#0F172A]">
                  {material.quantity} {material.unit}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Expected Price</span>
                <span className="font-mono text-xl font-bold tabular-nums text-[#0D3B2E]">
                  {material.expectedPrice
                    ? `${formatCurrencyINR(material.expectedPrice)}`
                    : 'On Quote'}
                </span>
                {material.expectedPrice && (
                  <span className="text-xs text-slate-500 ml-1">/ {material.unit}</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-700">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                Location: <strong className="text-[#0F172A]">{material.location}</strong>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                type="button"
                onClick={() => setQuoteOpen(true)}
                className="flex-1 py-3 px-5 text-sm font-semibold text-white bg-[#059669] hover:bg-[#047857] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
              >
                Request Quote
              </button>
              <button
                type="button"
                onClick={() => toggleSavedMaterial(material.id)}
                className={`inline-flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isSaved
                    ? 'bg-[#0D3B2E] text-white border-[#0D3B2E]'
                    : 'bg-white text-[#0F172A] border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
                {isSaved ? 'Saved' : 'Save Material'}
              </button>
            </div>

            {existingQuotesForMaterial.length > 0 && (
              <div className="pt-2 text-xs text-slate-600 flex items-center justify-between">
                <span>
                  <strong className="font-mono tabular-nums text-[#0F172A]">
                    {existingQuotesForMaterial.length}
                  </strong>{' '}
                  demo quotation request{existingQuotesForMaterial.length > 1 ? 's' : ''} recorded
                  for this listing
                </span>
                <button
                  type="button"
                  onClick={() => navigate('requests')}
                  className="text-[#0D3B2E] font-semibold hover:underline cursor-pointer"
                >
                  View Requests
                </button>
              </div>
            )}
          </div>

          {/* Supplier Information Block */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-2.5">
              <Building2 className="w-5 h-5 text-[#0D3B2E]" />
              <h2 className="font-display text-base font-bold text-[#0F172A]">
                Supplier Profile
              </h2>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0F172A]">{material.supplierName}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {material.supplierContactRole ?? 'Industrial Materials Desk'} · {material.location}
              </p>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed pt-2 border-t border-slate-100">
              {material.isSampleData
                ? 'Illustrative sample supplier profile created for demonstration. Does not represent an independently audited or registered business.'
                : 'Demo supplier listing stored locally in your browser session.'}
            </p>
          </div>

          {/* Independent Verification Notice */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong className="text-[#0F172A]">Buyer Verification Notice:</strong> Material
              grade, weight, and physical condition are declared by the supplier and must be
              independently inspected before concluding any purchase or dispatch.
            </p>
          </div>
        </div>
      </div>

      {quoteOpen && <QuoteModal material={material} onClose={() => setQuoteOpen(false)} />}
    </div>
  );
}
