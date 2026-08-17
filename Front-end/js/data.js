/**
 * Electro Shop - Product Catalog & Static Seed Dataset
 * Compatible with Backend Schema: { id, category, name, description, price }
 */

const CATEGORIES = [
  { id: "all", name: "All Categories", icon: "fas fa-th-large", count: 24 },
  { id: "laptops", name: "Laptops & Computers", icon: "fas fa-laptop", count: 5 },
  { id: "smartphones", name: "Smartphones & Tablets", icon: "fas fa-mobile-alt", count: 4 },
  { id: "audio", name: "Audio & Headphones", icon: "fas fa-headphones-alt", count: 4 },
  { id: "gaming", name: "Gaming & Esports", icon: "fas fa-gamepad", count: 4 },
  { id: "wearables", name: "Smart Wearables", icon: "fas fa-clock", count: 3 },
  { id: "cameras", name: "Cameras & Drones", icon: "fas fa-camera", count: 2 },
  { id: "accessories", name: "Accessories & Power", icon: "fas fa-bolt", count: 2 }
];

const BRANDS = ["Apple", "Sony", "Samsung", "Asus", "Dell", "Bose", "DJI", "Razer", "Logitech", "Anker"];

// SVG Product Asset Generators for zero broken links & ultra crisp retina rendering
const createProductSVG = (type, title, primaryColor = "#ff3e1d", accentColor = "#0f172a") => {
  const svgs = {
    laptop: `<svg viewBox="0 0 400 300" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="laptopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e293b"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
        <linearGradient id="screenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="50%" stop-color="#818cf8"/>
          <stop offset="100%" stop-color="#c084fc"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="#f8fafc" rx="12"/>
      <rect x="75" y="45" width="250" height="150" rx="8" fill="url(#laptopGrad)" stroke="#334155" stroke-width="2"/>
      <rect x="85" y="55" width="230" height="130" rx="4" fill="url(#screenGrad)"/>
      <circle cx="200" cy="50" r="2.5" fill="#94a3b8"/>
      <!-- Screen glow details -->
      <path d="M100 120 Q 150 90 200 130 T 300 100" stroke="rgba(255,255,255,0.4)" stroke-width="3" fill="none"/>
      <!-- Laptop Base -->
      <path d="M50 200 L350 200 L330 220 L70 220 Z" fill="#cbd5e1"/>
      <path d="M170 200 L230 200 L225 206 L175 206 Z" fill="#94a3b8"/>
      <ellipse cx="200" cy="240" rx="130" ry="12" fill="rgba(15,23,42,0.06)"/>
    </svg>`,

    phone: `<svg viewBox="0 0 400 300" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="phoneScreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#1e1b4b"/>
        </linearGradient>
        <linearGradient id="glowG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ff3e1d"/>
          <stop offset="100%" stop-color="#f59e0b"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="#f8fafc" rx="12"/>
      <!-- Shadow -->
      <ellipse cx="200" cy="255" rx="80" ry="12" fill="rgba(15,23,42,0.08)"/>
      <!-- Phone Body -->
      <rect x="140" y="30" width="120" height="220" rx="20" fill="#020617" stroke="#334155" stroke-width="3"/>
      <!-- Screen -->
      <rect x="145" y="36" width="110" height="208" rx="16" fill="url(#phoneScreen)"/>
      <!-- Dynamic Island / Notch -->
      <rect x="180" y="42" width="40" height="10" rx="5" fill="#000"/>
      <!-- Wallpaper Artwork -->
      <circle cx="200" cy="140" r="35" fill="url(#glowG)" opacity="0.8"/>
      <circle cx="215" cy="155" r="25" fill="#38bdf8" opacity="0.6"/>
      <!-- UI lines -->
      <rect x="160" y="195" width="80" height="6" rx="3" fill="rgba(255,255,255,0.2)"/>
      <rect x="175" y="206" width="50" height="4" rx="2" fill="rgba(255,255,255,0.15)"/>
    </svg>`,

    headphones: `<svg viewBox="0 0 400 300" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e293b"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="#f8fafc" rx="12"/>
      <ellipse cx="200" cy="250" rx="90" ry="12" fill="rgba(15,23,42,0.08)"/>
      <!-- Headband Arc -->
      <path d="M120 160 C 120 70, 280 70, 280 160" fill="none" stroke="#334155" stroke-width="16" stroke-linecap="round"/>
      <path d="M135 150 C 135 90, 265 90, 265 150" fill="none" stroke="#64748b" stroke-width="4"/>
      <!-- Earcups -->
      <rect x="100" y="140" width="34" height="65" rx="16" fill="url(#hpGrad)" stroke="#ff3e1d" stroke-width="2"/>
      <rect x="266" y="140" width="34" height="65" rx="16" fill="url(#hpGrad)" stroke="#ff3e1d" stroke-width="2"/>
      <!-- Cushions -->
      <rect x="125" y="145" width="15" height="55" rx="8" fill="#475569"/>
      <rect x="260" y="145" width="15" height="55" rx="8" fill="#475569"/>
      <circle cx="117" cy="172" r="6" fill="#ff3e1d"/>
      <circle cx="283" cy="172" r="6" fill="#ff3e1d"/>
    </svg>`,

    gaming: `<svg viewBox="0 0 400 300" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="padGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e293b"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="#f8fafc" rx="12"/>
      <ellipse cx="200" cy="245" rx="110" ry="14" fill="rgba(15,23,42,0.08)"/>
      <!-- Controller Body -->
      <path d="M120 180 C 100 230, 80 210, 100 130 C 120 70, 280 70, 300 130 C 320 210, 300 230, 280 180 C 260 160, 240 190, 200 190 C 160 190, 140 160, 120 180 Z" fill="url(#padGrad)" stroke="#475569" stroke-width="3"/>
      <!-- D-pad -->
      <path d="M140 120 H150 V110 H160 V120 H170 V130 H160 V140 H150 V130 H140 Z" fill="#64748b"/>
      <!-- Action Buttons -->
      <circle cx="240" cy="115" r="5" fill="#ff3e1d"/>
      <circle cx="255" cy="125" r="5" fill="#38bdf8"/>
      <circle cx="225" cy="125" r="5" fill="#10b981"/>
      <circle cx="240" cy="135" r="5" fill="#fbbf24"/>
      <!-- Thumbsticks -->
      <circle cx="160" cy="165" r="16" fill="#334155" stroke="#ff3e1d" stroke-width="2"/>
      <circle cx="240" cy="165" r="16" fill="#334155" stroke="#ff3e1d" stroke-width="2"/>
      <!-- Glowing center led -->
      <circle cx="200" cy="135" r="4" fill="#38bdf8"/>
    </svg>`,

    watch: `<svg viewBox="0 0 400 300" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="screenWatch" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#020617"/>
          <stop offset="100%" stop-color="#1e293b"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="#f8fafc" rx="12"/>
      <ellipse cx="200" cy="260" rx="60" ry="10" fill="rgba(15,23,42,0.08)"/>
      <!-- Straps -->
      <rect x="170" y="25" width="60" height="70" rx="8" fill="#334155"/>
      <rect x="170" y="205" width="60" height="70" rx="8" fill="#334155"/>
      <!-- Watch Case -->
      <rect x="150" y="80" width="100" height="140" rx="24" fill="#0f172a" stroke="#64748b" stroke-width="3"/>
      <!-- Dial Screen -->
      <rect x="158" y="88" width="84" height="124" rx="18" fill="url(#screenWatch)"/>
      <!-- Digital Crown -->
      <rect x="250" y="110" width="6" height="24" rx="2" fill="#ff3e1d"/>
      <!-- Activity Rings -->
      <circle cx="200" cy="150" r="32" fill="none" stroke="#ff3e1d" stroke-width="4" stroke-dasharray="140 60"/>
      <circle cx="200" cy="150" r="24" fill="none" stroke="#10b981" stroke-width="4" stroke-dasharray="100 50"/>
      <circle cx="200" cy="150" r="16" fill="none" stroke="#38bdf8" stroke-width="4" stroke-dasharray="70 30"/>
      <!-- Digital time text -->
      <text x="200" y="125" fill="#ffffff" font-size="14" font-weight="bold" font-family="sans-serif" text-anchor="middle">10:42</text>
    </svg>`,

    camera: `<svg viewBox="0 0 400 300" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lensGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0284c7"/>
          <stop offset="50%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#6366f1"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="#f8fafc" rx="12"/>
      <ellipse cx="200" cy="245" rx="100" ry="12" fill="rgba(15,23,42,0.08)"/>
      <!-- Body -->
      <rect x="110" y="90" width="180" height="130" rx="14" fill="#0f172a" stroke="#334155" stroke-width="2"/>
      <!-- Viewfinder bump -->
      <rect x="165" y="70" width="70" height="25" rx="4" fill="#1e293b"/>
      <!-- Shutter Button & Dial -->
      <rect x="125" y="80" width="20" height="10" rx="2" fill="#e2e8f0"/>
      <rect x="250" y="78" width="24" height="12" rx="3" fill="#64748b"/>
      <!-- Lens Mount & Barrel -->
      <circle cx="200" cy="155" r="55" fill="#1e293b" stroke="#64748b" stroke-width="4"/>
      <circle cx="200" cy="155" r="42" fill="url(#lensGrad)" stroke="#ff3e1d" stroke-width="2"/>
      <circle cx="200" cy="155" r="22" fill="#020617"/>
      <circle cx="190" cy="145" r="6" fill="rgba(255,255,255,0.7)"/>
    </svg>`,

    accessory: `<svg viewBox="0 0 400 300" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ganGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e293b"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="#f8fafc" rx="12"/>
      <ellipse cx="200" cy="240" rx="80" ry="10" fill="rgba(15,23,42,0.08)"/>
      <!-- Power brick -->
      <rect x="140" y="80" width="120" height="130" rx="16" fill="url(#ganGrad)" stroke="#475569" stroke-width="2"/>
      <!-- USB-C Ports -->
      <rect x="175" y="110" width="50" height="12" rx="4" fill="#020617" stroke="#ff3e1d" stroke-width="1.5"/>
      <rect x="175" y="135" width="50" height="12" rx="4" fill="#020617" stroke="#ff3e1d" stroke-width="1.5"/>
      <rect x="175" y="160" width="50" height="16" rx="3" fill="#020617" stroke="#38bdf8" stroke-width="1.5"/>
      <!-- LED Indicator -->
      <circle cx="200" cy="95" r="3" fill="#10b981"/>
      <text x="200" y="200" fill="#94a3b8" font-size="10" font-weight="bold" font-family="sans-serif" text-anchor="middle">140W GaN</text>
    </svg>`
  };

  const svgString = svgs[type] || svgs.laptop;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
};

const SEED_PRODUCTS = [
  // Laptops & Computers
  {
    id: "prod-lap-01",
    name: "MacBook Pro 16\" M3 Max",
    category: "Laptops & Computers",
    brand: "Apple",
    price: 3499.00,
    oldPrice: 3899.00,
    rating: 4.9,
    reviewsCount: 184,
    badge: "Sale -10%",
    inStock: true,
    featured: true,
    deal: true,
    image: createProductSVG("laptop", "MacBook Pro 16"),
    description: "Equipped with the groundbreaking 16-core M3 Max chip, Liquid Retina XDR display with 1600 nits peak brightness, and up to 22 hours of battery life.",
    specs: [
      "Apple M3 Max Chip (16-Core CPU, 40-Core GPU)",
      "48GB Unified Memory",
      "1TB Ultra-Fast SSD",
      "16.2-inch Liquid Retina XDR (120Hz ProMotion)"
    ]
  },
  {
    id: "prod-lap-02",
    name: "ROG Zephyrus G16 OLED Gaming Laptop",
    category: "Laptops & Computers",
    brand: "Asus",
    price: 2199.99,
    oldPrice: 2499.99,
    rating: 4.8,
    reviewsCount: 92,
    badge: "Hot",
    inStock: true,
    featured: true,
    deal: true,
    image: createProductSVG("laptop", "ROG Zephyrus G16"),
    description: "Ultra-slim CNC aluminum chassis powered by Intel Core Ultra 9 and NVIDIA GeForce RTX 4080 with a breathtaking 2.5K 240Hz OLED ROG Nebula display.",
    specs: [
      "Intel Core Ultra 9 185H",
      "NVIDIA GeForce RTX 4080 12GB GDDR6",
      "32GB LPDDR5X RAM",
      "16\" 2.5K 240Hz 0.2ms OLED Display"
    ]
  },
  {
    id: "prod-lap-03",
    name: "Dell XPS 14 Touch InfinityEdge",
    category: "Laptops & Computers",
    brand: "Dell",
    price: 1699.00,
    oldPrice: 1899.00,
    rating: 4.6,
    reviewsCount: 73,
    badge: "New",
    inStock: true,
    featured: false,
    deal: false,
    image: createProductSVG("laptop", "Dell XPS 14"),
    description: "Machined aluminum craftsmanship with invisible glass trackpad, tactile touch function row, and 3.2K OLED touchscreen.",
    specs: [
      "Intel Core Ultra 7 155H",
      "NVIDIA GeForce RTX 4050 6GB",
      "16GB LPDDR5X RAM",
      "14.5\" 3.2K (3200 x 2000) OLED 120Hz Touch"
    ]
  },
  {
    id: "prod-lap-04",
    name: "Razer Blade 18 Ultimate Desktop Replacement",
    category: "Laptops & Computers",
    brand: "Razer",
    price: 4299.99,
    oldPrice: 4599.99,
    rating: 4.9,
    reviewsCount: 45,
    badge: "Best Seller",
    inStock: true,
    featured: false,
    deal: false,
    image: createProductSVG("laptop", "Razer Blade 18"),
    description: "The apex of desktop replacement gaming laptops featuring world's first 18-inch 4K 200Hz display and full-power RTX 4090.",
    specs: [
      "Intel Core i9-14900HX (24 cores)",
      "NVIDIA GeForce RTX 4090 16GB VRAM",
      "64GB DDR5 5600MHz RAM",
      "18\" 4K 200Hz Calman Verified Display"
    ]
  },
  {
    id: "prod-lap-05",
    name: "MacBook Air 15\" M3 Liquid Retina",
    category: "Laptops & Computers",
    brand: "Apple",
    price: 1299.00,
    oldPrice: 1399.00,
    rating: 4.7,
    reviewsCount: 215,
    badge: "Popular",
    inStock: true,
    featured: true,
    deal: false,
    image: createProductSVG("laptop", "MacBook Air 15"),
    description: "Impossibly thin design under 12mm with silent fanless architecture, dual external display support, and all-day 18hr battery.",
    specs: [
      "Apple M3 8-Core CPU / 10-Core GPU",
      "16GB Unified Memory",
      "512GB SSD Storage",
      "15.3\" Liquid Retina display with True Tone"
    ]
  },

  // Smartphones & Tablets
  {
    id: "prod-pho-01",
    name: "iPhone 16 Pro Max Titanium 256GB",
    category: "Smartphones & Tablets",
    brand: "Apple",
    price: 1199.00,
    oldPrice: 1299.00,
    rating: 4.9,
    reviewsCount: 320,
    badge: "Hot",
    inStock: true,
    featured: true,
    deal: true,
    image: createProductSVG("phone", "iPhone 16 Pro Max"),
    description: "Grade 5 titanium construction with Camera Control button, 48MP Fusion camera system with 5x telephoto, and A18 Pro silicon.",
    specs: [
      "A18 Pro chip with 6-core GPU",
      "6.9-inch Super Retina XDR Always-On ProMotion",
      "48MP Fusion Main Camera with 4K 120 fps Dolby Vision",
      "Titanium frame with Ceramic Shield"
    ]
  },
  {
    id: "prod-pho-02",
    name: "Samsung Galaxy S24 Ultra 512GB",
    category: "Smartphones & Tablets",
    brand: "Samsung",
    price: 1299.99,
    oldPrice: 1419.99,
    rating: 4.8,
    reviewsCount: 260,
    badge: "Sale -8%",
    inStock: true,
    featured: true,
    deal: true,
    image: createProductSVG("phone", "Galaxy S24 Ultra"),
    description: "Galaxy AI powerhouse with built-in S-Pen, 200MP camera sensor with Quad Tele System, and flat titanium armored exterior.",
    specs: [
      "Snapdragon 8 Gen 3 for Galaxy",
      "6.8\" Dynamic AMOLED 2X QHD+ 120Hz",
      "200MP Quad Tele System with 100x Space Zoom",
      "5000mAh Battery with 45W Fast Charging"
    ]
  },
  {
    id: "prod-pho-03",
    name: "iPad Pro 13\" M4 Ultra Retina Tandem OLED",
    category: "Smartphones & Tablets",
    brand: "Apple",
    price: 1299.00,
    oldPrice: 1399.00,
    rating: 4.9,
    reviewsCount: 112,
    badge: "New",
    inStock: true,
    featured: false,
    deal: false,
    image: createProductSVG("phone", "iPad Pro 13"),
    description: "The thinnest Apple product ever made at just 5.1mm, featuring the groundbreaking Ultra Retina XDR tandem OLED screen.",
    specs: [
      "Apple M4 chip (9-core CPU, 10-core GPU)",
      "13-inch Ultra Retina XDR Tandem OLED",
      "256GB Storage with Wi-Fi 6E",
      "Apple Pencil Pro & Magic Keyboard ready"
    ]
  },
  {
    id: "prod-pho-04",
    name: "Sony Xperia 1 VI 4K Professional Camera Phone",
    category: "Smartphones & Tablets",
    brand: "Sony",
    price: 1149.00,
    oldPrice: 1299.00,
    rating: 4.5,
    reviewsCount: 48,
    badge: "Popular",
    inStock: true,
    featured: false,
    deal: false,
    image: createProductSVG("phone", "Sony Xperia 1 VI"),
    description: "Designed with Alpha camera engineers featuring continuous optical zoom 85-170mm and Bravia AI powered display engine.",
    specs: [
      "Snapdragon 8 Gen 3 Mobile Platform",
      "85-170mm True Optical Telephoto Zoom Lens",
      "6.5\" FHD+ 120Hz LTPO OLED Display",
      "Dedicated two-stage camera shutter key"
    ]
  },

  // Audio & Headphones
  {
    id: "prod-aud-01",
    name: "Sony WH-1000XM5 Wireless Noise Cancelling",
    category: "Audio & Headphones",
    brand: "Sony",
    price: 348.00,
    oldPrice: 399.99,
    rating: 4.9,
    reviewsCount: 450,
    badge: "Best Seller",
    inStock: true,
    featured: true,
    deal: true,
    image: createProductSVG("headphones", "Sony WH-1000XM5"),
    description: "Industry-leading noise cancellation powered by two processors and 8 microphones. Crystal clear hands-free calling and 30-hour battery life.",
    specs: [
      "Dual Processor V1 & QN1 HD NC Chips",
      "Auto NC Optimizer tailored to altitude & wearing style",
      "30 Hours Battery with 3-min quick charge for 3 hrs",
      "LDAC Hi-Res Audio Wireless Certified"
    ]
  },
  {
    id: "prod-aud-02",
    name: "Bose QuietComfort Ultra Spatial Audio",
    category: "Audio & Headphones",
    brand: "Bose",
    price: 379.00,
    oldPrice: 429.00,
    rating: 4.8,
    reviewsCount: 195,
    badge: "Hot",
    inStock: true,
    featured: true,
    deal: false,
    image: createProductSVG("headphones", "Bose QC Ultra"),
    description: "Revolutionary Bose Immersive Audio spatializes what you hear. CustomTune technology personalizes sound performance to your ear shape.",
    specs: [
      "Bose Immersive Audio 3D Spatial Technology",
      "World-class Quiet & Aware active modes",
      "Up to 24 Hours of Playtime (18 hrs with Immersive)",
      "Luxury soft protein leather cushions"
    ]
  },
  {
    id: "prod-aud-03",
    name: "Apple AirPods Max with USB-C",
    category: "Audio & Headphones",
    brand: "Apple",
    price: 529.00,
    oldPrice: 549.00,
    rating: 4.7,
    reviewsCount: 280,
    badge: "Sale -5%",
    inStock: true,
    featured: false,
    deal: false,
    image: createProductSVG("headphones", "AirPods Max"),
    description: "Computational audio combines custom acoustic design with the Apple H1 chip in each ear for an unparalleled listening experience.",
    specs: [
      "Apple-designed dynamic driver with neodymium magnets",
      "Active Noise Cancellation with Transparency mode",
      "Personalized Spatial Audio with dynamic head tracking",
      "USB-C Charging & Lossless Audio Support"
    ]
  },
  {
    id: "prod-aud-04",
    name: "Bose SoundLink Max Portable Bluetooth Speaker",
    category: "Audio & Headphones",
    brand: "Bose",
    price: 399.00,
    oldPrice: 449.00,
    rating: 4.8,
    reviewsCount: 88,
    badge: "New",
    inStock: true,
    featured: false,
    deal: false,
    image: createProductSVG("headphones", "Bose SoundLink Max"),
    description: "Deep, room-shaking stereo sound built into a rugged, grab-and-go waterproof enclosure with up to 20 hours of battery life.",
    specs: [
      "IP67 Dust and Waterproof rating",
      "20 Hours battery life with USB-C power out",
      "Snapdragon Sound with aptX Adaptive",
      "Removable soft-texture climbing rope handle"
    ]
  },

  // Gaming & Esports
  {
    id: "prod-gam-01",
    name: "PlayStation 5 Pro Console 2TB SSD",
    category: "Gaming & Esports",
    brand: "Sony",
    price: 699.99,
    oldPrice: 749.99,
    rating: 4.9,
    reviewsCount: 512,
    badge: "Hot",
    inStock: true,
    featured: true,
    deal: true,
    image: createProductSVG("gaming", "PS5 Pro"),
    description: "PlayStation Spectral Super Resolution (PSSR) AI upscaling, advanced ray tracing hardware, and constant 60/120fps 4K fidelity.",
    specs: [
      "Enhanced GPU with 67% more Compute Units",
      "2TB Custom High-Speed NVMe SSD",
      "PlayStation Spectral Super Resolution (PSSR) AI",
      "Wi-Fi 7 Ready & Full PS4/PS5 Backwards Compatibility"
    ]
  },
  {
    id: "prod-gam-02",
    name: "Razer BlackWidow V4 Pro Wireless Keyboard",
    category: "Gaming & Esports",
    brand: "Razer",
    price: 229.99,
    oldPrice: 269.99,
    rating: 4.7,
    reviewsCount: 140,
    badge: "Sale -15%",
    inStock: true,
    featured: false,
    deal: false,
    image: createProductSVG("gaming", "Razer BlackWidow V4"),
    description: "Full battlestation immersion with the Razer Command Dial, 8 dedicated macro keys, magnetic plush leatherette wrist rest, and Chroma RGB.",
    specs: [
      "Razer Green Mechanical Tactile & Clicky Switches",
      "HyperSpeed Wireless & Bluetooth 5.1",
      "Multi-Function Command Dial & 8 Macro Keys",
      "Underglow on 3 sides with per-key RGB"
    ]
  },
  {
    id: "prod-gam-03",
    name: "Logitech G PRO X SUPERLIGHT 2 Mouse",
    category: "Gaming & Esports",
    brand: "Logitech",
    price: 149.99,
    oldPrice: 169.99,
    rating: 4.9,
    reviewsCount: 310,
    badge: "Best Seller",
    inStock: true,
    featured: true,
    deal: false,
    image: createProductSVG("gaming", "Logitech G PRO X 2"),
    description: "The undisputed champion of competitive esports mice. 60-gram ultra-lightweight design with HERO 2 sensor delivering 32,000 DPI.",
    specs: [
      "HERO 2 Sensor with 44,000 DPI & 888 IPS tracking",
      "LIGHTFORCE Hybrid Optical-Mechanical Switches",
      "4000Hz (0.25ms) Wireless Polling Rate",
      "95 Hours of Continuous Battery Life"
    ]
  },
  {
    id: "prod-gam-04",
    name: "Asus ROG Swift 32\" 4K 240Hz OLED Monitor",
    category: "Gaming & Esports",
    brand: "Asus",
    price: 1299.00,
    oldPrice: 1399.00,
    rating: 4.9,
    reviewsCount: 78,
    badge: "New",
    inStock: true,
    featured: false,
    deal: false,
    image: createProductSVG("gaming", "ROG Swift OLED"),
    description: "32-inch 4K QD-OLED gaming panel with a blistering 240Hz refresh rate, 0.03ms response time, and custom graphene heatsink.",
    specs: [
      "32\" 4K UHD (3840 x 2160) Quantum Dot OLED",
      "240Hz Refresh Rate & 0.03ms Gray-to-Gray Response",
      "DisplayHDR True Black 400 & 99% DCI-P3",
      "Dolby Vision & Uniform Brightness technology"
    ]
  },

  // Smart Wearables
  {
    id: "prod-wea-01",
    name: "Apple Watch Ultra 2 Black Titanium 49mm",
    category: "Smart Wearables",
    brand: "Apple",
    price: 799.00,
    oldPrice: 849.00,
    rating: 4.9,
    reviewsCount: 220,
    badge: "Hot",
    inStock: true,
    featured: true,
    deal: true,
    image: createProductSVG("watch", "Apple Watch Ultra 2"),
    description: "Rugged aerospace-grade satin black titanium casing, 3000-nit display, dual-frequency precision GPS, and up to 72 hours in Low Power Mode.",
    specs: [
      "49mm Black Titanium Case with Sapphire Crystal Front",
      "3000 nits Always-On Retina Display",
      "Precision Dual-Frequency L1 + L5 GPS & Depth Gauge to 40m",
      "S9 SiP with Double Tap gesture control"
    ]
  },
  {
    id: "prod-wea-02",
    name: "Samsung Galaxy Watch Ultra LTE 47mm",
    category: "Smart Wearables",
    brand: "Samsung",
    price: 599.99,
    oldPrice: 649.99,
    rating: 4.7,
    reviewsCount: 134,
    badge: "Sale -8%",
    inStock: true,
    featured: false,
    deal: false,
    image: createProductSVG("watch", "Galaxy Watch Ultra"),
    description: "Engineered for extreme adventures with Cushion Design titanium armor, multi-sport tracking, emergency siren, and BioActive sensor.",
    specs: [
      "10ATM / IP68 Titanium Grade 4 Case",
      "Dual-Frequency GPS (L1 + L5) with TrackBack",
      "Energy Score & Personalized Heart Rate Zones",
      "Up to 100 Hours battery in Power Saving mode"
    ]
  },
  {
    id: "prod-wea-03",
    name: "Sony Smart Band Horizon Pro Tracker",
    category: "Smart Wearables",
    brand: "Sony",
    price: 179.00,
    oldPrice: 199.00,
    rating: 4.6,
    reviewsCount: 82,
    badge: "Popular",
    inStock: true,
    featured: false,
    deal: false,
    image: createProductSVG("watch", "Smart Band Horizon"),
    description: "Ultra-slim curved AMOLED fitness band with continuous ECG, stress index analysis, and 14-day battery reserve.",
    specs: [
      "1.47\" Curved 3D AMOLED Display",
      "Clinical Grade ECG & SpO2 Blood Oxygen",
      "14 Days Typical Battery Life",
      "50m Water Resistance & Swim Stroke Counter"
    ]
  },

  // Cameras & Drones
  {
    id: "prod-cam-01",
    name: "Sony Alpha 7 IV Full-Frame Hybrid Camera",
    category: "Cameras & Drones",
    brand: "Sony",
    price: 2398.00,
    oldPrice: 2599.00,
    rating: 4.9,
    reviewsCount: 170,
    badge: "Best Seller",
    inStock: true,
    featured: true,
    deal: true,
    image: createProductSVG("camera", "Sony A7 IV"),
    description: "33MP back-illuminated Exmor R CMOS sensor with BIONZ XR processing engine, 4K 60p 10-bit 4:2:2 video, and real-time human/animal/bird Eye AF.",
    specs: [
      "33.0 MP Full-Frame Exmor R CMOS Sensor",
      "BIONZ XR Processor with AI Subject Recognition",
      "4K 60p in Super 35 & 7K Oversampled 4K 30p",
      "5-axis in-body optical image stabilization (5.5 steps)"
    ]
  },
  {
    id: "prod-cam-02",
    name: "DJI Mini 4 Pro Drone Fly More Combo",
    category: "Cameras & Drones",
    brand: "DJI",
    price: 1099.00,
    oldPrice: 1199.00,
    rating: 4.9,
    reviewsCount: 290,
    badge: "Hot",
    inStock: true,
    featured: true,
    deal: false,
    image: createProductSVG("camera", "DJI Mini 4 Pro"),
    description: "Under 249g regulation-friendly drone with omnidirectional obstacle sensing, 4K/60fps HDR True Vertical Shooting, and 20km FHD video transmission.",
    specs: [
      "Sub-249g Weight (No FAA registration needed in many areas)",
      "Omnidirectional Active Vision Obstacle Sensing",
      "4K/60fps HDR & 4K/100fps Slow Motion Video",
      "DJI RC 2 Controller with built-in 5.5\" FHD screen"
    ]
  },

  // Accessories & Power
  {
    id: "prod-acc-01",
    name: "Anker Prime 240W GaN 4-Port Fast Desktop Charger",
    category: "Accessories & Power",
    brand: "Anker",
    price: 139.99,
    oldPrice: 169.99,
    rating: 4.8,
    reviewsCount: 340,
    badge: "Sale -18%",
    inStock: true,
    featured: false,
    deal: true,
    image: createProductSVG("accessory", "Anker Prime 240W"),
    description: "Power 4 devices simultaneously with ultra-fast 240W total output. Includes 3 USB-C and 1 USB-A port with ActiveShield 2.0 safety monitoring.",
    specs: [
      "240W Total Output with 140W Max Single USB-C Port",
      "GaNPrime Technology for superior heat dissipation & compact size",
      "Powers two 16\" MacBook Pros at full speed together",
      "ActiveShield 2.0 monitors temperature 3,000,000 times/day"
    ]
  },
  {
    id: "prod-acc-02",
    name: "Anker MagGo 3-in-1 Qi2 Wireless Charging Station",
    category: "Accessories & Power",
    brand: "Anker",
    price: 99.99,
    oldPrice: 119.99,
    rating: 4.7,
    reviewsCount: 160,
    badge: "Popular",
    inStock: true,
    featured: false,
    deal: false,
    image: createProductSVG("accessory", "Anker MagGo 3-in-1"),
    description: "Certified 15W ultra-fast Qi2 wireless charging fold-flat stand for iPhone, Apple Watch Fast Charger, and AirPods case simultaneously.",
    specs: [
      "Official Qi2 Certified 15W Magnetic Fast Wireless Charging",
      "Made for Apple Watch Fast Charging module",
      "Ultra-compact foldable design perfect for travel",
      "40W USB-C PD power adapter included"
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CATEGORIES, BRANDS, SEED_PRODUCTS, createProductSVG };
}
