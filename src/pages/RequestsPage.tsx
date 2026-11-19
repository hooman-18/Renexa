import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Info,
  XCircle,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { QuoteStatus } from '../types/marketplace';
import { formatCurrencyINR, formatRelativeDate } from '../utils/matching';

const STATUS_TABS: ('All' | QuoteStatus)[] = [
  'All',
  'Pending',
  'Accepted',
  'Rejected',
  'Completed',
];

export function RequestsPage() {
  const { quotes, role, setRole, updateQuoteStatus, navigate } = useMarketplace();
  const [statusFilter, setStatusFilter] = useState<'All' | QuoteStatus>('All');

  const filteredQuotes = useMemo(() => {
    if (statusFilter === 'All') return quotes;
    return quotes.filter((q) => q.status === statusFilter);
  }, [quotes, statusFilter]);

  const counts = useMemo(
    () => ({
      All: quotes.length,
      Pending: quotes.filter((q) => q.status === 'Pending').length,
      Accepted: quotes.filter((q) => q.status === 'Accepted').length,
      Rejected: quotes.filter((q) => q.status === 'Rejected').length,
      Completed: quotes.filter((q) => q.status === 'Completed').length,
    }),
    [quotes]
  );

  const renderStatus = (status: QuoteStatus) => {
    switch (status) {
      case 'Accepted':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="w-4 h-4" />
            Accepted
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700">
            <XCircle className="w-4 h-4" />
            Rejected
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0D3B2E]">
            <CheckCircle2 className="w-4 h-4" />
            Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700">
            <Clock className="w-4 h-4" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <p className="text-xs font-medium text-[#0D3B2E]">
            In-App Quotation Workflow ·{' '}
            {role === 'supplier' ? 'Supplier Incoming Enquiries' : 'Buyer Submitted Requests'}
          </p>
          <h1 className="font-display text-3xl font-bold text-[#0F172A] tracking-tight mt-1">
            My Requests
          </h1>
          <p className="mt-1.5 text-sm text-slate-600 max-w-2xl">
            {role === 'supplier'
              ? 'Review incoming buyer quotation requests and update their status to Pending, Accepted, Rejected, or Completed.'
              : 'Track your submitted quotation requests and review supplier responses in real time.'}
          </p>
        </div>

        {/* Role Perspective Toggle for Easy Demo Walkthrough */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-500">Perspective:</span>
          <div className="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setRole('supplier')}
              className={`px-3 py-1.5 font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                role === 'supplier'
                  ? 'bg-white text-[#0D3B2E] shadow-xs'
                  : 'text-slate-600 hover:text-[#0F172A]'
              }`}
            >
              Supplier View
            </button>
            <button
              type="button"
              onClick={() => setRole('buyer')}
              className={`px-3 py-1.5 font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                role === 'buyer'
                  ? 'bg-white text-[#0D3B2E] shadow-xs'
                  : 'text-slate-600 hover:text-[#0F172A]'
              }`}
            >
              Buyer View
            </button>
          </div>
        </div>
      </div>

      {/* Simulated Transaction Clarification Notice (Section 11) */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 flex items-start gap-3">
        <Info className="w-4 h-4 text-[#0D3B2E] shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600 leading-relaxed">
          <strong className="text-[#0F172A]">Simulated Demo Transactions:</strong> All quotation
          requests and status updates shown below are stored locally in your browser for
          demonstration purposes. They do not represent actual purchases, escrow payments, binding
          contracts, or logistics deliveries.
        </p>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex flex-wrap items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg">
          {STATUS_TABS.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                statusFilter === status
                  ? 'bg-[#0F172A] text-white'
                  : 'text-slate-600 hover:text-[#0F172A]'
              }`}
            >
              {status}{' '}
              <span className="font-mono tabular-nums opacity-75">({counts[status]})</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => navigate('marketplace')}
          className="text-xs font-semibold text-[#0D3B2E] hover:underline cursor-pointer"
        >
          + Request Quote on Another Material
        </button>
      </div>

      {/* Requests List */}
      {filteredQuotes.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <p className="font-display text-base font-bold text-[#0F172A]">
            No {statusFilter === 'All' ? '' : statusFilter.toLowerCase()} quotation requests
          </p>
          <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
            Browse the Material Marketplace and click &ldquo;Request Quote&rdquo; on any industrial
            listing to create a live demo enquiry.
          </p>
          <button
            type="button"
            onClick={() => navigate('marketplace')}
            className="mt-5 px-4 py-2 text-sm font-semibold text-white bg-[#0D3B2E] rounded-lg cursor-pointer"
          >
            Open Marketplace
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuotes.map((quote) => (
            <article
              key={quote.id}
              className="bg-white border border-slate-200 rounded-xl p-6 space-y-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-mono font-semibold text-[#0F172A]">
                      {quote.referenceCode}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{quote.materialCategory}</span>
                    <span aria-hidden="true">·</span>
                    <span>Submitted {formatRelativeDate(quote.createdAt)}</span>
                    {quote.isSampleData && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>Sample Data</span>
                      </>
                    )}
                  </div>

                  <h2 className="font-display text-lg font-bold text-[#0F172A] mt-1">
                    <button
                      type="button"
                      onClick={() =>
                        navigate('material-details', { materialId: quote.materialId })
                      }
                      className="hover:text-[#0D3B2E] transition-colors text-left cursor-pointer"
                    >
                      {quote.materialName}
                    </button>
                  </h2>

                  <p className="text-xs text-slate-600 mt-1">
                    Buyer: <strong className="text-[#0F172A]">{quote.buyerCompanyName}</strong> (
                    {quote.contactPerson}) <span aria-hidden="true">→</span> Supplier:{' '}
                    <strong className="text-[#0F172A]">{quote.supplierName}</strong>
                  </p>
                </div>

                <div className="text-left sm:text-right">{renderStatus(quote.status)}</div>
              </div>

              {/* Commercial Specs Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-3.5 border-y border-slate-100 text-sm">
                <div>
                  <span className="text-xs text-slate-500 block">Requested Quantity</span>
                  <span className="font-mono font-semibold tabular-nums text-[#0F172A]">
                    {quote.requiredQuantity} {quote.unit}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Buyer Offered Price</span>
                  <span className="font-mono font-semibold tabular-nums text-[#0D3B2E]">
                    {quote.offeredPrice
                      ? `${formatCurrencyINR(quote.offeredPrice)} / ${quote.unit}`
                      : 'Awaiting Supplier Quote'}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Supplier Expected Price</span>
                  <span className="font-mono font-medium tabular-nums text-slate-700">
                    {quote.expectedPrice
                      ? `${formatCurrencyINR(quote.expectedPrice)} / ${quote.unit}`
                      : 'On Quotation'}
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 border border-slate-100 rounded-lg px-4 py-3">
                &ldquo;{quote.message}&rdquo;
              </p>

              {/* Status Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <span className="text-xs text-slate-500">
                  Last updated: {formatRelativeDate(quote.updatedAt)}
                </span>

                <div className="flex flex-wrap items-center gap-2">
                  {role === 'supplier' ? (
                    <>
                      {quote.status !== 'Pending' && (
                        <button
                          type="button"
                          onClick={() => updateQuoteStatus(quote.id, 'Pending')}
                          className="px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50 cursor-pointer"
                        >
                          Reopen Pending
                        </button>
                      )}
                      {quote.status !== 'Rejected' && quote.status !== 'Completed' && (
                        <button
                          type="button"
                          onClick={() => updateQuoteStatus(quote.id, 'Rejected')}
                          className="px-3 py-1.5 text-xs font-semibold text-red-700 border border-red-200 hover:bg-red-50 rounded-md cursor-pointer"
                        >
                          Reject
                        </button>
                      )}
                      {quote.status === 'Pending' && (
                        <button
                          type="button"
                          onClick={() => updateQuoteStatus(quote.id, 'Accepted')}
                          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#059669] hover:bg-[#047857] rounded-md cursor-pointer"
                        >
                          Accept Request
                        </button>
                      )}
                      {quote.status === 'Accepted' && (
                        <button
                          type="button"
                          onClick={() => updateQuoteStatus(quote.id, 'Completed')}
                          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0D3B2E] hover:bg-[#114D3C] rounded-md cursor-pointer"
                        >
                          Mark Completed
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      {quote.status === 'Accepted' && (
                        <button
                          type="button"
                          onClick={() => updateQuoteStatus(quote.id, 'Completed')}
                          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0D3B2E] hover:bg-[#114D3C] rounded-md cursor-pointer"
                        >
                          Confirm Offline Completion
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setRole('supplier')}
                        className="px-3 py-1.5 text-xs font-semibold text-[#0D3B2E] border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer"
                      >
                        Switch to Supplier View to Respond
                      </button>
                    </>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
