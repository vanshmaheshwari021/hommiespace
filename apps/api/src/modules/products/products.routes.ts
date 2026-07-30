import { Router } from 'express';
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct, getProductById, createProductReview, getAllReviews, deleteReview, createProductComment, replyToProductComment } from './products.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { productSchema } from '@hommiespace/shared';

const router = Router();

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/reviews/all', requireAuth, getAllReviews);
router.delete('/reviews/:id', requireAuth, deleteReview);
router.get('/:id', getProductById);
router.post('/:id/reviews', requireAuth, createProductReview);
router.post('/:id/comments', requireAuth, createProductComment);
router.post('/:id/comments/:commentId/reply', requireAuth, replyToProductComment);
router.post('/', requireAuth, validate(productSchema), createProduct);
router.put('/:id', requireAuth, validate(productSchema.partial()), updateProduct);
router.delete('/:id', requireAuth, deleteProduct);

export default router;
