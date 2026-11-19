import { ShieldAlert } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ReNexaLogo } from './ReNexaLogo';

export function Footer() {
  const { navigate, setRole } = useMarketplace();

  return (
    <footer className="bg-[#0F172A] text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Legal & Compliance Disclaimer (Section 14) */}
        <div className="pb-10 mb-10 border-b border-slate-800 flex flex-col md:flex-row gap-4 items-start">
          <ShieldAlert className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1.5 text-sm leading-relaxed text-slate-300 max-w-4xl">
            <p className="font-display font-semibold text-white">
              Platform Scope &amp; Material Verification Disclaimer
            </p>
            <p>
              ReNexa is a proposed industrial material exchange platform. Material specifications
              are supplier-provided and must be independently checked before any transaction.
              Regulated or hazardous materials require applicable authorization and compliance.
            </p>
            <p className="text-xs text-slate-400">
              This interactive demonstration focuses strictly on recoverable, non-hazardous
              industrial materials and uses sample data with locally simulated quotation requests.
              ReNexa acts as a B2B intermediary marketplace and does not manufacture materials,
              process payments, or guarantee third-party logistics.
            </p>
          </div>
        </div>

        {/* Navigation & Brand Column */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5 space-y-3">
            <button
              type="button"
              onClick={() => navigate('home')}
              className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-md"
            >
              <ReNexaLogo variant="inverted" size="md" />
            </button>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              One Industry&apos;s Waste. Another&apos;s Resource. Connecting industrial material
              generators with manufacturing buyers seeking secondary raw materials.
            </p>
          </div>

          <div className="md:col-span-3 space-y-2.5 text-sm">
            <p className="font-display font-semibold text-white">Platform</p>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Homepage
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('marketplace')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Material Marketplace
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('how-it-works')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('requests')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  My Requests
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-2.5 text-sm">
            <p className="font-display font-semibold text-white">Demo Workspaces</p>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setRole('supplier');
                    navigate('supplier-dashboard');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Supplier Dashboard
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setRole('supplier');
                    navigate('add-listing');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  List Recoverable Industrial Material
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setRole('buyer');
                    navigate('buyer-dashboard');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Buyer Dashboard &amp; Smart Matching
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setRole('buyer');
                    navigate('post-requirement');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Post Raw Material Requirement
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom signature bar */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p className="font-medium text-slate-200">
            ReNexa | Connecting Industries. Creating Value.
          </p>
          <p>Interactive B2B Circular Economy Marketplace Prototype · Demo Environment</p>
        </div>
      </div>
    </footer>
  );
}
