import React, { Suspense, lazy } from 'react';
import { useApp } from './context/AppContext';
import { useLanguage } from './context/LanguageContext';
import Header from './components/layout/Header';
import PublicHomePage from './pages/PublicHomePage';
import SurfaceLoader from './components/common/SurfaceLoader';
import MobileBottomNav from './components/layout/MobileBottomNav';
import ToastContainer from './components/common/ToastContainer';
import { Sparkles } from 'lucide-react';
import { cultureAssets } from './config/cultureAssets';

// Dynamic route code-splitting for high-weight surfaces
const AuthPage = lazy(() => import('./pages/AuthPage'));
const ArtisanOnboarding = lazy(() => import('./components/artisan/ArtisanOnboarding'));
const ArtisanDashboard = lazy(() => import('./components/artisan/ArtisanDashboard'));
const StudioContainer = lazy(() => import('./components/studio/StudioContainer'));
const InventoryPage = lazy(() => import('./components/inventory/InventoryPage'));
const MarketplacePage = lazy(() => import('./components/marketplace/MarketplacePage'));
const BuyerHubPage = lazy(() => import('./components/buyer/BuyerHubPage'));
const AdminConsole = lazy(() => import('./components/admin/AdminConsole'));
const AdminCatalogOversight = lazy(() => import('./components/admin/AdminCatalogOversight'));
const AdminRfqOversight = lazy(() => import('./components/admin/AdminRfqOversight'));
const FinancialAssistantPage = lazy(() => import('./components/finance/FinancialAssistantPage'));
const AIAssistantModal = lazy(() => import('./components/assistant/AIAssistantModal'));

export default function App() {
  const { currentSurface, openAssistant, isSurfaceAllowed, navigate } = useApp();
  const { t, lang } = useLanguage();

  const isAuth = currentSurface === 'auth';
  const isAllowed = isSurfaceAllowed || (() => true);

  return (
    <div className={`karigar-app-root ${isAuth ? 'auth-mode-active' : ''}`}>
      {/* Global Transparent Ambient Wallpaper across entire frontend */}
      <div 
        className="global-artisan-backdrop" 
        style={{ backgroundImage: `url(${cultureAssets.wallpapers.compositeMasterpiece})` }}
      />

      {/* Sticky Header shown ONLY after authenticating / inside app surfaces */}
      {!isAuth && <Header />}

      {/* Surface Viewport with Suspense Boundary: Only permitted pages for current role */}
      <main className={`main-content-viewport ${isAuth ? 'auth-viewport-dedicated' : ''}`}>
        <Suspense fallback={<SurfaceLoader />}>
          {currentSurface === 'auth' && <AuthPage />}
          {isAllowed('marketplace') && currentSurface === 'marketplace' && <MarketplacePage />}
          {isAllowed('studio') && currentSurface === 'studio' && <StudioContainer />}
          {isAllowed('artisan') && currentSurface === 'artisan' && <ArtisanDashboard />}
          {isAllowed('inventory') && currentSurface === 'inventory' && <InventoryPage />}
          {isAllowed('finance') && currentSurface === 'finance' && <FinancialAssistantPage />}
          {isAllowed('buyer') && currentSurface === 'buyer' && <BuyerHubPage />}
          {isAllowed('admin') && currentSurface === 'admin' && <AdminConsole />}
          {isAllowed('admin-catalog') && currentSurface === 'admin-catalog' && <AdminCatalogOversight />}
          {isAllowed('admin-rfqs') && currentSurface === 'admin-rfqs' && <AdminRfqOversight />}
          {isAllowed('onboarding') && currentSurface === 'onboarding' && <ArtisanOnboarding />}

          {/* Safety fallback if surface is not allowed or unrecognized */}
          {currentSurface !== 'auth' && !isAllowed(currentSurface) && (
            <div style={{ padding: '80px 20px', textAlign: 'center' }}>
              <h2>Welcome to KarigarSeetu</h2>
              <p style={{ margin: '12px 0 24px', color: '#665C54' }}>
                Please sign in to access this workspace.
              </p>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  navigate('auth');
                }}
              >
                Go to Sign In Portal →
              </button>
            </div>
          )}
        </Suspense>
      </main>

      {/* Floating 24/7 AI Business Advisor Button - visible only inside app */}
      {!isAuth && (
        <button 
          className="floating-assistant-btn"
          onClick={() => openAssistant()}
          title={lang === 'hi' ? "कारीगर सेतु से पूछें" : "Ask KarigarSeetu"}
        >
          <Sparkles size={18} />
          <span>{lang === 'hi' ? "कारीगर सेतु से पूछें" : "Ask KarigarSeetu"}</span>
        </button>
      )}

      {/* Floating AI Business Assistant Drawer */}
      {!isAuth && (
        <Suspense fallback={null}>
          <AIAssistantModal />
        </Suspense>
      )}

      {/* Mobile Bottom Navigation - visible only inside app */}
      {!isAuth && <MobileBottomNav />}

      {/* Global Artisan-Themed Toast Notifications */}
      <ToastContainer />
    </div>
  );
}
