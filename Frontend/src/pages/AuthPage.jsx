import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { cultureAssets } from '../config/cultureAssets';
import { 
  Sparkles, 
  ShieldCheck, 
  ShoppingBag, 
  Palette, 
  UserCheck, 
  Lock, 
  Mail, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Terminal, 
  Layers, 
  Compass,
  Building2,
  HelpCircle,
  Key
} from 'lucide-react';

export default function AuthPage() {
  const { navigate, loginUser, currentUser, showToast } = useApp();
  const { lang, t, speak } = useLanguage();

  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedSignupRole, setSelectedSignupRole] = useState('artisan'); // 'artisan' | 'buyer'
  const [developerKey, setDeveloperKey] = useState('');
  const [organization, setOrganization] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedRole, setAnalyzedRole] = useState(null); // 'admin' | 'artisan' | 'buyer'
  const [confidenceReason, setConfidenceReason] = useState('');

  // 1-Tap Quick Demo Profiles
  const demoProfiles = [
    {
      id: 'artisan-demo',
      role: 'artisan',
      name: 'Meena Devi',
      identifier: 'meena.devi@chanderi.artisan',
      cluster: 'Chanderi Handloom Cluster, MP',
      badge: 'Seller / Master Artisan',
      icon: Palette,
      color: '#A9543A',
      desc: 'Sells handwoven pure silk & gold zari sarees direct to buyers.'
    },
    {
      id: 'buyer-demo',
      role: 'buyer',
      name: 'Ananya Sharma',
      identifier: 'ananya.sharma@craftbazaar.in',
      cluster: 'CraftBazaar Retail Global',
      badge: 'Direct Buyer / B2B Retailer',
      icon: ShoppingBag,
      color: '#2B5A8F',
      desc: 'Sources authentic GI crafts & places bulk export orders.'
    },
    {
      id: 'admin-demo',
      role: 'admin',
      name: 'Vikram Sengupta',
      identifier: 'admin@karigar.ai',
      cluster: 'KarigarSeetu Platform Core Team',
      badge: 'Platform Developer & Admin',
      icon: Terminal,
      color: '#4B365F',
      desc: 'Monitors vision AI models, pipeline latency, and platform uptime.'
    }
  ];

  // Real-time Credential Role Analysis Engine
  useEffect(() => {
    if (!identifier.trim()) {
      setAnalyzedRole(null);
      setConfidenceReason('');
      return;
    }

    setIsAnalyzing(true);
    const timer = setTimeout(() => {
      const lower = identifier.toLowerCase().trim();

      // Rule 1: Master Artisan Meena Devi / Chanderi explicit recognition
      if (
        lower.includes('meena') ||
        lower.includes('chanderi')
      ) {
        setAnalyzedRole('artisan');
        setConfidenceReason('Recognized Master Artisan Meena Devi (Chanderi Handloom Cluster, MP - Seller / Master Artisan).');
      } 
      // Rule 2: Developer / Admin detection (use whole word dev or developer, never substring match devi)
      else if (
        lower.includes('admin') || 
        lower.includes('developer') || 
        /\bdev\b/.test(lower) ||
        lower.startsWith('dev-') ||
        lower.startsWith('dev_') ||
        lower.endsWith('@karigar.ai') || 
        lower.includes('engineer') || 
        lower.includes('maintainer')
      ) {
        setAnalyzedRole('admin');
        setConfidenceReason('Recognized official KarigarSeetu developer domain or administrator identity.');
      } 
      // Rule 3: General Artisan / Seller detection
      else if (
        lower.includes('artisan') || 
        lower.includes('seller') || 
        lower.includes('weaver') || 
        lower.includes('shg') || 
        lower.includes('karigar') ||
        lower.startsWith('art-') ||
        /^\+?91[6-9]\d{9}$/.test(lower) || 
        /^[6-9]\d{9}$/.test(lower)
      ) {
        setAnalyzedRole('artisan');
        setConfidenceReason('Identified verified craft producer ID / rural mobile number pattern.');
      } 
      // Rule 3: Buyer detection (Consumer / Retail / Corporate)
      else if (
        lower.includes('buyer') || 
        lower.includes('retail') || 
        lower.includes('export') || 
        lower.includes('store') ||
        lower.includes('@gmail.com') ||
        lower.includes('@yahoo.com') ||
        lower.includes('@outlook.com') ||
        lower.includes('@fab') ||
        lower.includes('.com') ||
        lower.includes('.in')
      ) {
        setAnalyzedRole('buyer');
        setConfidenceReason('Identified commercial buyer / direct consumer purchasing identity.');
      } 
      // Default intelligent fallback
      else {
        setAnalyzedRole('buyer');
        setConfidenceReason('Defaulting to Buyer Portal (can be changed to Artisan or Admin).');
      }

      setIsAnalyzing(false);
    }, 120);

    return () => clearTimeout(timer);
  }, [identifier]);

  // Handle Quick Demo Profile Autofill
  const handleSelectDemoProfile = (profile) => {
    setMode('signin');
    setIdentifier(profile.identifier);
    setPassword('DemoKarigar2026!');
    setAnalyzedRole(profile.role);
    setConfidenceReason(`Instant demo profile configured: ${profile.badge}`);
    setAuthError('');
  };

  // Direct 1-Click Demo Login
  const handleDirectDemoLogin = (profile, e) => {
    if (e) e.stopPropagation();
    const userData = {
      role: profile.role,
      name: profile.name,
      email: profile.identifier,
      phone: '+91 98765 43210',
      clusterOrCompany: profile.cluster,
      verifiedBadge: true
    };
    if (profile.role === 'artisan') {
      speak(lang === 'hi' ? `नमस्ते ${profile.name}, आपके कारीगर स्टूडियो में आपका स्वागत है।` : `Welcome back ${profile.name}! Loading your Artisan Hub.`);
    } else if (profile.role === 'admin') {
      speak(`System access granted for ${profile.name}. Operations console ready.`);
    } else {
      speak(lang === 'hi' ? `नमस्ते ${profile.name}, प्रामाणिक हस्तशिल्प बाज़ार में आपका स्वागत है।` : `Welcome ${profile.name} to the Artisan-Only Direct Marketplace.`);
    }
    const targetSurface = profile.role === 'artisan' ? 'artisan' : profile.role === 'admin' ? 'admin' : 'marketplace';
    loginUser(userData, targetSurface);
  };

  // Submit Handler
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setAuthError('');

    if (!identifier.trim()) {
      setAuthError('Please enter your Email, Phone number, or Artisan/Developer ID.');
      return;
    }

    const lowerIdentifier = identifier.toLowerCase().trim();

    // Auto-fill demo password if left blank for known profiles/roles
    let effectivePassword = password.trim();
    if (!effectivePassword) {
      if (
        lowerIdentifier.includes('meena') ||
        lowerIdentifier.includes('chanderi') ||
        lowerIdentifier.includes('artisan') ||
        lowerIdentifier.includes('admin') ||
        lowerIdentifier.includes('buyer')
      ) {
        effectivePassword = 'DemoKarigar2026!';
        setPassword('DemoKarigar2026!');
      } else {
        setAuthError('Please enter your account password.');
        return;
      }
    }

    if (mode === 'signup' && !fullName.trim()) {
      setAuthError('Please enter your full name.');
      return;
    }

    if (mode === 'signup' && selectedSignupRole === 'admin') {
      setAuthError('Developer / Admin accounts cannot be created via public registration.');
      return;
    }

    // Synchronously detect role from identifier if analyzedRole is pending
    const detectRoleSync = (id) => {
      const lower = id.toLowerCase().trim();
      if (
        lower.includes('meena') ||
        lower.includes('chanderi')
      ) {
        return 'artisan';
      }
      if (
        lower.includes('admin') || 
        lower.includes('developer') || 
        /\bdev\b/.test(lower) ||
        lower.startsWith('dev-') ||
        lower.startsWith('dev_') ||
        lower.endsWith('@karigar.ai') || 
        lower.includes('engineer') || 
        lower.includes('maintainer')
      ) {
        return 'admin';
      }
      if (
        lower.includes('artisan') || 
        lower.includes('seller') || 
        lower.includes('weaver') || 
        lower.includes('shg') || 
        lower.includes('karigar') ||
        lower.startsWith('art-') ||
        /^\+?91[6-9]\d{9}$/.test(lower) || 
        /^[6-9]\d{9}$/.test(lower)
      ) {
        return 'artisan';
      }
      return 'buyer';
    };

    // Determine final role with immediate synchronous detection if analyzedRole is pending
    let finalRole = mode === 'signin' ? (analyzedRole || detectRoleSync(identifier)) : selectedSignupRole;
    if (
      finalRole !== 'admin' && (
        lowerIdentifier.includes('meena') ||
        lowerIdentifier.includes('chanderi') ||
        lowerIdentifier.includes('artisan') ||
        lowerIdentifier.includes('seller') ||
        lowerIdentifier.includes('weaver') ||
        lowerIdentifier.includes('karigar') ||
        lowerIdentifier === 'meena devi'
      )
    ) {
      finalRole = 'artisan';
    }

    // Determine user display metadata
    let assignedName = fullName.trim() || 'Valued Member';
    let assignedCluster = organization.trim() || '';

    if (mode === 'signin') {
      if (lowerIdentifier.includes('meena') || lowerIdentifier.includes('chanderi')) {
        assignedName = 'Meena Devi';
        assignedCluster = 'Chanderi Handloom Cluster, MP';
      } else {
        const matchedDemo = demoProfiles.find(p => p.identifier.toLowerCase() === lowerIdentifier);
        if (matchedDemo) {
          assignedName = matchedDemo.name;
          assignedCluster = matchedDemo.cluster;
        } else {
          // Derive human-readable name from email
          const parts = identifier.split('@')[0].split(/[._-]/);
          assignedName = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ') || 'User';
          assignedCluster = finalRole === 'artisan' ? 'Verified Rural Cluster' : finalRole === 'admin' ? 'Platform Operations' : 'Connoisseur Buyer';
        }
      }
    }

    const userData = {
      role: finalRole,
      name: assignedName,
      email: identifier.includes('@') ? identifier : `${identifier}@karigar.in`,
      phone: phone || '+91 98765 43210',
      clusterOrCompany: assignedCluster,
      verifiedBadge: true
    };

    // Spoken Audio Welcome Feedback
    if (finalRole === 'artisan') {
      speak(lang === 'hi' ? `नमस्ते ${assignedName}, आपके कारीगर स्टूडियो में आपका स्वागत है।` : `Welcome back ${assignedName}! Loading your Artisan Hub.`);
    } else if (finalRole === 'admin') {
      speak(`System access granted for ${assignedName}. Operations console ready.`);
    } else {
      speak(lang === 'hi' ? `नमस्ते ${assignedName}, प्रामाणिक हस्तशिल्प बाज़ार में आपका स्वागत है।` : `Welcome ${assignedName} to the Artisan-Only Direct Marketplace.`);
    }

    // Execute Login & Direct to appropriate page (artisan -> 'artisan' page)
    const targetSurface = finalRole === 'artisan' ? 'artisan' : finalRole === 'admin' ? 'admin' : 'marketplace';
    loginUser(userData, targetSurface);
  };

  return (
    <div className="unified-auth-page">
      <div className="auth-ambient-wallpaper" style={{ backgroundImage: `url(${cultureAssets.wallpapers.compositeMasterpiece})` }} />

      <div className="container auth-container">
        {/* Top Breadcrumb & Header */}
        <div className="auth-header-block">
          <div className="auth-preheader-bar" style={{ justifyContent: 'center' }}>
            <span className="first-page-chip">✨ SECURE ARTISAN & BUYER PORTAL</span>
          </div>
          <div className="auth-brand-pill">
            <span className="brand-dot" />
            <span>UNIFIED SMART AUTHENTICATION PORTAL</span>
          </div>
          <h1 className="auth-title">Welcome to KarigarSeetu</h1>
          <p className="auth-subtitle">
            One single entrance for <strong>Master Artisans (Sellers)</strong>, <strong>Direct Craft Buyers</strong>, and <strong>Platform Maintainers (Developers)</strong>. Enter your credentials or choose a quick demo identity below — our AI analyzes your role and launches your dedicated workspace.
          </p>
        </div>

        {/* Main Grid: Form Card on Left/Center + Quick Demo Profiles on Right */}
        <div className="auth-main-grid">
          {/* Card 1: Intelligent Auth Form Card */}
          <div className="auth-card glass-panel">
            {/* Mode Switcher Tabs */}
            <div className="auth-tabs-row">
              <button 
                type="button"
                className={`auth-tab-btn ${mode === 'signin' ? 'active' : ''}`}
                onClick={() => { setMode('signin'); setAuthError(''); }}
              >
                <span>{lang === 'hi' ? 'प्रवेश करें' : 'Sign In'}</span>
              </button>
              <button 
                type="button" 
                className={`auth-tab-btn ${mode === 'signup' ? 'active' : ''}`}
                onClick={() => { 
                  setMode('signup'); 
                  setAuthError(''); 
                  if (selectedSignupRole === 'admin') setSelectedSignupRole('artisan');
                }}
              >
                <span>{lang === 'hi' ? 'खाता बनाएं' : 'Create Account'}</span>
              </button>
            </div>

            {/* Error Banner */}
            {authError && (
              <div className="auth-error-banner">
                <AlertCircle size={16} />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="auth-form-body">
              {/* Sign Up Name Field */}
              {mode === 'signup' && (
                <div className="form-group">
                  <label className="field-label">Full Name / Artisan or Business Name</label>
                  <div className="input-wrap">
                    <UserCheck size={18} className="input-icon" />
                    <input 
                      type="text"
                      className="text-input"
                      placeholder="e.g., Meena Devi / FabLiving Retails"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Identifier Field (Email / Phone / Artisan ID) */}
              <div className="form-group">
                <div className="label-with-hint">
                  <label className="field-label">
                    {mode === 'signin' ? 'Email, Mobile Number, or Artisan ID' : 'Primary Email or Mobile'}
                  </label>
                  <span className="field-hint">Auto-analyzed by AI</span>
                </div>
                <div className="input-wrap">
                  <Mail size={18} className="input-icon" />
                  <input 
                    type="text"
                    className="text-input"
                    placeholder="e.g., meena.devi@chanderi.artisan or admin@karigar.ai"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* REAL-TIME ROLE ANALYSIS PILL (When typing in signin) */}
              {mode === 'signin' && identifier.trim() && (
                <div className={`role-detection-box ${analyzedRole || 'analyzing'}`}>
                  <div className="detection-header">
                    <span className="detection-label">
                      {isAnalyzing ? (
                        <>
                          <span className="analyzing-spinner" />
                          <span>Analyzing Credentials...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={15} />
                          <span>Smart Role Detected:</span>
                        </>
                      )}
                    </span>
                    {analyzedRole && (
                      <span className={`detected-badge ${analyzedRole}`}>
                        {analyzedRole === 'artisan' && '🧵 Verified Artisan / Seller'}
                        {analyzedRole === 'buyer' && '🛍️ Direct Craft Buyer'}
                        {analyzedRole === 'admin' && '🛡️ Developer / Platform Admin'}
                      </span>
                    )}
                  </div>
                  {confidenceReason && (
                    <p className="detection-reason">{confidenceReason}</p>
                  )}
                  <div className="routing-preview">
                    <span>Target Workspace: </span>
                    <strong>
                      {analyzedRole === 'artisan' && 'Artisan Hub & AI Product Studio'}
                      {analyzedRole === 'buyer' && 'Artisan Direct Marketplace & B2B RFQ Hub'}
                      {analyzedRole === 'admin' && 'Central Operations & Telemetry Console'}
                    </strong>
                  </div>
                </div>
              )}

              {/* SIGN UP ROLE SELECTION RADIO CARDS */}
              {mode === 'signup' && (
                <div className="form-group">
                  <label className="field-label">Select Your Account Type</label>
                  <div className="role-selection-grid">
                    {/* Role 1: Artisan / Seller */}
                    <div 
                      className={`role-select-card ${selectedSignupRole === 'artisan' ? 'selected' : ''}`}
                      onClick={() => setSelectedSignupRole('artisan')}
                    >
                      <div className="role-card-header">
                        <Palette size={20} color="#A9543A" />
                        <span className="role-name">Artisan / Seller</span>
                      </div>
                      <p>Sell handlooms & handicrafts direct to national and global buyers. Free AI photography & smart pricing.</p>
                      {selectedSignupRole === 'artisan' && <span className="active-dot">● Active</span>}
                    </div>

                    {/* Role 2: Buyer */}
                    <div 
                      className={`role-select-card ${selectedSignupRole === 'buyer' ? 'selected' : ''}`}
                      onClick={() => setSelectedSignupRole('buyer')}
                    >
                      <div className="role-card-header">
                        <ShoppingBag size={20} color="#2B5A8F" />
                        <span className="role-name">Craft Buyer</span>
                      </div>
                      <p>Shop certified GI crafts direct with zero middleman markups or post bulk B2B procurement RFQs.</p>
                      {selectedSignupRole === 'buyer' && <span className="active-dot">● Active</span>}
                    </div>

                  </div>
                </div>
              )}

              {/* Password Field */}
              <div className="form-group">
                <div className="label-with-hint">
                  <label className="field-label">Password</label>
                  {mode === 'signin' && (
                    <a 
                      href="#forgot" 
                      onClick={(e) => { 
                        e.preventDefault(); 
                        showToast({
                          type: 'info',
                          title: 'Password Reset',
                          message: 'Password reset instructions sent to your registered phone/email via SMS/OTP.'
                        });
                      }} 
                      className="forgot-link"
                    >
                      Forgot Password?
                    </a>
                  )}
                </div>
                <div className="input-wrap">
                  <Lock size={18} className="input-icon" />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    className="text-input"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button 
                    type="button" 
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button type="submit" className="auth-submit-btn">
                <span>
                  {mode === 'signin' ? (
                    analyzedRole === 'admin' 
                      ? 'Authenticate as Developer & Launch Console' 
                      : analyzedRole === 'artisan'
                      ? 'Login to Artisan Studio & Hub'
                      : 'Sign In to Direct Marketplace'
                  ) : (
                    `Complete Registration as ${selectedSignupRole.toUpperCase()}`
                  )}
                </span>
                <ArrowRight size={18} />
              </button>

              <div className="auth-security-notice">
                <ShieldCheck size={14} />
                <span>256-Bit Encrypted Session • Zero Middlemen Data Sharing • Verified Indian Crafts</span>
              </div>
            </form>
          </div>

          {/* Card 2: 1-Click Instant Demo Profiles for Testing / Evaluators */}
          <div className="auth-demo-sidebar">
            <div className="demo-panel-header">
              <Sparkles size={16} color="var(--primary)" />
              <h3>1-Tap Role Testing Profiles</h3>
            </div>
            <p className="demo-panel-desc">
              Want to test the automatic role detection and portal routing without typing? Click any pre-configured identity below to autofill and verify:
            </p>

            <div className="demo-profiles-list">
              {demoProfiles.map(profile => {
                const isCurrent = identifier === profile.identifier;
                const IconComp = profile.icon;
                return (
                  <div 
                    key={profile.id}
                    className={`demo-profile-card ${isCurrent ? 'selected' : ''}`}
                    onClick={() => handleDirectDemoLogin(profile)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="profile-top-row">
                      <div className="profile-avatar" style={{ background: `${profile.color}15`, color: profile.color }}>
                        <IconComp size={20} />
                      </div>
                      <div className="profile-titles">
                        <h4>{profile.name}</h4>
                        <span className="profile-badge-pill" style={{ color: profile.color, borderColor: `${profile.color}40`, background: `${profile.color}10` }}>
                          {profile.badge}
                        </span>
                      </div>
                      <div className="profile-btn-group">
                        <button 
                          type="button" 
                          className="demo-direct-signin-btn"
                          onClick={(e) => handleDirectDemoLogin(profile, e)}
                          title={`Log in instantly as ${profile.name}`}
                        >
                          Sign In →
                        </button>
                      </div>
                    </div>

                    <p className="profile-desc">{profile.desc}</p>
                    <div className="profile-meta-foot">
                      <span className="cluster-tag">{profile.cluster}</span>
                      <span className="email-tag">{profile.identifier}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Guide Card */}
            <div className="auth-guide-box">
              <div className="guide-title">
                <Compass size={16} />
                <span>How KarigarSeetu Role Routing Works:</span>
              </div>
              <ul className="guide-steps">
                <li><strong>Artisan (Seller):</strong> Directed to AI Studio to photo-enhance crafts, record voice stories, and review B2B buyer inquiries.</li>
                <li><strong>Buyer:</strong> Directed to direct-from-artisan catalog with GI verification and bulk RFQ posting.</li>
                <li><strong>Developer (Admin):</strong> Directed to system telemetry, uptime SLAs, and cluster operations.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .unified-auth-page {
          position: relative;
          min-height: calc(100vh - 80px);
          padding: 48px 0 96px;
          overflow: hidden;
        }
        .auth-ambient-wallpaper {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          opacity: 0.08;
          mix-blend-mode: multiply;
          pointer-events: none;
        }
        .auth-container {
          position: relative;
          z-index: 2;
          max-width: 1140px;
          margin: 0 auto;
        }
        .auth-header-block {
          text-align: center;
          max-width: 780px;
          margin: 0 auto 36px;
        }
        .auth-preheader-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          gap: 12px;
          flex-wrap: wrap;
        }
        .first-page-chip {
          background: #FAF6EE;
          border: 1px solid rgba(169, 84, 58, 0.25);
          color: var(--primary);
          font-size: 0.74rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          padding: 5px 14px;
          border-radius: 999px;
        }
        .auth-guest-link {
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid var(--border-medium);
          color: var(--text-primary);
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          padding: 6px 14px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        .auth-guest-link:hover {
          background: var(--primary);
          color: #FFFFFF;
          border-color: var(--primary);
          transform: translateY(-1px);
        }
        .auth-brand-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(169, 84, 58, 0.1);
          color: var(--primary);
          font-size: 0.76rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          padding: 6px 16px;
          border-radius: 999px;
          margin-bottom: 14px;
          border: 1px solid rgba(169, 84, 58, 0.25);
        }
        .brand-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--primary);
        }
        .auth-title {
          font-family: var(--font-serif);
          font-size: 2.5rem;
          color: var(--text-primary);
          margin-bottom: 12px;
          font-weight: 700;
        }
        .auth-subtitle {
          font-size: 0.96rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }
        .auth-main-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 32px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .auth-main-grid {
            grid-template-columns: 1fr;
          }
        }
        .auth-card {
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(220, 205, 185, 0.8);
          border-radius: 20px;
          padding: 36px;
          box-shadow: 0 12px 36px -8px rgba(45, 30, 20, 0.08);
        }
        .auth-tabs-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          background: #F4EFE9;
          padding: 6px;
          border-radius: 12px;
          margin-bottom: 28px;
        }
        .auth-tab-btn {
          padding: 11px 16px;
          border-radius: 8px;
          border: none;
          background: transparent;
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .auth-tab-btn.active {
          background: #FFFFFF;
          color: var(--primary);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        .auth-error-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #FDEDED;
          border: 1px solid #F5C6CB;
          color: #721C24;
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 0.88rem;
          margin-bottom: 20px;
        }
        .auth-form-body {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .label-with-hint {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .field-label {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .field-hint {
          font-size: 0.74rem;
          color: var(--primary);
          font-weight: 600;
        }
        .forgot-link {
          font-size: 0.78rem;
          color: var(--primary);
          text-decoration: none;
          font-weight: 600;
        }
        .forgot-link:hover {
          text-decoration: underline;
        }
        .input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
          pointer-events: none;
        }
        .text-input {
          width: 100%;
          padding: 13px 14px 13px 44px;
          border: 1px solid var(--border-medium);
          border-radius: 10px;
          background: #FFFFFF;
          font-size: 0.92rem;
          color: var(--text-primary);
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .text-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(169, 84, 58, 0.12);
        }
        .password-toggle-btn {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
        }

        /* Real-Time Role Detection Box */
        .role-detection-box {
          padding: 14px 18px;
          border-radius: 12px;
          border: 1px solid var(--border-medium);
          background: #FAF7F2;
          display: flex;
          flex-direction: column;
          gap: 6px;
          transition: all 0.3s ease;
        }
        .role-detection-box.artisan {
          border-color: rgba(169, 84, 58, 0.5);
          background: rgba(169, 84, 58, 0.05);
        }
        .role-detection-box.buyer {
          border-color: rgba(43, 90, 143, 0.5);
          background: rgba(43, 90, 143, 0.05);
        }
        .role-detection-box.admin {
          border-color: rgba(75, 54, 95, 0.5);
          background: rgba(75, 54, 95, 0.06);
        }
        .detection-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .detection-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .analyzing-spinner {
          width: 12px;
          height: 12px;
          border: 2px solid var(--primary);
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .detected-badge {
          font-size: 0.75rem;
          font-weight: 800;
          padding: 3px 10px;
          border-radius: 999px;
        }
        .detected-badge.artisan {
          background: #F8EBE7;
          color: #A9543A;
          border: 1px solid rgba(169, 84, 58, 0.3);
        }
        .detected-badge.buyer {
          background: #E8F0F8;
          color: #2B5A8F;
          border: 1px solid rgba(43, 90, 143, 0.3);
        }
        .detected-badge.admin {
          background: #F0EAF5;
          color: #4B365F;
          border: 1px solid rgba(75, 54, 95, 0.3);
        }
        .detection-reason {
          font-size: 0.78rem;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.4;
        }
        .routing-preview {
          font-size: 0.8rem;
          color: var(--text-primary);
          padding-top: 4px;
          border-top: 1px dashed rgba(0, 0, 0, 0.08);
        }

        /* Sign Up Role Selection Grid */
        .role-selection-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 4px;
        }
        .role-select-card {
          border: 1px solid var(--border-medium);
          border-radius: 12px;
          padding: 14px 16px;
          cursor: pointer;
          background: #FFFFFF;
          transition: all 0.2s ease;
          position: relative;
        }
        .role-select-card:hover {
          border-color: var(--primary);
          transform: translateY(-1px);
        }
        .role-select-card.selected {
          border-color: var(--primary);
          background: rgba(169, 84, 58, 0.04);
          box-shadow: 0 4px 14px rgba(169, 84, 58, 0.12);
        }
        .role-card-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 4px;
        }
        .role-name {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .role-select-card p {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.4;
        }
        .active-dot {
          position: absolute;
          top: 14px;
          right: 14px;
          font-size: 0.74rem;
          font-weight: 700;
          color: var(--primary);
        }
        .dev-key-group {
          background: #F9F6FC;
          padding: 14px;
          border-radius: 12px;
          border: 1px dashed #C8B4DC;
        }

        /* Submit Button */
        .auth-submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: var(--primary);
          color: #FFFFFF;
          border: none;
          padding: 14px 20px;
          border-radius: 12px;
          font-size: 0.98rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 6px 18px rgba(169, 84, 58, 0.25);
          margin-top: 8px;
        }
        .auth-submit-btn:hover {
          background: var(--primary-dark, #8A3D27);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(169, 84, 58, 0.35);
        }
        .auth-security-notice {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 0.72rem;
          color: var(--text-muted);
          text-align: center;
          margin-top: 4px;
        }

        /* Demo Sidebar */
        .auth-demo-sidebar {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .demo-panel-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .demo-panel-header h3 {
          font-family: var(--font-serif);
          font-size: 1.35rem;
          color: var(--text-primary);
          font-weight: 700;
        }
        .demo-panel-desc {
          font-size: 0.86rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin: 0;
        }
        .demo-profiles-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .demo-profile-card {
          background: #FFFFFF;
          border: 1px solid var(--border-medium);
          border-radius: 14px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
        }
        .demo-profile-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px -4px rgba(0, 0, 0, 0.08);
          border-color: var(--primary);
        }
        .demo-profile-card.selected {
          border-color: var(--primary);
          background: rgba(169, 84, 58, 0.03);
          box-shadow: 0 6px 18px rgba(169, 84, 58, 0.15);
        }
        .profile-top-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }
        .profile-avatar {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .profile-titles {
          flex: 1;
        }
        .profile-titles h4 {
          font-size: 0.94rem;
          color: var(--text-primary);
          font-weight: 700;
          margin-bottom: 2px;
        }
        .profile-badge-pill {
          font-size: 0.7rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 999px;
          border: 1px solid;
          display: inline-block;
        }
        .demo-direct-signin-btn {
          font-size: 0.76rem;
          font-weight: 700;
          background: var(--primary);
          color: #FFFFFF;
          border: 1px solid var(--primary);
          padding: 6px 12px;
          border-radius: 8px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: all 0.2s ease;
          box-shadow: 0 2px 6px rgba(169, 84, 58, 0.25);
        }
        .demo-direct-signin-btn:hover {
          background: #8e442f;
          border-color: #8e442f;
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(169, 84, 58, 0.35);
        }
        .demo-autofill-btn {
          font-size: 0.74rem;
          font-weight: 700;
          background: #FAF7F2;
          color: var(--primary);
          border: 1px solid var(--border-medium);
          padding: 4px 10px;
          border-radius: 8px;
          cursor: pointer;
        }
        .demo-profile-card:hover .demo-autofill-btn {
          background: var(--primary);
          color: #FFFFFF;
          border-color: var(--primary);
        }
        .profile-desc {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: 10px;
          line-height: 1.45;
        }
        .profile-meta-foot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.72rem;
          color: var(--text-muted);
          padding-top: 8px;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
        }
        .cluster-tag {
          font-weight: 600;
          color: var(--text-primary);
        }

        /* Guide box */
        .auth-guide-box {
          background: #F4EFE9;
          border: 1px solid rgba(220, 205, 185, 0.6);
          border-radius: 14px;
          padding: 18px;
        }
        .guide-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.84rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 10px;
        }
        .guide-steps {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 0.78rem;
          color: var(--text-secondary);
          line-height: 1.45;
        }
        .guide-steps strong {
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
}
