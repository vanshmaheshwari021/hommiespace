import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import ProductModel from '../../models/Product.js';
import CategoryModel from '../../models/Category.js';
import ReviewModel from '../../models/Review.js';
import CommentModel from '../../models/Comment.js';

const SAMPLE_PRODUCTS = [
  {
    _id: '66a81f92e0123456789aaa01',
    id: '66a81f92e0123456789aaa01',
    name: 'Stockholm Velvet Armchair',
    slug: 'stockholm-velvet-armchair',
    price: 29500,
    rating: 4.9,
    numReviews: 24,
    material: 'Velvet & Solid Oak Wood',
    status: 'active',
    categoryId: { _id: 'cat-chairs', name: 'Chairs & Seating', slug: 'chairs' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: [
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80',
      'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=800&q=80'
    ],
    colorVariants: [
      { name: 'Terracotta Velvet', colorCode: '#BC6C58', stock: 12, priceOffset: 0 },
      { name: 'Sandstone Grey', colorCode: '#C8C2B9', stock: 8, priceOffset: 0 }
    ],
    dimensions: { length: 85, width: 80, height: 90, unit: 'cm' },
    weight: { value: 18, unit: 'kg' },
    description: 'An iconic Scandinavian lounge armchair crafted with solid kiln-dried oak wood and luxurious velvet upholstery.'
  },
  {
    _id: '66a81f92e0123456789aaa02',
    id: '66a81f92e0123456789aaa02',
    name: 'Nordic Oak Dining Table',
    slug: 'nordic-oak-dining-table',
    price: 124000,
    rating: 4.9,
    numReviews: 19,
    material: 'Solid Oak Wood',
    status: 'active',
    categoryId: { _id: 'cat-tables', name: 'Dining Tables', slug: 'tables' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: [
      'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=800&q=80',
      'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=800&q=80'
    ],
    colorVariants: [
      { name: 'Natural White Oak', colorCode: '#D4B896', stock: 5, priceOffset: 0 },
      { name: 'Smoked Walnut', colorCode: '#3D2E26', stock: 3, priceOffset: 5000 }
    ],
    dimensions: { length: 200, width: 95, height: 75, unit: 'cm' },
    weight: { value: 55, unit: 'kg' },
    description: 'Handcrafted solid oak dining table featuring soft curved edges and minimalist organic leg profiles.'
  },
  {
    _id: '66a81f92e0123456789aaa03',
    id: '66a81f92e0123456789aaa03',
    name: 'Kobenhavn Ceramic Vase Set',
    slug: 'kobenhavn-ceramic-vase-set',
    price: 8900,
    rating: 4.8,
    numReviews: 42,
    material: 'Sandstone Ceramic',
    status: 'active',
    categoryId: { _id: 'cat-decor', name: 'Vases & Decor', slug: 'decor' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: [
      'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&q=80',
      'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&q=80'
    ],
    colorVariants: [
      { name: 'Sandstone Off-White', colorCode: '#FAF8F5', stock: 25, priceOffset: 0 }
    ],
    dimensions: { length: 25, width: 25, height: 35, unit: 'cm' },
    weight: { value: 3.5, unit: 'kg' },
    description: 'Minimalist trio ceramic vase set with tactile matte texture inspired by modern Copenhagen architecture.'
  },
  {
    _id: '66a81f92e0123456789aaa04',
    id: '66a81f92e0123456789aaa04',
    name: 'Gothenburg Brass Floor Lamp',
    slug: 'gothenburg-brass-floor-lamp',
    price: 18900,
    rating: 4.7,
    numReviews: 15,
    material: 'Brushed Brass & Linen',
    status: 'active',
    categoryId: { _id: 'cat-lighting', name: 'Lighting & Lamps', slug: 'lighting' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80'
    ],
    colorVariants: [
      { name: 'Brushed Gold Brass', colorCode: '#C5A059', stock: 10, priceOffset: 0 }
    ],
    dimensions: { length: 45, width: 45, height: 160, unit: 'cm' },
    weight: { value: 8, unit: 'kg' },
    description: 'Sculptural brass floor standing lamp featuring an organic woven linen shade for soft ambient illumination.'
  },
  {
    _id: '66a81f92e0123456789aaa05',
    id: '66a81f92e0123456789aaa05',
    name: 'Malmo Minimalist Linen Sofa',
    slug: 'malmo-minimalist-linen-sofa',
    price: 185000,
    rating: 5.0,
    numReviews: 31,
    material: 'Natural Belgian Linen',
    status: 'active',
    categoryId: { _id: 'cat-sofas', name: 'Sofas & Couches', slug: 'sofas' },
    vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio', logoUrl: '/logo.png' },
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80'
    ],
    colorVariants: [
      { name: 'Oatmeal Natural Linen', colorCode: '#E3DAC9', stock: 4, priceOffset: 0 }
    ],
    dimensions: { length: 240, width: 100, height: 82, unit: 'cm' },
    weight: { value: 72, unit: 'kg' },
    description: 'Deep-seated 3-seater couch crafted with feather-down filled cushions and removable Belgian linen covers.'
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
    const filter: any = {};

    if (category) {
      const cat = await CategoryModel.findOne({ slug: category as string }).catch(() => null);
      if (cat) {
        filter.categoryId = cat._id;
      }
    }

    if (vendorId) filter.vendorId = vendorId;
    if (search) filter.name = { $regex: search as string, $options: 'i' };
    if (status) filter.status = status as string;

    let query = ProductModel.find(filter)
      .populate('categoryId', 'name slug')
      .populate('vendorId', 'businessName logoUrl');

    if (limit) query = query.limit(Number(limit));

    const products = await query;
    res.status(200).json({
      status: 'success',
      data: products.length > 0 ? products : SAMPLE_PRODUCTS
    });
  } catch (error) {
    console.warn('MongoDB offline/buffering. Serving fallback products catalog.');
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

    const categories = await CategoryModel.find({});
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
      const vendorProfile = await VendorModel.findOne({ userId: req.user.id });
      if (!vendorProfile) {
        res.status(400).json({ status: 'error', message: 'Vendor profile not found. Complete onboarding first.' });
        return;
      }
      vendorId = vendorProfile._id;
    } else if (!vendorId && req.user.role === 'admin') {
      const { default: VendorModel } = await import('../../models/Vendor.js');
      const firstVendor = await VendorModel.findOne({});
      if (firstVendor) {
        vendorId = firstVendor._id;
      } else {
        vendorId = 'ven-nordic';
      }
    }

    const product = new ProductModel({
      ...req.body,
      vendorId
    });

    await product.save();

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
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      res.status(404).json({ status: 'error', message: 'Product not found.' });
      return;
    }

    if (req.user?.role === 'vendor') {
      const { default: VendorModel } = await import('../../models/Vendor.js');
      const vendorProfile = await VendorModel.findOne({ userId: req.user.id });
      if (!vendorProfile || product.vendorId.toString() !== vendorProfile._id.toString()) {
        res.status(403).json({ status: 'error', message: 'Forbidden. You do not own this product.' });
        return;
      }
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )
      .populate('categoryId', 'name slug')
      .populate('vendorId', 'businessName logoUrl');

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
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      res.status(404).json({ status: 'error', message: 'Product not found.' });
      return;
    }

    if (req.user?.role === 'vendor') {
      const { default: VendorModel } = await import('../../models/Vendor.js');
      const vendorProfile = await VendorModel.findOne({ userId: req.user.id });
      if (!vendorProfile || product.vendorId.toString() !== vendorProfile._id.toString()) {
        res.status(403).json({ status: 'error', message: 'Forbidden. You do not own this product.' });
        return;
      }
    }

    await ProductModel.findByIdAndDelete(req.params.id);

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
    const product = await ProductModel.findById(req.params.id)
      .populate('categoryId')
      .populate('vendorId')
      .catch(() => null);

    if (!product) {
      const match = SAMPLE_PRODUCTS.find(p => p.id === req.params.id || p._id === req.params.id) || SAMPLE_PRODUCTS[0];
      res.status(200).json({
        status: 'success',
        data: {
          product: match,
          reviews: [],
          comments: [],
          relatedProducts: SAMPLE_PRODUCTS.filter(p => p.id !== match.id).slice(0, 4)
        }
      });
      return;
    }

    const reviews = await ReviewModel.find({ productId: product._id }).catch(() => []);
    const comments = await CommentModel.find({ productId: product._id }).sort({ createdAt: -1 }).catch(() => []);

    const catId = typeof product.categoryId === 'object' && product.categoryId ? (product.categoryId as any)._id : product.categoryId;
    const relatedProducts = await ProductModel.find({
      categoryId: catId,
      _id: { $ne: product._id },
      status: 'active'
    }).limit(4).catch(() => []);

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

    const product = await ProductModel.findById(productId);
    if (!product) {
      res.status(404).json({ status: 'error', message: 'Product not found.' });
      return;
    }

    const review = new ReviewModel({
      userId: req.user.id,
      userName: req.user.name || 'Anonymous Customer',
      productId,
      rating,
      comment,
      isApproved: true
    });
    await review.save();

    const reviews = await ReviewModel.find({ productId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    product.rating = parseFloat(avgRating.toFixed(1));
    product.numReviews = reviews.length;
    await product.save();

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
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ status: 'error', message: 'Forbidden. Admin only.' });
      return;
    }
    const reviews = await ReviewModel.find({}).populate('productId', 'name');
    res.status(200).json({ status: 'success', data: reviews });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ status: 'error', message: 'Forbidden. Admin only.' });
      return;
    }
    await ReviewModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: 'success', message: 'Review deleted.' });
  } catch (error) {
    next(error);
  }
};

export const createProductComment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ status: 'error', message: 'Unauthorized' });
      return;
    }
    const { content } = req.body;
    const productId = req.params.id;
    const comment = new CommentModel({
      productId,
      userId: req.user.id,
      userName: req.user.name || 'Anonymous Customer',
      content
    });
    await comment.save();
    res.status(201).json({ status: 'success', data: comment });
  } catch (error) {
    next(error);
  }
};

export const replyToProductComment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'vendor')) {
      res.status(403).json({ status: 'error', message: 'Forbidden. Admin or Vendor only.' });
      return;
    }
    const { reply } = req.body;
    const comment = await CommentModel.findById(req.params.commentId);
    if (!comment) {
      res.status(404).json({ status: 'error', message: 'Comment not found.' });
      return;
    }
    comment.reply = reply;
    await comment.save();
    res.status(200).json({ status: 'success', data: comment });
  } catch (error) {
    next(error);
  }
};
