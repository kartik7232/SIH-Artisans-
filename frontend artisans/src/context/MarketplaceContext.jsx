import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { products as initialProducts } from '../data/products';
import { artisans as initialArtisans } from '../data/artisans';
import { crafts as initialCrafts } from '../data/crafts';
import storageService from '../services/storageService';

const MarketplaceContext = createContext();

const DEFAULT_INQUIRIES = [
  {
    id: 'inq-1',
    buyerName: 'ABC Handicrafts & Exports',
    buyerLocation: 'New Delhi / London',
    productName: 'Handwoven Organic Cotton Tote Bags',
    quantity: 500,
    targetPrice: 200,
    totalValue: 100000,
    timeline: '30 Days',
    status: 'new',
    timestamp: '2 hours ago',
    message: 'Looking for 500 export-grade handwoven bags with natural madder root dyed lining. Urgent order for autumn pop-up.'
  }
];

const DEFAULT_BUYER_REQUIREMENTS = [
  {
    id: 'req-1',
    buyerCompany: 'EcoLiving Resorts & Boutique Spas',
    item: 'Handwoven Bamboo Food Covers & Bazaar Baskets',
    quantity: 500,
    budgetPerUnit: 350,
    location: 'Goa & Kochi',
    timeline: 30,
    matchScore: 96,
    matchedArtisan: 'Majuli Island Bamboo Guild',
    status: 'Active Matching',
    image: '/assets/culture/crafts/bamboo-bazaar-baskets.jpg'
  },
  {
    id: 'req-2',
    buyerCompany: 'Heritage Haveli Hospitality Interiors',
    item: 'Hand-Braided Sarkanda Mudda Seating Stools',
    quantity: 250,
    budgetPerUnit: 580,
    location: 'Jaipur & Udaipur',
    timeline: 45,
    matchScore: 94,
    matchedArtisan: 'Farrukhnagar Mudda Craft Guild',
    status: 'Under Negotiation',
    image: '/assets/culture/crafts/sarkanda-mudda-stools.jpg'
  },
  {
    id: 'req-3',
    buyerCompany: 'Ananya Organic Kitchens & Stores',
    item: 'Cylindrical Bamboo Storage Jars with Woven Lids',
    quantity: 400,
    budgetPerUnit: 380,
    location: 'Bengaluru',
    timeline: 25,
    matchScore: 91,
    matchedArtisan: 'Barpeta Bamboo Collective SHG',
    status: 'Open',
    image: '/assets/culture/crafts/bamboo-storage-containers.jpg'
  },
  {
    id: 'req-4',
    buyerCompany: 'Veda Heritage Weddings & ESG Favors',
    item: 'Vibrant Geometric Handwoven Bamboo Pankha Hand Fans',
    quantity: 1200,
    budgetPerUnit: 110,
    location: 'New Delhi',
    timeline: 20,
    matchScore: 97,
    matchedArtisan: 'Mithila Bamboo Weavers Collective',
    status: 'Open',
    image: '/assets/culture/crafts/handwoven-bamboo-pankha.jpg'
  },
  {
    id: 'req-5',
    buyerCompany: 'Gramin Khadi & Agro Packaging',
    item: 'Traditional Bamboo Winnowing Trays (Supa)',
    quantity: 600,
    budgetPerUnit: 180,
    location: 'Lucknow & Varanasi',
    timeline: 35,
    matchScore: 90,
    matchedArtisan: 'Purulia Tribal Bamboo Artisan SHG',
    status: 'Open',
    image: '/assets/culture/crafts/bamboo-winnowing-trays.jpg'
  }
];

export const MarketplaceProvider = ({ children, onProductPublished, onInquirySent, onRequirementPosted }) => {
  const loadMergedProducts = useCallback(() => {
    const custom = storageService.loadCustomProducts();
    if (custom && custom.length > 0) {
      const customIds = new Set(custom.map(p => p.id));
      const filteredInitial = initialProducts.filter(p => !customIds.has(p.id));
      return [...custom, ...filteredInitial];
    }
    return initialProducts;
  }, []);

  const [productsList, setProductsList] = useState(loadMergedProducts);
  const [inquiries, setInquiries] = useState(() => storageService.loadInquiries(DEFAULT_INQUIRIES));
  const [buyerRequirements, setBuyerRequirements] = useState(() => storageService.loadBuyerRequirements(DEFAULT_BUYER_REQUIREMENTS));

  // Sync with real-time storage updates (e.g. cross-tab or studio persistence)
  useEffect(() => {
    const unsubscribe = storageService.subscribe((event) => {
      if (event === 'storage_sync' || event === 'local_write' || event === 'local_remove') {
        setProductsList(loadMergedProducts());
        setInquiries(storageService.loadInquiries(DEFAULT_INQUIRIES));
        setBuyerRequirements(storageService.loadBuyerRequirements(DEFAULT_BUYER_REQUIREMENTS));
      }
    });

    return unsubscribe;
  }, [loadMergedProducts]);

  const addPublishedProduct = useCallback((newProduct) => {
    setProductsList(prev => [newProduct, ...prev]);
    storageService.saveCustomProduct(newProduct);
    if (onProductPublished) {
      onProductPublished(newProduct);
    }
  }, [onProductPublished]);

  const addInquiry = useCallback((inquiry) => {
    setInquiries(prev => [inquiry, ...prev]);
    storageService.saveInquiry(inquiry);
    if (onInquirySent) {
      onInquirySent(inquiry);
    }
  }, [onInquirySent]);

  const addBuyerRequirement = useCallback((requirement) => {
    setBuyerRequirements(prev => [requirement, ...prev]);
    storageService.saveBuyerRequirement(requirement);
    if (onRequirementPosted) {
      onRequirementPosted(requirement);
    }
  }, [onRequirementPosted]);

  return (
    <MarketplaceContext.Provider value={{
      productsList,
      setProductsList,
      addPublishedProduct,
      inquiries,
      addInquiry,
      buyerRequirements,
      addBuyerRequirement,
      crafts: initialCrafts,
      artisans: initialArtisans
    }}>
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};

export default MarketplaceContext;
