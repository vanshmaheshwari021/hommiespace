import { Router } from 'express';
import { onboardVendor, getVendorProfile, getAllVendors, approveVendor } from './vendors.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { vendorOnboardingSchema } from '@hommiespace/shared';

const router = Router();

router.put('/onboard', requireAuth, validate(vendorOnboardingSchema), onboardVendor);
router.get('/profile', requireAuth, getVendorProfile);
router.get('/', requireAuth, getAllVendors);
router.put('/:id/approve', requireAuth, approveVendor);

export default router;
