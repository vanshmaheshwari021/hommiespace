import { Router } from 'express';
import { getCoupons, upsertCoupon, deleteCoupon, applyCoupon } from './coupons.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { couponSchema } from '@hommiespace/shared';

const router = Router();

router.get('/', getCoupons);
router.post('/apply', applyCoupon);
router.post('/', requireAuth, validate(couponSchema), upsertCoupon);
router.delete('/:id', requireAuth, deleteCoupon);

export default router;
