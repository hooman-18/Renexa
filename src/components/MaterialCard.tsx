import { Bookmark, MapPin } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { MaterialListing } from '../types/marketplace';
import { formatCurrencyINR } from '../utils/matching';
import { MaterialImage } from './MaterialImage';

interface MaterialCardProps {
  listing: MaterialListing;
  onRequestQuote: (listing: MaterialListing) => void;
}

export function MaterialCard({ listing, onRequestQuote }: MaterialCardProps) {
  const { navigate, savedIds, toggleSavedMaterial } = useMarketplace();
  const isSaved = savedIds.includes(listing.id);

  return (
    <article className="group bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col transition-colors hover:border-slate-300">
      {/* 4:3 Material Photography */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        <button
          type="button"
          onClick={() => navigate('material-details', { materialId: listing.id })}
          className="block w-full h-full text-left cursor-pointer focus-visible:outline-none"
          aria-label={`View details for ${listing.name}`}
        >
          <MaterialImage
            src={listing.imageUrl}
            alt={listing.name}
            category={listing.category}
            className="w-full h-full transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </button>

        {/* Functional Bookmark Toggle */}
        <button
          type="button"
          onClick={() => toggleSavedMaterial(listing.id)}
          className={`absolute top-3 right-3 w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${
            isSaved
              ? 'bg-[#0D3B2E] text-white'
              : 'bg-white/90 text-slate-700 hover:bg-white'
          }`}
          aria-label={isSaved ? `Remove ${listing.name} from saved` : `Save ${listing.name}`}
          aria-pressed={isSaved}
        >
          <Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Card Body — Zero-Pill Metadata Discipline */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1.5">
          <div className="flex items-center gap-1.5 min-w-0 truncate">
            <span className="font-medium text-[#0D3B2E] truncate">{listing.category}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">
              {listing.isSampleData ? 'Sample Data' : 'Demo Listing'}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-slate-600 shrink-0">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {listing.location}
          </span>
        </div>

        <h3 className="font-display text-lg font-bold text-[#0F172A] leading-snug">
          <button
            type="button"
            onClick={() => navigate('material-details', { materialId: listing.id })}
            className="text-left hover:text-[#0D3B2E] transition-colors cursor-pointer"
          >
            {listing.name}
          </button>
        </h3>

        <p className="text-xs text-slate-600 mt-1 line-clamp-1" title={listing.grade}>
          Grade: <span className="font-medium text-slate-800">{listing.grade}</span>
        </p>

        {/* Key Specs Row with Hairline Divider */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 grid grid-cols-2 gap-3">
          <div>
            <span className="block text-[11px] text-slate-500">Available Quantity</span>
            <span className="font-mono text-sm font-semibold tabular-nums text-[#0F172A]">
              {listing.quantity} {listing.unit}
            </span>
          </div>
          <div className="text-right">
            <span className="block text-[11px] text-slate-500">Expected Price</span>
            <span className="font-mono text-sm font-semibold tabular-nums text-[#0D3B2E]">
              {listing.expectedPrice
                ? `${formatCurrencyINR(listing.expectedPrice)}/${listing.unit}`
                : 'On Quotation'}
            </span>
          </div>
        </div>

        <p className="mt-3 text-xs text-slate-500 truncate">
          Supplier: <span className="text-slate-700 font-medium">{listing.supplierName}</span>
        </p>

        {/* Actions */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => navigate('material-details', { materialId: listing.id })}
            className="px-3 py-2 text-xs font-semibold text-[#0F172A] bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            View Details
          </button>
          <button
            type="button"
            onClick={() => onRequestQuote(listing)}
            className="px-3 py-2 text-xs font-semibold text-white bg-[#059669] hover:bg-[#047857] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Request Quote
          </button>
        </div>
      </div>
    </article>
  );
}
