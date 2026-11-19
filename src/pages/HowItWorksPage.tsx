import {
  ArrowRight,
  Building2,
  Factory,
  FileCheck2,
  Handshake,
  Layers,
  SearchCheck,
  ShieldAlert,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

const SIX_STEPS = [
  {
    step: 'STEP 1',
    title: 'A company lists its usable industrial waste',
    detail:
      'A manufacturing plant with recoverable scrap, sheet offcuts, extrusions, or baled packaging lists available lots on ReNexa instead of letting usable materials sit idle.',
    actor: 'Supplier',
  },
  {
    step: 'STEP 2',
    title: 'ReNexa records material specifications',
    detail:
      'Material category, type, supplier-declared grade/quality, quantity (KG or TON), city, and optional expected pricing are structured into searchable records.',
    actor: 'ReNexa Platform',
  },
  {
    step: 'STEP 3',
    title: 'Another company searches for suitable raw materials',
    detail:
      'Downstream manufacturers filter the marketplace by category, grade, quantity, and location—or post a structured Material Requirement directly.',
    actor: 'Buyer',
  },
  {
    step: 'STEP 4',
    title: 'ReNexa identifies potential matches',
    detail:
      'Rule-based matching evaluates category alignment, material keywords, grade overlap, normalized volume sufficiency, and regional proximity to surface Strong Potential or Partial Matches.',
    actor: 'ReNexa Matching',
  },
  {
    step: 'STEP 5',
    title: 'Buyer requests a quotation',
    detail:
      'The buyer submits an in-app quotation request stating required quantity, optional offered price, contact details, and physical inspection notes.',
    actor: 'Buyer → Supplier',
  },
  {
    step: 'STEP 6',
    title: 'Both companies coordinate the transaction',
    detail:
      'The supplier accepts or responds to the quotation. Both businesses independently inspect material quality and finalize commercial terms, logistics, and compliance directly.',
    actor: 'Direct B2B Coordination',
  },
];

export function HowItWorksPage() {
  const { navigate, setRole } = useMarketplace();

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">
      {/* Page Hero Header */}
      <section className="max-w-3xl">
        <p className="text-xs font-medium text-[#0D3B2E]">Business Model &amp; Platform Architecture</p>
        <h1
          className="font-display text-3xl sm:text-4xl font-bold text-[#0F172A] tracking-tight mt-1.5"
          style={{ textWrap: 'balance' }}
        >
          How ReNexa transforms industrial waste into B2B raw material
        </h1>
        <p className="mt-3 text-base text-slate-600 leading-relaxed">
          ReNexa does not manufacture products itself. It acts as a structured B2B intermediary
          marketplace that connects companies generating usable industrial scrap with businesses
          that consume those exact grades as secondary raw materials.
        </p>
      </section>

      {/* Visual Business Flow Diagram */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-8">
        <div>
          <p className="text-xs font-mono font-semibold text-[#059669]">CORE VALUE FLOW</p>
          <h2 className="font-display text-xl font-bold text-[#0F172A] mt-1">
            Circular Material Exchange Diagram
          </h2>
        </div>

        {/* 5-Node Horizontal Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              icon: Factory,
              label: '01. Industrial Waste',
              sub: 'Usable metal offcuts, polymer flakes, or baled fibers',
              dark: false,
            },
            {
              icon: SearchCheck,
              label: '02. Material Matching',
              sub: 'Category, grade, quantity & regional alignment',
              dark: true,
            },
            {
              icon: FileCheck2,
              label: '03. Business Connection',
              sub: 'Structured quotation requests & status updates',
              dark: true,
            },
            {
              icon: Layers,
              label: '04. Raw Material',
              sub: 'Verified and adopted as production feedstock',
              dark: false,
            },
            {
              icon: Handshake,
              label: '05. Value Creation',
              sub: 'Reduced material wastage & regional supply efficiency',
              dark: false,
            },
          ].map((node) => {
            const Icon = node.icon;
            return (
              <div
                key={node.label}
                className={`rounded-xl p-5 border flex flex-col justify-between ${
                  node.dark
                    ? 'bg-[#0D3B2E] text-white border-[#0D3B2E]'
                    : 'bg-slate-50 text-[#0F172A] border-slate-200'
                }`}
              >
                <Icon
                  className={`w-5 h-5 mb-4 ${node.dark ? 'text-emerald-300' : 'text-[#0D3B2E]'}`}
                />
                <div>
                  <h3 className="font-display text-sm font-bold">{node.label}</h3>
                  <p
                    className={`text-xs mt-1.5 leading-relaxed ${
                      node.dark ? 'text-slate-200' : 'text-slate-600'
                    }`}
                  >
                    {node.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Concrete Real-World B2B Example */}
        <div className="pt-6 border-t border-slate-200">
          <p className="text-xs font-semibold text-slate-500 mb-4">
            Illustrative Industrial Use Case
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center">
            <div className="lg:col-span-3 border border-slate-200 rounded-xl p-5 bg-white">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0D3B2E]">
                <Factory className="w-4 h-4" />
                Company A (Supplier)
              </div>
              <h3 className="font-display text-base font-bold text-[#0F172A] mt-2">
                Metal Product Manufacturer
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Generates 5 TON of clean Mild Steel plate offcuts (IS 2062 Grade A) in Pune during
                sheet fabrication.
              </p>
            </div>

            <div className="hidden lg:flex lg:col-span-1 justify-center text-emerald-600">
              <ArrowRight className="w-5 h-5" />
            </div>

            <div className="lg:col-span-3 border border-[#0D3B2E] rounded-xl p-5 bg-[#0F172A] text-white">
              <p className="text-xs font-mono text-emerald-400">RENEXA INTERMEDIARY</p>
              <h3 className="font-display text-base font-bold mt-2">
                Specification Matching &amp; Quote Routing
              </h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Matches Steel category, IS 2062 grade, 5 TON supply &ge; 3 TON demand, and Pune
                location as a Strong Potential Match.
              </p>
            </div>

            <div className="hidden lg:flex lg:col-span-1 justify-center text-emerald-600">
              <ArrowRight className="w-5 h-5" />
            </div>

            <div className="lg:col-span-3 border border-slate-200 rounded-xl p-5 bg-white">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0D3B2E]">
                <Building2 className="w-4 h-4" />
                Company B (Buyer)
              </div>
              <h3 className="font-display text-base font-bold text-[#0F172A] mt-2">
                Gym Equipment Manufacturer
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Sends a quotation request for 3 TON, inspects the mild steel offcuts, and uses them
                directly as raw material for gym frames.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6-Step Operational Process */}
      <section className="space-y-6">
        <div>
          <p className="text-xs font-medium text-[#0D3B2E]">Step-by-Step Walkthrough</p>
          <h2 className="font-display text-2xl font-bold text-[#0F172A] tracking-tight mt-1">
            Six-Stage Marketplace Process
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SIX_STEPS.map((item) => (
            <div
              key={item.step}
              className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-mono font-semibold text-[#059669]">{item.step}</span>
                  <span className="text-slate-500">{item.actor}</span>
                </div>
                <h3 className="font-display text-base font-bold text-[#0F172A] mt-3">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Scope & Governance Notice + Demo CTAs */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-start gap-3.5 max-w-2xl">
          <ShieldAlert className="w-5 h-5 text-[#0D3B2E] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-display text-base font-bold text-[#0F172A]">
              Try the live Supplier &amp; Buyer flow in Demo Mode
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              ReNexa focuses on clean, recoverable, non-hazardous industrial streams. Test listing
              a material as a supplier, discovering it as a buyer, and submitting a simulated
              quotation request right now.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              setRole('supplier');
              navigate('add-listing');
            }}
            className="px-4 py-2.5 text-sm font-semibold text-white bg-[#0D3B2E] hover:bg-[#114D3C] rounded-lg cursor-pointer whitespace-nowrap shrink-0"
          >
            Try as Supplier
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('buyer');
              navigate('buyer-dashboard');
            }}
            className="px-4 py-2.5 text-sm font-semibold text-[#0F172A] border border-slate-300 hover:bg-slate-50 rounded-lg cursor-pointer whitespace-nowrap shrink-0"
          >
            Try as Buyer
          </button>
        </div>
      </section>
    </div>
  );
}
