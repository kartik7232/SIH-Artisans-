/**
 * KARIGARAI — B2B MARKET LINKAGE & AI BUYER MATCHING
 * Data model for institutional buyers, bulk requirements, and AI matching
 */

export const buyerTypes = [
  { id: "retailer", label: "Retail Brands & Boutiques" },
  { id: "hotel", label: "Luxury Heritage Hotels & Resorts" },
  { id: "designer", label: "Fashion & Interior Designers" },
  { id: "corporate", label: "Corporate Gifting & ESG" },
  { id: "government", label: "Government Emporiums & PSUs" },
  { id: "exporter", label: "Fair-Trade Global Exporters" }
];

export const sampleRequirements = [
  {
    id: "req-1",
    title: "500 Handwoven Bamboo Food Covers & Bazaar Baskets for Eco-Resorts",
    buyerName: "CGH Earth Eco-Resorts & Spas",
    buyerType: "Luxury Hotel",
    productType: "Bamboo & Cane Kitchenware",
    quantity: 500,
    budgetPerUnit: "₹300 - ₹380",
    totalBudget: "₹1,50,000 - ₹1,90,000",
    targetCraft: "Assam Bamboo & Cane Weaving",
    deliveryLocation: "Goa & Kochi",
    leadTimeDays: 30,
    postedDate: "1 day ago",
    status: "Active Matching",
    image: "/assets/culture/crafts/bamboo-bazaar-baskets.jpg",
    description: "Seeking 500 handwoven conical food cloches and wicker bazaar baskets. Zero-plastic dining showcase for luxury eco-resort dining villas.",
    topMatch: {
      artisanId: "subrata-roy",
      artisanName: "Majuli Island Bamboo Guild",
      matchScore: 96,
      matchReasons: [
        "100% natural Muli bamboo & cane binding",
        "Monthly cluster capacity: 1,200 units (Req: 500)",
        "Within client budget (₹340 quoted)",
        "GI-certified North East craft producer"
      ]
    }
  },
  {
    id: "req-2",
    title: "250 Hand-Braided Sarkanda Mudda Seating Stools for Heritage Haveli",
    buyerName: "Suryagarh Hospitality Interiors",
    buyerType: "Luxury Hotel",
    productType: "Handcrafted Seating & Ottomans",
    quantity: 250,
    budgetPerUnit: "₹500 - ₹650",
    totalBudget: "₹1,25,000 - ₹1,62,500",
    targetCraft: "Sarkanda & Reed Furniture",
    deliveryLocation: "Jaisalmer & Jaipur, Rajasthan",
    leadTimeDays: 40,
    postedDate: "3 days ago",
    status: "Under Negotiation",
    image: "/assets/culture/crafts/sarkanda-mudda-stools.jpg",
    description: "Custom geometric multi-color braided Mudda stools for rooftop courtyards and sunset terraces.",
    topMatch: {
      artisanId: "suresh-sharma",
      artisanName: "Farrukhnagar Mudda Craft Guild",
      matchScore: 94,
      matchReasons: [
        "Specialist in radial reed trussing & multi-color jute weave",
        "Direct cluster delivery (Farrukhnagar to Jaipur)",
        "Capacity: 500 units/month (Req: 250)",
        "Weather-tested outdoor suitability"
      ]
    }
  },
  {
    id: "req-3",
    title: "1,200 Vibrant Handwoven Bamboo Pankha Fans for ESG Summer Favors",
    buyerName: "Tata Consultancy Services ESG Initiative",
    buyerType: "Corporate",
    productType: "Bamboo Sliver Hand Fans",
    quantity: 1200,
    budgetPerUnit: "₹95 - ₹120",
    totalBudget: "₹1,14,000 - ₹1,44,000",
    targetCraft: "Bamboo Sliver Weaving",
    deliveryLocation: "New Delhi & Mumbai",
    leadTimeDays: 20,
    postedDate: "4 days ago",
    status: "Active Matching",
    image: "/assets/culture/crafts/handwoven-bamboo-pankha.jpg",
    description: "Seeking 1,200 vivid geometric hand fans dyed with natural herbal pigments. Artisan storytelling tags with QR link to rural women weaver profiles.",
    topMatch: {
      artisanId: "kanta-bai",
      artisanName: "Mithila Folk Bamboo Collective",
      matchScore: 97,
      matchReasons: [
        "Direct rural women artisan cluster",
        "Vivid natural herbal dye recipes",
        "Cluster monthly capacity: 3,500 units (Req: 1,200)",
        "Fair-trade price transparently routed to makers"
      ]
    }
  },
  {
    id: "req-4",
    title: "400 Cylindrical Bamboo Storage Jars with Airtight Woven Lids",
    buyerName: "Ananya Organic Kitchens & Stores",
    buyerType: "Retail Brands & Boutiques",
    productType: "Eco Storage Jars",
    quantity: 400,
    budgetPerUnit: "₹350 - ₹420",
    totalBudget: "₹1,40,000 - ₹1,68,000",
    targetCraft: "Bamboo Storage Craft",
    deliveryLocation: "Bengaluru, Karnataka",
    leadTimeDays: 25,
    postedDate: "1 week ago",
    status: "Active Matching",
    image: "/assets/culture/crafts/bamboo-storage-containers.jpg",
    description: "Airtight cylindrical bamboo food storage canisters for loose organic tea and spice display.",
    topMatch: {
      artisanId: "subrata-roy",
      artisanName: "Barpeta Bamboo Collective SHG",
      matchScore: 92,
      matchReasons: [
        "Smoked termite-proof bamboo seasoning",
        "Snug woven interlocking lid seal",
        "Cluster capacity: 800 units/month (Req: 400)"
      ]
    }
  },
  {
    id: "req-5",
    title: "600 Traditional Bamboo Winnowing Trays (Supa)",
    buyerName: "Gramin Khadi & Agro Packaging",
    buyerType: "Government Emporiums & PSUs",
    productType: "Village Agricultural Handcraft",
    quantity: 600,
    budgetPerUnit: "₹160 - ₹200",
    totalBudget: "₹96,000 - ₹1,20,000",
    targetCraft: "Bamboo Winnowing & Sifting",
    deliveryLocation: "Lucknow & Varanasi, Uttar Pradesh",
    leadTimeDays: 35,
    postedDate: "2 weeks ago",
    status: "Contract Closed",
    image: "/assets/culture/crafts/bamboo-winnowing-trays.jpg",
    description: "Traditional bamboo winnowing trays (supa) for agro-packaging and heritage festival displays.",
    topMatch: {
      artisanId: "subrata-roy",
      artisanName: "Purulia Tribal Bamboo Artisan SHG",
      matchScore: 90,
      matchReasons: [
        "Traditional tight twill weave technique",
        "Smoke-cured durability",
        "Cluster capacity: 2,000 units/month"
      ]
    }
  }
];

export default { buyerTypes, sampleRequirements };
