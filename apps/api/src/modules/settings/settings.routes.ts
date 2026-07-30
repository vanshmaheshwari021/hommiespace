import { Router } from 'express';
import { getSettings, updateSettings } from './settings.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { settingsSchema } from '@hommiespace/shared';

const router = Router();

router.get('/', getSettings);
router.put('/', requireAuth, validate(settingsSchema), updateSettings);

export default router;
