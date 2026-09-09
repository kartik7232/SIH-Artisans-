import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import storageService from '../../services/storageService';
import {
  IndianRupee,
  Sparkles,
  TrendingUp,
  TrendingDown,
  FileText,
  CheckCircle2,
  AlertCircle,
  Volume2,
  Mic,
  Send,
  Plus,
  Download,
  Printer,
  ShieldCheck,
  Award,
  Filter,
  Search,
  Calendar,
  Layers,
  HelpCircle,
  ArrowRight,
  CreditCard,
  Building2,
  Coins,
  Briefcase,
  X
} from 'lucide-react';
import './financialAssistant.css';

export default function FinancialAssistantPage() {
  const { t, lang, speak } = useLanguage();
  const { currentUser, showToast } = useApp();

  const [activeTab, setActiveTab] = useState('advisor');
  const [transactions, setTransactions] = useState(() => storageService.loadFinancialLedger());
  const [summary, setSummary] = useState(() => storageService.getFinancialSummary());

  // Refresh summary when transactions change
  useEffect(() => {
    setSummary(storageService.getFinancialSummary(transactions));
  }, [transactions]);

  // =========================================================================
  // TAB 1: AI FINANCIAL ADVISOR STATE & LOGIC
  // =========================================================================
  const defaultAiWelcome = lang === 'hi' 
    ? 'नमस्ते! मैं आपका कारीगर सेतु आर्थिक सलाहकार हूँ। आप मुझसे PM विश्वकर्मा योजना, कच्चा माल बजट, सही बिक्री मूल्य (Fair Pricing) या बैंक लोन के बारे में कभी भी पूछ सकते हैं।'
    : 'Namaste! I am your KarigarSeetu Financial AI Advisor. Ask me about PM Vishwakarma ₹3 Lakh loan eligibility, raw material budgeting, B2B wholesale pricing margins, or seasonal working capital.';

  const [chatMessages, setChatMessages] = useState([
    {
      id: 'msg-1',
      sender: 'bot',
      text: defaultAiWelcome,
      time: 'Just now'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const quickPrompts = [
    {
      id: 'p1',
      labelHi: 'क्या मैं PM विश्वकर्मा ₹3 लाख ऋण के लिए पात्र हूँ?',
      labelEn: 'Am I eligible for PM Vishwakarma ₹3 Lakh loan at 5%?',
      replyHi: 'हाँ! यदि आप पारंपरिक हथकरघा बुनकर, मिट्टी के बर्तन, धातु या काष्ठ शिल्पी हैं, तो आप PM विश्वकर्मा योजना के अंतर्गत बिना किसी गारंटी (collateral-free) के ₹3,00,000 (प्रथम चरण ₹1 लाख, द्वितीय चरण ₹2 लाख) तक का ऋण केवल 5% रियायती ब्याज दर पर प्राप्त कर सकते हैं। साथ ही ₹15,000 का आधुनिक टूलकिट अनुदान भी मिलता है।',
      replyEn: 'Yes! As a recognized artisan or weaver, you are eligible for the PM Vishwakarma Scheme. It provides up to ₹3,00,000 collateral-free credit at a highly subsidized 5% interest rate (₹1L in Tranche 1, followed by ₹2L in Tranche 2), along with a ₹15,000 modern toolkit grant and 5-7 days skill training with ₹500/day stipend.'
    },
    {
      id: 'p2',
      labelHi: '25 चंदेरी साड़ियों के लिए कितनी कार्यशील पूंजी (Working Capital) चाहिए?',
      labelEn: 'How much working capital is needed for a batch of 25 Chanderi sarees?',
      replyHi: '25 चंदेरी साड़ियों के लिए आपको लगभग ₹36,500 से ₹42,000 की कार्यशील पूंजी की आवश्यकता होगी:\n• शुद्ध रेशम ताना व बाना: ₹21,000 (₹840/साड़ी)\n• ज़री और पारंपरिक बूटी धागा: ₹6,500 (₹260/साड़ी)\n• सहायक बुनाई मजदूरी: ₹7,500 (₹300/साड़ी)\n• फिनिशिंग और पैकेजिंग: ₹2,500\nयदि आप इन्हें ₹2,200/साड़ी में बेचते हैं तो कुल बिक्री ₹55,000 होगी और आपका शुद्ध लाभ ₹17,500 (लगभग 31.8% मार्जिन) रहेगा।',
      replyEn: 'For a production run of 25 authentic handloom sarees, you need approximately ₹37,500 to ₹42,000 in working capital:\n• Silk warp & weft yarn: ₹21,000 (~₹840/unit)\n• Zari & design threads: ₹6,500 (~₹260/unit)\n• Auxiliary weaving wages: ₹7,500 (~₹300/unit)\n• Packaging & QC tags: ₹2,500\nAt an average sale price of ₹2,200/unit, gross revenue is ₹55,000, yielding a healthy net profit of ₹17,500 (31.8% margin).'
    },
    {
      id: 'p3',
      labelHi: 'थोक B2B खरीदार को 50 पीस पर कितना डिस्काउंट देना सुरक्षित है?',
      labelEn: 'What is a safe discount margin for a 50-piece B2B wholesale order?',
      replyHi: 'कारीगर सेतु फेयर प्राइसिंग नियम के अनुसार, 50 पीस के B2B ऑर्डर पर 12% से 15% से अधिक छूट न दें। थोक ऑर्डर में आपकी यूनिट लागत कम हो जाती है क्योंकि कच्चा माल थोक में सस्ता मिलता है, लेकिन शुद्ध कारीगरी मजदूरी को कभी कम न करें। हमेशा 40% से 50% अग्रिम (Advance Payment) का अनुबंध रखें।',
      replyEn: 'Under fair artisan pricing guidelines, keep wholesale discounts between 12% and 15% for 50+ unit bulk orders. Bulk raw material procurement reduces your per-unit costs, but never compromise your core weaving labor hours. Always mandate a 40-50% upfront production advance.'
    },
    {
      id: 'p4',
      labelHi: 'हस्तशिल्प कारीगरों के लिए GST पंजीकरण छूट की सीमा क्या है?',
      labelEn: 'What is the GST registration exemption threshold for artisans?',
      replyHi: 'भारत सरकार के नियमों के अनुसार, हस्तशिल्प और हथकरघा उत्पादों की अंतर-राज्यीय (inter-state) बिक्री पर ₹20 लाख (विशेष राज्यों में ₹10 लाख) तक के वार्षिक टर्नओवर पर सामान्य कारीगरों को अनिवार्य GST पंजीकरण से छूट प्राप्त है, बशर्ते आपके पास स्थायी कारीगर पहचान पत्र (Pehchan ID / PAN) हो।',
      replyEn: 'Under Indian GST council guidelines, casual and handicraft artisans making inter-state supplies are exempt from mandatory GST registration up to an annual turnover of ₹20 Lakhs (₹10 Lakhs in northeastern states), provided you operate with a valid PAN and Artisan Pehchan card.'
    }
  ];

  const handleSendMessage = (textToSend) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputQuery('');

    // Generate intelligent artisan financial advisory reply
    setTimeout(() => {
      let botResponse = '';
      const lower = query.toLowerCase();

      if (lower.includes('vishwakarma') || lower.includes('विश्वकर्मा') || lower.includes('योजना') || lower.includes('scheme')) {
        botResponse = lang === 'hi'
          ? 'PM विश्वकर्मा योजना में 18 पारंपरिक शिल्पों को मान्यता प्राप्त है। आपको ₹15,000 का टूलकिट वाउचर, ₹3 लाख तक का कम ब्याज (5%) ऋण और डिजिटल लेन-देन पर प्रति लेन-देन ₹1 का प्रोत्साहन मिलता है। आप हमारे "सरकारी योजनाएं" टैब से सीधे आवेदन पात्रता जांच सकते हैं।'
          : 'Under PM Vishwakarma Yojana, recognized artisans receive a ₹15,000 modern toolkit grant, ₹3 Lakh collateral-free loan at 5% interest, and ₹1 incentive per digital transaction (up to 100/month). Check your instant eligibility in Tab 3!';
      } else if (lower.includes('mudra') || lower.includes('मुद्रा') || lower.includes('loan') || lower.includes('कर्ज')) {
        botResponse = lang === 'hi'
          ? 'मुद्रा योजना (PMMY) में कारीगरों के लिए 3 श्रेणियां हैं: शिशु (₹50,000 तक), किशोर (₹50,000 से ₹5 लाख), और तरुण (₹5 लाख से ₹10 लाख)। इसके लिए किसी संपत्ति को गिरवी रखने की आवश्यकता नहीं होती है।'
          : 'PMMY (Mudra Scheme) offers Shishu loans up to ₹50,000, Kishore loans up to ₹5 Lakhs, and Tarun loans up to ₹10 Lakhs with zero processing fees and no third-party collateral requirements.';
      } else if (lower.includes('margin') || lower.includes('profit') || lower.includes('मुनाफा') || lower.includes('लाभ')) {
        botResponse = lang === 'hi'
          ? `आपके डिजिटल बहीखाते के अनुसार आपका वर्तमान शुद्ध लाभ ₹${summary.netProfit.toLocaleString('en-IN')} है (लाभ दर ${summary.profitMargin}%)। आपका व्यवसाय वित्तीय रूप से स्वस्थ है और किसी भी बैंक से प्राथमिकता ऋण पाने योग्य है।`
          : `Based on your digital ledger, your current net surplus is ₹${summary.netProfit.toLocaleString('en-IN')} with a healthy ${summary.profitMargin}% profit margin. Your enterprise demonstrates solid bankability.`;
      } else {
        botResponse = lang === 'hi'
          ? `आपके वित्तीय प्रश्न का विश्लेषण किया गया है। हस्तशिल्प क्लस्टर में कच्चा माल (ताने का रेशम/धागा) हमेशा सहकारिता से थोक में खरीदें, जिससे 12% लागत बचेगी। अपने सभी दैनिक खर्च डिजिटल बहीखाते में दर्ज रखें ताकि बैंक स्टेटमेंट मजबूत रहे।`
          : `Financial recommendation: Procuring raw materials collectively through your cluster society can reduce input costs by up to 14%. Keeping daily digital records in your Bahi-Khata guarantees high credit readiness for bank inspections.`;
      }

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, botMsg]);
      // Audio narration
      speak(botResponse, lang === 'hi' ? 'hi' : 'en');
    }, 600);
  };

  const handleVoiceToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    // Check if SpeechRecognition is available in browser
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        setIsRecording(true);
        recognition.start();

        recognition.onresult = (event) => {
          const speechResult = event.results[0][0].transcript;
          setInputQuery(speechResult);
          setIsRecording(false);
          handleSendMessage(speechResult);
        };

        recognition.onerror = () => {
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };
      } catch {
        setIsRecording(false);
      }
    } else {
      // Fallback: simulated voice input for demonstration
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        const sampleQuery = lang === 'hi' 
          ? 'क्या मुझे PM विश्वकर्मा में ₹15,000 टूलकिट अनुदान मिलेगा?' 
          : 'Can I get the ₹15,000 PM Vishwakarma toolkit incentive?';
        setInputQuery(sampleQuery);
        handleSendMessage(sampleQuery);
      }, 1500);
    }
  };

  // =========================================================================
  // TAB 2: BAHI-KHATA LEDGER STATE & LOGIC
  // =========================================================================
  const [ledgerFilter, setLedgerFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTx, setNewTx] = useState({
    type: 'income',
    description: '',
    category: 'Direct Marketplace',
    amount: '',
    paymentMethod: 'UPI',
    notes: ''
  });

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      // Filter category / type
      if (ledgerFilter === 'income' && t.type !== 'income') return false;
      if (ledgerFilter === 'expense' && t.type !== 'expense') return false;
      if (ledgerFilter === 'raw_material' && t.category !== 'Raw Materials') return false;
      if (ledgerFilter === 'wages' && t.category !== 'Artisan Wages') return false;

      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.paymentMethod.toLowerCase().includes(q) ||
          (t.notes && t.notes.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [transactions, ledgerFilter, searchTerm]);

  const handleAddTransactionSubmit = (e) => {
    e.preventDefault();
    if (!newTx.description || !newTx.amount) {
      if (showToast) showToast('Please enter description and amount', 'warning');
      return;
    }

    const created = storageService.addLedgerTransaction(newTx);
    if (created) {
      setTransactions(storageService.loadFinancialLedger());
      setIsAddModalOpen(false);
      setNewTx({
        type: 'income',
        description: '',
        category: 'Direct Marketplace',
        amount: '',
        paymentMethod: 'UPI',
        notes: ''
      });
      if (showToast) showToast('Transaction recorded in Bahi-Khata ledger!', 'success');
    }
  };

  const exportCSV = () => {
    const headers = ['Date', 'Type', 'Category', 'Description', 'Amount (INR)', 'Payment Method', 'Notes'];
    const rows = transactions.map(t => [
      `"${t.date}"`,
      `"${t.type}"`,
      `"${t.category}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      t.amount,
      `"${t.paymentMethod}"`,
      `"${(t.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KarigarSeetu_BahiKhata_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (showToast) showToast('Bahi-Khata ledger exported as CSV', 'info');
  };

  const printStatement = () => {
    window.print();
  };

  // =========================================================================
  // TAB 3: GOVERNMENT SCHEMES & ELIGIBILITY CHECKER
  // =========================================================================
  const [craftType, setCraftType] = useState('handloom');
  const [hasArtisanId, setHasArtisanId] = useState('yes');
  const [turnoverBracket, setTurnoverBracket] = useState('under_10l');
  const [schemeResult, setSchemeResult] = useState(null);

  const calculateEligibility = (e) => {
    e.preventDefault();
    setSchemeResult({
      isEligible: true,
      schemes: [
        {
          name: 'PM Vishwakarma Scheme',
          grant: '₹15,000 Toolkit Grant (E-Voucher)',
          loan: '₹3,00,000 Collateral-Free Credit @ 5% Subsidized Interest',
          training: '5-7 Days Basic Training with ₹500/day Stipend',
          idBadge: 'PM Vishwakarma Digital Certificate & ID Card'
        },
        {
          name: 'Weavers Mudra / Artisan Credit Card (ACC)',
          grant: 'Margin Money Assistance up to ₹10,000',
          loan: 'Working Capital Limit up to ₹2,00,000 with 6% Interest Subvention'
        }
      ],
      checklist: [
        'Aadhaar Card linked with active mobile number',
        'Bank Passbook / Cancelled Cheque (Joint account or individual)',
        'Artisan Pehchan Card or Handicraft Weaver ID',
        'Declaration of active workshop or home loom setup'
      ]
    });
  };

  // =========================================================================
  // TAB 4: WORKING CAPITAL FORECASTER
  // =========================================================================
  const [forecastUnits, setForecastUnits] = useState(30);
  const [rawCostPerUnit, setRawCostPerUnit] = useState(850);
  const [wageCostPerUnit, setWageCostPerUnit] = useState(450);
  const [packCostPerUnit, setPackCostPerUnit] = useState(120);
  const [sellingPricePerUnit, setSellingPricePerUnit] = useState(2400);

  const totalCostPerUnit = rawCostPerUnit + wageCostPerUnit + packCostPerUnit;
  const totalCapitalNeeded = forecastUnits * totalCostPerUnit;
  const projectedRevenue = forecastUnits * sellingPricePerUnit;
  const projectedProfit = projectedRevenue - totalCapitalNeeded;
  const projectedMarginPct = projectedRevenue > 0 ? Math.round((projectedProfit / projectedRevenue) * 100) : 0;
  const breakEvenUnits = Math.ceil(totalCapitalNeeded / (sellingPricePerUnit || 1));

  return (
    <div className="financial-page">
      <div className="container">
        {/* Hero Banner with Audio Guide */}
        <div className="finance-hero-banner">
          <div className="finance-hero-top">
            <div>
              <div className="finance-badges-row">
                <span className="finance-badge gold">
                  <Coins size={14} />
                  {lang === 'hi' ? 'डिजिटल बहीखाता एवं AI सलाहकार' : 'Digital Bahi-Khata & AI Advisor'}
                </span>
                <span className="finance-badge green">
                  <ShieldCheck size={14} />
                  {lang === 'hi' ? 'PM विश्वकर्मा एवं मुद्रा सहायता' : 'PM Vishwakarma & Mudra Ready'}
                </span>
              </div>
              <h1 className="finance-hero-title">
                {lang === 'hi' ? 'कारीगर वित्तीय प्रबंधन एवं बहीखाता' : 'Artisan Financial Management & Bahi-Khata'}
              </h1>
              <p className="finance-hero-sub">
                {lang === 'hi'
                  ? 'पारदर्शी आय-व्यय बहीखाता, निष्पक्ष मूल्य निर्धारण, बैंक ऋण तत्परता स्कोर और सरकारी योजनाओं का संपूर्ण समाधान।'
                  : 'Empowering traditional craft masters with automated ledger bookkeeping, fair pricing guardrails, collateral-free scheme access, and seasonal working capital forecasting.'}
              </p>
            </div>

            <button
              className="finance-voice-listen-btn"
              onClick={() => {
                const msg = lang === 'hi'
                  ? `कारीगर सेतु वित्तीय केंद्र में आपका स्वागत है। आपका वर्तमान शुद्ध लाभ ₹${summary.netProfit} है, और क्रेडिट स्कोर ${summary.healthScore} है।`
                  : `Welcome to KarigarSeetu Financial Suite. Your net surplus is ₹${summary.netProfit}, and your credit readiness score is ${summary.healthScore}.`;
                speak(msg, lang === 'hi' ? 'hi' : 'en');
              }}
              title="Listen to audio overview"
            >
              <Volume2 size={18} />
              <span>{lang === 'hi' ? 'वित्तीय स्थिति सुनें (Audio)' : 'Listen to Financial Summary'}</span>
            </button>
          </div>
        </div>

        {/* 4 Top KPI Cards */}
        <div className="finance-kpi-grid">
          {/* Net Profit */}
          <div className="finance-kpi-card">
            <div className="kpi-header-row">
              <span className="kpi-title">{lang === 'hi' ? 'शुद्ध मासिक लाभ' : 'Net Monthly Surplus'}</span>
              <div className="kpi-icon-wrap green">
                <TrendingUp size={20} />
              </div>
            </div>
            <div className="kpi-value">
              ₹{summary.netProfit.toLocaleString('en-IN')}
            </div>
            <div className="kpi-foot-row positive">
              <CheckCircle2 size={14} />
              <span>{summary.profitMargin}% {lang === 'hi' ? 'लाभ मार्जिन' : 'Healthy Profit Margin'}</span>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="finance-kpi-card">
            <div className="kpi-header-row">
              <span className="kpi-title">{lang === 'hi' ? 'कुल बिक्री व आमदनी' : 'Gross Craft Revenue'}</span>
              <div className="kpi-icon-wrap blue">
                <Coins size={20} />
              </div>
            </div>
            <div className="kpi-value">
              ₹{summary.totalIncome.toLocaleString('en-IN')}
            </div>
            <div className="kpi-foot-row">
              <span>{lang === 'hi' ? 'मार्केटप्लेस व B2B थोक ऑर्डर' : 'Direct & B2B Orders'}</span>
            </div>
          </div>

          {/* Total Outflow */}
          <div className="finance-kpi-card">
            <div className="kpi-header-row">
              <span className="kpi-title">{lang === 'hi' ? 'उत्पादन व सामग्री व्यय' : 'Raw Material & Wages'}</span>
              <div className="kpi-icon-wrap orange">
                <TrendingDown size={20} />
              </div>
            </div>
            <div className="kpi-value">
              ₹{summary.totalExpense.toLocaleString('en-IN')}
            </div>
            <div className="kpi-foot-row">
              <span>{lang === 'hi' ? 'रेशम, ज़री, औजार मरम्मत' : 'Yarn, Zari, Loom Upkeep'}</span>
            </div>
          </div>

          {/* Credit Readiness */}
          <div className="finance-kpi-card">
            <div className="kpi-header-row">
              <span className="kpi-title">{lang === 'hi' ? 'ऋण तत्परता स्कोर' : 'Credit Readiness Score'}</span>
              <div className="kpi-icon-wrap purple">
                <Award size={20} />
              </div>
            </div>
            <div className="kpi-value">
              {summary.healthScore} <span style={{ fontSize: '1rem', color: '#968F84' }}>/ 900</span>
            </div>
            <div className="kpi-foot-row positive">
              <ShieldCheck size={14} />
              <span>{lang === 'hi' ? 'मुद्रा व विश्वकर्मा ऋण हेतु उपयुक्त' : 'Class-A Bank Ready'}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="finance-nav-tabs">
          <button
            className={`finance-tab-btn ${activeTab === 'advisor' ? 'active' : ''}`}
            onClick={() => setActiveTab('advisor')}
          >
            <Sparkles size={17} />
            <span>{lang === 'hi' ? 'AI वित्तीय सलाहकार' : 'AI Financial Advisor'}</span>
          </button>

          <button
            className={`finance-tab-btn ${activeTab === 'ledger' ? 'active' : ''}`}
            onClick={() => setActiveTab('ledger')}
          >
            <FileText size={17} />
            <span>{lang === 'hi' ? 'डिजिटल बहीखाता (Ledger)' : 'Digital Bahi-Khata Ledger'}</span>
          </button>

          <button
            className={`finance-tab-btn ${activeTab === 'schemes' ? 'active' : ''}`}
            onClick={() => setActiveTab('schemes')}
          >
            <Building2 size={17} />
            <span>{lang === 'hi' ? 'सरकारी योजनाएं एवं ऋण' : 'Govt Schemes & Subsidies'}</span>
          </button>

          <button
            className={`finance-tab-btn ${activeTab === 'forecaster' ? 'active' : ''}`}
            onClick={() => setActiveTab('forecaster')}
          >
            <Layers size={17} />
            <span>{lang === 'hi' ? 'कार्यशील पूंजी कैलकुलेटर' : 'Working Capital Forecaster'}</span>
          </button>

          <button
            className={`finance-tab-btn ${activeTab === 'credit' ? 'active' : ''}`}
            onClick={() => setActiveTab('credit')}
          >
            <CreditCard size={17} />
            <span>{lang === 'hi' ? 'बैंक रिपोर्ट व साख' : 'Credit Readiness Report'}</span>
          </button>
        </div>

        {/* Dynamic Tab Surface */}
        <div className="finance-content-surface">
          {/* TAB 1: AI FINANCIAL ADVISOR */}
          {activeTab === 'advisor' && (
            <div className="ai-advisor-layout">
              <div className="advisor-chat-pane">
                <div className="advisor-chat-messages">
                  {chatMessages.map(msg => (
                    <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
                      <div className="bubble-header">
                        <span className={`bubble-sender ${msg.sender === 'bot' ? 'bot-label' : 'user-label'}`}>
                          {msg.sender === 'bot' ? '✨ KarigarSeetu Financial AI' : 'Artisan'}
                        </span>
                        {msg.sender === 'bot' && (
                          <button
                            className="bubble-audio-btn"
                            onClick={() => speak(msg.text, lang === 'hi' ? 'hi' : 'en')}
                            title="Listen to this advice"
                          >
                            <Volume2 size={14} />
                          </button>
                        )}
                      </div>
                      <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>
                    </div>
                  ))}
                </div>

                <div className="advisor-chat-input-bar">
                  <input
                    type="text"
                    className="advisor-input"
                    placeholder={
                      lang === 'hi'
                        ? 'आर्थिक प्रश्न पूछें (जैसे: PM विश्वकर्मा लोन, साड़ी की लागत, GST नियम)...'
                        : 'Ask financial question (e.g. loan eligibility, saree cost, fair pricing)...'
                    }
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendMessage();
                    }}
                  />
                  <button
                    className={`mic-toggle-btn ${isRecording ? 'recording' : ''}`}
                    onClick={handleVoiceToggle}
                    title={isRecording ? 'Listening...' : 'Click to Speak (आवाज़ से पूछें)'}
                  >
                    <Mic size={18} />
                  </button>
                  <button
                    className="send-btn"
                    onClick={() => handleSendMessage()}
                    title="Send"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>

              {/* Side Pane: Quick Prompt Chips */}
              <div className="advisor-side-pane">
                <div className="preset-chip-box">
                  <h4>
                    <Sparkles size={16} color="var(--primary)" />
                    <span>{lang === 'hi' ? 'शीघ्र मार्गदर्शन प्रश्न' : 'Frequent Financial Questions'}</span>
                  </h4>
                  <div className="chips-list">
                    {quickPrompts.map(qp => (
                      <button
                        key={qp.id}
                        className="prompt-chip"
                        onClick={() => {
                          const question = lang === 'hi' ? qp.labelHi : qp.labelEn;
                          const answer = lang === 'hi' ? qp.replyHi : qp.replyEn;
                          
                          setChatMessages(prev => [
                            ...prev,
                            { id: `user-${Date.now()}`, sender: 'user', text: question, time: 'Just now' },
                            { id: `bot-${Date.now()}`, sender: 'bot', text: answer, time: 'Just now' }
                          ]);
                          speak(answer, lang === 'hi' ? 'hi' : 'en');
                        }}
                      >
                        {lang === 'hi' ? qp.labelHi : qp.labelEn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Artisan Guidance Note */}
                <div style={{
                  padding: '16px',
                  background: '#F0F7F4',
                  borderRadius: '12px',
                  border: '1px solid #C8E6C9',
                  fontSize: '0.84rem',
                  color: '#1B5E20',
                  lineHeight: '1.45'
                }}>
                  <strong>💡 {lang === 'hi' ? 'कारीगर सुरक्षा सलाह' : 'Artisan Financial Safety'}:</strong>
                  <p style={{ marginTop: '6px' }}>
                    {lang === 'hi'
                      ? 'कभी भी स्थानीय सूदखोरों (informal lenders) से 36% महंगे ब्याज पर ऋण न लें। PM विश्वकर्मा योजना में 5% रियायती ब्याज और कोई बंधक (collateral) नहीं लगता।'
                      : 'Avoid high-interest informal local lenders charging 30-36%. Always leverage PM Vishwakarma and Mudra schemes for official 5% subsidized interest.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BAHI-KHATA LEDGER */}
          {activeTab === 'ledger' && (
            <div>
              <div className="ledger-top-bar">
                {/* Filter categories */}
                <div className="ledger-filters">
                  <button
                    className={`filter-btn ${ledgerFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setLedgerFilter('all')}
                  >
                    {lang === 'hi' ? 'सभी लेनदेन' : 'All Entries'}
                  </button>
                  <button
                    className={`filter-btn ${ledgerFilter === 'income' ? 'active' : ''}`}
                    onClick={() => setLedgerFilter('income')}
                  >
                    {lang === 'hi' ? 'जमा (Income)' : 'Income (+) '}
                  </button>
                  <button
                    className={`filter-btn ${ledgerFilter === 'expense' ? 'active' : ''}`}
                    onClick={() => setLedgerFilter('expense')}
                  >
                    {lang === 'hi' ? 'निकासी (Expense)' : 'Expenses (-)'}
                  </button>
                  <button
                    className={`filter-btn ${ledgerFilter === 'raw_material' ? 'active' : ''}`}
                    onClick={() => setLedgerFilter('raw_material')}
                  >
                    {lang === 'hi' ? 'कच्चा माल' : 'Raw Materials'}
                  </button>
                  <button
                    className={`filter-btn ${ledgerFilter === 'wages' ? 'active' : ''}`}
                    onClick={() => setLedgerFilter('wages')}
                  >
                    {lang === 'hi' ? 'कारीगर मजदूरी' : 'Artisan Wages'}
                  </button>
                </div>

                {/* Search & Actions */}
                <div className="ledger-actions">
                  <div style={{ position: 'relative' }}>
                    <Search size={15} style={{ position: 'absolute', left: '10px', top: '9px', color: '#968F84' }} />
                    <input
                      type="text"
                      placeholder={lang === 'hi' ? 'खोजें...' : 'Search ledger...'}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        padding: '6px 12px 6px 32px',
                        borderRadius: '20px',
                        border: '1px solid var(--border-medium)',
                        fontSize: '0.84rem'
                      }}
                    />
                  </div>

                  <button className="btn btn-secondary" onClick={exportCSV} title="Export as CSV">
                    <Download size={15} />
                    <span>CSV</span>
                  </button>

                  <button className="btn btn-secondary" onClick={printStatement} title="Print Bahi-Khata Statement">
                    <Printer size={15} />
                    <span>{lang === 'hi' ? 'प्रिंट' : 'Print'}</span>
                  </button>

                  <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
                    <Plus size={16} />
                    <span>{lang === 'hi' ? '+ नया लेनदेन जोड़ें' : '+ Add Entry'}</span>
                  </button>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="ledger-table-wrap">
                <table className="ledger-table">
                  <thead>
                    <tr>
                      <th>{lang === 'hi' ? 'दिनांक' : 'Date'}</th>
                      <th>{lang === 'hi' ? 'विवरण' : 'Description'}</th>
                      <th>{lang === 'hi' ? 'प्रकार / श्रेणी' : 'Type / Category'}</th>
                      <th>{lang === 'hi' ? 'भुगतान विधि' : 'Payment Mode'}</th>
                      <th>{lang === 'hi' ? 'राशि (INR)' : 'Amount (₹)'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map(t => (
                      <tr key={t.id}>
                        <td style={{ whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>{t.date}</td>
                        <td>
                          <strong>{t.description}</strong>
                          {t.notes && <div style={{ fontSize: '0.78rem', color: '#716A60', marginTop: '2px' }}>{t.notes}</div>}
                        </td>
                        <td>
                          <span className={`type-pill ${t.type}`}>
                            {t.type === 'income' ? '● Income' : '▲ Expense'}
                          </span>
                          <span style={{ fontSize: '0.8rem', marginLeft: '8px', color: 'var(--text-secondary)' }}>
                            {t.category}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>{t.paymentMethod}</td>
                        <td className={`amount-col ${t.type}`}>
                          {t.type === 'income' ? '+' : '-'} ₹{Number(t.amount).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                    {filteredTransactions.length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                          No transactions found matching the selected filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Ledger Balance Footer */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                background: '#FAF8F4',
                borderRadius: '8px',
                border: '1px solid var(--border-light)'
              }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Total {filteredTransactions.length} entries recorded in KarigarSeetu Bahi-Khata
                </span>
                <span style={{ fontSize: '1.05rem', fontWeight: '700', color: summary.netProfit >= 0 ? '#2E7D32' : '#C62828' }}>
                  {lang === 'hi' ? 'कुल शुद्ध अवशेष' : 'Net Balance'}: ₹{summary.netProfit.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: GOVERNMENT SCHEMES & SUBSIDIES */}
          {activeTab === 'schemes' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h3 className="serif-title" style={{ fontSize: '1.5rem', marginBottom: '6px' }}>
                  {lang === 'hi' ? 'भारतीय कारीगर एवं बुनकर कल्याण योजनाएं' : 'National Artisan & Weaver Welfare Schemes'}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                  {lang === 'hi'
                    ? 'भारत सरकार द्वारा कारीगरों के लिए बिना किसी गारंटी (Zero Collateral) ऋण एवं आधुनिक टूलकिट अनुदान।'
                    : 'Curated central & state government schemes providing collateral-free credit, subsidized toolkits, and marketing support.'}
                </p>
              </div>

              {/* Scheme Cards Grid */}
              <div className="schemes-grid">
                {/* PM Vishwakarma */}
                <div className="scheme-card highlight">
                  <div>
                    <span className="scheme-badge-top">⭐ FLAGSHIP CENTRAL SCHEME</span>
                    <h4 className="scheme-name">PM Vishwakarma Yojana</h4>
                    <p className="scheme-tagline">
                      {lang === 'hi'
                        ? 'हथकरघा बुनकरों, मिट्टी, धातु व काष्ठ शिल्पकारों के लिए ₹3 लाख ऋण व ₹15,000 टूलकिट अनुदान।'
                        : 'Comprehensive support for traditional artisans with ₹3 Lakh subsidized loan and free modern toolkit.'}
                    </p>
                    <ul className="scheme-benefits-list">
                      <li>
                        <CheckCircle2 size={15} />
                        <span><strong>₹3,00,000 Loan:</strong> Tranche 1 (₹1L @ 5%) + Tranche 2 (₹2L @ 5%)</span>
                      </li>
                      <li>
                        <CheckCircle2 size={15} />
                        <span><strong>₹15,000 Tool Grant:</strong> E-voucher for modern cluster machinery</span>
                      </li>
                      <li>
                        <CheckCircle2 size={15} />
                        <span><strong>Skill Training:</strong> 5-7 days basic skill enhancement + ₹500/day stipend</span>
                      </li>
                      <li>
                        <CheckCircle2 size={15} />
                        <span><strong>Digital Incentive:</strong> ₹1 per digital transaction (up to 100 tx/month)</span>
                      </li>
                    </ul>
                  </div>
                  <a
                    href="https://pmvishwakarma.gov.in"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                  >
                    <span>{lang === 'hi' ? 'आधिकारिक पोर्टल पर आवेदन करें →' : 'Apply on PM Vishwakarma Portal →'}</span>
                  </a>
                </div>

                {/* Pradhan Mantri Mudra Yojana */}
                <div className="scheme-card">
                  <div>
                    <span className="scheme-badge-top">MICRO ENTERPRISE CREDIT</span>
                    <h4 className="scheme-name">Pradhan Mantri Mudra Yojana (PMMY)</h4>
                    <p className="scheme-tagline">
                      {lang === 'hi'
                        ? 'कार्यशाला विस्तार व उपकरण खरीद हेतु ₹10 लाख तक का ऋण बिना किसी बंधक (No Collateral).'
                        : 'Institutional credit up to ₹10 Lakhs for artisan workshop expansion with zero processing fee.'}
                    </p>
                    <ul className="scheme-benefits-list">
                      <li>
                        <CheckCircle2 size={15} />
                        <span><strong>Shishu Category:</strong> Loans up to ₹50,000 for raw material stock</span>
                      </li>
                      <li>
                        <CheckCircle2 size={15} />
                        <span><strong>Kishore Category:</strong> Loans ₹50,000 to ₹5,00,000 for pit-loom & studio</span>
                      </li>
                      <li>
                        <CheckCircle2 size={15} />
                        <span><strong>Tarun Category:</strong> ₹5,00,000 to ₹10,00,000 for cluster exporters</span>
                      </li>
                      <li>
                        <CheckCircle2 size={15} />
                        <span>Zero collateral or guarantor needed from public sector banks</span>
                      </li>
                    </ul>
                  </div>
                  <a
                    href="https://www.mudra.org.in"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary"
                    style={{ width: '100%' }}
                  >
                    <span>{lang === 'hi' ? 'मुद्रा पोर्टल जानकारी देखें' : 'View Mudra Guidelines'}</span>
                  </a>
                </div>

                {/* Artisan Credit Card (ACC) */}
                <div className="scheme-card">
                  <div>
                    <span className="scheme-badge-top">REVOLVING CREDIT LIMIT</span>
                    <h4 className="scheme-name">Artisan Credit Card (ACC)</h4>
                    <p className="scheme-tagline">
                      {lang === 'hi'
                        ? '3 वर्ष के लिए 6% ब्याज अनुदान के साथ ₹2 लाख तक की नकद साख सीमा (Cash Credit Limit).'
                        : 'Flexible cash credit limit up to ₹2 Lakhs with 6% interest subvention for working capital.'}
                    </p>
                    <ul className="scheme-benefits-list">
                      <li>
                        <CheckCircle2 size={15} />
                        <span>Revolving credit facility valid for 3 continuous years</span>
                      </li>
                      <li>
                        <CheckCircle2 size={15} />
                        <span>Government interest subvention of 6% for timely repayments</span>
                      </li>
                      <li>
                        <CheckCircle2 size={15} />
                        <span>Margin money assistance of up to ₹10,000 provided by Ministry</span>
                      </li>
                    </ul>
                  </div>
                  <button
                    className="btn btn-secondary"
                    style={{ width: '100%' }}
                    onClick={() => setActiveTab('forecaster')}
                  >
                    <span>{lang === 'hi' ? 'कार्यशील पूंजी आवश्यकता जांचें' : 'Check Working Capital Need'}</span>
                  </button>
                </div>
              </div>

              {/* Interactive Eligibility & Subsidy Checker */}
              <div className="eligibility-checker-box">
                <div className="checker-header">
                  <h3>{lang === 'hi' ? 'तत्काल योजना पात्रता कैलकुलेटर' : 'Instant Scheme Eligibility Calculator'}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                    {lang === 'hi'
                      ? 'अपनी शिल्प श्रेणी चुनें और तुरंत देखें कि आपको कितना सरकारी अनुदान और रियायती ऋण मिल सकता है।'
                      : 'Select your craft trade and annual turnover to check which collateral-free credit grants you qualify for.'}
                  </p>
                </div>

                <form onSubmit={calculateEligibility}>
                  <div className="checker-grid">
                    <div className="checker-field">
                      <label>{lang === 'hi' ? 'पारंपरिक शिल्प प्रकार' : 'Artisan Craft Category'}</label>
                      <select value={craftType} onChange={(e) => setCraftType(e.target.value)}>
                        <option value="handloom">Handloom Weaving & Textiles (हथकरघा बुनाई)</option>
                        <option value="pottery">Terracotta & Pottery (मिट्टी के बर्तन)</option>
                        <option value="woodcraft">Woodcraft & Carving (काष्ठ शिल्प)</option>
                        <option value="metal">Brass, Bronze & Bell Metal (धातु शिल्प)</option>
                        <option value="leather">Artisan Leather Craft (चर्म शिल्प)</option>
                        <option value="embroidery">Zardozi, Chikankari & Embroidery (कशीदाकारी)</option>
                      </select>
                    </div>

                    <div className="checker-field">
                      <label>{lang === 'hi' ? 'कारीगर पहचान पत्र (Pehchan ID)' : 'Do you have Artisan Pehchan ID?'}</label>
                      <select value={hasArtisanId} onChange={(e) => setHasArtisanId(e.target.value)}>
                        <option value="yes">Yes, Registered (हाँ, पंजीकृत है)</option>
                        <option value="no">No / In Progress (नहीं / अभी नहीं है)</option>
                      </select>
                    </div>

                    <div className="checker-field">
                      <label>{lang === 'hi' ? 'वार्षिक बिक्री कारोबार' : 'Annual Sales Turnover'}</label>
                      <select value={turnoverBracket} onChange={(e) => setTurnoverBracket(e.target.value)}>
                        <option value="under_10l">Under ₹10 Lakhs (सूक्ष्म शिल्पी)</option>
                        <option value="10l_to_25l">₹10 Lakhs - ₹25 Lakhs (क्लस्टर स्तर)</option>
                        <option value="above_25l">Above ₹25 Lakhs (थोक निर्यातक)</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary">
                    <CheckCircle2 size={16} />
                    <span>{lang === 'hi' ? 'पात्रता एवं लाभ की गणना करें' : 'Verify My Eligibility & Grants'}</span>
                  </button>
                </form>

                {schemeResult && (
                  <div style={{ marginTop: '24px' }}>
                    <div className="eligibility-result-alert">
                      <Award size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <strong style={{ fontSize: '1.05rem' }}>
                          🎉 {lang === 'hi' ? 'बधाई! आप PM विश्वकर्मा एवं मुद्रा योजना के लिए 100% पात्र हैं।' : 'Congratulations! You qualify for PM Vishwakarma & Mudra Schemes.'}
                        </strong>
                        <p style={{ marginTop: '6px', fontSize: '0.88rem' }}>
                          {lang === 'hi'
                            ? 'आप ₹15,000 का मुफ्त टूलकिट अनुदान और ₹3,00,000 तक का 5% ब्याज ऋण बिना किसी बैंक गारंटी के प्राप्त कर सकते हैं।'
                            : 'You are eligible for the ₹15,000 modern toolkit grant and up to ₹3,00,000 in 5% subsidized credit with zero collateral.'}
                        </p>
                      </div>
                    </div>

                    <div style={{ marginTop: '18px', background: '#FFFFFF', padding: '18px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                      <h4 style={{ fontSize: '0.92rem', marginBottom: '10px' }}>
                        📋 {lang === 'hi' ? 'बैंक शाखा हेतु आवश्यक दस्तावेज सूची' : 'Checklist of Documents Needed for Bank Application'}:
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                        {schemeResult.checklist.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem' }}>
                            <CheckCircle2 size={15} color="#2E7D32" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: WORKING CAPITAL & FESTIVE FORECASTER */}
          {activeTab === 'forecaster' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h3 className="serif-title" style={{ fontSize: '1.5rem', marginBottom: '6px' }}>
                  {lang === 'hi' ? 'कार्यशील पूंजी एवं त्योहारी सीजन पूर्वानुमान' : 'Working Capital & Festive Season Forecaster'}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                  {lang === 'hi'
                    ? 'त्योहारी सीजन (दिवाली, विवाह लग्न) के लिए आवश्यक कच्चा माल, मजदूरी पूंजी, संभावित बिक्री आय और न्यूनतम सुरक्षित बिक्री की गणना करें।'
                    : 'Simulate bulk production costs, raw material inventory buffers, break-even sales units, and net profit margins before starting a loom run.'}
                </p>
              </div>

              <div className="forecaster-layout">
                {/* Sliders Controls */}
                <div className="forecaster-controls">
                  {/* Production Units */}
                  <div className="control-item">
                    <label>
                      <span>{lang === 'hi' ? 'लक्ष्य उत्पादन इकाइयां (Pieces/Sarees):' : 'Target Production Batch (Units):'}</span>
                      <span className="val-preview">{forecastUnits} Units</span>
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="150"
                      step="5"
                      value={forecastUnits}
                      onChange={(e) => setForecastUnits(Number(e.target.value))}
                      className="control-slider"
                    />
                  </div>

                  {/* Raw Material Cost per unit */}
                  <div className="control-item">
                    <label>
                      <span>{lang === 'hi' ? 'कच्चा माल लागत प्रति इकाई (रेशम/धागा/ज़री):' : 'Raw Material Cost / Unit (Silk/Yarn/Zari):'}</span>
                      <span className="val-preview">₹{rawCostPerUnit}</span>
                    </label>
                    <input
                      type="range"
                      min="200"
                      max="3000"
                      step="50"
                      value={rawCostPerUnit}
                      onChange={(e) => setRawCostPerUnit(Number(e.target.value))}
                      className="control-slider"
                    />
                  </div>

                  {/* Artisan Labor Wages per unit */}
                  <div className="control-item">
                    <label>
                      <span>{lang === 'hi' ? 'कारीगर बुनाई मजदूरी प्रति इकाई:' : 'Artisan Weaving Wages / Unit:'}</span>
                      <span className="val-preview">₹{wageCostPerUnit}</span>
                    </label>
                    <input
                      type="range"
                      min="150"
                      max="2000"
                      step="50"
                      value={wageCostPerUnit}
                      onChange={(e) => setWageCostPerUnit(Number(e.target.value))}
                      className="control-slider"
                    />
                  </div>

                  {/* Packaging & Finishing per unit */}
                  <div className="control-item">
                    <label>
                      <span>{lang === 'hi' ? 'फिनिशिंग, GI टैग व पैकेजिंग:' : 'Finishing, GI Tag & Packaging / Unit:'}</span>
                      <span className="val-preview">₹{packCostPerUnit}</span>
                    </label>
                    <input
                      type="range"
                      min="30"
                      max="500"
                      step="10"
                      value={packCostPerUnit}
                      onChange={(e) => setPackCostPerUnit(Number(e.target.value))}
                      className="control-slider"
                    />
                  </div>

                  {/* Target Selling Price per unit */}
                  <div className="control-item">
                    <label>
                      <span>{lang === 'hi' ? 'अपेक्षित विक्रय मूल्य प्रति इकाई:' : 'Target Selling Price / Unit:'}</span>
                      <span className="val-preview">₹{sellingPricePerUnit}</span>
                    </label>
                    <input
                      type="range"
                      min="500"
                      max="6000"
                      step="100"
                      value={sellingPricePerUnit}
                      onChange={(e) => setSellingPricePerUnit(Number(e.target.value))}
                      className="control-slider"
                    />
                  </div>
                </div>

                {/* Real-time Calculation Output Card */}
                <div className="forecaster-output-card">
                  <div>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--text-primary)' }}>
                      📊 {lang === 'hi' ? 'पूर्वानुमान परिणाम' : 'Production Forecast Summary'}
                    </h4>

                    <div className="calc-stat-row">
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {lang === 'hi' ? 'कुल उत्पादन लागत प्रति पीस:' : 'Total Cost per Finished Unit:'}
                      </span>
                      <strong>₹{totalCostPerUnit.toLocaleString('en-IN')}</strong>
                    </div>

                    <div className="calc-stat-row">
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {lang === 'hi' ? 'आवश्यक कुल कार्यशील पूंजी:' : 'Total Working Capital Needed:'}
                      </span>
                      <strong style={{ color: '#E65100', fontSize: '1.05rem' }}>
                        ₹{totalCapitalNeeded.toLocaleString('en-IN')}
                      </strong>
                    </div>

                    <div className="calc-stat-row">
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {lang === 'hi' ? 'अनुमानित कुल बिक्री आय:' : 'Projected Gross Revenue:'}
                      </span>
                      <strong style={{ color: '#1565C0', fontSize: '1.05rem' }}>
                        ₹{projectedRevenue.toLocaleString('en-IN')}
                      </strong>
                    </div>

                    <div className="calc-stat-row total-bold">
                      <span>{lang === 'hi' ? 'अनुमानित शुद्ध लाभ (Net Profit):' : 'Projected Net Profit:'}</span>
                      <span>₹{projectedProfit.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="calc-stat-row">
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {lang === 'hi' ? 'लाभ प्रतिशत (Profit Margin %):' : 'Net Margin Percentage:'}
                      </span>
                      <span style={{
                        fontWeight: '700',
                        color: projectedMarginPct >= 25 ? '#2E7D32' : '#C62828'
                      }}>
                        {projectedMarginPct}% {projectedMarginPct >= 25 ? '(Healthy)' : '(Low Margin)'}
                      </span>
                    </div>

                    <div className="calc-stat-row">
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {lang === 'hi' ? 'लागत रिकवरी (Break-Even):' : 'Break-Even Units:'}
                      </span>
                      <strong>{breakEvenUnits} of {forecastUnits} Units</strong>
                    </div>
                  </div>

                  <div style={{
                    marginTop: '20px',
                    padding: '14px',
                    background: '#FBF4E4',
                    borderRadius: '8px',
                    fontSize: '0.84rem',
                    color: '#8A6414',
                    border: '1px solid #EAD8B1'
                  }}>
                    💡 <strong>{lang === 'hi' ? 'त्योहारी सीजन सुरक्षा बफर' : 'Safety Reserve Recommendation'}:</strong>
                    <div style={{ marginTop: '4px' }}>
                      {lang === 'hi'
                        ? `कच्चे माल की कीमतों में अप्रत्याशित वृद्धि से बचने के लिए कम से कम ₹${Math.round(totalCapitalNeeded * 0.15).toLocaleString('en-IN')} का अतिरिक्त बफर रिज़र्व रखें।`
                        : `Maintain an emergency cash buffer of ₹${Math.round(totalCapitalNeeded * 0.15).toLocaleString('en-IN')} (15%) to absorb seasonal yarn price fluctuations.`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CREDIT READINESS & BANKABILITY REPORT */}
          {activeTab === 'credit' && (
            <div>
              <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <h3 className="serif-title" style={{ fontSize: '1.5rem', marginBottom: '6px' }}>
                    {lang === 'hi' ? 'कारीगर साख एवं बैंक तत्परता रिपोर्ट' : 'Artisan Credit Readiness & Bankability Report'}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                    {lang === 'hi'
                      ? 'स्थानीय बैंक शाखा प्रबंधक या सहकारिता समिति को दिखाने योग्य सत्यापित वित्तीय साख प्रमाणपत्र।'
                      : 'Audited digital transaction track record ready to submit to SBI/PNB branch managers for fast-track credit approval.'}
                  </p>
                </div>

                <button className="btn btn-primary" onClick={printStatement}>
                  <Printer size={16} />
                  <span>{lang === 'hi' ? 'आधिकारिक बैंक रिपोर्ट प्रिंट करें' : 'Print Bank Verification Certificate'}</span>
                </button>
              </div>

              <div className="credit-report-wrap">
                {/* Meter Box */}
                <div className="credit-meter-box">
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>
                    KARIGAR CREDIT INDEX
                  </span>
                  
                  <div className="score-circle">
                    <span className="score-number">{summary.healthScore}</span>
                    <span className="score-max">OUT OF 900</span>
                  </div>

                  <span style={{
                    background: '#E8F5E9',
                    color: '#2E7D32',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontWeight: '700',
                    fontSize: '0.84rem'
                  }}>
                    CLASS-A • BANK READY
                  </span>

                  <p style={{ marginTop: '14px', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                    {lang === 'hi'
                      ? 'आपका डिजिटल लेनदेन इतिहास निरंतर सकारात्मक लाभ और विश्वसनीय आपूर्ति को दर्शाता है।'
                      : 'Your consistent digital turnover and healthy 30%+ profit margin place you in the lowest credit risk tier.'}
                  </p>
                </div>

                {/* Factors List */}
                <div className="credit-factors-list">
                  <div className="factor-card">
                    <div className="factor-icon">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.94rem', marginBottom: '4px' }}>
                        {lang === 'hi' ? 'डिजिटल यूपीआई / एनईएफटी लेन-देन (100% पारदर्शी)' : 'Digital UPI / NEFT Transaction Cadence'}
                      </h4>
                      <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                        {lang === 'hi'
                          ? 'सभी थोक अग्रिम और सामग्री भुगतान सीधे बैंक खाते से लिंक हैं, जिससे बैंक में आय प्रमाण आसानी से सिद्ध होता है।'
                          : 'Recorded transactions carry verified bank / UPI footprints, providing solid proof of business turnover.'}
                      </p>
                    </div>
                  </div>

                  <div className="factor-card">
                    <div className="factor-icon">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.94rem', marginBottom: '4px' }}>
                        {lang === 'hi' ? 'सकारात्मक मासिक मुनाफा (>25%)' : 'Consistent Monthly Profit Margin (>25%)'}
                      </h4>
                      <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                        Current net profit margin of {summary.profitMargin}% exceeds standard micro-enterprise benchmark of 18%.
                      </p>
                    </div>
                  </div>

                  <div className="factor-card">
                    <div className="factor-icon">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.94rem', marginBottom: '4px' }}>
                        {lang === 'hi' ? 'B2B थोक निर्यात एवं आर्डर पूर्ति' : 'B2B Wholesale Fulfillment Record'}
                      </h4>
                      <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                        Active FabCraft Global export order pipeline provides guaranteed forward cash flows.
                      </p>
                    </div>
                  </div>

                  <div className="factor-card">
                    <div className="factor-icon">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.94rem', marginBottom: '4px' }}>
                        {lang === 'hi' ? 'सरकारी जीआई प्रमाणीकरण (#MP-8201)' : 'GI Craft Master Artisan Certification'}
                      </h4>
                      <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                        Officially tagged cluster member with authenticated geographical indication pedigree.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Transaction Modal */}
      {isAddModalOpen && (
        <div className="finance-modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="finance-modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3>{lang === 'hi' ? 'नई बहीखाता प्रविष्टि जोड़ें' : 'Add Bahi-Khata Ledger Entry'}</h3>
              <button onClick={() => setIsAddModalOpen(false)} style={{ cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddTransactionSubmit} className="modal-body">
              {/* Type toggle */}
              <div className="form-group">
                <label>{lang === 'hi' ? 'लेनदेन प्रकार' : 'Transaction Type'}</label>
                <div className="type-toggle-group">
                  <button
                    type="button"
                    className={`type-toggle-btn ${newTx.type === 'income' ? 'active income' : ''}`}
                    onClick={() => setNewTx(prev => ({ ...prev, type: 'income' }))}
                  >
                    + Income (जमा / बिक्री)
                  </button>
                  <button
                    type="button"
                    className={`type-toggle-btn ${newTx.type === 'expense' ? 'active expense' : ''}`}
                    onClick={() => setNewTx(prev => ({ ...prev, type: 'expense' }))}
                  >
                    - Expense (खर्च / निकासी)
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label>{lang === 'hi' ? 'विवरण' : 'Description / Item Name'}</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={lang === 'hi' ? 'उदा. कच्चा शहतूत रेशम या साड़ी बिक्री' : 'e.g. Mulberry raw silk yarn or Saree sale'}
                  value={newTx.description}
                  onChange={(e) => setNewTx(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>

              {/* Category */}
              <div className="form-group">
                <label>{lang === 'hi' ? 'श्रेणी' : 'Category'}</label>
                <select
                  className="form-control"
                  value={newTx.category}
                  onChange={(e) => setNewTx(prev => ({ ...prev, category: e.target.value }))}
                >
                  <option value="Raw Materials">Raw Materials (कच्चा माल - धागा/रेशम/रंग)</option>
                  <option value="Artisan Wages">Artisan Wages (कारीगर मजदूरी / सहायक)</option>
                  <option value="Tool & Loom Maintenance">Tool & Loom Maintenance (करघा व औजार)</option>
                  <option value="Packaging & Logistics">Packaging & Logistics (पैकेजिंग)</option>
                  <option value="Direct Marketplace">Direct Marketplace Sale (सीधी बिक्री)</option>
                  <option value="B2B Wholesale">B2B Wholesale Sale (थोक ऑर्डर)</option>
                  <option value="Exhibition & Haat">Exhibition & Haat (प्रदर्शनी / मेला)</option>
                  <option value="Misc">Misc. Workshop Expense</option>
                </select>
              </div>

              {/* Amount */}
              <div className="form-group">
                <label>{lang === 'hi' ? 'राशि (INR ₹)' : 'Amount (₹)'}</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  placeholder="₹ Amount"
                  value={newTx.amount}
                  onChange={(e) => setNewTx(prev => ({ ...prev, amount: e.target.value }))}
                  required
                />
              </div>

              {/* Payment Mode */}
              <div className="form-group">
                <label>{lang === 'hi' ? 'भुगतान विधि' : 'Payment Method'}</label>
                <select
                  className="form-control"
                  value={newTx.paymentMethod}
                  onChange={(e) => setNewTx(prev => ({ ...prev, paymentMethod: e.target.value }))}
                >
                  <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                  <option value="Bank Transfer (NEFT)">Bank Transfer (NEFT / IMPS)</option>
                  <option value="Cash">Cash (नकद)</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              {/* Notes */}
              <div className="form-group">
                <label>{lang === 'hi' ? 'अतिरिक्त टिप्पणी' : 'Optional Notes'}</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Bill #821 or buyer contact"
                  value={newTx.notes}
                  onChange={(e) => setNewTx(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Save to Bahi-Khata
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
