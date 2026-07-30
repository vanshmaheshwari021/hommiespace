import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import UserModel from '../apps/api/src/models/User.js';
import VendorModel from '../apps/api/src/models/Vendor.js';
import CategoryModel from '../apps/api/src/models/Category.js';
import ProductModel from '../apps/api/src/models/Product.js';
import ReviewModel from '../apps/api/src/models/Review.js';
import EnquiryModel from '../apps/api/src/models/Enquiry.js';
import OrderModel from '../apps/api/src/models/Order.js';
import CouponModel from '../apps/api/src/models/Coupon.js';
import TicketModel from '../apps/api/src/models/Ticket.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../apps/api/.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hommiespace';

const seedData = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected! Clearing previous data...');
    
    await UserModel.deleteMany({});
    await VendorModel.deleteMany({});
    await CategoryModel.deleteMany({});
    await ProductModel.deleteMany({});
    await ReviewModel.deleteMany({});
    await EnquiryModel.deleteMany({});
    await OrderModel.deleteMany({});
    await CouponModel.deleteMany({});
    await TicketModel.deleteMany({});

    console.log('Seeding users and vendor profiles...');
    
    // 1. Seed Admin
    const admin = new UserModel({
      name: 'Super Admin',
      email: 'admin@hommiespace.com',
      password: 'password123',
      role: 'admin'
    });
    await admin.save();

    // 2. Seed 3 Vendors
    const vendorNames = ['Nordic Designs', 'Clay & Co', 'Modernist Spaces'];
    const vendorEmails = ['nordic@hommiespace.com', 'clay@hommiespace.com', 'modernist@hommiespace.com'];
    const vendorProfiles = [];

    for (let i = 0; i < 3; i++) {
      const vUser = new UserModel({
        name: `${vendorNames[i]} Owner`,
        email: vendorEmails[i],
        password: 'password123',
        role: 'vendor'
      });
      await vUser.save();

      const vProfile = new VendorModel({
        userId: vUser._id,
        businessName: vendorNames[i],
        businessAddress: `${100 + i * 50} Design Avenue, Copenhagen`,
        phone: `+45 88 88 8${i} 8${i}`,
        description: `Premium hand-crafted furniture and home decor from ${vendorNames[i]} design house.`,
        logoUrl: `https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&q=80&w=200`,
        bannerUrl: `https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200`,
        isApproved: true
      });
      await vProfile.save();
      vendorProfiles.push(vProfile);
    }

    // 3. Seed 10 Customers
    const customers = [];
    for (let i = 1; i <= 10; i++) {
      const customer = new UserModel({
        name: `Customer ${i}`,
        email: `customer${i}@gmail.com`,
        password: 'password123',
        role: 'customer'
      });
      await customer.save();
      customers.push(customer);
    }

    // 4. Seed Categories
    console.log('Seeding categories...');
    const categoriesData = [
      { name: 'Furniture', slug: 'furniture' },
      { name: 'Lighting', slug: 'lighting' },
      { name: 'Wall Art', slug: 'wall-art' },
      { name: 'Kitchenware', slug: 'kitchenware' },
      { name: 'Decor Pieces', slug: 'decor-pieces' },
      { name: 'Storage Products', slug: 'storage-products' },
      { name: 'Home Improvement', slug: 'home-improvement' }
    ];
    const categories = [];
    for (const cat of categoriesData) {
      const category = new CategoryModel(cat);
      await category.save();
      categories.push(category);
    }

    // 5. Seed 32 Products
    console.log('Seeding 32 products...');
    const productsData = [
      // CATEGORY 0: Seating
      {
        name: 'Oasis Bouclé Lounge Chair',
        description: 'Enveloping organic form lounge chair upholstered in premium textured bouclé fabric. Featuring a solid oak base frame, this statement piece offers cozy, relaxed seating comfort.',
        price: 890,
        categoryId: categories[0]._id,
        vendorId: vendorProfiles[0]._id,
        material: 'Oakwood base, high-density foam, bouclé fabric',
        dimensions: { width: 85, height: 75, depth: 90, unit: 'cm' },
        colorVariants: [
          { name: 'Off-White', hex: '#FAF9F6', stock: 12, priceOffset: 0 },
          { name: 'Sand Bouclé', hex: '#E6DFD3', stock: 8, priceOffset: 50 },
          { name: 'Charcoal', hex: '#2C2C2C', stock: 5, priceOffset: 0 }
        ],
        images: [
          'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800'
        ],
        stock: 25,
        status: 'active'
      },
      {
        name: 'Danish Woven Cord Lounge Chair',
        description: 'An iconic silhouette honoring Mid-Century Danish design. Features a hand-woven paper cord seat and backrest over a sturdy, steam-bent solid ash wood frame.',
        price: 620,
        categoryId: categories[0]._id,
        vendorId: vendorProfiles[0]._id,
        material: 'Ash wood, natural paper cord',
        dimensions: { width: 70, height: 80, depth: 75, unit: 'cm' },
        colorVariants: [
          { name: 'Natural Ash', hex: '#D2C1A7', stock: 15, priceOffset: 0 },
          { name: 'Black Ash', hex: '#1C1C1C', stock: 10, priceOffset: 30 }
        ],
        images: [
          'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&q=80&w=800'
        ],
        stock: 25,
        status: 'active'
      },
      {
        name: 'Terracotta Linen Accent Chair',
        description: 'A cozy accent chair featuring deep seat cushions upholstered in durable Belgian washed linen. The rich terracotta hue provides a warm and grounded accent color for minimalist living areas.',
        price: 540,
        categoryId: categories[0]._id,
        vendorId: vendorProfiles[1]._id,
        material: 'Birchwood frame, washed linen fabric',
        dimensions: { width: 78, height: 82, depth: 80, unit: 'cm' },
        colorVariants: [
          { name: 'Terracotta', hex: '#BC6C58', stock: 7, priceOffset: 0 },
          { name: 'Sage Green', hex: '#8C9A86', stock: 6, priceOffset: 0 }
        ],
        images: [
          'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800'
        ],
        stock: 13,
        status: 'active'
      },
      {
        name: 'Minimalist Dining Armchair',
        description: 'Clean profiles and organic curves meet in this modern dining armchair. Upholstered in linen-blend fabric with slender, textured black metal legs.',
        price: 240,
        categoryId: categories[0]._id,
        vendorId: vendorProfiles[2]._id,
        material: 'Steel legs, plywood core, linen upholstery',
        dimensions: { width: 58, height: 78, depth: 55, unit: 'cm' },
        colorVariants: [
          { name: 'Oatmeal', hex: '#EAE5DB', stock: 24, priceOffset: 0 },
          { name: 'Clay Gray', hex: '#9E9385', stock: 16, priceOffset: 0 }
        ],
        images: [
          'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800'
        ],
        stock: 40,
        status: 'active'
      },
      {
        name: 'Saddle Leather Counter Stool',
        description: 'An elegant counter height stool featuring a molded seat wrapped in premium vegetable-tanned saddle leather. Supported by tapered black walnut legs.',
        price: 320,
        categoryId: categories[0]._id,
        vendorId: vendorProfiles[2]._id,
        material: 'Black walnut, full-grain leather',
        dimensions: { width: 45, height: 92, depth: 42, unit: 'cm' },
        colorVariants: [
          { name: 'Cognac Leather', hex: '#B87333', stock: 14, priceOffset: 0 },
          { name: 'Dark Walnut Leather', hex: '#3D2E26', stock: 10, priceOffset: 20 }
        ],
        images: [
          'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800'
        ],
        stock: 24,
        status: 'active'
      },
      {
        name: 'Eased Daybed Bench',
        description: 'A spacious daybed bench ideal for entries, bedroom footboards, or open-plan seating. Outfitted with a tufted cushion in heavy woven flax linen.',
        price: 950,
        categoryId: categories[0]._id,
        vendorId: vendorProfiles[1]._id,
        material: 'Solid white oak, flax linen',
        dimensions: { width: 160, height: 45, depth: 65, unit: 'cm' },
        colorVariants: [
          { name: 'Flax Natural', hex: '#EAE5DB', stock: 4, priceOffset: 0 },
          { name: 'Olive Green', hex: '#556B2F', stock: 3, priceOffset: 40 }
        ],
        images: [
          'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&q=80&w=800'
        ],
        stock: 7,
        status: 'active'
      },

      // CATEGORY 1: Tables (mapped to Furniture)
      {
        name: 'Travertine Low Coffee Table',
        description: 'A monolithic coffee table crafted from solid honed Italian travertine stone. Showcases natural ivory pores and unique cream banding, sitting on deep recessed plinth bases.',
        price: 980,
        categoryId: categories[0]._id,
        vendorId: vendorProfiles[0]._id,
        material: 'Honed Italian travertine stone',
        dimensions: { width: 110, height: 30, depth: 70, unit: 'cm' },
        colorVariants: [
          { name: 'Ivory Travertine', hex: '#FAF5ED', stock: 6, priceOffset: 0 }
        ],
        images: [
          'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800'
        ],
        stock: 6,
        status: 'active'
      },
      {
        name: 'Solid Walnut Oval Dining Table',
        description: 'A luxurious oval dining table crafted in solid FSC-certified black walnut. Features organic beveled tabletop edges and sturdy cylindrical pillar legs that allow comfortable legroom.',
        price: 2100,
        categoryId: categories[0]._id,
        vendorId: vendorProfiles[0]._id,
        material: 'Solid black walnut, matte hardwax finish',
        dimensions: { width: 220, height: 75, depth: 100, unit: 'cm' },
        colorVariants: [
          { name: 'Natural Walnut', hex: '#3D2E26', stock: 4, priceOffset: 0 }
        ],
        images: [
          'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800'
        ],
        stock: 4,
        status: 'active'
      },
      {
        name: 'Brushed Metal Side Table',
        description: 'An architectural accent side table made of folded steel with a hand-brushed finish. Its clean profile adds contrast when placed beside soft upholstered armchairs.',
        price: 180,
        categoryId: categories[0]._id,
        vendorId: vendorProfiles[1]._id,
        material: 'Folded carbon steel',
        dimensions: { width: 40, height: 50, depth: 40, unit: 'cm' },
        colorVariants: [
          { name: 'Brushed Steel', hex: '#A8A8A8', stock: 22, priceOffset: 0 },
          { name: 'Matte Charcoal', hex: '#1F1E1B', stock: 18, priceOffset: 0 }
        ],
        images: [
          'https://images.unsplash.com/photo-1532372320978-9b4d7a92b24d?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=800'
        ],
        stock: 40,
        status: 'active'
      },
      {
        name: 'Oak Pillar Console Table',
        description: 'A sculptural console table featuring a thick top resting on two massive ribbed oak column legs. Perfect for hallways, entryways, or behind living room sofas.',
        price: 780,
        categoryId: categories[0]._id,
        vendorId: vendorProfiles[2]._id,
        material: 'Solid white oak, oak veneers',
        dimensions: { width: 140, height: 75, depth: 38, unit: 'cm' },
        colorVariants: [
          { name: 'Natural Oak', hex: '#FAF5ED', stock: 8, priceOffset: 0 },
          { name: 'Ebonized Black Oak', hex: '#1C1C1C', stock: 5, priceOffset: 50 }
        ],
        images: [
          'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&q=80&w=800'
        ],
        stock: 13,
        status: 'active'
      },

      // CATEGORY 2: Storage (mapped to Storage Products)
      {
        name: 'Linear Danish Oak Sideboard',
        description: 'A classic Danish sideboard handcrafted from premium white oak. Offers generous storage capacity behind double sliding doors, featuring integrated solid-wood handles and adjustable shelves.',
        price: 1650,
        categoryId: categories[5]._id,
        vendorId: vendorProfiles[0]._id,
        material: 'White oak wood, oak veneers',
        dimensions: { width: 180, height: 70, depth: 45, unit: 'cm' },
        colorVariants: [
          { name: 'Muted Oak', hex: '#EAE5DB', stock: 6, priceOffset: 0 },
          { name: 'Smoked Oak', hex: '#8F8270', stock: 4, priceOffset: 120 }
        ],
        images: [
          'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1601887389937-0b02c26b6c3c?auto=format&fit=crop&q=80&w=800'
        ],
        stock: 10,
        status: 'active'
      },
      {
        name: 'Arched Display Cabinet',
        description: 'An elegant display cabinet with a graceful arched top profile. Crafted from solid pine wood and finished in matte charcoal, featuring double tempered glass doors and internal display lighting.',
        price: 1450,
        categoryId: categories[5]._id,
        vendorId: vendorProfiles[1]._id,
        material: 'Pinewood, tempered glass, brass hardware',
        dimensions: { width: 95, height: 190, depth: 40, unit: 'cm' },
        colorVariants: [
          { name: 'Charcoal Black', hex: '#1F1E1B', stock: 5, priceOffset: 0 },
          { name: 'Bone White', hex: '#FAF9F6', stock: 3, priceOffset: 0 }
        ],
        images: [
          'https://images.unsplash.com/photo-1601887389937-0b02c26b6c3c?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800'
        ],
        stock: 8,
        status: 'active'
      },
      {
        name: 'Floating Walnut Shelving Unit',
        description: 'A modular, wall-mounted floating shelf unit crafted from solid American walnut. Provides minimalist horizontal lines for showing books, collectibles, and ceramic vases.',
        price: 290,
        categoryId: categories[5]._id,
        vendorId: vendorProfiles[2]._id,
        material: 'American black walnut',
        dimensions: { width: 120, height: 25, depth: 22, unit: 'cm' },
        colorVariants: [
          { name: 'Natural Walnut', hex: '#3D2E26', stock: 15, priceOffset: 0 }
        ],
        images: [
          'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1601887389937-0b02c26b6c3c?auto=format&fit=crop&q=80&w=800'
        ],
        stock: 15,
        status: 'active'
      },

      // CATEGORY 3: Lighting (mapped to Lighting)
      {
        name: 'Ceramic Pleated Pendant Light',
        description: 'A beautiful pendant lamp featuring a hand-thrown ceramic shade with a delicate pleated edge. Suspended by a braided textile cord and matching brass ceiling canopy.',
        price: 210,
        categoryId: categories[1]._id,
        vendorId: vendorProfiles[1]._id,
        material: 'Terracotta ceramic shade, solid brass fixtures',
        dimensions: { width: 32, height: 18, depth: 32, unit: 'cm' },
        colorVariants: [
          { name: 'Matte White', hex: '#FAF9F6', stock: 25, priceOffset: 0 },
          { name: 'Terracotta', hex: '#BC6C58', stock: 20, priceOffset: 15 }
        ],
        images: [
          'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&q=80&w=800'
        ],
        stock: 45,
        status: 'active'
      },
      {
        name: 'Travertine Pillar Table Lamp',
        description: 'A sculptural table lamp made of solid travertine stone base, combined with a premium linen drum shade. Emanates a warm, ambient glow ideal for bedrooms and credenzas.',
        price: 175,
        categoryId: categories[1]._id,
        vendorId: vendorProfiles[0]._id,
        material: 'Travertine stone base, Belgian linen shade',
        dimensions: { width: 28, height: 48, depth: 28, unit: 'cm' },
        colorVariants: [
          { name: 'Natural Travertine', hex: '#EAE5DB', stock: 35, priceOffset: 0 }
        ],
        images: [
          'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800'
        ],
        stock: 35,
        status: 'active'
      },
      {
        name: 'Bowed Brass Floor Lamp',
        description: 'An elegant floor lamp with a slender, arched solid brass frame. A heavy circular marble base ensures stability, making it ideal for reading corners.',
        price: 340,
        categoryId: categories[1]._id,
        vendorId: vendorProfiles[2]._id,
        material: 'Solid brass, white Carrara marble',
        dimensions: { width: 35, height: 165, depth: 40, unit: 'cm' },
        colorVariants: [
          { name: 'Satin Brass', hex: '#E6C280', stock: 12, priceOffset: 0 }
        ],
        images: [
          'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800'
        ],
        stock: 12,
        status: 'active'
      },

      // CATEGORY 4: Decor & Accents
      {
        name: 'Speckled Terracotta Vase',
        description: 'A classic earthenware vase showcasing a matte, raw clay exterior and a contrasting glossy glazed interior. Ideal for showcasing dried botanicals or fresh stems.',
        price: 75,
        categoryId: categories[4]._id,
        vendorId: vendorProfiles[1]._id,
        material: 'Local terracotta clay',
        dimensions: { width: 20, height: 35, depth: 20, unit: 'cm' },
        colorVariants: [
          { name: 'Raw Terracotta', hex: '#BC6C58', stock: 40, priceOffset: 0 },
          { name: 'Sage Glaze', hex: '#8C9A86', stock: 25, priceOffset: 5 }
        ],
        images: [
          'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&q=80&w=800'
        ],
        stock: 65,
        status: 'active'
      },
      {
        name: 'Washed Linen Pillow Cover',
        description: 'A premium throw pillow cover made from 100% natural, stonewashed Belgian flax linen. Features double-stitch detailing and a hidden brass zipper.',
        price: 45,
        categoryId: categories[4]._id,
        vendorId: vendorProfiles[0]._id,
        material: '100% Belgian flax linen',
        dimensions: { width: 50, height: 50, depth: 2, unit: 'cm' },
        colorVariants: [
          { name: 'Oatmeal Linen', hex: '#EAE5DB', stock: 60, priceOffset: 0 },
          { name: 'Sage Linen', hex: '#8C9A86', stock: 45, priceOffset: 0 },
          { name: 'Clay Red', hex: '#BC6C58', stock: 30, priceOffset: 0 }
        ],
        images: [
          'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&q=80&w=800'
        ],
        stock: 135,
        status: 'active'
      },
      {
        name: 'Wool Bouclé Throw Blanket',
        description: 'A heavyweight, incredibly cozy throw blanket woven from organic merino wool bouclé yarn. Finished with soft fringe detailing along the edges.',
        price: 160,
        categoryId: categories[4]._id,
        vendorId: vendorProfiles[0]._id,
        material: '85% Merino Wool, 15% Organic Cotton',
        dimensions: { width: 130, height: 180, depth: 1, unit: 'cm' },
        colorVariants: [
          { name: 'Cream Bouclé', hex: '#FAF9F6', stock: 30, priceOffset: 0 },
          { name: 'Camel Tan', hex: '#C59B76', stock: 20, priceOffset: 10 }
        ],
        images: [
          'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800'
        ],
        stock: 50,
        status: 'active'
      },

      // CATEGORY 6: Wall Art (categories[2])
      {
        name: 'Textured Plaster Relief Canvas',
        description: 'A striking minimalist plaster relief panel set in a solid oak gallery frame. The layered plaster catches shadows dynamically as the room lighting changes throughout the day.',
        price: 340,
        categoryId: categories[2]._id,
        vendorId: vendorProfiles[0]._id,
        material: 'Plaster composite, white oak frame',
        dimensions: { width: 80, height: 100, depth: 4, unit: 'cm' },
        colorVariants: [
          { name: 'Chalk White', hex: '#FAF9F6', stock: 12, priceOffset: 0 },
          { name: 'Warm Greige', hex: '#D7D1C5', stock: 8, priceOffset: 20 }
        ],
        images: [
          'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800'
        ],
        stock: 20,
        status: 'active'
      },
      {
        name: 'Abstract Earth Lithograph',
        description: 'An abstract, multi-tonal print featuring organic shapes in terracottas, charcoal, and warm sands. Hand-signed and printed on heavy museum-quality cotton paper.',
        price: 185,
        categoryId: categories[2]._id,
        vendorId: vendorProfiles[1]._id,
        material: 'Giclée archival print, cotton paper, walnut frame',
        dimensions: { width: 50, height: 70, depth: 3, unit: 'cm' },
        colorVariants: [
          { name: 'Walnut Frame', hex: '#3D2E26', stock: 25, priceOffset: 0 }
        ],
        images: [
          'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800'
        ],
        stock: 25,
        status: 'active'
      }
    ];

    // Let's add 15 more products programmatically to hit 30+ products requirement
    const categoriesPool = categories;
    const vendorsPool = vendorProfiles;
    const adjectives = ['Organic', 'Scandi', 'Minimalist', 'Rustic', 'Modernist', 'Crafted', 'Artisanal'];
    const objects = ['Stool', 'Shelf', 'Bowl', 'Jug', 'Planter', 'Side Table', 'Pendant', 'Mirror', 'Tray'];
    
    // We already have 21 products above. Let's add 11 more programmatically.
    for (let i = 1; i <= 11; i++) {
      const adj = adjectives[i % adjectives.length];
      const obj = objects[i % objects.length];
      const name = `${adj} ${obj} No. ${10 + i}`;
      const price = 50 + (i * 35);

      // Map programmatic products to appropriate category slugs based on item name
      let catSlug = 'decor-pieces';
      if (obj === 'Stool' || obj === 'Side Table') catSlug = 'furniture';
      else if (obj === 'Shelf') catSlug = 'storage-products';
      else if (obj === 'Pendant') catSlug = 'lighting';
      else if (obj === 'Bowl' || obj === 'Jug' || obj === 'Tray') catSlug = 'kitchenware';

      const cat = categoriesPool.find(c => c.slug === catSlug) || categoriesPool[0];
      const vendor = vendorsPool[i % vendorsPool.length];

      // Assign matching Unsplash image pairs based on item type to prevent mismatches (e.g. bowls showing chairs)
      let prodImages = [
        'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1521503862198-2ae9a997bbc9?auto=format&fit=crop&q=80&w=800'
      ];

      if (obj === 'Stool') {
        prodImages = [
          'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800'
        ];
      } else if (obj === 'Shelf') {
        prodImages = [
          'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1601887389937-0b02c26b6c3c?auto=format&fit=crop&q=80&w=800'
        ];
      } else if (obj === 'Bowl') {
        prodImages = [
          'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1535401991746-da3d9055713e?auto=format&fit=crop&q=80&w=800'
        ];
      } else if (obj === 'Jug') {
        prodImages = [
          'https://images.unsplash.com/photo-1576016770956-debb63d900ee?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&q=80&w=800'
        ];
      } else if (obj === 'Planter') {
        prodImages = [
          'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1521503862198-2ae9a997bbc9?auto=format&fit=crop&q=80&w=800'
        ];
      } else if (obj === 'Side Table') {
        prodImages = [
          'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800'
        ];
      } else if (obj === 'Pendant') {
        prodImages = [
          'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&q=80&w=800'
        ];
      } else if (obj === 'Mirror') {
        prodImages = [
          'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&q=80&w=800'
        ];
      } else if (obj === 'Tray') {
        prodImages = [
          'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800'
        ];
      }

      productsData.push({
        name,
        description: `A beautifully designed ${name.toLowerCase()} that blends functionality with modern craft aesthetics. Sourced and produced ethically.`,
        price,
        categoryId: cat._id,
        vendorId: vendor._id,
        material: 'Premium solid components, oiled finish',
        dimensions: { width: 30 + i, height: 40 + i, depth: 30 + i, unit: 'cm' },
        colorVariants: [
          { name: 'Natural Finish', hex: '#FAF5ED', stock: 15, priceOffset: 0 },
          { name: 'Dark Oak', hex: '#3D2E26', stock: 10, priceOffset: 15 }
        ],
        images: prodImages,
        stock: 25,
        status: 'active'
      });
    }

    const seededProducts = [];
    for (const prodData of productsData) {
      const product = new ProductModel(prodData);
      await product.save();
      seededProducts.push(product);
    }
    console.log(`Seeded ${seededProducts.length} products successfully.`);

    // 6. Seed Reviews (Update Ratings)
    console.log('Seeding reviews...');
    const comments = [
      'Absolutely beautiful piece, fits my living room perfectly!',
      'The texture of the fabric is amazing. Highly recommended.',
      'Solid construction and quick delivery. Very satisfied.',
      'Looks good but the color was slightly darker than in photos.',
      'Exceptional quality. Definitely worth the price!'
    ];

    for (let i = 0; i < 20; i++) {
      const product = seededProducts[i % seededProducts.length];
      const customer = customers[i % customers.length];
      const rating = (i % 3) + 3; // generates ratings: 3, 4, 5
      const comment = comments[i % comments.length];

      const review = new ReviewModel({
        userId: customer._id,
        userName: customer.name,
        productId: product._id,
        rating,
        comment,
        isApproved: true
      });
      await review.save();

      // Update product rating calculations
      const reviewsForProduct = await ReviewModel.find({ productId: product._id });
      const avgRating = reviewsForProduct.reduce((acc, r) => acc + r.rating, 0) / reviewsForProduct.length;
      
      product.rating = parseFloat(avgRating.toFixed(1));
      product.numReviews = reviewsForProduct.length;
      await product.save();
    }

    // 7. Seed Enquiries
    console.log('Seeding enquiries...');
    const enquiryMessages = [
      'Hi, is it possible to customize the dimensions of this sideboard? I need it to be 20cm shorter.',
      'Do you offer swatches for the bouclé fabric? I would like to check the off-white color in person.',
      'Is this item in stock? Looking to order 4 pieces for a commercial dining project.',
      'Does this lamp support dimmable LED bulb fixtures?'
    ];
    
    const repliesPool = [
      'Yes, we can accommodate custom length adjustments for a 15% surcharge. Please contact support to submit a drawing.',
      'We would be happy to mail fabric cards to you free of charge! Please send us your shipping address.',
      'Yes, we have sufficient stock for commercial orders. Lead time for 4 pieces is approximately 2 weeks.',
      'Yes! The brass socket fits standard E26 dimmable bulb fixtures.'
    ];

    for (let i = 0; i < 8; i++) {
      const product = seededProducts[i % 5];
      const customer = customers[i % customers.length];
      const message = enquiryMessages[i % enquiryMessages.length];

      const enquiry = new EnquiryModel({
        userId: customer._id,
        productId: product._id,
        vendorId: product.vendorId,
        message,
        status: i % 2 === 0 ? 'responded' : 'pending',
        replies: []
      });

      if (i % 2 === 0) {
        // Find associated vendor user
        const vendorProfile = await VendorModel.findById(product.vendorId);
        if (vendorProfile) {
          enquiry.replies.push({
            senderId: vendorProfile.userId as mongoose.Types.ObjectId,
            senderName: `${vendorNames[0]} Support`, // Simplified
            senderRole: 'vendor',
            message: repliesPool[i % repliesPool.length],
            createdAt: new Date()
          });
        }
      }
      
      await enquiry.save();
    }

    // 8. Seed Orders (15 Orders)
    console.log('Seeding 15 orders...');
    const address = {
      street: '123 Studio Loft Ave',
      city: 'Brooklyn',
      state: 'NY',
      zipCode: '11201',
      country: 'United States'
    };

    for (let i = 1; i <= 15; i++) {
      const customer = customers[i % customers.length];
      const product1 = seededProducts[(i * 2) % seededProducts.length];
      const product2 = seededProducts[(i * 3) % seededProducts.length];

      const orderItems = [
        {
          product: product1._id,
          vendorId: product1.vendorId,
          qty: 1,
          price: product1.price,
          status: i % 5 === 0 ? 'delivered' : 'processing'
        }
      ];

      if (i % 2 === 0) {
        orderItems.push({
          product: product2._id,
          vendorId: product2.vendorId,
          qty: 2,
          price: product2.price,
          status: 'pending'
        });
      }

      const totalPrice = orderItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

      const order = new OrderModel({
        userId: customer._id,
        items: orderItems,
        totalPrice,
        discountAmount: i % 3 === 0 ? 20 : 0,
        couponCode: i % 3 === 0 ? 'WELCOME20' : undefined,
        shippingAddress: address,
        billingAddress: address,
        paymentMethod: i % 2 === 0 ? 'card' : 'paypal',
        paymentStatus: i % 5 === 0 ? 'paid' : 'pending',
        orderStatus: i % 5 === 0 ? 'delivered' : 'pending'
      });
      await order.save();
    }

    // 9. Seed Coupons
    console.log('Seeding coupons...');
    const couponsData = [
      {
        code: 'WELCOME20',
        discountType: 'percentage',
        discountValue: 20,
        minPurchase: 100,
        startDate: '2026-01-01T00:00:00Z',
        endDate: '2027-12-31T23:59:59Z',
        isActive: true
      },
      {
        code: 'SAVE50',
        discountType: 'fixed',
        discountValue: 50,
        minPurchase: 300,
        startDate: '2026-01-01T00:00:00Z',
        endDate: '2027-12-31T23:59:59Z',
        isActive: true
      },
      {
        code: 'SAGE10',
        discountType: 'percentage',
        discountValue: 10,
        minPurchase: 50,
        startDate: '2026-01-01T00:00:00Z',
        endDate: '2027-12-31T23:59:59Z',
        isActive: true
      }
    ];
    for (const c of couponsData) {
      await new CouponModel(c).save();
    }

    // 10. Seed Support Tickets
    console.log('Seeding support tickets...');
    const ticketsData = [
      {
        userId: customers[0]._id,
        customerName: customers[0].name,
        customerEmail: customers[0].email,
        subject: 'Custom sizing details for Oak Dining Table',
        message: 'Hi, is it possible to get the dining table in 220cm instead of 200cm?',
        status: 'open',
        replies: []
      },
      {
        userId: customers[1]._id,
        customerName: customers[1].name,
        customerEmail: customers[1].email,
        subject: 'Sage linen finish restocking inquiry',
        message: 'Hello, when will the Sage Finish variant of the woven cord loungers be back in stock?',
        status: 'in-progress',
        replies: [
          {
            senderRole: 'admin',
            senderName: 'Super Admin',
            message: 'Hello, our studio partner Nordic Designs is restocking this variant next Monday.',
            createdAt: new Date()
          }
        ]
      }
    ];
    for (const t of ticketsData) {
      await new TicketModel(t).save();
    }

    console.log('Database successfully seeded with ALL required resources (categories, products, reviews, enquiries, orders, coupons, tickets)!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
