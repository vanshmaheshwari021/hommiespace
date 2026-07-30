import { Router } from 'express';
import { getTickets, createTicket, replyTicket, updateTicketStatus } from './tickets.controller.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, getTickets);
router.post('/', requireAuth, createTicket);
router.post('/:id/reply', requireAuth, replyTicket);
router.put('/:id/status', requireAuth, updateTicketStatus);

export default router;
