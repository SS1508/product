import { Injectable } from '@angular/core';

export interface Product {
  id: number; name: string; brand: string; price: number; mrp: number; image: string;
  category: string; description: string; rating: number; reviews: number; stock: number; badge?: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly imageSet = [
    'photo-1496181133206-80ce9b88a853','photo-1511707171634-5f897ff02aa9','photo-1505740420928-5e560c06d30e',
    'photo-1523275335684-37898b6baf30','photo-1542291026-7eec264c27ff','photo-1526170375885-4d8ecf77b99f',
    'photo-1548036328-c9fa89d128fa','photo-1555041469-a586c61ea9bc','photo-1556229010-6c3f2c9ca5f8',
    'photo-1572635196237-14b3f281503f','photo-1523381210434-271e8be1f52b','photo-1543163521-1bf539c55dd2'
  ];
  private readonly catalog: {category:string; names:string; brands:string; base:number}[] = [
    {category:'Mobiles', names:'Galaxy A55 5G|Galaxy S24 FE|Galaxy M35 5G|Galaxy A35 5G|Galaxy S24 Ultra|Galaxy Z Flip6|iPhone 15|iPhone 15 Plus|iPhone 16|iPhone 16 Pro|OnePlus 12R|OnePlus Nord CE4|OnePlus 13R|Pixel 8a|Pixel 9|Nothing Phone 2a|Redmi Note 13 Pro|Redmi 13 5G|Motorola Edge 50 Fusion|Vivo V30', brands:'Samsung|Apple|OnePlus|Google|Nothing|Xiaomi|Motorola|Vivo', base:18999},
    {category:'Laptops', names:'IdeaPad Slim 3|IdeaPad Gaming 3|Yoga Slim 6|ThinkBook 14|MacBook Air M2|MacBook Air M3|MacBook Pro 14|Vivobook 15|Zenbook 14 OLED|TUF Gaming A15|Pavilion 14|Victus 15|Inspiron 15|XPS 13|Swift Go 14|Aspire 7|Surface Laptop Go|Chromebook Plus|LOQ 15|Legion Slim 5', brands:'Lenovo|Apple|ASUS|HP|Dell|Acer|Microsoft', base:42990},
    {category:'Audio', names:'WH-CH720N Headphones|WF-C700N Earbuds|AirPods 3rd Gen|AirPods Pro 2|Buds 3 Pro|Buds FE|OnePlus Buds 3|Nord Buds 2|JBL Tune 770NC|JBL Flip 6 Speaker|SoundLink Flex|Nothing Ear|CMF Buds Pro|Realme Buds Air 6|Sony ULT Field 1|Sennheiser Accentum|boAt Nirvana Ion|boAt Stone 1200|Marshall Emberton II|JBL Go 4', brands:'Sony|Apple|Samsung|OnePlus|JBL|Bose|Nothing|CMF|Realme|Sennheiser|boAt|Marshall', base:1499},
    {category:'Wearables', names:'Galaxy Watch 6|Galaxy Watch FE|Apple Watch SE|Apple Watch Series 9|OnePlus Watch 2|OnePlus Watch 2R|Pixel Watch 2|Amazfit GTR Mini|Amazfit Active|Garmin Forerunner 55|Noise ColorFit Pro 5|boAt Lunar Pro|Fitbit Charge 6|Fossil Gen 6|Titan Smart 3|CMF Watch Pro 2|Redmi Watch 4|Fire-Boltt Phoenix Ultra|Huawei Watch Fit 3|Garmin Venu Sq 2', brands:'Samsung|Apple|OnePlus|Google|Amazfit|Garmin|Noise|boAt|Fitbit|Titan|CMF|Redmi|Huawei', base:2499},
    {category:'Fashion', names:'Classic Oxford Shirt|Linen Blend Shirt|Everyday Polo T-shirt|Premium Crew Neck Tee|Slim Fit Chinos|Straight Fit Jeans|Cotton Kurta Set|Printed Anarkali Kurta|Everyday A-line Dress|Floral Midi Dress|Relaxed Fit Hoodie|Lightweight Denim Jacket|Running Shoes|Court Sneakers|Leather Formal Shoes|Everyday Sandals|Canvas Tote Bag|Structured Crossbody Bag|Analog Minimal Watch|Polarised Sunglasses', brands:'Roadster|Wrogn|Manyavar|Biba|Mast & Harbour|Puma|Adidas|H&M|Fabindia|Titan|Fastrack', base:799},
    {category:'Home & Kitchen', names:'BrewMate French Press|Stainless Steel Cookware Set|Air Fryer 4.2L|Digital Microwave 20L|Mixer Grinder 750W|Quick Boil Electric Kettle|Robot Vacuum Cleaner|Ergonomic Study Chair|Wooden Bedside Table|Cotton Bedsheet Set|Ceramic Dinner Set|LED Desk Lamp|Insulated Water Bottle|Cast Iron Dutch Oven|Non-stick Tawa|Bamboo Storage Organiser|Memory Foam Pillow|Cotton Bath Towel Set|Smart LED Bulb 9W|Compact Air Purifier', brands:'Prestige|Philips|Havells|Milton|Wakefit|IKEA|Wonderchef|Borosil|Dyson|Crompton', base:499},
    {category:'Beauty', names:'Vitamin C Face Serum|Daily Hydration Moisturiser|SPF 50 Sunscreen Gel|Gentle Foaming Cleanser|Retinol Night Cream|Argan Oil Shampoo|Repair Conditioner|Ceramide Body Lotion|Matte Lipstick Set|Nail Enamel Trio|Beard Grooming Kit|Hair Styling Dryer|Electric Toothbrush|Rose Water Toner|Under-eye Gel|Fragrance Gift Set|Makeup Brush Set|Clay Face Mask|Scalp Massager|Aloe Vera Gel', brands:'Minimalist|Cetaphil|Dot & Key|Mamaearth|L’Oréal|Lakmé|Nykaa|The Man Company|Philips|Forest Essentials', base:249},
    {category:'Sports & Books', names:'Adjustable Dumbbells 20kg|Yoga Mat 6mm|Resistance Bands Set|Cricket Bat Kashmir Willow|Football Training Ball|Skipping Rope Pro|Cycling Helmet|Tennis Racket Graphite|Atomic Habits|Ikigai|The Psychology of Money|Introduction to Algorithms|Indian Polity by M. Laxmikanth|Quantitative Aptitude|The Alchemist|Project Hail Mary|The White Tiger|Deep Work|NCERT Physics Class 12|Rich Dad Poor Dad', brands:'Boldfit|Cosco|Yonex|SG|Nivia|Penguin|HarperCollins|Pearson|Arihant|Bloomsbury', base:299}
  ];
  private readonly products: Product[] = this.catalog.flatMap((group, groupIndex) => group.names.split('|').map((name, index) => {
    const id = groupIndex * 20 + index + 1; const price = group.base + ((index * 1379) % Math.max(2000, group.base * 2));
    const brands = group.brands.split('|');
    return { id, name, brand: brands[index % brands.length], price, mrp: Math.round(price * (1.12 + (index % 5) * .07)), category: group.category,
      image: `https://images.unsplash.com/${this.imageSet[id % this.imageSet.length]}?auto=format&fit=crop&w=700&q=82`,
      description: `Thoughtfully selected ${name.toLowerCase()} from ${brands[index % brands.length]}. Designed for everyday performance, comfort and lasting value.`,
      rating: +(3.8 + ((id * 7) % 13) / 10).toFixed(1), reviews: 118 + ((id * 139) % 9800), stock: id % 19 === 0 ? 0 : 5 + ((id * 3) % 70), badge: index % 4 === 0 ? 'Bestseller' : index % 5 === 0 ? 'Deal of the day' : undefined };
  }));
  getProducts(): Product[] { return this.products; }
  getCategories(): string[] { return ['All', ...this.catalog.map(item => item.category)]; }
  getProductsByCategory(category: string): Product[] { return category === 'All' ? this.products : this.products.filter(p => p.category === category); }
  getProductById(id: number): Product | undefined { return this.products.find(p => p.id === id); }
}
