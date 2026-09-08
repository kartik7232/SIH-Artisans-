import artisanCompositeMasterpiece from "../assets/culture/wallpapers/artisan-composite-masterpiece.jpg";
import masterArtisanLoupe from "../assets/culture/imagery/master-artisan-craftsman.jpg";
import batikWomenWeavers from "../assets/culture/imagery/batik-women-weavers.png";
import artisanHandsCircle from "../assets/culture/illustrations/artisan-hands-circle.png";
import mangalgiriHeritageStory from "../assets/culture/imagery/mangalgiri-heritage-story.jpg";
import artisanPanorama from "../assets/culture/wallpapers/artisan-panorama.jpg";

// Newly uploaded artisan craft images
import bambooBasketWeaving from "../assets/culture/crafts/bamboo-basket-weaving.jpg";
import enameledCopperPottery from "../assets/culture/crafts/enameled-copper-pottery.jpg";
import tribalTerracottaLamp from "../assets/culture/crafts/tribal-terracotta-lamp.jpg";
import kashmiriAariEmbroidery from "../assets/culture/crafts/kashmiri-aari-embroidery.jpg";
import jaipurBluePotteryArtisan from "../assets/culture/crafts/jaipur-blue-pottery-artisan.jpg";

// Authentic bamboo, wicker, sarkanda & handicraft artisan photos
import bambooBazaarBaskets from "../assets/culture/crafts/bamboo-bazaar-baskets.jpg";
import bambooWinnowingTrays from "../assets/culture/crafts/bamboo-winnowing-trays.jpg";
import sarkandaMuddaStools from "../assets/culture/crafts/sarkanda-mudda-stools.jpg";
import handwovenBambooPankha from "../assets/culture/crafts/handwoven-bamboo-pankha.jpg";
import bambooStorageContainers from "../assets/culture/crafts/bamboo-storage-containers.jpg";
import artisanVillageMural from "../assets/artisan-village-mural.jpg";

// Curated Atelier & Bazaar showcases
import wovenCaneBazaar from "../assets/culture/curations/woven-cane-bazaar.jpg";
import carvedWoodHeirlooms from "../assets/culture/curations/carved-wood-heirlooms.jpg";
import royalCraftEmporium from "../assets/culture/curations/royal-craft-emporium.jpg";

export const cultureAssets = {
  wallpapers: {
    compositeMasterpiece: artisanCompositeMasterpiece,
    artisanHeritage: artisanCompositeMasterpiece,
    artisanPanorama: artisanPanorama,
    artisanVillageMural: artisanVillageMural,
    villageMural: "/assets/culture/wallpapers/artisan-village-mural.jpg",
    publicUrl: "/artisan-composite-masterpiece.jpg"
  },

  imagery: {
    masterArtisanLoupe: masterArtisanLoupe,
    batikWomenWeavers: batikWomenWeavers,
    artisanHandsCircle: artisanHandsCircle,
    mangalgiriHeritageStory: mangalgiriHeritageStory
  },

  curations: {
    wovenCaneBazaar: wovenCaneBazaar,
    carvedWoodHeirlooms: carvedWoodHeirlooms,
    royalCraftEmporium: royalCraftEmporium
  },

  crafts: {
    bambooBasketWeaving: bambooBasketWeaving,
    enameledCopperPottery: enameledCopperPottery,
    tribalTerracottaLamp: tribalTerracottaLamp,
    kashmiriAariEmbroidery: kashmiriAariEmbroidery,
    jaipurBluePotteryArtisan: jaipurBluePotteryArtisan,
    bambooBazaarBaskets: bambooBazaarBaskets,
    bambooWinnowingTrays: bambooWinnowingTrays,
    sarkandaMuddaStools: sarkandaMuddaStools,
    handwovenBambooPankha: handwovenBambooPankha,
    bambooStorageContainers: bambooStorageContainers
  },

  buyer: {
    heroShowcase: bambooBazaarBaskets,
    bambooBazaarBaskets: bambooBazaarBaskets,
    bambooWinnowingTrays: bambooWinnowingTrays,
    sarkandaMuddaStools: sarkandaMuddaStools,
    handwovenBambooPankha: handwovenBambooPankha,
    bambooStorageContainers: bambooStorageContainers,
    clusters: [
      {
        id: 'cluster-bamboo-bazaar',
        name: 'Assam Bamboo & Wicker Bazaar Guild',
        hindiName: 'असम बांस व केन बाजार शिल्प संघ',
        craft: 'Bamboo & Cane Weaving',
        region: 'Barpeta & Majuli, Assam',
        image: bambooBazaarBaskets,
        moq: '50 units',
        capacity: '1,200 units / mo',
        priceBand: '₹280 – ₹450',
        leadTime: '15–20 Days',
        speciality: 'Conical food covers, woven bazaar baskets, wicker trays',
        giCertified: true
      },
      {
        id: 'cluster-winnowing-trays',
        name: 'Traditional Bamboo Winnowing Trays (Supa)',
        hindiName: 'पारंपरिक बांस सूप व अनाज टोकरी समूह',
        craft: 'Bamboo Winnowing & Sifting Weave',
        region: 'Purulia, West Bengal & Bihar',
        image: bambooWinnowingTrays,
        moq: '100 units',
        capacity: '2,000 units / mo',
        priceBand: '₹120 – ₹220',
        leadTime: '10–15 Days',
        speciality: 'Eco-friendly grain winnowing trays, ritual supa, rustic shallow baskets',
        giCertified: true
      },
      {
        id: 'cluster-sarkanda-mudda',
        name: 'Heritage Sarkanda Mudda Seating Guild',
        hindiName: 'सरकंडा मुड्डा हस्तनिर्मित बैठक समूह',
        craft: 'Wild Reed & Grass Furniture Weaving',
        region: 'Farrukhnagar, Haryana Craft Belt',
        image: sarkandaMuddaStools,
        moq: '25 units',
        capacity: '500 units / mo',
        priceBand: '₹450 – ₹750',
        leadTime: '20–25 Days',
        speciality: 'Hand-braided colorful Mudda stools, courtyard ottomans, eco seating',
        giCertified: true
      },
      {
        id: 'cluster-bamboo-pankha',
        name: 'Geometric Handwoven Bamboo Pankha Collective',
        hindiName: 'हस्तनिर्मित रंग-बिरंगा बांस पंखा समूह',
        craft: 'Bamboo Sliver Geometric Weaving',
        region: 'Madhubani & Darbhanga, Bihar',
        image: handwovenBambooPankha,
        moq: '100 units',
        capacity: '3,500 units / mo',
        priceBand: '₹85 – ₹160',
        leadTime: '10–14 Days',
        speciality: 'Vivid dyed geometric patterns, natural cane handles, ESG wedding favors',
        giCertified: true
      },
      {
        id: 'cluster-bamboo-storage',
        name: 'Cylindrical Bamboo Storage & Kitchen Canisters',
        hindiName: 'बांस भंडारण जार व ढक्कनदार टोकरियां',
        craft: 'Airtight Bamboo Plaiting & Joinery',
        region: 'Nalbari & Guwahati, Assam',
        image: bambooStorageContainers,
        moq: '40 units',
        capacity: '800 units / mo',
        priceBand: '₹320 – ₹550',
        leadTime: '15–18 Days',
        speciality: 'Smoked termite-proof grain jars, spice storage canisters with woven lids',
        giCertified: true
      }
    ]
  },

  hero: {
    primaryArtwork: artisanCompositeMasterpiece,
    eyebrow: "CELEBRATING INDIA'S CRAFTSMANSHIP",
    titleLine1: "INDIA,",
    titleLine2: "MADE BY HAND.",
    description: "Every craft carries generations of sacred knowledge. KarigarAI turns your single physical product photo and mother-tongue voice into a world-class digital catalogue, smart pricing, and direct market access.",
    primaryCta: "Explore Artisan Crafts",
    secondaryCta: "Start AI Product Studio"
  },

  footer: {
    artwork: artisanCompositeMasterpiece,
    quote: "Technology should not replace tradition. It should help tradition travel further.",
    subquote: "Empowering rural weavers, potters, sculptors, and craft clusters with voice-first artificial intelligence."
  },

  studio: {
    backgroundArtwork: artisanCompositeMasterpiece,
    handsArtwork: artisanHandsCircle,
    watermarkOpacity: 0.07
  }
};

export default cultureAssets;
