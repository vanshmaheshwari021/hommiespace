import { Router } from 'express';
import { getCMSPages, getCMSPageBySlug, upsertCMSPage, deleteCMSPage } from './cms.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { cmsPageSchema } from '@hommiespace/shared';

const router = Router();

router.get('/', getCMSPages);
router.get('/:slug', getCMSPageBySlug);
router.post('/', requireAuth, validate(cmsPageSchema), upsertCMSPage);
router.delete('/:id', requireAuth, deleteCMSPage);

export default router;
