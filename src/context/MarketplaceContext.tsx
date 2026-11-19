import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  CATEGORY_PRESET_IMAGES,
  INITIAL_ACTIVITIES,
  INITIAL_LISTINGS,
  INITIAL_QUOTES,
  INITIAL_REQUIREMENTS,
} from '../data/seedData';
import {
  ActivityItem,
  BuyerRequirement,
  MaterialListing,
  PageRoute,
  QuotationRequest,
  QuoteStatus,
  ToastMessage,
  UserRole,
} from '../types/marketplace';

const STORAGE_KEY = 'renexa_demo_marketplace_v1';

interface PersistedState {
  role: UserRole;
  listings: MaterialListing[];
  requirements: BuyerRequirement[];
  quotes: QuotationRequest[];
  savedIds: string[];
  activities: ActivityItem[];
}

interface MarketplaceContextValue {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentPage: PageRoute;
  selectedMaterialId: string | null;
  editingListingId: string | null;
  activeRequirementId: string | null;
  setActiveRequirementId: (id: string | null) => void;
  navigate: (page: PageRoute, options?: { materialId?: string; editListingId?: string; requirementId?: string }) => void;

  listings: MaterialListing[];
  requirements: BuyerRequirement[];
  quotes: QuotationRequest[];
  savedIds: string[];
  activities: ActivityItem[];

  addListing: (
    data: Omit<MaterialListing, 'id' | 'createdAt' | 'isSampleData' | 'status'>
  ) => MaterialListing;
  updateListing: (
    id: string,
    data: Partial<Omit<MaterialListing, 'id' | 'createdAt'>>
  ) => void;
  deleteListing: (id: string) => void;
  toggleListingStatus: (id: string) => void;

  addRequirement: (
    data: Omit<BuyerRequirement, 'id' | 'createdAt' | 'isSampleData'>
  ) => BuyerRequirement;
  deleteRequirement: (id: string) => void;

  submitQuote: (data: {
    materialId: string;
    buyerCompanyName: string;
    contactPerson: string;
    requiredQuantity: number;
    offeredPrice?: number;
    message: string;
  }) => QuotationRequest | null;
  updateQuoteStatus: (id: string, status: QuoteStatus) => void;

  toggleSavedMaterial: (materialId: string) => void;
  resetDemoData: () => void;

  toasts: ToastMessage[];
  pushToast: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;
}

const MarketplaceContext = createContext<MarketplaceContextValue | null>(null);

function loadPersistedState(): PersistedState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        role: 'buyer',
        listings: INITIAL_LISTINGS,
        requirements: INITIAL_REQUIREMENTS,
        quotes: INITIAL_QUOTES,
        savedIds: ['mat-mild-steel-01'],
        activities: INITIAL_ACTIVITIES,
      };
    }
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      role: parsed.role === 'supplier' || parsed.role === 'buyer' ? parsed.role : 'buyer',
      listings: Array.isArray(parsed.listings) ? parsed.listings : INITIAL_LISTINGS,
      requirements: Array.isArray(parsed.requirements) ? parsed.requirements : INITIAL_REQUIREMENTS,
      quotes: Array.isArray(parsed.quotes) ? parsed.quotes : INITIAL_QUOTES,
      savedIds: Array.isArray(parsed.savedIds) ? parsed.savedIds : ['mat-mild-steel-01'],
      activities: Array.isArray(parsed.activities) ? parsed.activities : INITIAL_ACTIVITIES,
    };
  } catch {
    return {
      role: 'buyer',
      listings: INITIAL_LISTINGS,
      requirements: INITIAL_REQUIREMENTS,
      quotes: INITIAL_QUOTES,
      savedIds: ['mat-mild-steel-01'],
      activities: INITIAL_ACTIVITIES,
    };
  }
}

export function MarketplaceProvider({ children }: { children: React.ReactNode }) {
  const [initialState] = useState<PersistedState>(() => loadPersistedState());

  const [role, setRoleState] = useState<UserRole>(initialState.role);
  const [listings, setListings] = useState<MaterialListing[]>(initialState.listings);
  const [requirements, setRequirements] = useState<BuyerRequirement[]>(initialState.requirements);
  const [quotes, setQuotes] = useState<QuotationRequest[]>(initialState.quotes);
  const [savedIds, setSavedIds] = useState<string[]>(initialState.savedIds);
  const [activities, setActivities] = useState<ActivityItem[]>(initialState.activities);

  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(
    initialState.listings[0]?.id ?? null
  );
  const [editingListingId, setEditingListingId] = useState<string | null>(null);
  const [activeRequirementId, setActiveRequirementId] = useState<string | null>(
    initialState.requirements[0]?.id ?? null
  );
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persist every state change to localStorage
  useEffect(() => {
    try {
      const payload: PersistedState = {
        role,
        listings,
        requirements,
        quotes,
        savedIds,
        activities,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore quota errors gracefully if user uploads a large image
    }
  }, [role, listings, requirements, quotes, savedIds, activities]);

  const pushToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev.slice(-3), { ...toast, id }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const logActivity = useCallback((entry: Omit<ActivityItem, 'id' | 'timestamp'>) => {
    const item: ActivityItem = {
      ...entry,
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      timestamp: new Date().toISOString(),
    };
    setActivities((prev) => [item, ...prev].slice(0, 30));
  }, []);

  const setRole = useCallback((nextRole: UserRole) => {
    setRoleState(nextRole);
  }, []);

  const navigate = useCallback(
    (
      page: PageRoute,
      options?: { materialId?: string; editListingId?: string; requirementId?: string }
    ) => {
      if (options?.materialId !== undefined) {
        setSelectedMaterialId(options.materialId);
      }
      if (page === 'add-listing') {
        setEditingListingId(options?.editListingId ?? null);
      } else {
        setEditingListingId(null);
      }
      if (options?.requirementId !== undefined) {
        setActiveRequirementId(options.requirementId);
      }
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    []
  );

  const addListing = useCallback(
    (data: Omit<MaterialListing, 'id' | 'createdAt' | 'isSampleData' | 'status'>) => {
      const created: MaterialListing = {
        ...data,
        id: `mat-user-${Date.now()}`,
        imageUrl: data.imageUrl || CATEGORY_PRESET_IMAGES[data.category],
        status: 'Active',
        isSampleData: false,
        createdAt: new Date().toISOString(),
        specifications: data.specifications ?? {
          condition: 'Supplier-declared recoverable industrial lot',
          packaging: 'Standard industrial bundling / palletized',
          dispatchWindow: 'Coordinated directly upon quotation acceptance',
          hazardClassification: 'Declared non-hazardous recoverable material',
        },
      };
      setListings((prev) => [created, ...prev]);
      logActivity({
        role: 'supplier',
        action: 'Published new material listing',
        detail: `${created.name} (${created.quantity} ${created.unit}, ${created.location}) is now live in the marketplace.`,
        relatedPage: 'material-details',
        relatedId: created.id,
      });
      pushToast({
        type: 'success',
        title: 'Material listing published',
        description: `${created.name} is now visible to buyers in the ReNexa Marketplace.`,
      });
      return created;
    },
    [logActivity, pushToast]
  );

  const updateListing = useCallback(
    (id: string, data: Partial<Omit<MaterialListing, 'id' | 'createdAt'>>) => {
      setListings((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                ...data,
                updatedAt: new Date().toISOString(),
              }
            : item
        )
      );
      logActivity({
        role: 'supplier',
        action: 'Updated material listing',
        detail: `Updated specifications for ${data.name ?? 'material listing'}.`,
        relatedPage: 'material-details',
        relatedId: id,
      });
      pushToast({
        type: 'success',
        title: 'Listing updated',
        description: 'Material specifications have been saved to local demo storage.',
      });
    },
    [logActivity, pushToast]
  );

  const deleteListing = useCallback(
    (id: string) => {
      const target = listings.find((l) => l.id === id);
      setListings((prev) => prev.filter((item) => item.id !== id));
      setSavedIds((prev) => prev.filter((saved) => saved !== id));
      if (selectedMaterialId === id) {
        setSelectedMaterialId(null);
      }
      if (target) {
        logActivity({
          role: 'supplier',
          action: 'Removed material listing',
          detail: `Deleted "${target.name}" (${target.location}) from active catalog.`,
          relatedPage: 'supplier-dashboard',
        });
        pushToast({
          type: 'info',
          title: 'Listing deleted',
          description: `"${target.name}" was removed from the marketplace.`,
        });
      }
    },
    [listings, logActivity, pushToast, selectedMaterialId]
  );

  const toggleListingStatus = useCallback(
    (id: string) => {
      const target = listings.find((l) => l.id === id);
      if (!target) return;
      const nextStatus = target.status === 'Active' ? 'Paused' : 'Active';
      setListings((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: nextStatus } : item))
      );
      logActivity({
        role: 'supplier',
        action: `Marked listing as ${nextStatus}`,
        detail: `"${target.name}" status changed to ${nextStatus}.`,
        relatedPage: 'supplier-dashboard',
      });
      pushToast({
        type: 'info',
        title: `Listing ${nextStatus.toLowerCase()}`,
        description: `"${target.name}" is now ${nextStatus.toLowerCase()}.`,
      });
    },
    [listings, logActivity, pushToast]
  );

  const addRequirement = useCallback(
    (data: Omit<BuyerRequirement, 'id' | 'createdAt' | 'isSampleData'>) => {
      const created: BuyerRequirement = {
        ...data,
        id: `req-user-${Date.now()}`,
        isSampleData: false,
        createdAt: new Date().toISOString(),
      };
      setRequirements((prev) => [created, ...prev]);
      setActiveRequirementId(created.id);
      logActivity({
        role: 'buyer',
        action: 'Posted material requirement',
        detail: `Requested ${created.requiredQuantity} ${created.unit} of ${created.requiredMaterial} (${created.preferredLocation}).`,
        relatedPage: 'buyer-dashboard',
      });
      pushToast({
        type: 'success',
        title: 'Requirement posted & matched',
        description: 'ReNexa compared your specifications against available supplier listings.',
      });
      return created;
    },
    [logActivity, pushToast]
  );

  const deleteRequirement = useCallback(
    (id: string) => {
      setRequirements((prev) => {
        const remaining = prev.filter((r) => r.id !== id);
        if (activeRequirementId === id) {
          setActiveRequirementId(remaining[0]?.id ?? null);
        }
        return remaining;
      });
      pushToast({
        type: 'info',
        title: 'Requirement removed',
        description: 'The material requirement has been deleted from your workspace.',
      });
    },
    [activeRequirementId, pushToast]
  );

  const submitQuote = useCallback(
    (data: {
      materialId: string;
      buyerCompanyName: string;
      contactPerson: string;
      requiredQuantity: number;
      offeredPrice?: number;
      message: string;
    }) => {
      const material = listings.find((l) => l.id === data.materialId);
      if (!material) return null;

      const refNum = 1042 + quotes.length;
      const created: QuotationRequest = {
        id: `quote-user-${Date.now()}`,
        referenceCode: `RNX-Q-${refNum}`,
        materialId: material.id,
        materialName: material.name,
        materialCategory: material.category,
        supplierName: material.supplierName,
        buyerCompanyName: data.buyerCompanyName,
        contactPerson: data.contactPerson,
        requiredQuantity: data.requiredQuantity,
        unit: material.unit,
        offeredPrice: data.offeredPrice,
        expectedPrice: material.expectedPrice,
        message: data.message,
        status: 'Pending',
        isSampleData: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setQuotes((prev) => [created, ...prev]);
      logActivity({
        role: 'both',
        action: 'New quotation request submitted',
        detail: `${created.buyerCompanyName} requested ${created.requiredQuantity} ${created.unit} of ${created.materialName} (${created.referenceCode}).`,
        relatedPage: 'requests',
      });
      pushToast({
        type: 'success',
        title: `Quotation request ${created.referenceCode} sent`,
        description: `Simulated demo enquiry delivered to ${material.supplierName}.`,
      });
      return created;
    },
    [listings, quotes.length, logActivity, pushToast]
  );

  const updateQuoteStatus = useCallback(
    (id: string, status: QuoteStatus) => {
      const target = quotes.find((q) => q.id === id);
      if (!target) return;
      setQuotes((prev) =>
        prev.map((q) =>
          q.id === id ? { ...q, status, updatedAt: new Date().toISOString() } : q
        )
      );
      logActivity({
        role: 'both',
        action: `Quotation marked as ${status}`,
        detail: `Request ${target.referenceCode} for ${target.materialName} updated to ${status}.`,
        relatedPage: 'requests',
      });
      pushToast({
        type: 'success',
        title: `Request ${status}`,
        description: `${target.referenceCode} (${target.materialName}) is now marked as ${status}.`,
      });
    },
    [quotes, logActivity, pushToast]
  );

  const toggleSavedMaterial = useCallback(
    (materialId: string) => {
      const target = listings.find((l) => l.id === materialId);
      setSavedIds((prev) => {
        const exists = prev.includes(materialId);
        if (exists) {
          pushToast({
            type: 'info',
            title: 'Removed from saved materials',
            description: target ? `${target.name} removed from favourites.` : undefined,
          });
          return prev.filter((id) => id !== materialId);
        }
        pushToast({
          type: 'success',
          title: 'Saved to favourites',
          description: target ? `${target.name} added to your Buyer Dashboard.` : undefined,
        });
        return [materialId, ...prev];
      });
    },
    [listings, pushToast]
  );

  const resetDemoData = useCallback(() => {
    setListings(INITIAL_LISTINGS);
    setRequirements(INITIAL_REQUIREMENTS);
    setQuotes(INITIAL_QUOTES);
    setSavedIds(['mat-mild-steel-01']);
    setActivities(INITIAL_ACTIVITIES);
    setActiveRequirementId(INITIAL_REQUIREMENTS[0]?.id ?? null);
    setSelectedMaterialId(INITIAL_LISTINGS[0]?.id ?? null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    pushToast({
      type: 'info',
      title: 'Demo data restored',
      description: 'All sample listings, requirements, and requests have been reset.',
    });
  }, [pushToast]);

  return (
    <MarketplaceContext.Provider
      value={{
        role,
        setRole,
        currentPage,
        selectedMaterialId,
        editingListingId,
        activeRequirementId,
        setActiveRequirementId,
        navigate,
        listings,
        requirements,
        quotes,
        savedIds,
        activities,
        addListing,
        updateListing,
        deleteListing,
        toggleListingStatus,
        addRequirement,
        deleteRequirement,
        submitQuote,
        updateQuoteStatus,
        toggleSavedMaterial,
        resetDemoData,
        toasts,
        pushToast,
        dismissToast,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace(): MarketplaceContextValue {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) {
    throw new Error('useMarketplace must be used inside MarketplaceProvider');
  }
  return ctx;
}
