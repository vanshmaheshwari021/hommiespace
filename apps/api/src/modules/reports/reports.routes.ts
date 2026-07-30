import { Router } from 'express';
import { getAnalyticsStats, getCSVReport, getActivityLogs } from './reports.controller.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();

router.get('/stats', requireAuth, getAnalyticsStats);
router.get('/csv', requireAuth, getCSVReport);
router.get('/activity-logs', requireAuth, getActivityLogs);

export default router;
