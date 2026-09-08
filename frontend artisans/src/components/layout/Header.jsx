import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Sparkles, 
  Globe, 
  ShoppingBag, 
  Camera, 
  LayoutDashboard, 
  Building2, 
  ShieldCheck, 
  Menu, 
  X,
  Volume2,
  LogIn,
  LogOut,
  UserCheck,
  Layers
} from 'lucide-react';

export default function Header() {
  const { currentSurface, navigate, openAssistant, currentUser, logoutUser } = useApp();
  const { lang, setLang, t, supportedLanguages, currentLanguageInfo, speak } = useLanguage();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const role = currentUser?.role || 'artisan';
  const userHome = role === 'artisan' ? 'artisan' : role === 'admin' ? 'admin' : 'marketplace';

  // Strict Role-Based Navigation: Only show pages permitted for the user's role
  const navItems = React.useMemo(() => {
    if (role === 'admin') {
      return [
        { id: 'admin', label: 'Admin Console', icon: ShieldCheck, badge: 'Core' },
        { id: 'admin-catalog', label: 'Catalog Oversight', icon: ShoppingBag, badge: 'Audit' },
        { id: 'admin-rfqs', label: 'B2B RFQ Oversight', icon: Building2, badge: 'Live' }
      ];
    }
    if (role === 'buyer') {
      return [
        { id: 'marketplace', label: 'Artisan Marketplace', icon: ShoppingBag, badge: 'Direct' },
        { id: 'buyer', label: 'B2B Bulk RFQ Hub', icon: Building2 }
      ];
    }
    // Default: Artisan / Seller
    return [
      { id: 'artisan', label: t('navDashboard') || 'Artisan Hub', icon: LayoutDashboard },
      { id: 'studio', label: t('navStudio') || 'AI Product Studio', icon: Sparkles, badge: 'AI Hero' },
      { id: 'inventory', label: t('navInventory') || 'My Inventory', icon: Layers },
      { id: 'marketplace', label: t('navMarketplace') || 'Live Marketplace', icon: ShoppingBag }
    ];
  }, [role, t]);

  const handleNavClick = (id) => {
    navigate(id);
    setMobileMenuOpen(false);
  };

  const handleLanguageChange = (code, nativeName) => {
    setLang(code);
    setLangDropdownOpen(false);
    // Optional brief voice confirmation in selected language
    if (code === 'hi') speak('कारीगर एआई में आपका स्वागत है', 'hi');
    else if (code === 'ta') speak('காரிகர் AI உங்களை வரவேற்கிறது', 'ta');
    else if (code === 'te') speak('కారికర్ AI కి స్వాగతం', 'te');
    else if (code === 'bn') speak('কারিগর এআই-তে স্বাগতম', 'bn');
    else speak(`Language changed to ${nativeName}`, 'en');
  };

  return (
    <header className="site-header">
      <div className="header-container">
        {/* Brand Logo */}
        <div className="brand-logo-wrap" onClick={() => navigate(userHome)}>
          <div className="brand-icon">
            <span className="brand-om">{lang === 'hi' ? 'क' : 'K'}</span>
          </div>
          <div className="brand-text">
            <div className="brand-title">
              KARIGAR<span className="ai-accent">AI</span>
            </div>
            <div className="brand-sub">
              {lang === 'hi' ? 'कारीगर AI • प्रामाणिक भारत' : 'Handcrafted India • Direct Artisan Platform'}
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          {navItems.map(item => {
            const isActive = currentSurface === item.id;
            return (
              <button
                key={item.id}
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                {item.icon && <item.icon size={15} className="nav-icon" />}
                <span>{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </button>
            );
          })}
        </nav>

        {/* Action Controls & Language Selector */}
        <div className="header-actions">
          {/* Language Selector Dropdown */}
          <div className="language-selector-wrap">
            <button 
              className="language-btn"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              title={lang === 'hi' ? "भाषा चुनें" : "Select Language"}
            >
              <Globe size={16} className="globe-icon" />
              <span className="lang-name">{currentLanguageInfo?.nativeName || 'English'}</span>
              <span className="lang-code-pill">{lang.toUpperCase()}</span>
            </button>

            {langDropdownOpen && (
              <div className="language-dropdown-menu">
                <div className="dropdown-header">
                  <span>{lang === 'hi' ? "भाषा चुनें" : "Select Language"}</span>
                  <button 
                    className="close-dropdown-btn" 
                    onClick={() => setLangDropdownOpen(false)}
                  >
                    ×
                  </button>
                </div>
                <div className="languages-grid">
                  {supportedLanguages.map(item => (
                    <button
                      key={item.code}
                      className={`lang-option ${lang === item.code ? 'selected' : ''}`}
                      onClick={() => handleLanguageChange(item.code, item.nativeName)}
                    >
                      <span className="lang-flag">{item.flag}</span>
                      <div className="lang-details">
                        <span className="lang-native">{item.nativeName}</span>
                        <span className="lang-english">{item.name}</span>
                      </div>
                      {lang === item.code && <span className="selected-dot">●</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Unified Authentication Portal Trigger or Active User Profile */}
          {currentUser?.isLoggedIn ? (
            <div className="user-profile-header-chip">
              <div className={`user-avatar-badge ${currentUser.role || 'artisan'}`}>
                {currentUser.role === 'artisan' && '🧵'}
                {currentUser.role === 'buyer' && '🛍️'}
                {currentUser.role === 'admin' && '🛡️'}
              </div>
              <div className="user-text-info">
                <span className="user-nav-name">{(currentUser?.name ? currentUser.name.split(' ')[0] : 'User')}</span>
                <span className={`user-nav-role-pill ${currentUser.role || 'artisan'}`}>
                  {currentUser.role === 'artisan' && 'Master Artisan'}
                  {currentUser.role === 'buyer' && 'Direct Buyer'}
                  {currentUser.role === 'admin' && 'Platform Admin'}
                </span>
              </div>
              <button 
                className="user-logout-btn" 
                onClick={logoutUser} 
                title="Sign Out / Switch Profile"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button 
              className={`header-auth-btn ${currentSurface === 'auth' ? 'active' : ''}`}
              onClick={() => navigate('auth')}
              title="Sign In / Create Account (Artisan, Buyer, Admin)"
            >
              <LogIn size={15} />
              <span>Portal Login</span>
            </button>
          )}

          {/* Role-Specific Action CTA */}
          {role === 'artisan' && (
            <button 
              className="header-cta-btn"
              onClick={() => navigate('studio')}
              title="Create new catalog piece with AI Studio"
            >
              <Camera size={16} />
              <span>AI Studio</span>
            </button>
          )}

          {role === 'buyer' && (
            <button 
              className="header-cta-btn buyer-rfq-cta"
              onClick={() => navigate('buyer')}
              title="Post custom bulk requirement or RFQ"
            >
              <Building2 size={16} />
              <span>Post B2B RFQ</span>
            </button>
          )}

          {role === 'admin' && (
            <button 
              className="header-cta-btn admin-core-cta"
              onClick={() => navigate('admin')}
              title="System Health & Core Admin"
            >
              <ShieldCheck size={16} />
              <span>Admin Console</span>
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button 
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <div className="mobile-nav-list">
            {navItems.map(item => (
              <button
                key={item.id}
                className={`mobile-nav-link ${currentSurface === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                {item.icon && <item.icon size={18} />}
                <span>{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .site-header {
          position: sticky;
          top: 0;
          z-index: 900;
          background: rgba(251, 249, 244, 0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-light);
          transition: all 0.2s ease;
        }
        .header-container {
          max-width: 1360px;
          margin: 0 auto;
          padding: 0 24px;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }
        .brand-logo-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          user-select: none;
        }
        .brand-icon {
          width: 42px;
          height: 42px;
          background: linear-gradient(135deg, #A9543A 0%, #8F4530 100%);
          color: #FFFDF8;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-serif);
          font-size: 1.6rem;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(169, 84, 58, 0.28);
        }
        .brand-text {
          display: flex;
          flex-direction: column;
        }
        .brand-title {
          font-family: var(--font-serif);
          font-size: 1.4rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: var(--text-primary);
          line-height: 1.1;
        }
        .ai-accent {
          color: var(--primary);
        }
        .brand-sub {
          font-size: 0.68rem;
          color: var(--text-muted);
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        @media (max-width: 1040px) {
          .desktop-nav {
            display: none;
          }
        }
        .nav-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-secondary);
          transition: all 0.18s ease;
        }
        .nav-link:hover {
          color: var(--primary);
          background: var(--primary-light);
        }
        .nav-link.active {
          color: var(--primary);
          background: var(--primary-light);
          font-weight: 700;
        }
        .nav-badge {
          background: var(--accent-gold-light);
          color: #8B6514;
          font-size: 0.65rem;
          padding: 2px 6px;
          border-radius: 999px;
          font-weight: 700;
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .language-selector-wrap {
          position: relative;
        }
        .language-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 12px;
          border-radius: 8px;
          background: #FFFFFF;
          border: 1px solid var(--border-medium);
          color: var(--text-primary);
          font-size: 0.85rem;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        .language-btn:hover {
          border-color: var(--primary);
          box-shadow: var(--shadow-sm);
        }
        .globe-icon {
          color: var(--primary);
        }
        .lang-code-pill {
          background: var(--primary-light);
          color: var(--primary);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 700;
        }
        .language-dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: #FFFFFF;
          border: 1px solid var(--border-medium);
          border-radius: 12px;
          box-shadow: var(--shadow-lg);
          width: 280px;
          padding: 12px;
          z-index: 1000;
          animation: modalIn 0.2s ease;
        }
        .dropdown-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border-light);
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
        }
        .close-dropdown-btn {
          font-size: 1.2rem;
          color: var(--text-muted);
        }
        .languages-grid {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-top: 8px;
          max-height: 280px;
          overflow-y: auto;
        }
        .lang-option {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 6px;
          text-align: left;
          width: 100%;
          transition: background 0.15s ease;
        }
        .lang-option:hover {
          background: var(--bg-subtle);
        }
        .lang-option.selected {
          background: var(--primary-light);
        }
        .lang-details {
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .lang-native {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .lang-english {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        .selected-dot {
          color: var(--primary);
          font-size: 0.8rem;
        }
        .header-cta-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--primary);
          color: #FFFFFF;
          padding: 9px 18px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 700;
          box-shadow: var(--shadow-sm);
          transition: all 0.2s ease;
        }
        .header-cta-btn:hover {
          background: var(--primary-hover);
          transform: translateY(-1px);
        }
        .mobile-hamburger-btn {
          display: none;
          color: var(--text-primary);
          padding: 6px;
        }
        @media (max-width: 1040px) {
          .mobile-hamburger-btn {
            display: flex;
          }
        }
        .mobile-menu-drawer {
          background: #FFFFFF;
          border-top: 1px solid var(--border-light);
          padding: 16px 24px;
        }
        .mobile-nav-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .mobile-nav-link.active {
          background: var(--primary-light);
          color: var(--primary);
        }

        /* Unified Authentication Portal Header Controls */
        .header-auth-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 8px;
          border: 1px solid var(--border-medium);
          background: #FFFFFF;
          font-size: 0.86rem;
          font-weight: 700;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .header-auth-btn:hover,
        .header-auth-btn.active {
          border-color: var(--primary);
          color: var(--primary);
          background: var(--primary-light);
          transform: translateY(-1px);
        }
        .user-profile-header-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 10px 4px 6px;
          background: #FFFFFF;
          border: 1px solid var(--border-medium);
          border-radius: 999px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
        }
        .user-avatar-badge {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.95rem;
        }
        .user-avatar-badge.artisan { background: #FCECE8; }
        .user-avatar-badge.buyer { background: #EAF0F8; }
        .user-avatar-badge.admin { background: #F2ECF7; }

        .user-text-info {
          display: flex;
          flex-direction: column;
          line-height: 1.15;
        }
        .user-nav-name {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .user-nav-role-pill {
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
        }
        .user-nav-role-pill.artisan { color: #A9543A; }
        .user-nav-role-pill.buyer { color: #2B5A8F; }
        .user-nav-role-pill.admin { color: #4B365F; }

        .user-logout-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: color 0.2s ease, background 0.2s ease;
        }
        .user-logout-btn:hover {
          color: #DC3545;
          background: #FDF2F2;
        }
      `}</style>
    </header>
  );
}
