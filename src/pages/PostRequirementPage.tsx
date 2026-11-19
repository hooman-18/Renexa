import React, { useState } from 'react';
import { ArrowLeft, SearchCheck } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  MATERIAL_CATEGORIES,
  MaterialCategory,
  QuantityUnit,
} from '../types/marketplace';

export function PostRequirementPage() {
  const { addRequirement, navigate, setRole } = useMarketplace();

  const [requiredMaterial, setRequiredMaterial] = useState('');
  const [category, setCategory] = useState<MaterialCategory>('Steel');
  const [materialType, setMaterialType] = useState('');
  const [requiredQuantity, setRequiredQuantity] = useState('');
  const [unit, setUnit] = useState<QuantityUnit>('TON');
  const [preferredGrade, setPreferredGrade] = useState('');
  const [budget, setBudget] = useState('');
  const [preferredLocation, setPreferredLocation] = useState('Pune');
  const [buyerCompanyName, setBuyerCompanyName] = useState(
    'Apex Fitness Fabrication (Demo Buyer)'
  );
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const next: Record<string, string> = {};
    if (!requiredMaterial.trim()) {
      next.requiredMaterial = 'Required material name is required.';
    }
    const qtyNum = Number(requiredQuantity);
    if (!requiredQuantity || Number.isNaN(qtyNum) || qtyNum <= 0) {
      next.requiredQuantity = 'Enter a valid required quantity greater than 0.';
    }
    if (!preferredGrade.trim()) {
      next.preferredGrade = 'Preferred grade or quality is required for matching.';
    }
    if (budget.trim() !== '') {
      const budgetNum = Number(budget);
      if (Number.isNaN(budgetNum) || budgetNum <= 0) {
        next.budget = 'Budget must be a positive number.';
      }
    }
    if (!preferredLocation.trim()) {
      next.preferredLocation = 'Preferred location / city is required.';
    }
    if (!buyerCompanyName.trim()) {
      next.buyerCompanyName = 'Buyer company name is required.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const created = addRequirement({
      requiredMaterial: requiredMaterial.trim(),
      category,
      materialType: materialType.trim() || undefined,
      requiredQuantity: Number(requiredQuantity),
      unit,
      preferredGrade: preferredGrade.trim(),
      budget: budget.trim() ? Number(budget) : undefined,
      preferredLocation: preferredLocation.trim(),
      buyerCompanyName: buyerCompanyName.trim(),
      additionalRequirements: additionalRequirements.trim(),
    });

    setRole('buyer');
    navigate('buyer-dashboard', { requirementId: created.id });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        type="button"
        onClick={() => navigate('buyer-dashboard')}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#0F172A] mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Buyer Dashboard
      </button>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 sm:px-8 py-6 border-b border-slate-200">
          <div className="flex items-center gap-2 text-xs font-medium text-[#0D3B2E]">
            <SearchCheck className="w-4 h-4" />
            Buyer Requirement · Automatic Rule-Based Matching
          </div>
          <h1 className="font-display text-2xl font-bold text-[#0F172A] tracking-tight mt-1">
            Post Your Material Requirement
          </h1>
          <p className="mt-1.5 text-sm text-slate-600">
            Specify the secondary raw material your manufacturing operation needs. Upon submission,
            ReNexa immediately compares your requirement against all available supplier listings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="req-material"
                className="block text-sm font-medium text-[#0F172A] mb-1.5"
              >
                Required Material *
              </label>
              <input
                id="req-material"
                type="text"
                value={requiredMaterial}
                onChange={(e) => setRequiredMaterial(e.target.value)}
                placeholder="e.g. Aluminium 6061 Extrusion Offcuts"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              {errors.requiredMaterial && (
                <p className="mt-1 text-xs text-red-600">{errors.requiredMaterial}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="req-category"
                className="block text-sm font-medium text-[#0F172A] mb-1.5"
              >
                Material Category *
              </label>
              <select
                id="req-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as MaterialCategory)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                {MATERIAL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="req-grade"
                className="block text-sm font-medium text-[#0F172A] mb-1.5"
              >
                Preferred Grade / Quality *
              </label>
              <input
                id="req-grade"
                type="text"
                value={preferredGrade}
                onChange={(e) => setPreferredGrade(e.target.value)}
                placeholder="e.g. IS 2062 Grade A, 6061-T6, Clear Washed PET"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              {errors.preferredGrade && (
                <p className="mt-1 text-xs text-red-600">{errors.preferredGrade}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="req-type"
                className="block text-sm font-medium text-[#0F172A] mb-1.5"
              >
                Preferred Form / Type{' '}
                <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                id="req-type"
                type="text"
                value={materialType}
                onChange={(e) => setMaterialType(e.target.value)}
                placeholder="e.g. Plate Offcuts, Extruded Profiles, Flakes, Bales"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label htmlFor="req-qty" className="block text-sm font-medium text-[#0F172A] mb-1.5">
                Required Quantity *
              </label>
              <input
                id="req-qty"
                type="number"
                step="any"
                min="0.1"
                value={requiredQuantity}
                onChange={(e) => setRequiredQuantity(e.target.value)}
                placeholder="e.g. 2"
                className="w-full px-3.5 py-2.5 text-sm font-mono tabular-nums border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              {errors.requiredQuantity && (
                <p className="mt-1 text-xs text-red-600">{errors.requiredQuantity}</p>
              )}
            </div>

            <div>
              <label htmlFor="req-unit" className="block text-sm font-medium text-[#0F172A] mb-1.5">
                Unit *
              </label>
              <select
                id="req-unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value as QuantityUnit)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="TON">TON (Metric Ton)</option>
                <option value="KG">KG (Kilogram)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="req-budget"
                className="block text-sm font-medium text-[#0F172A] mb-1.5"
              >
                Budget (₹ / {unit}) <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                id="req-budget"
                type="number"
                step="any"
                min="1"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Indicative rate"
                className="w-full px-3.5 py-2.5 text-sm font-mono tabular-nums border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              {errors.budget && <p className="mt-1 text-xs text-red-600">{errors.budget}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="req-location"
                className="block text-sm font-medium text-[#0F172A] mb-1.5"
              >
                Preferred Location / City *
              </label>
              <input
                id="req-location"
                type="text"
                value={preferredLocation}
                onChange={(e) => setPreferredLocation(e.target.value)}
                placeholder="e.g. Pune, Chakan, Pimpri, Talegaon"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              {errors.preferredLocation && (
                <p className="mt-1 text-xs text-red-600">{errors.preferredLocation}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="req-company"
                className="block text-sm font-medium text-[#0F172A] mb-1.5"
              >
                Buyer Company Name *
              </label>
              <input
                id="req-company"
                type="text"
                value={buyerCompanyName}
                onChange={(e) => setBuyerCompanyName(e.target.value)}
                placeholder="Your manufacturing business name"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              {errors.buyerCompanyName && (
                <p className="mt-1 text-xs text-red-600">{errors.buyerCompanyName}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="req-notes" className="block text-sm font-medium text-[#0F172A] mb-1.5">
              Additional Requirements &amp; End-Use Notes
            </label>
            <textarea
              id="req-notes"
              rows={3}
              value={additionalRequirements}
              onChange={(e) => setAdditionalRequirements(e.target.value)}
              placeholder="Include thickness tolerances, moisture limits, packaging preference, or inspection needs..."
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate('buyer-dashboard')}
              className="px-5 py-2.5 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-semibold text-white bg-[#059669] hover:bg-[#047857] rounded-lg transition-colors cursor-pointer"
            >
              Post Requirement &amp; Find Matches
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
