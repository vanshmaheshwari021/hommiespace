import { Router } from 'express';
import { createEnquiry, getMyEnquiries } from './enquiries.controller.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();

router.post('/', requireAuth, createEnquiry);
router.get('/', requireAuth, getMyEnquiries);

export default router;
