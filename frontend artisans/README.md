# KarigarAI (कारीगर AI) — Frontend Platform Documentation

> **India's Voice-First AI Direct Artisan Business Ecosystem**  
> Empowering rural master craftspeople, weavers, and Self-Help Groups (SHGs) with direct digital commerce, fair wage transparency, AI-powered product digitisation, and verified B2B procurement.

---

## 1. Executive Summary & Core Value Proposition

**KarigarAI** bridges the digital divide for over 200 million traditional craftspeople across rural India. By combining voice-first conversational AI, computer vision, regional language translation, and strict Role-Based Access Control (RBAC), the platform eliminates predatory middlemen and allows master artisans to command fair, dignified prices directly from individual buyers and corporate procurement teams.

### Core Pillars
1. **Voice-First AI Studio**: Rural artisans speak in their native tongue to create international-grade e-commerce listings in under 60 seconds from a single smartphone photo.
2. **Fair Wage Price Transparency**: Proprietary algorithmic breakdown separating raw materials, artisan master labor, craft heritage premiums, and market benchmarks.
3. **Verified GI-Tagged Provenance**: Cryptographic and physical QR provenance guaranteeing authentic Geographical Indication (GI) heritage.
4. **Role-Based Workspaces**: Tailored, isolated environments for **Master Artisans (Sellers)**, **Corporate ESG & Retail Buyers**, and **Platform Administrators**.
5. **Zero-Bleed Multilingual Engine**: Clean English by default with zero unwanted Hindi bleeding, switching dynamically to 8 Indian languages only upon user translation.

---

## 2. Technology Stack & Design System

- **Framework**: React 18 (`react`, `react-dom`) with modern Functional Components & Hooks
- **Bundler & Tooling**: Vite 6 (`@vitejs/plugin-react`) for sub-second Hot Module Replacement (HMR) and production bundling
- **Styling Architecture**: Pure Vanilla CSS design tokens with scoped component styles, glassmorphism overlays (`backdrop-filter`), responsive CSS grid/flex layouts, and CSS custom properties (`--primary: #A93226`, `--bg-main: #FDFBF7`, `--accent-gold: #D4AF37`)
- **Iconography**: `lucide-react` (high-density scalable SVG icons)
- **Visual Delight**: `canvas-confetti` for celebratory artisan restocks and achievements
- **Audio & Speech**: Browser Web Speech API (`SpeechSynthesis` & `SpeechRecognition`) with regional Indian voice accents
- **Testing Engine**: Vitest 5 (`vitest run`) — 37 automated tests passing across 9 comprehensive test suites

---

## 3. Role-Based Access Control (RBAC) & Personas

KarigarAI implements a secure, deterministic RBAC model (`src/config/roles.js`). Unauthorized surfaces automatically redirect users to their permitted workspace with real-time feedback.

| Role Key | Role Name | Permitted Surfaces | Restricted Surfaces | Default Landing | Demo Persona |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `artisan` | **Master Artisan / Seller** | `artisan`, `studio`, `inventory`, `marketplace` | `admin`, `admin-catalog`, `admin-rfqs`, `buyer` | `#/artisan` | **Meena Devi** (`meena.devi@chanderi.artisan`)<br>*Chanderi Handloom Master Weaver* |
| `buyer` | **Corporate Buyer / Sourcing** | `marketplace`, `buyer` | `studio`, `inventory`, `artisan`, `admin`, `admin-catalog`, `admin-rfqs` | `#/marketplace` | **Aditi Sharma** (`buyer@tata.com`)<br>*Corporate ESG & Retail Sourcing Partner* |
| `admin` | **Platform Administrator** | `admin`, `admin-catalog`, `admin-rfqs`, `marketplace`, `buyer` | `studio`, `inventory`, `artisan` | `#/admin` | **Rajeshwar Verma** (`admin@karigar.ai`)<br>*Director of Craft Cluster Operations* |

---

## 4. Comprehensive Page-by-Page Feature Breakdown

### 1. Unified Authentication Gateway (`#/auth`)
*The entry portal for all platform users before entering role-specific surfaces.*
- **Persona Quick-Select Cards**: 1-click test identities for **Meena Devi (Artisan)**, **Corporate Buyer (Aditi Sharma)**, and **Platform Admin (Rajeshwar Verma)**.
- **Smart Credential Role Detection**: Real-time analyzer that infers user role from email, name, or keywords (e.g. `meena`, `chanderi`, `artisan`, `weaver` → Artisan; `admin`, `dev` → Admin; `buyer`, `tata` → Buyer).
- **Mode Toggle**: Clean toggle between **Sign In** and **Create Account**.
- **Password Visibility Toggle**: Safe inspection of entered credentials.
- **Strict Role Routing**: Immediately routes users to their respective home workspace upon sign-in.

---

### 2. Artisan Hub & Dashboard (`#/artisan`)
*The daily mission control center for master craftspeople and rural artisan collectives.*
- **Personalized Header**: Dynamic greeting (`Namaste, Meena Devi` in English, `नमस्ते, Meena Devi जी` in Hindi).
- **Digital Shop Readiness Tracker**: Visual 82% progress bar and checklist (bio verification, GI badge, photo enhancement pending).
- **Real-Time B2B Inquiries Monitor**: Inspect active bulk buyer RFQs (e.g., ABC Handicrafts 500 handwoven bags for ₹1,00,000).
- **1-Click Quick Response Drawer**: Accept order proposals, offer counter-quotes, or reply with voice in seconds.
- **AI Business Growth Recommendations**: Proactive smart tips on festival trends, stock replenishment, and photography lighting.
- **Loom Performance Badges**: Displays verified Master Artisan Lineage `#MP-8201` and active GI cluster credentials.

---

### 3. AI Product Studio (`#/studio`)
*A 7-stage voice-and-vision assisted digitisation pipeline that turns a photo into an e-commerce listing.*
- **Stage 1 (Photo Capture)**: Live camera capture or file upload. Includes 1-click preset sample crafts for rapid testing.
- **Stage 2 (AI Visual Studio)**: Instant background removal, lighting normalization, and artifact contrast enhancement.
- **Stage 3 (Voice Storytelling)**: Microphone recorder with waveform animation. Artisans speak in Hindi or regional dialect to narrate their craft heritage.
- **Stage 4 (NLP Attribute Extraction)**: Auto-detects materials, techniques, color palettes, and dimensions.
- **Stage 5 (Multilingual Catalog & SEO)**: Generates dual-language English/Hindi titles, poetic descriptions, care instructions, and SEO tag chips.
- **Stage 6 (Smart Fair-Price Calculator)**: Interactive cost breakdown showing raw materials, labor hours, artisan profit, and benchmark retail price.
- **Stage 7 (Marketplace Publish)**: 1-click publishing with confetti celebration, instantly updating the direct marketplace.

---

### 4. My Products & Real-Time Inventory (`#/inventory`)
*The physical workshop vault and stock management ledger for artisans.*
- **Translucent Artisan Village Mural Wallpaper**: Features the authentic uploaded mural of Indian women weaving at the loom, spinning yarn, and carving crafts, with balanced opacity (`0.16`) and blur for high readability.
- **Real-Time Inventory KPI Grid**:
  - **Vault Stock Units**: Dynamic sum of all units across listings.
  - **Total Inventory Value**: Live total valuation in ₹ (Units × Fair Price).
  - **Low Stock Alerts**: Count of items with ≤ 5 units remaining.
  - **GI Authenticated**: Count of registered Geographical Indication crafts.
- **Stock Management Controls**:
  - **Inline Stepper**: `[-] 12 [+]` with instant toast notification upon update.
  - **1-Tap Batch Restock Pills**: Fast `+5`, `+10`, `+25` restock buttons with confetti burst.
  - **Stock Health Badges**: Green (Healthy Stock), Amber (Low Stock pulse), Red (Made-to-Order / Out of Stock).
- **Dual View Modes**:
  - **Artisan Cards Grid View**: Rich visual cards with photography, stats, and action pills.
  - **Workshop Table Ledger View**: High-efficiency row ledger with inline steppers.
- **Quick Edit Modal**: Edit unit price, stock units, and lead time on the fly without navigating away.
- **Printable Artisan QR Hangtag Simulator**: Generates physical print-ready hangtags with QR provenance seals for village exhibitions.
- **Workshop Manifest CSV Export**: 1-click download of all inventory data for bookkeeping.

---

### 5. Verified Artisan Direct Marketplace (`#/marketplace`)
*The public-facing, fair-trade shopping surface connecting buyers directly to craftspeople.*
- **"Explore by Art Tradition" Visual Carousel**: 10 authenticated craft cards with photos and icons (Bamboo & Wicker, Sarkanda Mudda, Winnowing Supa, Folk Pankha, Blue Pottery, Handloom Silk, Warli Art, Aari Needlework, Terracotta, Copper Repoussé).
- **Trending Art Quick Search Suggestion Chips**: Fast 1-click pills under the search bar (`🌿 Bamboo Baskets`, `🪑 Mudda Stool`, `🏺 Blue Pottery`, etc.).
- **Multi-Field Instant Search**: Searches across title, craft, region, materials, and description with a 1-click clear (`×`) button.
- **Multi-Dimensional Filter & Sort Controls**:
  - **Budget Selector**: Under ₹1,000, ₹1,000–₹2,500, ₹2,500–₹6,000, Above ₹6,000.
  - **Origin State Selector**: Assam, Haryana, West Bengal, Bihar, Rajasthan, Uttar Pradesh, Kashmir, Odisha, Maharashtra, Gujarat, Karnataka.
  - **Material Selector**: Natural Bamboo, Sarkanda, Pure Silk, Handspun Cotton, Clay & Terracotta, Brass & Bronze, Teak Wood.
  - **Sort Options**: Featured & GI Certified, Price: Low to High, Price: High to Low, Highest Rated (4.9+), Fastest Lead Time.
  - **GI Certified Toggle**: Dedicated amber-gold badge button with shield icon.
- **Role-Aware Header Actions**:
  - For **Buyers**: Shows `+ Request Bulk RFQ` and `B2B Wholesale Hub` (restricted `"List as Artisan"` button removed).
  - For **Artisans**: Shows `List as Artisan` (routes to `#/studio`).
- **Active Filters Tags Strip**: Dismissible filter pills with 1-click removal, "Reset All" button, and live match counter.
- **Product Details Modal**: Displays photography gallery, fair wage breakdown, specifications table, and audio story speech playback.
- **Direct Purchase Simulation**: 1-click order simulation with success toast and zero middleman fee confirmation.
- **Living Masters Directory & Craft Taxonomy Matrix**: Deep educational profiles of living master craftspersons across India.

---

### 6. B2B Wholesale Hub & Bulk RFQ Engine (`#/buyer`)
*Dedicated enterprise procurement portal for hotel chains, architects, and corporate ESG buyers.*
- **Hero Showcase**: High-impact visuals featuring Assam bamboo bazaar baskets and Haryana sarkanda mudda stools.
- **Verified Artisan Sourcing Clusters Directory**:
  - Assam Bamboo & Cane Guild (Barpeta & Majuli)
  - Traditional Supa Winnowing Cluster (Purulia & Midnapore)
  - Farrukhnagar Sarkanda Mudda Seating Guild
  - Bihar Madhubani Pankha Collective
  - Nalbari Cylindrical Bamboo Joinery Guild
- **1-Click RFQ Pre-fill**: Clicking "Request Bulk Quote" on any cluster automatically scrolls to the RFQ form and populates MOQ and wholesale budget.
- **Custom B2B RFQ Submission Wizard**: Submit project specifications, order volume (100–5,000 units), target unit budget, delivery timeline, and packaging requirements.
- **Active Procurement Pipelines**: Real-time tender monitoring showing matched artisan clusters, match scores, total value (₹), and status.
- **Direct Sourcing Impact Metrics**: 120+ Rural SHG Clusters, 100% Direct Cluster Gate Price, 0% Middlemen Markup.

---

### 7. Admin Operations Console (`#/admin`)
*High-level governance dashboard for platform operators and craft cluster managers.*
- **Platform Health & Metrics Command Center**: Active artisans count, registered buyers, gross platform merchandise volume, and GI audit compliance rate.
- **Sub-Surface Navigation Switcher**: Instant switching between Admin Overview, Catalog Oversight (`#/admin-catalog`), and B2B RFQ Oversight (`#/admin-rfqs`).
- **Artisan SHG Registry & Verification**: Inspect, audit, and approve newly registered rural craft clusters.
- **Live System Audit Log**: Real-time ledger of catalog additions, RFQ bids, and user authentication events.

---

### 8. Admin Catalog Oversight (`#/admin-catalog`)
*Complete administrative control over all 25+ marketplace product listings.*
- **Search & Filter Suite**: Filter by craft category, GI certification status, and search query.
- **Catalog Management Table**: Product photo, craft lineage, region, price, stock units, and audit status.
- **Interactive Product Edit Modal**: Modify product title, category, price, stock, and toggle GI certified status.
- **Instant Synchronization**: Changes instantly propagate to the live marketplace and storage service.

---

### 9. Admin B2B RFQ Oversight (`#/admin-rfqs`)
*Centralized management of corporate procurement tenders and cluster dispatches.*
- **RFQ Pipeline Ledger**: Displays tender ID, buyer company, item, volume, unit budget, total budget, location, and match score.
- **Authentic Craft Thumbnails**: Visual previews of the required craft items.
- **Status Lifecycle Workflow**: Advance tenders through `Active Matching`, `Under Negotiation`, `Production Scheduled`, and `Dispatched`.

---

### 10. Floating 24/7 AI Business Advisor (`AIAssistantModal`)
*An omnipresent conversational AI drawer available across all logged-in surfaces.*
- **Interactive Voice & Text Assistant**: Tap microphone or type queries in English or Hindi.
- **Contextual Artisan Assistance**: Real-time guidance on fair pricing calculations, product photography lighting, story translation to English, and festive market demand.
- **Quick Prompt Chips**: 1-click popular questions for faster interaction.
- **Role & Language Aware**: Automatically detects active language and responds in matching language.

---

### 11. Multilingual Engine & Zero-Bleed Language Isolation (`LanguageContext` & `i18n.js`)
- **Strict English Default**: When English is selected, zero Hindi characters appear across greetings, headers, buttons, tabs, and modals.
- **On-Demand Dynamic Translation**: Seamlessly translates to **हिन्दी (Hindi)**, **தமிழ் (Tamil)**, **తెలుగు (Telugu)**, **বাংলা (Bengali)**, **मराठी (Marathi)**, **ગુજરાતી (Gujarati)**, and **ಕನ್ನಡ (Kannada)**.
- **Audio Speech Synthesis**: Integrates native text-to-speech reading descriptions aloud in the chosen Indian language.

---

## 5. Directory & File Structure

```text
frontend artisans/
├── public/
│   └── assets/
│       └── culture/
│           ├── crafts/        # Authentic bamboo, wicker, pottery & handloom images
│           ├── curations/     # Atelier & emporium showcases
│           ├── illustrations/ # Cultural glyphs & vectors
│           ├── imagery/       # Master artisan portraits & weavers
│           └── wallpapers/    # High-resolution cultural murals (artisan-village-mural.jpg)
├── src/
│   ├── assets/                # Bundled visual assets & images
│   ├── components/
│   │   ├── admin/             # AdminConsole, AdminCatalogOversight, AdminRfqOversight
│   │   ├── artisan/           # ArtisanDashboard, ArtisanOnboarding
│   │   ├── assistant/         # AIAssistantModal (Floating 24/7 AI Business Advisor)
│   │   ├── buyer/             # BuyerHubPage (B2B Bulk Procurement Hub)
│   │   ├── common/            # SurfaceLoader, ToastContainer
│   │   ├── inventory/         # InventoryPage (My Products & Stock with Mural Wallpaper)
│   │   ├── layout/            # Header, MobileBottomNav
│   │   ├── marketplace/       # MarketplacePage (Direct Fair-Trade Artisan Marketplace)
│   │   ├── public/            # ArtisanHeritageGallery, HeritageFooter, ImpactSection
│   │   └── studio/            # StudioContainer (7-Step Voice AI Cataloging Pipeline)
│   ├── config/
│   │   ├── cultureAssets.js   # Centralized cultural image registry & imports
│   │   └── roles.js           # RBAC rules, permissions & routing definitions
│   ├── context/
│   │   ├── AppContext.jsx     # Global state: surface routing, user session, toasts
│   │   ├── LanguageContext.jsx# Multilingual state, translation dispatcher & TTS
│   │   └── MarketplaceContext.jsx # Products catalog, inquiries, B2B requirements
│   ├── data/
│   │   ├── artisans.js        # Master artisan lineages & biographical stories
│   │   ├── b2b.js             # Sourcing clusters & B2B procurement tenders
│   │   ├── crafts.js          # Cultural craft taxonomy & regional traditions
│   │   └── products.js        # 25+ authentic Indian craft listings with dual attributes
│   ├── pages/
│   │   ├── AuthPage.jsx       # Unified Authentication & Role Gateway
│   │   └── PublicHomePage.jsx # Public Landing Page
│   ├── services/
│   │   ├── audioSpeech.js     # Web Speech API speech synthesis & recognition
│   │   ├── i18n.js            # Translation dictionaries across 8 Indian languages
│   │   ├── pricingEngine.js   # Fair wage breakdown calculation algorithm
│   │   └── storageService.js  # LocalStorage persistence with defensive fallback
│   ├── __tests__/             # Automated Vitest test suites (37 passing tests)
│   ├── App.jsx                # Root application shell, header & lazy surface router
│   ├── index.css              # Global design tokens, typography, glassmorphism CSS
│   └── main.jsx               # React 18 DOM mount point
├── package.json               # Dependencies & build scripts
├── vite.config.js             # Vite 6 config with React plugin & Vitest integration
└── README.md                  # Comprehensive platform documentation (This file)
```

---

## 6. Getting Started & Development Workflow

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Installation
```bash
# Clone or navigate to the workspace
cd "frontend artisans"

# Install all project dependencies
npm install
```

### 2. Running Locally (Development Server)
```bash
npm run dev
```
The application will launch at **`http://localhost:5173/`** (or `http://localhost:5174/`).

### 3. Running Automated Tests
```bash
npm test
```
Executes all 37 Vitest unit tests verifying RBAC, Meena Devi credentials, admin oversight, buyer search features, language isolation, and inventory calculations.

### 4. Building for Production
```bash
npm run build
```
Creates an optimized production bundle in the `dist/` directory with static asset compression.

---

## 7. Quality Assurance & Verification Summary

- **Unit Test Coverage**: 37 tests across 9 test files — **100% Passing**.
- **Production Bundle**: Clean compilation in 5.8s with **0 warnings and 0 errors**.
- **Cross-Role Validation**:
  - **Artisan**: Can access Dashboard, Studio, Inventory, and Marketplace; blocked from Buyer and Admin.
  - **Buyer**: Can access Marketplace and B2B Buyer Hub; `"List as Artisan"` button removed; blocked from Studio and Admin.
  - **Admin**: Can access Admin Console, Catalog Oversight, and RFQ Oversight; blocked from Studio and Artisan Hub.
- **Language Purity**: Zero Devanagari script bleeding when `English` is active; translations only render when `Hindi` or another language is selected.
- **Visual Design**: Ambient mural wallpaper integrated into `#/inventory` at a balanced `0.16` opacity with glassmorphism cards.

---

*KarigarAI — Handcrafted India • Preserving Craft Heritage through Artificial Intelligence.*
