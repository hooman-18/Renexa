import { useState } from 'react';
import {
  ArrowRight,
  Building2,
  Factory,
  Layers,
  SearchCheck,
  ShieldCheck,
} from 'lucide-react';
import { MaterialCard } from '../components/MaterialCard';
import { MaterialImage } from '../components/MaterialImage';
import { QuoteModal } from '../components/QuoteModal';
import { useMarketplace } from '../context/MarketplaceContext';
import { GENERATED_IMAGES } from '../data/seedData';
import { MaterialListing } from '../types/marketplace';

const HOW_IT_WORKS_STEPS = [
  {
    num: '01',
    title: 'Suppliers list available materials',
    description:
      'Industrial facilities publish usable scrap, offcuts, and surplus lots with grade, quantity, location, and optional expected price.',
  },
  {
    num: '02',
    title: 'Buyers explore suitable materials',
    description:
      'Manufacturing buyers search and filter available secondary materials by category, quality specification, volume, and industrial region.',
  },
  {
    num: '03',
    title: 'ReNexa matches requirements and supply',
    description:
      'Structured specification matching compares buyer requirements against live supplier listings across category, grade, quantity, and proximity.',
  },
  {
    num: '04',
    title: 'Buyers request quotations',
    description:
      'Prospective buyers submit formal quotation requests directly through the platform with required quantities and inspection notes.',
  },
  {
    num: '05',
    title: 'Both businesses coordinate the transaction',
    description:
      'Suppliers review and respond to enquiries, enabling both organizations to inspect quality and finalize offline commercial terms.',
  },
];

const BENEFITS = [
  {
    title: 'Discover potential industrial buyers',
    body: 'Connect structured scrap streams directly with downstream manufacturers who actively consume those grades as production inputs.',
    span: 'lg:col-span-2',
  },
  {
    title: 'Find suitable secondary raw materials',
    body: 'Source segregated offcuts, extrusions, polymer flakes, and baled packaging fibers organized by technical grade and region.',
    span: 'lg:col-span-1',
  },
  {
    title: 'Reduce industrial material wastage',
    body: 'Keep clean, non-hazardous production remnants circulating in regional manufacturing supply chains instead of sitting idle.',
    span: 'lg:col-span-1',
  },
  {
    title: 'Improve resource utilization',
    body: 'Match output specifications from one production process with raw material specifications needed by another industrial vertical.',
    span: 'lg:col-span-1',
  },
  {
    title: 'Connect directly with industrial businesses',
    body: 'Replace fragmented informal brokers with transparent B2B quotation requests and structured specification records.',
    span: 'lg:col-span-1',
  },
];

export function LandingPage() {
  const { listings, setRole, navigate, role } = useMarketplace();
  const [quoteMaterial, setQuoteMaterial] = useState<MaterialListing | null>(null);

  const featuredListings = listings.filter((l) => l.status === 'Active').slice(0, 3);

  const handleSelectRole = (chosen: 'supplier' | 'buyer', target: 'dashboard' | 'action') => {
    setRole(chosen);
    if (chosen === 'supplier') {
      navigate(target === 'action' ? 'add-listing' : 'supplier-dashboard');
    } else {
      navigate(target === 'action' ? 'marketplace' : 'buyer-dashboard');
    }
  };

  return (
    <div className="bg-[#F8FAFC]">
      {/* 1. HERO SECTION */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            {/* Left Copy & Conversion Column */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <p className="text-xs font-medium text-[#0D3B2E] tracking-wide mb-3">
                B2B Circular Economy Marketplace · Recoverable Industrial Materials
              </p>

              <h1
                className="font-display font-bold text-[#0F172A] tracking-tight leading-[1.08]"
                style={{
                  fontSize: 'clamp(2.25rem, 3.8vw, 3.5rem)',
                  textWrap: 'balance',
                }}
              >
                One Industry&apos;s Waste. Another&apos;s Resource.
              </h1>

              <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Connecting industries to transform underutilized materials into valuable resources.
                List usable production scrap or source specification-matched secondary raw
                materials across regional manufacturing hubs.
              </p>

              {/* Two Prominent Hero Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => handleSelectRole('supplier', 'action')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#0D3B2E] hover:bg-[#114D3C] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                >
                  Sell Your Industrial Waste
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectRole('buyer', 'action')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-[#0F172A] bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                >
                  Find Raw Materials
                </button>
              </div>

              {/* Clean Entry Role Selector — Demo Access Without Registration */}
              <div className="mt-10 pt-8 border-t border-slate-200">
                <p className="text-xs font-medium text-slate-500 mb-3">
                  Enter Interactive Demo Workspace — No account or payment required
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <button
                    type="button"
                    onClick={() => handleSelectRole('supplier', 'dashboard')}
                    className={`text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                      role === 'supplier'
                        ? 'border-[#059669] bg-emerald-50/40'
                        : 'border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display text-sm font-bold text-[#0F172A] flex items-center gap-2">
                        <Factory className="w-4 h-4 text-[#0D3B2E]" />
                        I am a Supplier
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                    <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                      Have usable industrial scrap, offcuts, or leftover materials to list for
                      buyers.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectRole('buyer', 'dashboard')}
                    className={`text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                      role === 'buyer'
                        ? 'border-[#059669] bg-emerald-50/40'
                        : 'border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display text-sm font-bold text-[#0F172A] flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[#0D3B2E]" />
                        I am a Buyer
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                    <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                      Need recoverable secondary materials matched by grade, quantity, and city.
                    </p>
                  </button>
                </div>
              </div>
            </div>

            {/* Right 16:9 Architectural Industrial Visual */}
            <div className="lg:col-span-6 flex">
              <div className="relative w-full min-h-[300px] lg:min-h-[460px] rounded-xl overflow-hidden border border-slate-200 bg-[#0F172A]">
                <MaterialImage
                  src={GENERATED_IMAGES.hero}
                  alt="Modern industrial material warehouse storing sorted steel plates and extruded aluminium profiles"
                  className="w-full h-full object-cover"
                />
                {/* Measured Scrim Caption */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#09101D]/90 via-[#09101D]/55 to-transparent p-6 pt-16 text-white">
                  <p className="text-xs font-mono text-emerald-300 tracking-wide">
                    INDUSTRIAL EXCHANGE CONCEPT
                  </p>
                  <p className="mt-1 font-display text-base font-semibold leading-snug max-w-md">
                    Segregated steel offcuts, aluminium extrusions, copper busbar ends, and
                    post-industrial polymers routed directly to manufacturing buyers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VISUAL FLOW: SUPPLIER → RENEXA → BUYER */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl">
          <p className="text-xs font-medium text-[#0D3B2E]">Marketplace Architecture</p>
          <h2
            className="font-display text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight mt-1.5"
            style={{ textWrap: 'balance' }}
          >
            From industrial byproduct to qualified production input
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed">
            ReNexa operates strictly as a B2B intermediary platform—organizing material
            specifications and connecting industrial counterparts without manufacturing products
            itself.
          </p>
        </div>

        {/* Core 3-Stage Flow Diagram */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-11 gap-4 items-stretch">
          {/* Supplier Node */}
          <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                <span className="font-mono font-medium text-[#0D3B2E]">ORIGIN</span>
                <Factory className="w-4 h-4 text-slate-400" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#0F172A]">Supplier</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Example: A metal fabrication plant generates clean Mild Steel plate offcuts and
                structural remnants during production runs.
              </p>
            </div>
            <p className="mt-5 pt-3 border-t border-slate-100 text-xs text-slate-500">
              Publishes grade, quantity, &amp; city
            </p>
          </div>

          <div className="hidden lg:flex lg:col-span-1 items-center justify-center text-slate-400">
            <ArrowRight className="w-5 h-5" />
          </div>

          {/* ReNexa Matching Hub Node */}
          <div className="lg:col-span-3 bg-[#0D3B2E] text-white rounded-xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-emerald-300 mb-3">
                <span className="font-mono font-medium">INTERMEDIARY PLATFORM</span>
                <SearchCheck className="w-4 h-4 text-emerald-300" />
              </div>
              <h3 className="font-display text-lg font-bold text-white">ReNexa</h3>
              <p className="mt-2 text-sm text-slate-200 leading-relaxed">
                Records supplier specifications, matches them against posted buyer requirements,
                and routes structured quotation requests.
              </p>
            </div>
            <p className="mt-5 pt-3 border-t border-white/15 text-xs text-emerald-200">
              Category · Grade · Volume · Location
            </p>
          </div>

          <div className="hidden lg:flex lg:col-span-1 items-center justify-center text-slate-400">
            <ArrowRight className="w-5 h-5" />
          </div>

          {/* Buyer Node */}
          <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                <span className="font-mono font-medium text-[#0D3B2E]">DESTINATION</span>
                <Building2 className="w-4 h-4 text-slate-400" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#0F172A]">Buyer</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Example: A commercial gym equipment manufacturer sources suitable mild steel
                directly as raw material for frames and benches.
              </p>
            </div>
            <p className="mt-5 pt-3 border-t border-slate-100 text-xs text-slate-500">
              Requests quote &amp; verifies quality
            </p>
          </div>
        </div>

        {/* Value Chain Strip */}
        <div className="mt-6 bg-white border border-slate-200 rounded-xl px-6 py-4 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-medium text-[#0F172A]">
          <span>Industrial Waste</span>
          <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Material Matching</span>
          <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Business Connection</span>
          <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Raw Material</span>
          <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-[#0D3B2E] font-semibold">Value Creation</span>
        </div>
      </section>

      {/* 3. HOW RENEXA WORKS (5 NUMBERED EDITORIAL STEPS) */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div className="max-w-2xl">
              <p className="text-xs font-medium text-[#0D3B2E]">Operational Workflow</p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight mt-1.5">
                How ReNexa Works
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('how-it-works')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0D3B2E] hover:text-[#059669] transition-colors cursor-pointer self-start md:self-auto"
            >
              View detailed 6-step business model
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
            {HOW_IT_WORKS_STEPS.map((step) => (
              <div
                key={step.num}
                className="py-5 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 items-baseline"
              >
                <span className="md:col-span-1 font-mono text-sm font-semibold text-[#059669] tabular-nums">
                  {step.num}.
                </span>
                <h3 className="md:col-span-4 font-display text-base font-bold text-[#0F172A]">
                  {step.title}
                </h3>
                <p className="md:col-span-7 text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. BENEFITS — ASYMMETRIC EDITORIAL GRID */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl mb-10">
          <p className="text-xs font-medium text-[#0D3B2E]">Platform Value</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight mt-1.5">
            Designed for structured B2B material recovery
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {BENEFITS.map((benefit, idx) => (
            <div
              key={benefit.title}
              className={`bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between ${benefit.span}`}
            >
              <div>
                <span className="font-mono text-xs text-slate-400 tabular-nums">
                  0{idx + 1}
                </span>
                <h3 className="font-display text-lg font-bold text-[#0F172A] mt-2">
                  {benefit.title}
                </h3>
                <p className="mt-2.5 text-sm text-slate-600 leading-relaxed max-w-xl">
                  {benefit.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FEATURED SAMPLE MARKETPLACE LISTINGS */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-medium text-[#0D3B2E]">
              Live Demo Catalog · Sample Data
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight mt-1">
              Explore available industrial materials
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('marketplace')}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#0F172A] bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-auto"
          >
            Browse All Listings ({listings.filter((l) => l.status === 'Active').length})
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredListings.map((listing) => (
            <MaterialCard
              key={listing.id}
              listing={listing}
              onRequestQuote={(item) => setQuoteMaterial(item)}
            />
          ))}
        </div>

        {/* Scope Clarification Banner */}
        <div className="mt-10 bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-start gap-3.5 max-w-3xl">
            <ShieldCheck className="w-5 h-5 text-[#0D3B2E] shrink-0 mt-0.5" />
            <div className="text-sm text-slate-600 leading-relaxed">
              <strong className="text-[#0F172A] font-semibold">
                Non-hazardous recoverable streams only:
              </strong>{' '}
              This demonstration focuses on clean, recoverable industrial metals, polymers, and
              packaging fibers. All initial listings represent illustrative sample data and do not
              imply independent verification or that every industrial waste stream is reusable.
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setRole('buyer');
              navigate('post-requirement');
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#059669] hover:bg-[#047857] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            Test Smart Matching
          </button>
        </div>
      </section>

      {quoteMaterial && (
        <QuoteModal material={quoteMaterial} onClose={() => setQuoteMaterial(null)} />
      )}
    </div>
  );
}
