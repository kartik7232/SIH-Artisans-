/**
 * KARIGARAI — FROM EARTH TO ART: MATERIAL TAXONOMY
 * Data model for 12+ natural materials, techniques, and regions
 */

export const materials = [
  {
    id: "cotton",
    name: "Desi Handspun Cotton",
    hindiName: "देसी खादी व सूत",
    category: "Natural Fibre",
    origin: "Vidarbha, Gujarat, Bengal & Andhra",
    description: "Indigenous indigenous short and medium staple cotton spun on traditional charkhas. Breathable, durable, and softens with every wash.",
    sustainability: "100% Biodegradable, rain-fed organic farming",
    craftsAssociated: ["Khadi Weaving", "Bagru Block Printing", "Jamdani", "Chikankari"],
    carbonFootprint: "Minimal / Zero chemical fertilizers",
    image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "silk",
    name: "Pure Mulberry & Katan Silk",
    hindiName: "शुद्ध शहतूत व कातन रेशम",
    category: "Natural Fibre",
    origin: "Karnataka, Varanasi & Malda (Bengal)",
    description: "Lustrous protein filament reeled from silkworm cocoons, celebrated for its natural drape, tensile strength, and royal shimmer.",
    sustainability: "Natural organic protein fiber",
    craftsAssociated: ["Banarasi Brocade", "Pochampally Ikat", "Chanderi", "Mysore Silk"],
    carbonFootprint: "Handloom reeled, zero synthetic polyester",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "muga-silk",
    name: "Golden Muga Wild Silk",
    hindiName: "असमिया मूगा सिल्क",
    category: "Wild / Peace Silk",
    origin: "Assam Brahmaputra Valley",
    description: "Exclusive to Assam, this rare wild silk has a natural amber-golden sheen that outlasts the wearer and actually increases in luster with washing.",
    sustainability: "Wild forest harvested, eco-friendly silkworm host trees",
    craftsAssociated: ["Mekhela Chador", "Sualkuchi Weaving", "Royal Bihu Robes"],
    carbonFootprint: "Forest-derived indigenous cultivation",
    image: "https://images.unsplash.com/photo-1610030469668-932d5668e1a1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "cashmere-wool",
    name: "Changthangi Pashm & Wool",
    hindiName: "पश्मीना व चांगथांगी ऊन",
    category: "Animal Fibre",
    origin: "Changthang Plateau, Ladakh & Kashmir",
    description: "Ultra-fine underfleece harvested by hand combing from high-altitude Capra Hircus goats grazing above 14,000 feet.",
    sustainability: "Cruelty-free hand-combed seasonal molting",
    craftsAssociated: ["Kashmiri Pashmina", "Kani Shawls", "Ladakhi Pattus"],
    carbonFootprint: "Pastoral nomadic regenerative grazing",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "clay",
    name: "Alluvial Clay & Terracotta",
    hindiName: "जलोढ़ मिट्टी व टेराकोटा",
    category: "Earth & Mineral",
    origin: "River basins of Ganga, Sanjariya & Bankura",
    description: "Fine, plastic mineral-rich clay dug from sacred river beds and lake beds, hand-kneaded and wheel-thrown or coil-molded.",
    sustainability: "100% natural earth returned to soil upon lifecycle end",
    craftsAssociated: ["Bankura Terracotta", "Molela Terracotta Plaques", "Dabu Mud-Resist"],
    carbonFootprint: "Sun-dried and low-energy wood kilns",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "quartz-glass",
    name: "Powdered Quartz & Egyptian Paste",
    hindiName: "क्वार्ट्ज चूर्ण व कांच पेस्ट",
    category: "Ceramic Composite",
    origin: "Jaipur, Rajasthan",
    description: "Ground quartz stones blended with scrap glass, gum, and fuller's earth that creates Jaipur's famous non-clay ceramic body.",
    sustainability: "Recycles local quartz and discarded soda-lime glass",
    craftsAssociated: ["Jaipur Blue Pottery", "Cobalt Glazes"],
    carbonFootprint: "Single low-fire baking cycle",
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "bamboo-cane",
    name: "Golden Bamboo & Rattan Cane",
    hindiName: "बांस व बेंत",
    category: "Plant Fibre",
    origin: "Assam, Tripura, Nagaland & Meghalaya",
    description: "Fast-growing giant grass with incredible tensile strength, split into razor-thin ribbons and hand-woven into baskets and masks.",
    sustainability: "Rapidly renewable, regenerates in 3-5 years without replanting",
    craftsAssociated: ["Majuli Mask Making", "Northeast Cane Basketry", "Bamboo Furniture"],
    carbonFootprint: "Carbon negative growth cycle",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "brass-bronze",
    name: "Scrap Brass & Bell Metal (Kansa)",
    hindiName: "पीतल, कांसा व बेल मेटल",
    category: "Metal & Metallurgy",
    origin: "Bastar, Moradabad, Sarthebari & Mayurbhanj",
    description: "Resonant copper-tin and copper-zinc alloys valued for Ayurvedic acoustic and health properties and lost-wax casting.",
    sustainability: "100% infinitely recyclable scrap metal melted down",
    craftsAssociated: ["Dhokra Lost-Wax Casting", "Moradabad Engraving", "Bell Metal Utensils"],
    carbonFootprint: "Recycled scrap based metallurgy",
    image: "https://images.unsplash.com/photo-1601056641804-316ddf833e76?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "natural-indigo",
    name: "True Indigo & Vegetable Mordants",
    hindiName: "प्राकृतिक नील व वनस्पति रंग",
    category: "Organic Dye",
    origin: "Tamil Nadu, Gujarat & Rajasthan",
    description: "Extracted by fermenting leaves of Indigofera Tinctoria, combined with turmeric, madder root (Manjistha), and pomegranate peels.",
    sustainability: "Zero toxic petrochemical effluents; greywater fertilizes fields",
    craftsAssociated: ["Ajrakh Printing", "Bagru Dabu Dyeing", "Kalamkari"],
    carbonFootprint: "Agricultural closed-loop circular system",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "wood-teak-sheesham",
    name: "Teak, Sheesham & Ivory Wood",
    hindiName: "सागवान, शीशम व आले मारा",
    category: "Hardwood & Softwood",
    origin: "Saharanpur, Karnataka, Rajasthan & Bastar",
    description: "Seasoned hardwoods carved into block-printing matrices, and soft ivory wood (Wrightia Tinctoria) safe for children's toys.",
    sustainability: "Responsibly managed agroforestry wood with natural lac glazes",
    craftsAssociated: ["Woodblock Carving", "Channapatna Lacquerware", "Saharanpur Inlay"],
    carbonFootprint: "Biodegradable, carbon sequestering",
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "jute",
    name: "Golden Jute Fibre",
    hindiName: "सुनहरा पटसन / जूट",
    category: "Bast Fibre",
    origin: "Bengal & Assam Delta",
    description: "Silky, lustrous plant stem fiber celebrated as India's 'Golden Fibre' for its exceptional tensile resilience and natural coarse texture.",
    sustainability: "Grown in monsoon floods with zero synthetic irrigation",
    craftsAssociated: ["Bengal Jute Braiding", "Macramé", "Craft Rugs", "Storage Baskets"],
    carbonFootprint: "High carbon-absorbing crop",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "silver-wire",
    name: "Fine Inlay Silver (Chandi Ka Taar)",
    hindiName: "चांदी का महीन तार",
    category: "Precious Metal",
    origin: "Bidar (Karnataka) & Cuttack (Odisha)",
    description: "99.9% pure silver wire drawn through microscopic gauge plates to hammer into Bidri zinc grooves or solder into Tarakasi filigree.",
    sustainability: "Non-corrosive, non-toxic heirloom metal",
    craftsAssociated: ["Bidriware Silver Inlay", "Cuttack Tarakasi Filigree"],
    carbonFootprint: "Long lasting heirloom durability",
    image: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=600&q=80"
  }
];

export default materials;
