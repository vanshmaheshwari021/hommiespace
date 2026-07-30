import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import ProductModel from '../../models/Product.js';
import CategoryModel from '../../models/Category.js';
import ReviewModel from '../../models/Review.js';
import CommentModel from '../../models/Comment.js';

export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category, vendorId, search, limit, status } = req.query;
    const filter: any = {};

    if (category) {
      const cat = await CategoryModel.findOne({ slug: category as string });
      if (cat) {
        filter.categoryId = cat._id;
      }
    }

    if (vendorId) {
      filter.vendorId = vendorId;
    }

    if (search) {
      filter.name = { $regex: search as string, $options: 'i' };
    }

    if (status) {
      filter.status = status as string;
    }

    let query = ProductModel.find(filter)
      .populate('categoryId', 'name slug')
      .populate('vendorId', 'businessName logoUrl');

    if (limit) {
      query = query.limit(Number(limit));
    }

    const products = await query;

    res.status(200).json({
      status: 'success',
      data: products
    });
  } catch (error) {
    next(error);
  }
};
let cachedCategories: any = null;
let lastFetchedCategories: number = 0;
const CATEGORIES_CACHE_TTL = 30 * 1000; // Cache categories for 30 seconds to allow edits/additions but remain performant

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
    cachedCategories = categories;
    lastFetchedCategories = now;

    res.status(200).json({
      status: 'success',
      data: categories
    });
  } catch (error) {
    next(error);
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
      .populate('vendorId');
      
    if (!product) {
      res.status(404).json({ status: 'error', message: 'Product not found.' });
      return;
    }

    const reviews = await ReviewModel.find({ productId: product._id });
    const comments = await CommentModel.find({ productId: product._id }).sort({ createdAt: -1 });

    // Recommendation Algorithm: Fetch related products in the same category (excluding current product)
    const catId = typeof product.categoryId === 'object' && product.categoryId ? (product.categoryId as any)._id : product.categoryId;
    const relatedProducts = await ProductModel.find({
      categoryId: catId,
      _id: { $ne: product._id },
      status: 'active'
    }).limit(4);

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
    next(error);
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
