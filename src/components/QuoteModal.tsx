import React, { useState } from 'react';
import { CheckCircle2, Info, X } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { MaterialListing, QuotationRequest } from '../types/marketplace';
import { formatCurrencyINR } from '../utils/matching';

interface QuoteModalProps {
  material: MaterialListing;
  onClose: () => void;
}

export function QuoteModal({ material, onClose }: QuoteModalProps) {
  const { submitQuote, navigate } = useMarketplace();

  const [buyerCompanyName, setBuyerCompanyName] = useState('Apex Fitness Fabrication');
  const [contactPerson, setContactPerson] = useState('');
  const [requiredQuantity, setRequiredQuantity] = useState(
    String(Math.min(material.quantity, Math.max(1, Math.round(material.quantity * 0.5 * 10) / 10)))
  );
  const [offeredPrice, setOfferedPrice] = useState(
    material.expectedPrice ? String(material.expectedPrice) : ''
  );
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedQuote, setSubmittedQuote] = useState<QuotationRequest | null>(null);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!buyerCompanyName.trim()) {
      nextErrors.buyerCompanyName = 'Buyer company name is required.';
    }
    if (!contactPerson.trim()) {
      nextErrors.contactPerson = 'Contact person name is required.';
    }
    const qty = Number(requiredQuantity);
    if (!requiredQuantity || Number.isNaN(qty) || qty <= 0) {
      nextErrors.requiredQuantity = 'Enter a valid required quantity greater than 0.';
    }
    if (offeredPrice.trim() !== '') {
      const priceNum = Number(offeredPrice);
      if (Number.isNaN(priceNum) || priceNum <= 0) {
        nextErrors.offeredPrice = 'Offered price must be a positive number.';
      }
    }
    if (!message.trim() || message.trim().length < 10) {
      nextErrors.message = 'Please include brief inspection or dispatch details (at least 10 characters).';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const created = submitQuote({
      materialId: material.id,
      buyerCompanyName: buyerCompanyName.trim(),
      contactPerson: contactPerson.trim(),
      requiredQuantity: Number(requiredQuantity),
      offeredPrice: offeredPrice.trim() ? Number(offeredPrice) : undefined,
      message: message.trim(),
    });

    if (created) {
      setSubmittedQuote(created);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/60 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quote-modal-title"
    >
      <div className="bg-white w-full max-w-xl rounded-xl border border-slate-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-slate-500">
              {material.category} · {material.location}
            </p>
            <h2
              id="quote-modal-title"
              className="font-display text-lg font-bold text-[#0F172A] mt-0.5"
            >
              Request Quotation — {material.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
            aria-label="Close quotation form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto">
          {submittedQuote ? (
            <div className="py-4 space-y-5">
              <div className="flex items-start gap-3.5">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1.5">
                  <h3 className="font-display text-lg font-bold text-[#0F172A]">
                    Quotation Request Saved
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Reference{' '}
                    <span className="font-mono font-semibold text-[#0F172A]">
                      {submittedQuote.referenceCode}
                    </span>{' '}
                    has been recorded in the demo marketplace for{' '}
                    <span className="font-semibold text-[#0F172A]">
                      {submittedQuote.supplierName}
                    </span>
                    . Switch to the Supplier role anytime to accept, reject, or complete this request.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-xs text-slate-500 block">Requested Quantity</span>
                  <span className="font-mono font-semibold tabular-nums text-[#0F172A]">
                    {submittedQuote.requiredQuantity} {submittedQuote.unit}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Indicative Offer</span>
                  <span className="font-mono font-semibold tabular-nums text-[#0F172A]">
                    {submittedQuote.offeredPrice
                      ? `${formatCurrencyINR(submittedQuote.offeredPrice)} / ${submittedQuote.unit}`
                      : 'Open to Supplier Quote'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Simulated demo transaction. Does not initiate real payments, purchase orders, or
                  freight dispatch.
                </span>
              </p>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Continue Browsing
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('requests');
                  }}
                  className="px-4 py-2 text-sm font-semibold text-white bg-[#0D3B2E] hover:bg-[#114D3C] rounded-lg cursor-pointer"
                >
                  View My Requests
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Material Summary Line */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                <span>
                  Available:{' '}
                  <strong className="font-mono tabular-nums text-[#0F172A]">
                    {material.quantity} {material.unit}
                  </strong>
                </span>
                <span>
                  Expected Price:{' '}
                  <strong className="font-mono tabular-nums text-[#0F172A]">
                    {material.expectedPrice
                      ? `${formatCurrencyINR(material.expectedPrice)} / ${material.unit}`
                      : 'On Quotation'}
                  </strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="quote-company"
                    className="block text-sm font-medium text-[#0F172A] mb-1"
                  >
                    Buyer Company Name *
                  </label>
                  <input
                    id="quote-company"
                    type="text"
                    value={buyerCompanyName}
                    onChange={(e) => setBuyerCompanyName(e.target.value)}
                    placeholder="e.g. Apex Gym Equipment Pvt. Ltd."
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                  />
                  {errors.buyerCompanyName && (
                    <p className="mt-1 text-xs text-red-600">{errors.buyerCompanyName}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="quote-contact"
                    className="block text-sm font-medium text-[#0F172A] mb-1"
                  >
                    Contact Person *
                  </label>
                  <input
                    id="quote-contact"
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Ananya Joshi"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                  />
                  {errors.contactPerson && (
                    <p className="mt-1 text-xs text-red-600">{errors.contactPerson}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="quote-quantity"
                    className="block text-sm font-medium text-[#0F172A] mb-1"
                  >
                    Required Quantity ({material.unit}) *
                  </label>
                  <input
                    id="quote-quantity"
                    type="number"
                    step="any"
                    min="0.1"
                    value={requiredQuantity}
                    onChange={(e) => setRequiredQuantity(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm font-mono tabular-nums border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                  />
                  {errors.requiredQuantity && (
                    <p className="mt-1 text-xs text-red-600">{errors.requiredQuantity}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="quote-price"
                    className="block text-sm font-medium text-[#0F172A] mb-1"
                  >
                    Offered Price in ₹ / {material.unit} (Optional)
                  </label>
                  <input
                    id="quote-price"
                    type="number"
                    step="any"
                    min="1"
                    value={offeredPrice}
                    onChange={(e) => setOfferedPrice(e.target.value)}
                    placeholder="Leave blank to request rate"
                    className="w-full px-3.5 py-2 text-sm font-mono tabular-nums border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                  />
                  {errors.offeredPrice && (
                    <p className="mt-1 text-xs text-red-600">{errors.offeredPrice}</p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="quote-message"
                  className="block text-sm font-medium text-[#0F172A] mb-1"
                >
                  Message &amp; Inspection Notes *
                </label>
                <textarea
                  id="quote-message"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your intended end-use, preferred inspection date, or loading requirements..."
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-600">{errors.message}</p>
                )}
              </div>

              <p className="text-xs text-slate-500">
                Simulated demo enquiry: specifications are supplier-provided and must be
                independently verified before concluding any offline transaction.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-[#059669] hover:bg-[#047857] rounded-lg transition-colors cursor-pointer"
                >
                  Submit Quotation Request
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
