import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ToastContainer } from './components/ToastContainer';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import { AddMaterialListingPage } from './pages/AddMaterialListingPage';
import { BuyerDashboardPage } from './pages/BuyerDashboardPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { LandingPage } from './pages/LandingPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { MaterialDetailsPage } from './pages/MaterialDetailsPage';
import { PostRequirementPage } from './pages/PostRequirementPage';
import { RequestsPage } from './pages/RequestsPage';
import { SupplierDashboardPage } from './pages/SupplierDashboardPage';

function AppShell() {
  const { currentPage, editingListingId, selectedMaterialId } = useMarketplace();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <LandingPage />;
      case 'marketplace':
        return <MarketplacePage />;
      case 'supplier-dashboard':
        return <SupplierDashboardPage />;
      case 'buyer-dashboard':
        return <BuyerDashboardPage />;
      case 'add-listing':
        return <AddMaterialListingPage key={editingListingId ?? 'new-listing'} />;
      case 'post-requirement':
        return <PostRequirementPage />;
      case 'material-details':
        return <MaterialDetailsPage key={selectedMaterialId ?? 'material-detail'} />;
      case 'how-it-works':
        return <HowItWorksPage />;
      case 'requests':
        return <RequestsPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      <Header />
      <main className="flex-1">{renderPage()}</main>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <MarketplaceProvider>
      <AppShell />
    </MarketplaceProvider>
  );
}
