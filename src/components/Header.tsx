import { useState } from 'react';
import { Menu, RotateCcw, X } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { PageRoute, UserRole } from '../types/marketplace';
import { ReNexaLogo } from './ReNexaLogo';

const NAV_ITEMS: { label: string; page: PageRoute }[] = [
  { label: 'Marketplace', page: 'marketplace' },
  { label: 'Supplier Hub', page: 'supplier-dashboard' },
  { label: 'Buyer Hub', page: 'buyer-dashboard' },
  { label: 'My Requests', page: 'requests' },
  { label: 'How It Works', page: 'how-it-works' },
];

export function Header() {
  const { role, setRole, currentPage, navigate, quotes, resetDemoData } = useMarketplace();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const pendingCount = quotes.filter((q) => q.status === 'Pending').length;

  const handleNavClick = (page: PageRoute) => {
    if (page === 'supplier-dashboard') setRole('supplier');
    if (page === 'buyer-dashboard') setRole('buyer');
    navigate(page);
    setMobileMenuOpen(false);
  };

  const handlePrimaryAction = () => {
    if (role === 'supplier') {
      navigate('add-listing');
    } else {
      navigate('post-requirement');
    }
    setMobileMenuOpen(false);
  };

  const handleRoleChange = (nextRole: UserRole) => {
    setRole(nextRole);
    if (currentPage === 'supplier-dashboard' && nextRole === 'buyer') {
      navigate('buyer-dashboard');
    } else if (currentPage === 'buyer-dashboard' && nextRole === 'supplier') {
      navigate('supplier-dashboard');
    }
  };

  return (
    <>
      {/* Strict 3-Zone Top Bar Contract: Brand | 5 single-line nav links | 1 primary action */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-element Brand Wordmark */}
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 rounded-md whitespace-nowrap shrink-0 cursor-pointer"
            aria-label="ReNexa Home"
          >
            <ReNexaLogo size="md" />
          </button>

          {/* Zone 2: 5 concise single-line text nav links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600"
          >
            {NAV_ITEMS.map((item) => {
              const isActive =
                currentPage === item.page ||
                (item.page === 'marketplace' && currentPage === 'material-details') ||
                (item.page === 'supplier-dashboard' && currentPage === 'add-listing') ||
                (item.page === 'buyer-dashboard' && currentPage === 'post-requirement');
              return (
                <button
                  key={item.page}
                  type="button"
                  onClick={() => handleNavClick(item.page)}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-sm ${
                    isActive
                      ? 'text-[#0D3B2E] font-semibold after:absolute after:left-0 after:right-0 after:-bottom-[19px] after:h-[2px] after:bg-[#059669]'
                      : 'text-slate-600 hover:text-[#0F172A]'
                  }`}
                >
                  {item.label}
                  {item.page === 'requests' && pendingCount > 0 && (
                    <span className="ml-1.5 font-mono text-xs tabular-nums text-emerald-700">
                      ({pendingCount})
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary CTA button + mobile menu trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handlePrimaryAction}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-[#0D3B2E] hover:bg-[#114D3C] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              {role === 'supplier' ? '+ List Material' : 'Post Requirement'}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2 shadow-sm">
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                currentPage === 'home'
                  ? 'bg-slate-100 text-[#0D3B2E] font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Home
            </button>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.page}
                type="button"
                onClick={() => handleNavClick(item.page)}
                className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                  currentPage === item.page
                    ? 'bg-slate-100 text-[#0D3B2E] font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
                {item.page === 'requests' && pendingCount > 0 ? ` (${pendingCount})` : ''}
              </button>
            ))}
            <div className="pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={handlePrimaryAction}
                className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-[#0D3B2E] hover:bg-[#114D3C] rounded-lg transition-colors"
              >
                {role === 'supplier' ? '+ List New Material' : 'Post Material Requirement'}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Non-sticky Workspace Context Strip: DEMO MODE indicator + Active Role Switcher */}
      <div className="bg-[#0F172A] text-slate-200 border-b border-slate-800">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span className="font-mono font-semibold tracking-wider text-emerald-400">
              DEMO MODE
            </span>
            <span className="text-slate-500" aria-hidden="true">
              ·
            </span>
            <span className="text-slate-300">
              Interactive prototype using sample data &amp; browser persistence — no registration or payment required.
            </span>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 hidden sm:inline">Active role:</span>
              <div
                className="inline-flex items-center p-0.5 bg-slate-800/90 rounded-md border border-slate-700"
                role="group"
                aria-label="Switch Demo User Role"
              >
                <button
                  type="button"
                  onClick={() => handleRoleChange('supplier')}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    role === 'supplier'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Supplier
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('buyer')}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    role === 'buyer'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Buyer
                </button>
              </div>
            </div>

            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                title="Restore initial sample listings and requests"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Reset Demo</span>
              </button>
            ) : (
              <span className="inline-flex items-center gap-2 whitespace-nowrap shrink-0">
                <span className="text-amber-300">Reset all data?</span>
                <button
                  type="button"
                  onClick={() => {
                    resetDemoData();
                    setConfirmReset(false);
                  }}
                  className="text-emerald-400 hover:underline font-semibold cursor-pointer"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
