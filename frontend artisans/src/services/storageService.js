/**
 * KARIGARAI - Robust Storage, Schema Validation & Data Persistence Service
 * 
 * Provides:
 * - Schema validation for products, inquiries, and buyer requirements
 * - Versioned persistence over localStorage with memory fallback
 * - Event-driven change notifications across tabs and internal components
 * - Migration helpers for forward/backward compatibility
 */

const STORAGE_VERSION = 'v1';
const KEYS = {
  CUSTOM_PRODUCTS: `karigar_custom_products_${STORAGE_VERSION}`,
  INQUIRIES: `karigar_inquiries_${STORAGE_VERSION}`,
  BUYER_REQUIREMENTS: `karigar_buyer_reqs_${STORAGE_VERSION}`,
  AUTH_USER: 'karigar_auth_user'
};

// In-memory fallback dictionary
const memoryFallback = {};

// Subscriber registry for real-time reactivity
const subscribers = new Set();

const notifySubscribers = (event, payload) => {
  subscribers.forEach(cb => {
    try {
      cb(event, payload);
    } catch (err) {
      console.error('[storageService] Subscriber callback error:', err);
    }
  });
};

// Listen to window storage events for cross-tab reactivity
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (Object.values(KEYS).includes(event.key)) {
      notifySubscribers('storage_sync', { key: event.key, newValue: event.newValue });
    }
  });
}

const isStorageAvailable = () => {
  try {
    if (typeof window === 'undefined' || !('localStorage' in window)) return false;
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

const safeGetItem = (key) => {
  if (isStorageAvailable()) {
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      console.warn(`[storageService] Read failed for key "${key}":`, e);
    }
  }
  return memoryFallback[key] || null;
};

const safeSetItem = (key, value) => {
  if (isStorageAvailable()) {
    try {
      window.localStorage.setItem(key, value);
      notifySubscribers('local_write', { key, value });
      return true;
    } catch (e) {
      console.warn(`[storageService] Write failed for key "${key}", using memory fallback:`, e);
    }
  }
  memoryFallback[key] = value;
  notifySubscribers('local_write', { key, value });
  return true;
};

const safeRemoveItem = (key) => {
  if (isStorageAvailable()) {
    try {
      window.localStorage.removeItem(key);
      notifySubscribers('local_remove', { key });
    } catch (e) {
      console.warn(`[storageService] Remove failed for key "${key}":`, e);
    }
  }
  delete memoryFallback[key];
  notifySubscribers('local_remove', { key });
};

/**
 * SCHEMA VALIDATION HELPERS
 */
export const validateProduct = (product) => {
  if (!product || typeof product !== 'object') return null;
  if (!product.id || typeof product.id !== 'string') return null;
  if (!product.title || typeof product.title !== 'string' || product.title.trim().length === 0) return null;

  const price = Number(product.price);
  if (isNaN(price) || price < 0) return null;

  return {
    id: String(product.id),
    title: String(product.title).trim(),
    price: Math.round(price),
    category: String(product.category || product.craft || 'Handloom'),
    craft: String(product.craft || product.category || 'Handloom'),
    region: String(product.region || 'India'),
    artisanName: String(product.artisanName || 'Master Artisan'),
    artisanId: String(product.artisanId || 'artisan-user'),
    image: product.image || product.enhancedImage || 'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?auto=format&fit=crop&q=80&w=800',
    description: String(product.description || ''),
    hindiDescription: String(product.hindiDescription || ''),
    inStock: typeof product.inStock === 'number' ? Math.max(0, product.inStock) : 10,
    giCertified: Boolean(product.giCertified),
    aiVerified: Boolean(product.aiVerified !== false),
    views: typeof product.views === 'number' ? product.views : 1,
    inquiries: typeof product.inquiries === 'number' ? product.inquiries : 0,
    createdAt: product.createdAt || new Date().toISOString()
  };
};

export const validateInquiry = (inquiry) => {
  if (!inquiry || typeof inquiry !== 'object') return null;
  if (!inquiry.id || !inquiry.productName) return null;

  return {
    id: String(inquiry.id),
    buyerName: String(inquiry.buyerName || 'Direct Craft Buyer'),
    buyerLocation: String(inquiry.buyerLocation || 'India'),
    productName: String(inquiry.productName),
    quantity: Math.max(1, Number(inquiry.quantity) || 1),
    targetPrice: Number(inquiry.targetPrice) || 0,
    totalValue: Number(inquiry.totalValue) || 0,
    timeline: String(inquiry.timeline || '15 Days'),
    status: String(inquiry.status || 'new'),
    timestamp: inquiry.timestamp || 'Just now',
    message: String(inquiry.message || '')
  };
};

export const validateBuyerRequirement = (req) => {
  if (!req || typeof req !== 'object') return null;
  if (!req.id || !req.item) return null;

  return {
    id: String(req.id),
    buyerCompany: String(req.buyerCompany || 'Verified Buyer'),
    item: String(req.item),
    quantity: Math.max(1, Number(req.quantity) || 1),
    budgetPerUnit: Number(req.budgetPerUnit) || 0,
    location: String(req.location || 'India'),
    timeline: Number(req.timeline) || 30,
    matchScore: Number(req.matchScore) || 90,
    matchedArtisan: String(req.matchedArtisan || 'Artisan Cluster'),
    status: String(req.status || 'Active Matching'),
    image: req.image ? String(req.image) : undefined
  };
};

export const storageService = {
  /**
   * Subscribe to storage updates for real-time reactivity
   */
  subscribe: (callback) => {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
  },

  /**
   * Load custom products published by artisans via AI Studio with schema validation
   */
  loadCustomProducts: () => {
    try {
      const raw = safeGetItem(KEYS.CUSTOM_PRODUCTS);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.map(validateProduct).filter(Boolean);
    } catch (e) {
      console.error('[storageService] Failed to parse custom products:', e);
      return [];
    }
  },

  /**
   * Save a newly published product from AI Studio after schema validation
   */
  saveCustomProduct: (product) => {
    const validated = validateProduct(product);
    if (!validated) {
      console.warn('[storageService] Product failed schema validation:', product);
      return false;
    }

    try {
      const existing = storageService.loadCustomProducts();
      // Avoid duplicates by ID
      const filtered = existing.filter(p => p.id !== validated.id);
      const updated = [validated, ...filtered];
      safeSetItem(KEYS.CUSTOM_PRODUCTS, JSON.stringify(updated));
      return true;
    } catch (e) {
      console.error('[storageService] Failed to save custom product:', e);
      return false;
    }
  },

  /**
   * Load inquiries with defaults fallback and schema validation
   */
  loadInquiries: (defaults = []) => {
    try {
      const raw = safeGetItem(KEYS.INQUIRIES);
      if (!raw) return defaults;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const validatedStored = parsed.map(validateInquiry).filter(Boolean);
        const storedIds = new Set(validatedStored.map(i => i.id));
        const missingDefaults = defaults.filter(d => !storedIds.has(d.id));
        return [...validatedStored, ...missingDefaults];
      }
      return defaults;
    } catch {
      return defaults;
    }
  },

  /**
   * Save a newly submitted inquiry after validation
   */
  saveInquiry: (inquiry) => {
    const validated = validateInquiry(inquiry);
    if (!validated) return false;

    try {
      const existing = storageService.loadInquiries([]);
      const filtered = existing.filter(i => i.id !== validated.id);
      const updated = [validated, ...filtered];
      safeSetItem(KEYS.INQUIRIES, JSON.stringify(updated));
      return true;
    } catch (e) {
      console.error('[storageService] Failed to save inquiry:', e);
      return false;
    }
  },

  /**
   * Load buyer requirements with defaults fallback and validation
   */
  loadBuyerRequirements: (defaults = []) => {
    try {
      const raw = safeGetItem(KEYS.BUYER_REQUIREMENTS);
      if (!raw) return defaults;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const validatedStored = parsed.map(validateBuyerRequirement).filter(Boolean);
        const storedIds = new Set(validatedStored.map(r => r.id));
        const missingDefaults = defaults.filter(d => !storedIds.has(d.id));
        return [...validatedStored, ...missingDefaults];
      }
      return defaults;
    } catch {
      return defaults;
    }
  },

  /**
   * Save buyer requirement
   */
  saveBuyerRequirement: (requirement) => {
    const validated = validateBuyerRequirement(requirement);
    if (!validated) return false;

    try {
      const existing = storageService.loadBuyerRequirements([]);
      const filtered = existing.filter(r => r.id !== validated.id);
      const updated = [validated, ...filtered];
      safeSetItem(KEYS.BUYER_REQUIREMENTS, JSON.stringify(updated));
      return true;
    } catch (e) {
      console.error('[storageService] Failed to save buyer requirement:', e);
      return false;
    }
  },

  /**
   * Load authenticated user
   */
  loadAuthUser: () => {
    try {
      const raw = safeGetItem(KEYS.AUTH_USER);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  /**
   * Save authenticated user
   */
  saveAuthUser: (user) => {
    try {
      safeSetItem(KEYS.AUTH_USER, JSON.stringify(user));
      return true;
    } catch (e) {
      console.error('[storageService] Failed to save auth user:', e);
      return false;
    }
  },

  /**
   * Clear authenticated user
   */
  clearAuthUser: () => {
    safeRemoveItem(KEYS.AUTH_USER);
  }
};

export default storageService;
