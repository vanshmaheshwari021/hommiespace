import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import TicketModel from '../../models/Ticket.js';

export const getTickets = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ status: 'error', message: 'Unauthorized' });
      return;
    }

    const filter: any = {};
    if (req.user.role === 'customer') {
      filter.userId = req.user.id;
    }

    const tickets = await TicketModel.find(filter).sort({ updatedAt: -1 });
    res.status(200).json({ status: 'success', data: tickets });
  } catch (error) {
    next(error);
  }
};

export const createTicket = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ status: 'error', message: 'Unauthorized' });
      return;
    }

    const { subject, message } = req.body;
    const ticket = new TicketModel({
      userId: req.user.id,
      customerName: req.user.name || 'Anonymous Customer',
      customerEmail: req.user.email,
      subject,
      message,
      replies: []
    });

    await ticket.save();
    res.status(201).json({ status: 'success', data: ticket });
  } catch (error) {
    next(error);
  }
};

export const replyTicket = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ status: 'error', message: 'Unauthorized' });
      return;
    }

    const { message } = req.body;
    const ticket = await TicketModel.findById(req.params.id);

    if (!ticket) {
      res.status(404).json({ status: 'error', message: 'Ticket not found.' });
      return;
    }

    if (req.user.role === 'customer' && ticket.userId.toString() !== req.user.id) {
      res.status(403).json({ status: 'error', message: 'Forbidden.' });
      return;
    }

    ticket.replies.push({
      senderRole: req.user.role as any,
      senderName: req.user.name || 'Support Staff',
      message,
      createdAt: new Date()
    });

    if (req.user.role !== 'customer') {
      ticket.status = 'in-progress';
    }

    await ticket.save();
    res.status(200).json({ status: 'success', data: ticket });
  } catch (error) {
    next(error);
  }
};

export const updateTicketStatus = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'staff')) {
      res.status(403).json({ status: 'error', message: 'Forbidden.' });
      return;
    }

    const { status } = req.body;
    const ticket = await TicketModel.findById(req.params.id);

    if (!ticket) {
      res.status(404).json({ status: 'error', message: 'Ticket not found.' });
      return;
    }

    ticket.status = status;
    await ticket.save();

    res.status(200).json({ status: 'success', data: ticket });
  } catch (error) {
    next(error);
  }
};
