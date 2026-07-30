import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.js';

export const requireRole = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ status: 'error', message: 'Unauthorized. Not logged in.' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ status: 'error', message: 'Forbidden. Insufficient permissions.' });
      return;
    }

    next();
  };
};
export default requireRole;
