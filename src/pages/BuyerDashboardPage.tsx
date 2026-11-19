import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  MapPin,
  Plus,
  SearchCheck,
  ShieldAlert,
  Trash2,
} from 'lucide-react';
import { QuoteModal } from '../components/QuoteModal';
import { useMarketplace } from '../context/MarketplaceContext';
import { MatchLabel, MaterialListing } from '../types/marketplace';
import {
  formatCurrencyINR,
  formatRelativeDate,
  matchRequirementToListings,
} from '../utils/matching';

export function BuyerDashboardPage() {
  const {
    listings,
    requirements,
    quotes,
    savedIds,
    activities,
    activeRequirementId,
    setActiveRequirementId,
    deleteRequirement,
    toggleSavedMaterial,
    navigate,
  } = useMarketplace();

  const [quoteMaterial, setQuoteMaterial] = useState<MaterialListing | null>(null);

  const activeListings = useMemo(
    () => listings.filter((l) => l.status === 'Active'),
    [listings]
  );

  const selectedRequirement = useMemo(() => {
    if (activeRequirementId) {
      const found = requirements.find((r) => r.id === activeRequirementId);
      if (found) return found;
    }
    return requirements[0] ?? null;
  }, [requirements, activeRequirementId]);

  // Compute rule-based matches for currently selected requirement
  const currentMatches = useMemo(() => {
    if (!selectedRequirement) return [];
    return matchRequirementToListings(selectedRequirement, activeListings);
  }, [selectedRequirement, activeListings]);

  // Total unique matched listings across all posted requirements
  const totalUniqueMatchedCount = useMemo(() => {
    const matchedIds = new Set<string>();
    for (const req of requirements) {
      const results = matchRequirementToListings(req, activeListings);
      for (const r of results) {
        matchedIds.add(r.listing.id);
      }
    }
    return matchedIds.size;
  }, [requirements, activeListings]);

  const savedMaterials = useMemo(
    () => listings.filter((l) => savedIds.includes(l.id)),
    [listings, savedIds]
  );

  const buyerActivities = useMemo(
    () => activities.filter((a) => a.role === 'buyer' || a.role === 'both').slice(0, 6),
    [activities]
  );

  const renderMatchLabel = (label: MatchLabel) => {
    if (label === 'Strong Potential Match') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Strong Potential Match
        </span>
      );
    }
    if (label === 'Partial Match') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          Partial Match
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600">
        <ShieldAlert className="w-4 h-4 shrink-0" />
        Additional Verification Required
      </span>
    );
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <p className="text-xs font-medium text-[#0D3B2E]">
            Buyer Workspace · Secondary Raw Material Procurement
          </p>
          <h1 className="font-display text-3xl font-bold text-[#0F172A] tracking-tight mt-1">
            Buyer Dashboard
          </h1>
          <p className="mt-1.5 text-sm text-slate-600">
            Post raw material requirements, review rule-based supplier matches, manage saved
            materials, and track submitted quotation requests.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => navigate('marketplace')}
            className="px-4 py-2.5 text-sm font-semibold text-[#0F172A] bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Browse Marketplace
          </button>
          <button
            type="button"
            onClick={() => navigate('post-requirement')}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#059669] hover:bg-[#047857] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Post Your Material Requirement
          </button>
        </div>
      </div>

      {/* 4-Column Flat KPI Strip */}
      <section aria-label="Buyer Overview Metrics" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500">Available Materials</p>
          <p className="mt-2 font-mono text-3xl font-bold tabular-nums text-[#0F172A]">
            {activeListings.length}
          </p>
          <p className="mt-1 text-xs text-slate-500">Active listings in marketplace</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500">Matching Materials</p>
          <p className="mt-2 font-mono text-3xl font-bold tabular-nums text-[#0D3B2E]">
            {totalUniqueMatchedCount}
          </p>
          <p className="mt-1 text-xs text-slate-500">Matched to your posted requirements</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500">Sent Quotation Requests</p>
          <p className="mt-2 font-mono text-3xl font-bold tabular-nums text-[#0F172A]">
            {quotes.length}
          </p>
          <p className="mt-1 text-xs text-slate-500">Track status in My Requests</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500">Saved Materials</p>
          <p className="mt-2 font-mono text-3xl font-bold tabular-nums text-[#0F172A]">
            {savedMaterials.length}
          </p>
          <p className="mt-1 text-xs text-slate-500">Bookmarked for evaluation</p>
        </div>
      </section>

      {/* SMART MATERIAL MATCHING ENGINE */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-[#0D3B2E]">
              <SearchCheck className="w-4 h-4" />
              Rule-Based Smart Material Matching
            </div>
            <h2 className="font-display text-xl font-bold text-[#0F172A] mt-1">
              Requirement-to-Supply Matches
            </h2>
            <p className="text-xs text-slate-600 mt-0.5 max-w-2xl">
              Compares your posted requirements against all active sample and user-created supplier
              listings using category, material type, grade, quantity, and location.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('post-requirement')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0D3B2E] hover:bg-[#114D3C] rounded-lg whitespace-nowrap shrink-0 cursor-pointer self-start md:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            New Requirement
          </button>
        </div>

        {requirements.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-display text-base font-bold text-[#0F172A]">
              No material requirements posted yet
            </p>
            <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
              Post what secondary raw material your facility needs and ReNexa will surface
              relevant supplier listings with match reasoning.
            </p>
            <button
              type="button"
              onClick={() => navigate('post-requirement')}
              className="mt-4 px-5 py-2.5 text-sm font-semibold text-white bg-[#059669] hover:bg-[#047857] rounded-lg cursor-pointer"
            >
              Post Your Material Requirement
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Sidebar: Posted Buyer Requirements List */}
            <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-50/50 divide-y divide-slate-200">
              <div className="px-5 py-3 text-xs font-semibold text-slate-500">
                Posted Requirements ({requirements.length})
              </div>
              {requirements.map((req) => {
                const isSelected = selectedRequirement?.id === req.id;
                const matchCount = matchRequirementToListings(req, activeListings).length;
                return (
                  <div
                    key={req.id}
                    className={`p-5 transition-colors ${
                      isSelected ? 'bg-white' : 'hover:bg-white/70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveRequirementId(req.id)}
                        className="text-left flex-1 cursor-pointer"
                      >
                        <p className="text-[11px] text-slate-500">
                          {req.category} · {req.isSampleData ? 'Sample Requirement' : 'Your Requirement'}
                        </p>
                        <h3
                          className={`font-display text-sm font-bold mt-0.5 ${
                            isSelected ? 'text-[#0D3B2E]' : 'text-[#0F172A]'
                          }`}
                        >
                          {req.requiredMaterial}
                        </h3>
                        <p className="text-xs text-slate-600 mt-1">
                          <span className="font-mono font-semibold tabular-nums">
                            {req.requiredQuantity} {req.unit}
                          </span>{' '}
                          · {req.preferredLocation}
                        </p>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                          Grade: {req.preferredGrade}
                        </p>
                        <p className="text-xs font-semibold text-[#059669] mt-2 tabular-nums">
                          {matchCount} potential match{matchCount === 1 ? '' : 'es'} found
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteRequirement(req.id)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer shrink-0"
                        title="Remove requirement"
                        aria-label={`Delete requirement ${req.requiredMaterial}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Pane: Rule-Based Match Results for Selected Requirement */}
            <div className="lg:col-span-8 p-6 space-y-5">
              {selectedRequirement && (
                <>
                  <div className="pb-4 border-b border-slate-200 flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs text-slate-500">Matching against active requirement</p>
                      <h3 className="font-display text-lg font-bold text-[#0F172A] mt-0.5">
                        {selectedRequirement.requiredMaterial}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1">
                        Target:{' '}
                        <span className="font-mono font-semibold tabular-nums text-[#0F172A]">
                          {selectedRequirement.requiredQuantity} {selectedRequirement.unit}
                        </span>{' '}
                        · Grade: <strong>{selectedRequirement.preferredGrade}</strong> · Location:{' '}
                        <strong>{selectedRequirement.preferredLocation}</strong>
                        {selectedRequirement.budget && (
                          <>
                            {' '}
                            · Budget:{' '}
                            <span className="font-mono font-semibold tabular-nums">
                              {formatCurrencyINR(selectedRequirement.budget)}/
                              {selectedRequirement.unit}
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {currentMatches.length === 0 ? (
                    <div className="py-10 text-center">
                      <p className="text-sm font-semibold text-[#0F172A]">
                        No direct supplier matches found yet
                      </p>
                      <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                        Try switching to Supplier Hub to add a matching listing, then return here
                        to see the matching engine pick it up immediately.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {currentMatches.map((match) => (
                        <div
                          key={match.listing.id}
                          className="border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors space-y-3.5"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <div className="flex flex-wrap items-center gap-2.5">
                                {renderMatchLabel(match.label)}
                                <span className="text-slate-300" aria-hidden="true">
                                  |
                                </span>
                                <span className="text-xs text-slate-500">
                                  {match.listing.category} ·{' '}
                                  {match.listing.isSampleData ? 'Sample Data' : 'Demo Listing'}
                                </span>
                              </div>
                              <h4 className="font-display text-base font-bold text-[#0F172A] mt-1">
                                {match.listing.name}
                              </h4>
                              <p className="text-xs text-slate-600 mt-0.5">
                                Supplier: <strong className="text-slate-800">{match.listing.supplierName}</strong> ·{' '}
                                <span className="inline-flex items-center gap-0.5">
                                  <MapPin className="w-3 h-3 text-slate-400" />
                                  {match.listing.location}
                                </span>
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="font-mono text-sm font-bold tabular-nums text-[#0F172A]">
                                {match.listing.quantity} {match.listing.unit}
                              </p>
                              <p className="font-mono text-xs font-semibold tabular-nums text-[#0D3B2E] mt-0.5">
                                {match.listing.expectedPrice
                                  ? `${formatCurrencyINR(match.listing.expectedPrice)}/${match.listing.unit}`
                                  : 'Price on Quote'}
                              </p>
                            </div>
                          </div>

                          {/* Why it matched */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
                            <div>
                              <p className="font-semibold text-[#0F172A] mb-1">
                                Why this listing matched:
                              </p>
                              <ul className="space-y-1 text-slate-600 list-disc pl-4">
                                {match.reasons.map((reason, idx) => (
                                  <li key={idx}>{reason}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="font-semibold text-slate-700 mb-1">
                                Verification notes:
                              </p>
                              <ul className="space-y-1 text-slate-500 list-disc pl-4">
                                {match.verificationNotes.map((note, idx) => (
                                  <li key={idx}>{note}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Match Card Actions */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                            <span className="text-[11px] text-slate-500">
                              Supplier-stated grade: <strong className="text-slate-700">{match.listing.grade}</strong> (not independently verified)
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  navigate('material-details', { materialId: match.listing.id })
                                }
                                className="px-3.5 py-1.5 text-xs font-semibold text-[#0F172A] border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer whitespace-nowrap shrink-0"
                              >
                                View Details
                              </button>
                              <button
                                type="button"
                                onClick={() => setQuoteMaterial(match.listing)}
                                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#059669] hover:bg-[#047857] rounded-lg cursor-pointer whitespace-nowrap shrink-0"
                              >
                                Request Quote
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Bottom 2-Column Split: Saved Materials & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Saved Materials */}
        <section className="lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-[#0F172A]">Saved Materials</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Shortlisted materials bookmarked from the marketplace.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('marketplace')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#0D3B2E] hover:underline cursor-pointer"
            >
              Explore Marketplace
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {savedMaterials.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No saved materials yet. Click the bookmark icon on any marketplace listing to save it
              here.
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {savedMaterials.map((item) => (
                <div
                  key={item.id}
                  className="px-6 py-4 flex flex-wrap items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-xs text-slate-500">
                      {item.category} · {item.location}
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate('material-details', { materialId: item.id })}
                      className="font-display text-sm font-bold text-[#0F172A] hover:text-[#0D3B2E] cursor-pointer text-left"
                    >
                      {item.name}
                    </button>
                    <p className="text-xs text-slate-600 mt-0.5">
                      <span className="font-mono font-semibold tabular-nums">
                        {item.quantity} {item.unit}
                      </span>{' '}
                      ·{' '}
                      <span className="font-mono tabular-nums text-[#0D3B2E]">
                        {item.expectedPrice
                          ? `${formatCurrencyINR(item.expectedPrice)}/${item.unit}`
                          : 'Price on Quote'}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleSavedMaterial(item.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      <Bookmark className="w-3.5 h-3.5" fill="currentColor" />
                      Remove
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuoteMaterial(item)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#059669] hover:bg-[#047857] rounded-lg cursor-pointer"
                    >
                      Request Quote
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent Activities */}
        <section className="lg:col-span-4 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-[#0F172A]">Recent Activities</h2>
            <button
              type="button"
              onClick={() => navigate('requests')}
              className="text-xs font-semibold text-[#0D3B2E] hover:underline cursor-pointer"
            >
              My Requests
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {buyerActivities.length === 0 ? (
              <p className="p-6 text-xs text-slate-500">No recent buyer activities.</p>
            ) : (
              buyerActivities.map((act) => (
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

      {quoteMaterial && (
        <QuoteModal material={quoteMaterial} onClose={() => setQuoteMaterial(null)} />
      )}
    </div>
  );
}
