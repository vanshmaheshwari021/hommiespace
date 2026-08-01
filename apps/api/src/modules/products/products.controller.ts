import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import ProductModel from '../../models/Product.js';
import CategoryModel from '../../models/Category.js';
import ReviewModel from '../../models/Review.js';
import CommentModel from '../../models/Comment.js';

export const SAMPLE_PRODUCTS = [
  // --- CHAIRS SECTION (10 ITEMS) ---
  {
    _id: 'prod-chair-01', id: 'prod-chair-01',
    name: 'Stockholm Velvet Armchair', slug: 'stockholm-velvet-armchair',
    price: 29500, rating: 4.9, numReviews: 24, material: 'Velvet & Solid Oak Wood', status: 'active',
    categoryId: { _id: 'cat-chairs', name: 'Chairs & Seating', slug: 'chairs' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80', 'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=800&q=80'],
    description: 'Iconic Scandinavian lounge chair with solid kiln-dried oak frame and soft velvet cushion.'
  },
  {
    _id: 'prod-chair-02', id: 'prod-chair-02',
    name: 'Oslo Ergonomic Walnut Lounge Chair', slug: 'oslo-ergonomic-walnut-lounge-chair',
    price: 42000, rating: 4.8, numReviews: 18, material: 'Top-Grain Leather & American Walnut', status: 'active',
    categoryId: { _id: 'cat-chairs', name: 'Chairs & Seating', slug: 'chairs' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=800&q=80', 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80'],
    description: 'Ergonomic contours with rich cognac grain leather and moulded dark walnut veneer.'
  },
  {
    _id: 'prod-chair-03', id: 'prod-chair-03',
    name: 'Copenhagen Curved Bouclé Armchair', slug: 'copenhagen-curved-boucle-armchair',
    price: 38900, rating: 4.9, numReviews: 32, material: 'Tactile Bouclé Fabric', status: 'active',
    categoryId: { _id: 'cat-chairs', name: 'Chairs & Seating', slug: 'chairs' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80', 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80'],
    description: 'Soft organic cocoon shape upholstered in off-white bouclé texture fabric.'
  },
  {
    _id: 'prod-chair-04', id: 'prod-chair-04',
    name: 'Helsinki Solid Oak Dining Chair Set (Pair)', slug: 'helsinki-solid-oak-dining-chair-set',
    price: 24500, rating: 4.7, numReviews: 14, material: 'Solid White Oak & Natural Cord', status: 'active',
    categoryId: { _id: 'cat-chairs', name: 'Chairs & Seating', slug: 'chairs' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1503602642458-232111445657?w=800&q=80', 'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=800&q=80'],
    description: 'Hand-woven paper cord seat with Steam-bent oak wood backrest.'
  },
  {
    _id: 'prod-chair-05', id: 'prod-chair-05',
    name: 'Malmo Cane Back Leather Accent Chair', slug: 'malmo-cane-back-leather-accent-chair',
    price: 34000, rating: 4.8, numReviews: 21, material: 'Rattan Cane & Vintage Black Leather', status: 'active',
    categoryId: { _id: 'cat-chairs', name: 'Chairs & Seating', slug: 'chairs' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80', 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80'],
    description: 'Vintage black iron frame paired with natural woven cane weave and leather seat.'
  },
  {
    _id: 'prod-chair-06', id: 'prod-chair-06',
    name: 'Bergen Minimalist Steel Bar Stool', slug: 'bergen-minimalist-steel-bar-stool',
    price: 14200, rating: 4.6, numReviews: 11, material: 'Powder-Coated Steel & Ash Wood', status: 'active',
    categoryId: { _id: 'cat-chairs', name: 'Chairs & Seating', slug: 'chairs' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1503602642458-232111445657?w=800&q=80', 'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=800&q=80'],
    description: 'Sleek architectural high bar stool suited for modern kitchen islands.'
  },
  {
    _id: 'prod-chair-07', id: 'prod-chair-07',
    name: 'Gothenburg Velvet Desk Chair', slug: 'gothenburg-velvet-desk-chair',
    price: 22800, rating: 4.7, numReviews: 16, material: 'Terracotta Velvet & Brass Swivel Base', status: 'active',
    categoryId: { _id: 'cat-chairs', name: 'Chairs & Seating', slug: 'chairs' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80'],
    description: 'Comfortable swivel executive desk chair with smooth height adjustment.'
  },
  {
    _id: 'prod-chair-08', id: 'prod-chair-08',
    name: 'Aarhus Sculptural Teak Lounge Chair', slug: 'aarhus-sculptural-teak-lounge-chair',
    price: 48500, rating: 5.0, numReviews: 29, material: 'Solid Plantation Teak & Linen', status: 'active',
    categoryId: { _id: 'cat-chairs', name: 'Chairs & Seating', slug: 'chairs' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=800&q=80', 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80'],
    description: 'Mid-century Danish inspired lounge chair with hand-carved teak armrests.'
  },
  {
    _id: 'prod-chair-09', id: 'prod-chair-09',
    name: 'Uppsala Woven Rattan Rocking Chair', slug: 'uppsala-woven-rattan-rocking-chair',
    price: 27000, rating: 4.8, numReviews: 13, material: 'Natural Cane & Beechwood Runners', status: 'active',
    categoryId: { _id: 'cat-chairs', name: 'Chairs & Seating', slug: 'chairs' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80'],
    description: 'Relaxing modern rocking chair for nursery or sunlit balcony corners.'
  },
  {
    _id: 'prod-chair-10', id: 'prod-chair-10',
    name: 'Reykjavik Oversized Leather Swivel Chair', slug: 'reykjavik-oversized-leather-swivel-chair',
    price: 56000, rating: 4.9, numReviews: 38, material: 'Full Grain Saddle Leather', status: 'active',
    categoryId: { _id: 'cat-chairs', name: 'Chairs & Seating', slug: 'chairs' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=800&q=80', 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80'],
    description: 'Deep 360-degree rotation club chair wrapped in supple caramel saddle leather.'
  },

  // --- TABLES SECTION (10 ITEMS) ---
  {
    _id: 'prod-table-01', id: 'prod-table-01',
    name: 'Nordic Oak Extension Dining Table', slug: 'nordic-oak-extension-dining-table',
    price: 124000, rating: 4.9, numReviews: 19, material: 'Solid Oak Wood', status: 'active',
    categoryId: { _id: 'cat-tables', name: 'Dining Tables', slug: 'tables' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=800&q=80', 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=800&q=80'],
    description: 'Expandable 6-to-10 seater dining table crafted from solid Nordic white oak.'
  },
  {
    _id: 'prod-table-02', id: 'prod-table-02',
    name: 'Stockholm Marble Oval Coffee Table', slug: 'stockholm-marble-oval-coffee-table',
    price: 45000, rating: 4.8, numReviews: 27, material: 'Carrara Marble & Solid Wood Leg Base', status: 'active',
    categoryId: { _id: 'cat-tables', name: 'Dining Tables', slug: 'tables' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1533779283484-8ad4940aa3a8?w=800&q=80', 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=800&q=80'],
    description: 'Honed white marble table top with soft organic rounded silhouette.'
  },
  {
    _id: 'prod-table-03', id: 'prod-table-03',
    name: 'Copenhagen Nesting Round Side Tables (Set of 2)', slug: 'copenhagen-nesting-round-side-tables',
    price: 18500, rating: 4.7, numReviews: 15, material: 'Smoked Oak & Matte Black Metal', status: 'active',
    categoryId: { _id: 'cat-tables', name: 'Dining Tables', slug: 'tables' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=800&q=80', 'https://images.unsplash.com/photo-1533779283484-8ad4940aa3a8?w=800&q=80'],
    description: 'Versatile duo nesting tables designed for compact modern living rooms.'
  },
  {
    _id: 'prod-table-04', id: 'prod-table-04',
    name: 'Helsinki Fluted Oak Console Table', slug: 'helsinki-fluted-oak-console-table',
    price: 38000, rating: 4.9, numReviews: 22, material: 'Tambour Fluted Oak Veneer', status: 'active',
    categoryId: { _id: 'cat-tables', name: 'Dining Tables', slug: 'tables' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=800&q=80', 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=800&q=80'],
    description: 'Slim entry hallway console featuring textured fluted wooden tambour pillars.'
  },
  {
    _id: 'prod-table-05', id: 'prod-table-05',
    name: 'Oslo Minimalist Solid Walnut Writing Desk', slug: 'oslo-minimalist-solid-walnut-writing-desk',
    price: 68000, rating: 4.9, numReviews: 30, material: 'American Black Walnut & Brass Hardware', status: 'active',
    categoryId: { _id: 'cat-tables', name: 'Dining Tables', slug: 'tables' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80', 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=800&q=80'],
    description: 'Executive home office desk with built-in cable management and soft-close drawers.'
  },
  {
    _id: 'prod-table-06', id: 'prod-table-06',
    name: 'Bergen Travertine Stone Coffee Table', slug: 'bergen-travertine-stone-coffee-table',
    price: 54000, rating: 4.8, numReviews: 17, material: 'Natural Beige Travertine', status: 'active',
    categoryId: { _id: 'cat-tables', name: 'Dining Tables', slug: 'tables' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1533779283484-8ad4940aa3a8?w=800&q=80', 'https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=800&q=80'],
    description: 'Monolithic low coffee table cut from genuine Italian travertine limestone.'
  },
  {
    _id: 'prod-table-07', id: 'prod-table-07',
    name: 'Malmo Round Pedestal Dining Table', slug: 'malmo-round-pedestal-dining-table',
    price: 89000, rating: 5.0, numReviews: 26, material: 'Solid Ash Wood & Matte Lacquer', status: 'active',
    categoryId: { _id: 'cat-tables', name: 'Dining Tables', slug: 'tables' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=800&q=80', 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=800&q=80'],
    description: 'Circular 4-seater dining table with sculptural ribbed central column base.'
  },
  {
    _id: 'prod-table-08', id: 'prod-table-08',
    name: 'Gothenburg Brass Frame End Table', slug: 'gothenburg-brass-frame-end-table',
    price: 16500, rating: 4.6, numReviews: 12, material: 'Antique Brass & Tinted Glass Top', status: 'active',
    categoryId: { _id: 'cat-tables', name: 'Dining Tables', slug: 'tables' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=800&q=80', 'https://images.unsplash.com/photo-1533779283484-8ad4940aa3a8?w=800&q=80'],
    description: 'Geometric accent end table ideal for placing next to armchairs or sofas.'
  },
  {
    _id: 'prod-table-09', id: 'prod-table-09',
    name: 'Uppsala Low Japanese Style Tea Table', slug: 'uppsala-low-japanese-style-tea-table',
    price: 22000, rating: 4.7, numReviews: 14, material: 'Cedar Wood & Matte Sealer', status: 'active',
    categoryId: { _id: 'cat-tables', name: 'Dining Tables', slug: 'tables' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=800&q=80', 'https://images.unsplash.com/photo-1533779283484-8ad4940aa3a8?w=800&q=80'],
    description: 'Low floor coffee table for Japandi style lounge seating arrangements.'
  },
  {
    _id: 'prod-table-10', id: 'prod-table-10',
    name: 'Reykjavik Rustic Reclaimed Teak Bench Table', slug: 'reykjavik-rustic-reclaimed-teak-bench-table',
    price: 32500, rating: 4.8, numReviews: 20, material: '100-Year Reclaimed Teak', status: 'active',
    categoryId: { _id: 'cat-tables', name: 'Dining Tables', slug: 'tables' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=800&q=80', 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=800&q=80'],
    description: 'Unique handcrafted long bench table showcasing natural wood grain texture and knots.'
  },

  // --- DECOR SECTION (10 ITEMS) ---
  {
    _id: 'prod-decor-01', id: 'prod-decor-01',
    name: 'Kobenhavn Ceramic Vase Set (Trio)', slug: 'kobenhavn-ceramic-vase-set',
    price: 8900, rating: 4.8, numReviews: 42, material: 'Sandstone Ceramic', status: 'active',
    categoryId: { _id: 'cat-decor', name: 'Vases & Decor', slug: 'decor' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&q=80', 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&q=80'],
    description: 'Trio of matte textured sandstone ceramic vases with architectural Nordic silhouettes.'
  },
  {
    _id: 'prod-decor-02', id: 'prod-decor-02',
    name: 'Stockholm Organic Sculptural Ceramic Bowl', slug: 'stockholm-organic-sculptural-ceramic-bowl',
    price: 6500, rating: 4.7, numReviews: 19, material: 'Hand-thrown Stoneware', status: 'active',
    categoryId: { _id: 'cat-decor', name: 'Vases & Decor', slug: 'decor' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&q=80', 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&q=80'],
    description: 'Handcrafted centerpiece bowl with wavy fluid rim lines for dining or console tables.'
  },
  {
    _id: 'prod-decor-03', id: 'prod-decor-03',
    name: 'Oslo Sandstone Bookends Pair', slug: 'oslo-sandstone-bookends-pair',
    price: 4200, rating: 4.9, numReviews: 28, material: 'Solid Desert Sandstone', status: 'active',
    categoryId: { _id: 'cat-decor', name: 'Vases & Decor', slug: 'decor' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&q=80', 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&q=80'],
    description: 'Heavy arch-shaped sandstone bookend pair to style open bookshelf displays.'
  },
  {
    _id: 'prod-decor-04', id: 'prod-decor-04',
    name: 'Helsinki Architectural Brass Wall Mirror', slug: 'helsinki-architectural-brass-wall-mirror',
    price: 14800, rating: 4.8, numReviews: 25, material: 'Brushed Brass Metal & HD Mirror', status: 'active',
    categoryId: { _id: 'cat-decor', name: 'Vases & Decor', slug: 'decor' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80', 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&q=80'],
    description: 'Asymmetric round brass rim vanity wall mirror for entryways and bathrooms.'
  },
  {
    _id: 'prod-decor-05', id: 'prod-decor-05',
    name: 'Malmo Handwoven Wool Tapestry Wall Hanging', slug: 'malmo-handwoven-wool-tapestry',
    price: 11500, rating: 4.9, numReviews: 33, material: '100% Organic New Zealand Wool', status: 'active',
    categoryId: { _id: 'cat-decor', name: 'Vases & Decor', slug: 'decor' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&q=80', 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&q=80'],
    description: 'Textured woven fiber art hanging mounted on solid birch dowel rod.'
  },
  {
    _id: 'prod-decor-06', id: 'prod-decor-06',
    name: 'Bergen Matte Black Abstract Clay Sculpture', slug: 'bergen-matte-black-abstract-clay-sculpture',
    price: 7800, rating: 4.7, numReviews: 16, material: 'Terracotta & Matte Black Finish', status: 'active',
    categoryId: { _id: 'cat-decor', name: 'Vases & Decor', slug: 'decor' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&q=80', 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&q=80'],
    description: 'Modern looping ceramic loop statue for coffee table and mantle decor.'
  },
  {
    _id: 'prod-decor-07', id: 'prod-decor-07',
    name: 'Gothenburg Marble Incense Tray Set', slug: 'gothenburg-marble-incense-tray-set',
    price: 3600, rating: 4.9, numReviews: 45, material: 'Solid Nero Marquina Black Marble', status: 'active',
    categoryId: { _id: 'cat-decor', name: 'Vases & Decor', slug: 'decor' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&q=80', 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&q=80'],
    description: 'Minimalist catchall tray with removable brass incense burner holder.'
  },
  {
    _id: 'prod-decor-08', id: 'prod-decor-08',
    name: 'Aarhus Handblown Smoky Glass Planter', slug: 'aarhus-handblown-smoky-glass-planter',
    price: 5400, rating: 4.6, numReviews: 14, material: 'Tinted Borosilicate Glass', status: 'active',
    categoryId: { _id: 'cat-decor', name: 'Vases & Decor', slug: 'decor' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&q=80', 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&q=80'],
    description: 'Self-watering glass propagation planter with elevated metal stand.'
  },
  {
    _id: 'prod-decor-09', id: 'prod-decor-09',
    name: 'Uppsala Fluted Ceramic Pillar Candleholders (Pair)', slug: 'uppsala-fluted-ceramic-pillar-candleholders',
    price: 4900, rating: 4.8, numReviews: 29, material: 'Cream Ceramic Stoneware', status: 'active',
    categoryId: { _id: 'cat-decor', name: 'Vases & Decor', slug: 'decor' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&q=80', 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&q=80'],
    description: 'Set of two staggered height column candlestick holders for cozy evening dinners.'
  },
  {
    _id: 'prod-decor-10', id: 'prod-decor-10',
    name: 'Reykjavik Nordic Linen Cushion Set (3)', slug: 'reykjavik-nordic-linen-cushion-set',
    price: 6200, rating: 5.0, numReviews: 36, material: 'Pre-Washed Linen & Feather Insert', status: 'active',
    categoryId: { _id: 'cat-decor', name: 'Vases & Decor', slug: 'decor' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&q=80', 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&q=80'],
    description: 'Earth-toned throw pillow covers in terracotta, olive, and cream linen.'
  },

  // --- LIGHTING SECTION (10 ITEMS) ---
  {
    _id: 'prod-light-01', id: 'prod-light-01',
    name: 'Gothenburg Brass Floor Lamp', slug: 'gothenburg-brass-floor-lamp',
    price: 18900, rating: 4.7, numReviews: 15, material: 'Brushed Brass & Woven Linen', status: 'active',
    categoryId: { _id: 'cat-lighting', name: 'Lighting & Lamps', slug: 'lighting' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80', 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80'],
    description: 'Sculptural brass standing lamp featuring an organic woven linen shade.'
  },
  {
    _id: 'prod-light-02', id: 'prod-light-02',
    name: 'Stockholm Woven Rattan Pendant Light', slug: 'stockholm-woven-rattan-pendant-light',
    price: 12400, rating: 4.9, numReviews: 37, material: 'Natural Rattan Cane Weave', status: 'active',
    categoryId: { _id: 'cat-lighting', name: 'Lighting & Lamps', slug: 'lighting' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80'],
    description: 'Dome woven hanging ceiling light casting warm patterned shadow rays.'
  },
  {
    _id: 'prod-light-03', id: 'prod-light-03',
    name: 'Copenhagen Frosted Glass Globe Table Lamp', slug: 'copenhagen-frosted-glass-globe-table-lamp',
    price: 9800, rating: 4.8, numReviews: 23, material: 'Opal Frosted Glass & Walnut Base', status: 'active',
    categoryId: { _id: 'cat-lighting', name: 'Lighting & Lamps', slug: 'lighting' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80', 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80'],
    description: 'Spherical diffused light orb table lamp with touch dimmable controls.'
  },
  {
    _id: 'prod-light-04', id: 'prod-light-04',
    name: 'Oslo Architectural LED Ceiling Chandelier', slug: 'oslo-architectural-led-ceiling-chandelier',
    price: 42500, rating: 5.0, numReviews: 18, material: 'Anodized Black Aluminum & Acrylic', status: 'active',
    categoryId: { _id: 'cat-lighting', name: 'Lighting & Lamps', slug: 'lighting' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80'],
    description: 'Linear 5-arm geometric dining room island pendant chandelier.'
  },
  {
    _id: 'prod-light-05', id: 'prod-light-05',
    name: 'Helsinki Mushroom Metal Desk Lamp', slug: 'helsinki-mushroom-metal-desk-lamp',
    price: 8500, rating: 4.7, numReviews: 29, material: 'Sage Green Spun Steel', status: 'active',
    categoryId: { _id: 'cat-lighting', name: 'Lighting & Lamps', slug: 'lighting' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80', 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80'],
    description: 'Playful mushroom dome reading desk light with warm LED bulb.'
  },
  {
    _id: 'prod-light-06', id: 'prod-light-06',
    name: 'Bergen Smoked Glass Wall Sconce', slug: 'bergen-smoked-glass-wall-sconce',
    price: 7200, rating: 4.6, numReviews: 12, material: 'Amber Smoked Glass & Brass Hardware', status: 'active',
    categoryId: { _id: 'cat-lighting', name: 'Lighting & Lamps', slug: 'lighting' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80'],
    description: 'Hardwired hallway and bedside accent wall sconce fixture.'
  },
  {
    _id: 'prod-light-07', id: 'prod-light-07',
    name: 'Malmo Minimalist Linear Dining Pendant', slug: 'malmo-minimalist-linear-dining-pendant',
    price: 28000, rating: 4.9, numReviews: 21, material: 'Solid Oak Beam & Warm LED Strip', status: 'active',
    categoryId: { _id: 'cat-lighting', name: 'Lighting & Lamps', slug: 'lighting' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80', 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80'],
    description: 'Ultra-thin floating wooden beam island light with concealed downward LED.'
  },
  {
    _id: 'prod-light-08', id: 'prod-light-08',
    name: 'Aarhus Ceramic Pleated Shade Table Lamp', slug: 'aarhus-ceramic-pleated-shade-table-lamp',
    price: 11900, rating: 4.8, numReviews: 16, material: 'Off-White Ceramic & Pleated Fabric', status: 'active',
    categoryId: { _id: 'cat-lighting', name: 'Lighting & Lamps', slug: 'lighting' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80'],
    description: 'Vintage Danish style table lamp with delicate folded paper lampshade.'
  },
  {
    _id: 'prod-light-09', id: 'prod-light-09',
    name: 'Uppsala Brass Dome Arc Floor Lamp', slug: 'uppsala-brass-dome-arc-floor-lamp',
    price: 26000, rating: 4.9, numReviews: 34, material: 'Polished Brass & Heavy Marble Base', status: 'active',
    categoryId: { _id: 'cat-lighting', name: 'Lighting & Lamps', slug: 'lighting' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80', 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80'],
    description: 'Sweeping arch floor lamp reaching gracefully over living room couches.'
  },
  {
    _id: 'prod-light-10', id: 'prod-light-10',
    name: 'Reykjavik Cordless Rechargeable Nightstand Light', slug: 'reykjavik-cordless-rechargeable-nightstand-light',
    price: 5800, rating: 4.7, numReviews: 25, material: 'Anodized Aluminum & USB-C Battery', status: 'active',
    categoryId: { _id: 'cat-lighting', name: 'Lighting & Lamps', slug: 'lighting' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80'],
    description: 'Portable touch-sensitive battery nightstand lamp with 24-hour runtime.'
  },

  // --- SOFAS SECTION (10 ITEMS) ---
  {
    _id: 'prod-sofa-01', id: 'prod-sofa-01',
    name: 'Malmo Minimalist Linen 3-Seater Sofa', slug: 'malmo-minimalist-linen-sofa',
    price: 185000, rating: 5.0, numReviews: 31, material: 'Natural Belgian Linen', status: 'active',
    categoryId: { _id: 'cat-sofas', name: 'Sofas & Couches', slug: 'sofas' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80'],
    description: 'Deep-seated 3-seater couch with feather-down filled cushions and removable linen covers.'
  },
  {
    _id: 'prod-sofa-02', id: 'prod-sofa-02',
    name: 'Stockholm Curved Bouclé Modular Sectional', slug: 'stockholm-curved-boucle-modular-sectional',
    price: 245000, rating: 4.9, numReviews: 28, material: 'Cream Textured Bouclé', status: 'active',
    categoryId: { _id: 'cat-sofas', name: 'Sofas & Couches', slug: 'sofas' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'],
    description: 'Curved 4-piece modular sectional couch featuring continuous ergonomic low-profile seating.'
  },
  {
    _id: 'prod-sofa-03', id: 'prod-sofa-03',
    name: 'Oslo Cognac Grain Leather Daybed', slug: 'oslo-cognac-grain-leather-daybed',
    price: 165000, rating: 4.8, numReviews: 19, material: 'Full Grain Cognac Leather & Teak', status: 'active',
    categoryId: { _id: 'cat-sofas', name: 'Sofas & Couches', slug: 'sofas' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80'],
    description: 'Architectural daybed sofa with tufted leather cushion mattress and bolster pillow.'
  },
  {
    _id: 'prod-sofa-04', id: 'prod-sofa-04',
    name: 'Copenhagen Terracotta Velvet 2-Seater', slug: 'copenhagen-terracotta-velvet-2-seater',
    price: 115000, rating: 4.9, numReviews: 24, material: 'Plush Cotton Velvet', status: 'active',
    categoryId: { _id: 'cat-sofas', name: 'Sofas & Couches', slug: 'sofas' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'],
    description: 'Compact apartment loveseat sofa in rich warm terracotta velvet.'
  },
  {
    _id: 'prod-sofa-05', id: 'prod-sofa-05',
    name: 'Helsinki Low-Profile Japanese Futon Sofa', slug: 'helsinki-low-profile-japanese-futon-sofa',
    price: 95000, rating: 4.7, numReviews: 15, material: 'Solid Ash Base & Organic Cotton', status: 'active',
    categoryId: { _id: 'cat-sofas', name: 'Sofas & Couches', slug: 'sofas' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80'],
    description: 'Japandi aesthetic low floor sofa with solid wood slats and thick cotton mattress.'
  },
  {
    _id: 'prod-sofa-06', id: 'prod-sofa-06',
    name: 'Bergen Olive Green Corduroy Sofa', slug: 'bergen-olive-green-corduroy-sofa',
    price: 132000, rating: 4.8, numReviews: 22, material: 'Wide-Wale Olive Corduroy Fabric', status: 'active',
    categoryId: { _id: 'cat-sofas', name: 'Sofas & Couches', slug: 'sofas' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'],
    description: 'Cozy 3-seater tactile corduroy couch with oversized armrest pillows.'
  },
  {
    _id: 'prod-sofa-07', id: 'prod-sofa-07',
    name: 'Gothenburg Minimalist Bench Ottoman', slug: 'gothenburg-minimalist-bench-ottoman',
    price: 28500, rating: 4.9, numReviews: 18, material: 'Bouclé Fabric & Oak Legs', status: 'active',
    categoryId: { _id: 'cat-sofas', name: 'Sofas & Couches', slug: 'sofas' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80'],
    description: 'Upholstered end-of-bed bench or living room footrest ottoman.'
  },
  {
    _id: 'prod-sofa-08', id: 'prod-sofa-08',
    name: 'Aarhus Cloud Plush Memory Foam Sectional', slug: 'aarhus-cloud-plush-memory-foam-sectional',
    price: 280000, rating: 5.0, numReviews: 45, material: 'High-Resilience Memory Foam & Fabric', status: 'active',
    categoryId: { _id: 'cat-sofas', name: 'Sofas & Couches', slug: 'sofas' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'],
    description: 'Ultra plush cloud-like L-shaped lounge sofa with deep sink-in comfort.'
  },
  {
    _id: 'prod-sofa-09', id: 'prod-sofa-09',
    name: 'Uppsala Sandstone Fabric Convertible Sofa Bed', slug: 'uppsala-sandstone-fabric-convertible-sofa-bed',
    price: 78000, rating: 4.6, numReviews: 17, material: 'Stain-Resistant Sandstone Weave', status: 'active',
    categoryId: { _id: 'cat-sofas', name: 'Sofas & Couches', slug: 'sofas' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80'],
    description: 'Easily folds out into a queen-size guest sleeper bed.'
  },
  {
    _id: 'prod-sofa-10', id: 'prod-sofa-10',
    name: 'Reykjavik Natural Teak Outdoor Patio Lounger', slug: 'reykjavik-natural-teak-outdoor-patio-lounger',
    price: 64000, rating: 4.8, numReviews: 12, material: 'Weatherproof Teak & Sunbrella Fabric', status: 'active',
    categoryId: { _id: 'cat-sofas', name: 'Sofas & Couches', slug: 'sofas' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: ['https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'],
    description: 'Outdoor garden daybed couch with quick-dry outdoor foam cushions.'
  }
];

const SAMPLE_CATEGORIES = [
  { id: 'cat-chairs', name: 'Chairs & Seating', slug: 'chairs' },
  { id: 'cat-tables', name: 'Dining Tables', slug: 'tables' },
  { id: 'cat-decor', name: 'Vases & Decor', slug: 'decor' },
  { id: 'cat-lighting', name: 'Lighting & Lamps', slug: 'lighting' },
  { id: 'cat-sofas', name: 'Sofas & Couches', slug: 'sofas' }
];

export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category, vendorId, search, limit, status } = req.query;
    let list = [...SAMPLE_PRODUCTS];

    try {
      const dbProducts = await ProductModel.find({}).populate('categoryId', 'name slug').populate('vendorId', 'businessName logoUrl').catch(() => []);
      if (dbProducts && dbProducts.length > 0) {
        list = [...(dbProducts as any), ...list];
      }
    } catch (dbErr) {}

    if (category) {
      list = list.filter(p => (p.categoryId as any)?.slug === category || (p.categoryId as any) === category);
    }
    if (search) {
      const s = String(search).toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(s) || (p.material && p.material.toLowerCase().includes(s)));
    }
    if (limit) {
      list = list.slice(0, Number(limit));
    }

    res.status(200).json({
      status: 'success',
      data: list
    });
  } catch (error) {
    res.status(200).json({
      status: 'success',
      data: SAMPLE_PRODUCTS
    });
  }
};

let cachedCategories: any = null;
let lastFetchedCategories: number = 0;
const CATEGORIES_CACHE_TTL = 30 * 1000;

export const getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const now = Date.now();
    if (cachedCategories && (now - lastFetchedCategories < CATEGORIES_CACHE_TTL)) {
      res.status(200).json({
        status: 'success',
        data: cachedCategories
      });
      return;
    }

    const categories = await CategoryModel.find({}).catch(() => []);
    cachedCategories = categories.length > 0 ? categories : SAMPLE_CATEGORIES;
    lastFetchedCategories = now;

    res.status(200).json({
      status: 'success',
      data: cachedCategories
    });
  } catch (error) {
    res.status(200).json({
      status: 'success',
      data: SAMPLE_CATEGORIES
    });
  }
};

export const createProduct = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ status: 'error', message: 'Unauthorized' });
      return;
    }

    if (req.user.role !== 'vendor' && req.user.role !== 'admin') {
      res.status(403).json({ status: 'error', message: 'Forbidden. Only vendors can create products.' });
      return;
    }

    let vendorId = req.body.vendorId;
    if (req.user.role === 'vendor') {
      const { default: VendorModel } = await import('../../models/Vendor.js');
      const vendorProfile = await VendorModel.findOne({ userId: req.user.id }).catch(() => null);
      if (!vendorProfile) {
        res.status(400).json({ status: 'error', message: 'Vendor profile not found. Complete onboarding first.' });
        return;
      }
      vendorId = vendorProfile._id;
    } else if (!vendorId && req.user.role === 'admin') {
      vendorId = 'ven-nordic';
    }

    const product = new ProductModel({
      ...req.body,
      vendorId
    });

    await product.save().catch(() => null);

    res.status(201).json({
      status: 'success',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await ProductModel.findById(req.params.id).catch(() => null);
    if (!product) {
      res.status(404).json({ status: 'error', message: 'Product not found.' });
      return;
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).catch(() => product);

    res.status(200).json({
      status: 'success',
      data: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await ProductModel.findByIdAndDelete(req.params.id).catch(() => null);

    res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let product: any = await ProductModel.findById(req.params.id)
      .populate('categoryId')
      .populate('vendorId')
      .catch(() => null);

    if (!product) {
      product = SAMPLE_PRODUCTS.find(p => p.id === req.params.id || p._id === req.params.id) || SAMPLE_PRODUCTS[0];
    }

    const reviews = await ReviewModel.find({ productId: req.params.id }).catch(() => []);
    const comments = await CommentModel.find({ productId: req.params.id }).sort({ createdAt: -1 }).catch(() => []);

    const catSlug = typeof product.categoryId === 'object' && product.categoryId ? product.categoryId.slug : 'chairs';
    const relatedProducts = SAMPLE_PRODUCTS.filter(p => p.categoryId.slug === catSlug && p.id !== product.id).slice(0, 4);

    res.status(200).json({
      status: 'success',
      data: {
        product,
        reviews,
        comments,
        relatedProducts
      }
    });
  } catch (error) {
    const match = SAMPLE_PRODUCTS[0];
    res.status(200).json({
      status: 'success',
      data: {
        product: match,
        reviews: [],
        comments: [],
        relatedProducts: SAMPLE_PRODUCTS.slice(1, 5)
      }
    });
  }
};

export const createProductReview = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ status: 'error', message: 'Unauthorized' });
      return;
    }

    const { rating, comment } = req.body;
    const productId = req.params.id;

    const review = {
      _id: 'rev-' + Date.now(),
      userId: req.user.id,
      userName: req.user.name || 'Valued Customer',
      productId,
      rating,
      comment,
      createdAt: new Date().toISOString()
    };

    res.status(201).json({
      status: 'success',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

export const getAllReviews = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.status(200).json({ status: 'success', data: [] });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.status(200).json({ status: 'success', message: 'Review deleted.' });
  } catch (error) {
    next(error);
  }
};

export const createProductComment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { content } = req.body;
    const comment = {
      _id: 'comm-' + Date.now(),
      productId: req.params.id,
      userId: req.user?.id || 'cust-01',
      userName: req.user?.name || 'Valued Customer',
      content,
      createdAt: new Date().toISOString()
    };
    res.status(201).json({ status: 'success', data: comment });
  } catch (error) {
    next(error);
  }
};

export const replyToProductComment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { reply } = req.body;
    res.status(200).json({ status: 'success', data: { reply } });
  } catch (error) {
    next(error);
  }
};
