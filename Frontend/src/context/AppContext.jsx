import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ToastProvider, useToast } from './ToastContext';
import { AuthProvider, useAuth } from './AuthContext';
import { MarketplaceProvider, useMarketplace } from './MarketplaceContext';
import storageService from '../services/storageService';

const AppContext = createContext();

const VALID_SURFACES = [
  'public',
  'auth',
  'onboarding',
  'artisan',
  'studio',
  'inventory',
  'marketplace',
  'buyer',
  'admin',
  'admin-catalog',
  'admin-rfqs'
];

const getSurfaceFromHash = () => {
  if (typeof window === 'undefined') return null;
  const rawHash = window.location.hash.replace(/^#\/?/, '').split('?')[0].toLowerCase();
  if (rawHash === 'home') return 'public';
  return VALID_SURFACES.includes(rawHash) ? rawHash : null;
};

import { ROLE_PERMISSIONS, ROLE_HOME, isSurfaceAllowedForRole } from '../config/roles';

// Internal coordinator provider inside domain providers
const AppCoordinator = ({ children }) => {
  const { toasts, showToast, removeToast } = useToast();
  const { currentUser, loginUser, logoutUser } = useAuth();
  const {
    productsList,
    setProductsList,
    addPublishedProduct,
    inquiries,
    addInquiry,
    buyerRequirements,
    addBuyerRequirement,
    crafts,
    artisans
  } = useMarketplace();

  // Derive the active authenticated user synchronously, falling back to storage
  const storedUser = storageService.loadAuthUser();
  const activeUser = (currentUser && currentUser.isLoggedIn) 
    ? currentUser 
    : ((storedUser && storedUser.isLoggedIn) ? storedUser : currentUser);

  // 1. Two-way URL Hash-based Navigation (Auth-First Gate with RBAC)
  const [currentSurface, setCurrentSurface] = useState(() => {
    const user = storageService.loadAuthUser();
    const isLoggedIn = user && user.isLoggedIn;

    // Strict Rule: When anyone opens the web app, ONLY the login page appears first!
    if (!isLoggedIn) {
      return 'auth';
    }

    const hashSurface = getSurfaceFromHash();
    if (hashSurface && hashSurface !== 'auth' && hashSurface !== 'public') {
      if (isSurfaceAllowedForRole(hashSurface, user.role)) {
        return hashSurface;
      }
    }

    return ROLE_HOME[user.role] || 'marketplace';
  });

  const [surfaceParams, setSurfaceParams] = useState({});

  // Sync hash on initial mount and route changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = storageService.loadAuthUser();
      const isLoggedIn = Boolean(user && user.isLoggedIn);

      if (!isLoggedIn) {
        if (currentSurface !== 'auth') {
          setCurrentSurface('auth');
        }
        if (window.location.hash !== '#/auth') {
          window.location.hash = '#/auth';
        }
      } else if (!window.location.hash || window.location.hash === '#' || window.location.hash === '#/') {
        window.location.hash = `#/${currentSurface}`;
      }
    }
  }, [currentSurface]);

  // Listen for browser Back/Forward (hashchange) navigation with RBAC gating
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onHashChange = () => {
      const user = storageService.loadAuthUser();
      const isLoggedIn = Boolean(user && user.isLoggedIn);

      if (!isLoggedIn) {
        if (currentSurface !== 'auth') {
          setCurrentSurface('auth');
        }
        if (window.location.hash !== '#/auth') {
          window.location.hash = '#/auth';
        }
        return;
      }

      const surface = getSurfaceFromHash();
      if (surface && surface !== currentSurface) {
        if (surface === 'auth') {
          setCurrentSurface('auth');
          return;
        }
        if (!isSurfaceAllowedForRole(surface, user.role)) {
          const fallback = ROLE_HOME[user.role] || 'marketplace';
          showToast({
            type: 'warning',
            title: 'Access Restricted',
            message: `The "${surface}" page is restricted for ${user.role.toUpperCase()} users. Redirecting to your workspace.`
          });
          setCurrentSurface(fallback);
          window.location.hash = `#/${fallback}`;
          return;
        }
        setCurrentSurface(surface);
      }
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [currentSurface, showToast]);

  const navigate = useCallback((surface, params = {}) => {
    let target = surface === 'home' || surface === 'public' ? 'marketplace' : surface;
    const stored = storageService.loadAuthUser();
    const effective = (currentUser && currentUser.isLoggedIn) 
      ? currentUser 
      : ((stored && stored.isLoggedIn) ? stored : currentUser);
    const role = effective?.role;
    const isLoggedIn = Boolean(effective?.isLoggedIn);

    if (target === 'auth') {
      // Unconditional access to auth surface for sign-in / sign-out / profile switching
      target = 'auth';
    } else if (isLoggedIn && role) {
      if (!isSurfaceAllowedForRole(target, role)) {
        const fallback = ROLE_HOME[role] || 'marketplace';
        showToast({
          type: 'warning',
          title: 'Access Restricted',
          message: `The "${target}" page is restricted for ${role.toUpperCase()} accounts. Redirecting to your workspace.`
        });
        target = fallback;
      }
    } else {
      target = 'auth';
    }

    setCurrentSurface(target);
    setSurfaceParams(params);
    if (typeof window !== 'undefined') {
      if (window.location.hash !== `#/${target}`) {
        window.location.hash = `#/${target}`;
      }
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch {
        // Fallback for older browsers
      }
    }
  }, [currentUser, showToast]);

  // 2. Assistant Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedArtisan, setSelectedArtisan] = useState(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantInitialQuery, setAssistantInitialQuery] = useState('');

  const openAssistant = useCallback((prompt = '') => {
    setAssistantInitialQuery(prompt);
    setIsAssistantOpen(true);
  }, []);

  const closeAssistant = useCallback(() => {
    setIsAssistantOpen(false);
    setAssistantInitialQuery('');
  }, []);

  // 3. AI Product Studio Persistent Draft State
  const [studioState, setStudioState] = useState({
    stage: 1, // 1 to 7
    image: null,
    enhancedImage: null,
    bgMode: 'clean',
    lightingCorrection: true,
    aspectRatio: 'square',
    isRecording: false,
    audioRecorded: false,
    transcript: "This is a handwoven pure Chanderi silk saree with traditional gold zari booti motifs. It took our family 14 days on a pit loom in Ashoknagar, Madhya Pradesh.",
    detectedLanguage: "Hindi & English mix (High Confidence)",
    attributes: {
      craft: "Chanderi Handloom",
      material: "Pure Silk & Gold Zari",
      technique: "Pit-Loom Weaving with Ek-Naliya Border",
      region: "Chanderi, Madhya Pradesh",
      productType: "Traditional Saree",
      leadTime: "14 Days",
      artisanName: "Meena Devi"
    },
    catalogData: {
      titleEn: "Handcrafted Chanderi Pure Silk Saree with Gold Zari Booti",
      titleHi: "पारंपरिक ज़री बूटी वाली शुद्ध चंदेरी रेशम हथकरघा साड़ी",
      descEn: "Woven on traditional wooden pit-looms in the historic town of Chanderi, this saree blends mulberry silk with fine golden zari threads. Celebrated for its sheer featherlight drape, royal translucent luster, and hand-plucked booti motifs.",
      descHi: "मध्य प्रदेश के ऐतिहासिक चंदेरी नगर में लकड़ी के खड्डी लूम पर निर्मित, यह साड़ी शुद्ध शहतूत रेशम और सोने की ज़री के तारों से बुनी गई है। अपनी हल्की बनावट, पारभासी चमक और हस्तनिर्मित पारंपरिक बूटी के लिए प्रसिद्ध।",
      seoKeywords: [
        "#ChanderiSilkSaree",
        "#HandwovenHandloom",
        "#GIHandicraftMP",
        "#PureSilkArtisan",
        "#IndianTraditionalWear",
        "#VocalForLocal"
      ]
    },
    pricingData: {
      recommended: 1650,
      current: 1650,
      min: 1450,
      max: 1850,
      strategy: 'balanced',
      breakdown: {
        rawMaterial: 700,
        labour: 500,
        craftGIValue: 150,
        benchmarkBuffer: 200
      }
    },
    isPublished: false
  });

  return (
    <AppContext.Provider value={{
      // Navigation
      currentSurface,
      surfaceParams,
      navigate,

      // Authentication (from AuthContext)
      currentUser: activeUser,
      loginUser: (userData, customTarget) => {
        loginUser(userData, customTarget);

        const target = customTarget || ROLE_HOME[userData.role] || (userData.role === 'artisan' ? 'artisan' : userData.role === 'admin' ? 'admin' : 'marketplace');

        showToast({
          type: 'success',
          title: 'Welcome to KarigarSeetu',
          message: `Logged in as ${userData.name || 'User'}.`
        });

        setCurrentSurface(target);
        if (typeof window !== 'undefined') {
          window.location.hash = `#/${target}`;
          try {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } catch {
            // ignore
          }
        }
      },
      logoutUser: () => {
        storageService.clearAuthUser();
        logoutUser();
        setCurrentSurface('auth');
        setSurfaceParams({});
        if (typeof window !== 'undefined') {
          window.location.hash = '#/auth';
        }
        showToast({
          type: 'info',
          title: 'Logged Out',
          message: 'You have been safely signed out.'
        });
      },
      isSurfaceAllowed: (surface) => {
        if (!activeUser || !activeUser.isLoggedIn) {
          return surface === 'auth';
        }
        return isSurfaceAllowedForRole(surface, activeUser.role);
      },
      allowedSurfaces: (activeUser && activeUser.isLoggedIn && activeUser.role) 
        ? (ROLE_PERMISSIONS[activeUser.role] || []) 
        : [],

      // Marketplace & RFQ (from MarketplaceContext)
      productsList,
      setProductsList,
      addPublishedProduct,
      inquiries,
      addInquiry,
      buyerRequirements,
      addBuyerRequirement,
      crafts,
      artisans,

      // Modals & Assistant
      selectedProduct,
      setSelectedProduct,
      selectedArtisan,
      setSelectedArtisan,
      isAssistantOpen,
      openAssistant,
      closeAssistant,
      assistantInitialQuery,

      // Studio
      studioState,
      setStudioState,

      // Toasts (from ToastContext)
      toasts,
      showToast,
      removeToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

// Composed Root Provider
export const AppProvider = ({ children }) => {
  return (
    <ToastProvider>
      <AuthProvider>
        <MarketplaceProvider>
          <AppCoordinator>
            {children}
          </AppCoordinator>
        </MarketplaceProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export const useApp = () => useContext(AppContext);
export default AppContext;
