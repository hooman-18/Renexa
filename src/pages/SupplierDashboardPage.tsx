import { useMemo, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Edit3,
  Eye,
  PauseCircle,
  PlayCircle,
  Plus,
  Trash2,
  XCircle,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { QuoteStatus } from '../types/marketplace';
import { formatCurrencyINR, formatRelativeDate } from '../utils/matching';

export function SupplierDashboardPage() {
  const {
    listings,
    quotes,
    activities,
    navigate,
    deleteListing,
    toggleListingStatus,
    updateQuoteStatus,
  } = useMarketplace();

  const [listingFilter, setListingFilter] = useState<'all' | 'active' | 'paused'>('all');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const totalListings = listings.length;
    const activeListings = listings.filter((l) => l.status === 'Active').length;
    const totalEnquiries = quotes.length;
    const pendingRequests = quotes.filter((q) => q.status === 'Pending').length;
    return { totalListings, activeListings, totalEnquiries, pendingRequests };
  }, [listings, quotes]);

  const filteredListings = useMemo(() => {
    if (listingFilter === 'active') return listings.filter((l) => l.status === 'Active');
    if (listingFilter === 'paused') return listings.filter((l) => l.status === 'Paused');
    return listings;
  }, [listings, listingFilter]);

  const supplierActivities = useMemo(
    () => activities.filter((a) => a.role === 'supplier' || a.role === 'both').slice(0, 6),
    [activities]
  );

  const renderStatusLabel = (status: QuoteStatus) => {
    if (status === 'Accepted') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Accepted
        </span>
      );
    }
    if (status === 'Rejected') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700">
          <XCircle className="w-3.5 h-3.5" />
          Rejected
        </span>
      );
    }
    if (status === 'Completed') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0D3B2E]">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Completed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700">
        <Clock className="w-3.5 h-3.5" />
        Pending
      </span>
    );
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <p className="text-xs font-medium text-[#0D3B2E]">
            Supplier Workspace · Industrial Material Generator
          </p>
          <h1 className="font-display text-3xl font-bold text-[#0F172A] tracking-tight mt-1">
            Supplier Dashboard
          </h1>
          <p className="mt-1.5 text-sm text-slate-600">
            Publish usable scrap and leftover industrial materials, manage availability, and
            respond to incoming buyer quotation requests.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('add-listing')}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#0D3B2E] hover:bg-[#114D3C] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          List New Material
        </button>
      </div>

      {/* 4-Column Flat KPI Strip */}
      <section aria-label="Supplier Overview Metrics" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500">Total Material Listings</p>
          <p className="mt-2 font-mono text-3xl font-bold tabular-nums text-[#0F172A]">
            {stats.totalListings}
          </p>
          <p className="mt-1 text-xs text-slate-500">Catalog entries in demo storage</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500">Active Listings</p>
          <p className="mt-2 font-mono text-3xl font-bold tabular-nums text-[#0D3B2E]">
            {stats.activeListings}
          </p>
          <p className="mt-1 text-xs text-slate-500">Visible in Marketplace &amp; Matching</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500">Buyer Enquiries</p>
          <p className="mt-2 font-mono text-3xl font-bold tabular-nums text-[#0F172A]">
            {stats.totalEnquiries}
          </p>
          <p className="mt-1 text-xs text-slate-500">Total simulated quotation requests</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500">Pending Quotation Requests</p>
          <p className="mt-2 font-mono text-3xl font-bold tabular-nums text-amber-700">
            {stats.pendingRequests}
          </p>
          <p className="mt-1 text-xs text-slate-500">Awaiting supplier response</p>
        </div>
      </section>

      {/* Managed Material Listings Table */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-bold text-[#0F172A]">
              Material Listings
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Edit specifications, pause availability, or remove listings from the marketplace.
            </p>
          </div>

          <div className="inline-flex items-center p-1 bg-slate-100 rounded-lg text-xs">
            {(['all', 'active', 'paused'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setListingFilter(tab)}
                className={`px-3 py-1.5 font-medium rounded-md capitalize transition-colors cursor-pointer ${
                  listingFilter === tab
                    ? 'bg-white text-[#0F172A] shadow-xs'
                    : 'text-slate-600 hover:text-[#0F172A]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {filteredListings.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm font-semibold text-[#0F172A]">No listings in this view</p>
            <p className="text-xs text-slate-500 mt-1">
              Publish a new recoverable material listing to make it searchable for buyers.
            </p>
            <button
              type="button"
              onClick={() => navigate('add-listing')}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-[#0D3B2E] rounded-lg cursor-pointer"
            >
              + List New Material
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-500">
                  <th className="py-3 px-6">Material &amp; Grade</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Quantity</th>
                  <th className="py-3 px-4 text-right">Expected Price</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {filteredListings.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-6">
                      <button
                        type="button"
                        onClick={() => navigate('material-details', { materialId: item.id })}
                        className="font-semibold text-[#0F172A] hover:text-[#0D3B2E] text-left cursor-pointer"
                      >
                        {item.name}
                      </button>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.grade} · {item.isSampleData ? 'Sample Data' : 'User Demo Listing'}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-700 whitespace-nowrap">
                      {item.category}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-xs font-semibold tabular-nums text-[#0F172A] whitespace-nowrap">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-xs font-medium tabular-nums text-slate-700 whitespace-nowrap">
                      {item.expectedPrice
                        ? `${formatCurrencyINR(item.expectedPrice)}/${item.unit}`
                        : 'On Quote'}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-700 whitespace-nowrap">
                      {item.location}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`text-xs font-semibold ${
                          item.status === 'Active' ? 'text-emerald-700' : 'text-slate-500'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right whitespace-nowrap">
                      {confirmDeleteId === item.id ? (
                        <span className="inline-flex items-center gap-2 text-xs">
                          <span className="text-red-700 font-medium">Delete?</span>
                          <button
                            type="button"
                            onClick={() => {
                              deleteListing(item.id);
                              setConfirmDeleteId(null);
                            }}
                            className="font-semibold text-red-700 hover:underline cursor-pointer"
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="text-slate-500 hover:text-slate-800 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </span>
                      ) : (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => navigate('material-details', { materialId: item.id })}
                            className="p-1.5 rounded-md text-slate-500 hover:text-[#0F172A] hover:bg-slate-100 cursor-pointer"
                            title="View listing details"
                            aria-label={`View ${item.name}`}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              navigate('add-listing', { editListingId: item.id })
                            }
                            className="p-1.5 rounded-md text-slate-500 hover:text-[#0D3B2E] hover:bg-slate-100 cursor-pointer"
                            title="Edit listing"
                            aria-label={`Edit ${item.name}`}
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleListingStatus(item.id)}
                            className="p-1.5 rounded-md text-slate-500 hover:text-amber-700 hover:bg-slate-100 cursor-pointer"
                            title={item.status === 'Active' ? 'Pause listing' : 'Activate listing'}
                            aria-label={
                              item.status === 'Active'
                                ? `Pause ${item.name}`
                                : `Activate ${item.name}`
                            }
                          >
                            {item.status === 'Active' ? (
                              <PauseCircle className="w-4 h-4" />
                            ) : (
                              <PlayCircle className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(item.id)}
                            className="p-1.5 rounded-md text-slate-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                            title="Delete listing"
                            aria-label={`Delete ${item.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Bottom 2-Column Split: Incoming Buyer Enquiries & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Incoming Buyer Enquiries */}
        <section className="lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-bold text-[#0F172A]">
                Incoming Buyer Enquiries
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Simulated quotation requests from interested buyers — update status below.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('requests')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#0D3B2E] hover:underline cursor-pointer whitespace-nowrap shrink-0"
            >
              Manage All Requests
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {quotes.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No quotation requests received yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {quotes.slice(0, 5).map((quote) => (
                <div key={quote.id} className="p-5 sm:px-6 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-mono font-medium text-[#0F172A]">
                          {quote.referenceCode}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{formatRelativeDate(quote.createdAt)}</span>
                        {quote.isSampleData && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>Sample Data</span>
                          </>
                        )}
                      </div>
                      <h3 className="font-display text-base font-bold text-[#0F172A] mt-0.5">
                        {quote.materialName}{' '}
                        <span className="font-mono text-sm font-semibold tabular-nums text-[#0D3B2E]">
                          ({quote.requiredQuantity} {quote.unit})
                        </span>
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5">
                        From <strong className="text-[#0F172A]">{quote.buyerCompanyName}</strong> ·
                        Contact: {quote.contactPerson}
                      </p>
                    </div>
                    <div className="text-right">
                      {renderStatusLabel(quote.status)}
                      <p className="text-xs font-mono tabular-nums text-slate-600 mt-1">
                        Offer:{' '}
                        {quote.offeredPrice
                          ? `${formatCurrencyINR(quote.offeredPrice)}/${quote.unit}`
                          : 'Requesting Rate'}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 rounded-lg px-3.5 py-2.5 border border-slate-100">
                    &ldquo;{quote.message}&rdquo;
                  </p>

                  <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                    {quote.status === 'Pending' && (
                      <>
                        <button
                          type="button"
                          onClick={() => updateQuoteStatus(quote.id, 'Rejected')}
                          className="px-3 py-1.5 text-xs font-semibold text-red-700 border border-red-200 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={() => updateQuoteStatus(quote.id, 'Accepted')}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-[#059669] hover:bg-[#047857] rounded-md transition-colors cursor-pointer"
                        >
                          Accept Quote
                        </button>
                      </>
                    )}
                    {quote.status === 'Accepted' && (
                      <button
                        type="button"
                        onClick={() => updateQuoteStatus(quote.id, 'Completed')}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0D3B2E] hover:bg-[#114D3C] rounded-md transition-colors cursor-pointer"
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent Activities */}
        <section className="lg:col-span-4 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="font-display text-lg font-bold text-[#0F172A]">Recent Activities</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {supplierActivities.length === 0 ? (
              <p className="p-6 text-xs text-slate-500">No recent supplier activities.</p>
            ) : (
              supplierActivities.map((act) => (
                <div key={act.id} className="px-6 py-4">
                  <p className="text-xs font-semibold text-[#0F172A]">{act.action}</p>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{act.detail}</p>
                  <p className="text-[11px] font-mono text-slate-400 mt-1.5">
                    {formatRelativeDate(act.timestamp)}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
