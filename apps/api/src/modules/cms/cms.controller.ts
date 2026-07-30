import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import CMSPageModel from '../../models/CMSPage.js';

export const getCMSPages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const pages = await CMSPageModel.find({});
    res.status(200).json({ status: 'success', data: pages });
  } catch (error) {
    next(error);
  }
};

export const getCMSPageBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = await CMSPageModel.findOne({ slug: req.params.slug });
    if (!page) {
      res.status(404).json({ status: 'error', message: 'Page not found.' });
      return;
    }
    res.status(200).json({ status: 'success', data: page });
  } catch (error) {
    next(error);
  }
};

export const upsertCMSPage = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ status: 'error', message: 'Forbidden' });
      return;
    }

    const { title, slug, content } = req.body;
    let page = await CMSPageModel.findOne({ slug });

    if (!page) {
      page = new CMSPageModel({ title, slug, content });
    } else {
      page.title = title;
      page.content = content;
    }

    await page.save();

    res.status(200).json({ status: 'success', data: page });
  } catch (error) {
    next(error);
  }
};

export const deleteCMSPage = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ status: 'error', message: 'Forbidden' });
      return;
    }

    const page = await CMSPageModel.findByIdAndDelete(req.params.id);
    if (!page) {
      res.status(404).json({ status: 'error', message: 'Page not found.' });
      return;
    }

    res.status(200).json({ status: 'success', message: 'Page deleted.' });
  } catch (error) {
    next(error);
  }
};
