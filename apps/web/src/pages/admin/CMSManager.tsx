import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cmsPageSchema } from '@hommiespace/shared';
import type { CMSPageInput } from '@hommiespace/shared';
import { Button, Card, Table, Modal, Skeleton } from '@hommiespace/ui';
import API from '../../api/index.js';

interface CMSPage {
  id: string;
  title: string;
  slug: string;
  content: string;
}

export const CMSManager: React.FC = () => {
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'pages' | 'reviews'>('pages');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<CMSPage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CMSPageInput>({
    resolver: zodResolver(cmsPageSchema)
  });

  const fetchPages = async () => {
    setLoading(true);
    try {
      const response = await API.get('/cms');
      setPages(response.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await API.get('/products/reviews/all');
      setReviews(response.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'pages') {
      fetchPages();
    } else {
      fetchReviews();
    }
  }, [activeTab]);

  const handleDeleteReview = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await API.delete(`/products/reviews/${String(id)}`);
      setReviews(prev => prev.filter(r => {
        const rId = r.id || (r as any)._id;
        return String(rId) !== String(id);
      }));
    } catch (err) {
      console.error(err);
      alert('Failed to delete review');
    }
  };

  const handleAddClick = () => {
    setEditingPage(null);
    reset({ title: '', slug: '', content: '' });
    setIsModalOpen(true);
  };

  const handleEditClick = (page: CMSPage) => {
    setEditingPage(page);
    reset({ title: page.title, slug: page.slug, content: page.content });
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (pageId: string) => {
    if (!window.confirm('Are you sure you want to delete this page?')) return;
    try {
      await API.delete(`/cms/${String(pageId)}`);
      setPages(prev => prev.filter(p => {
        const pId = p.id || (p as any)._id;
        return String(pId) !== String(pageId);
      }));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete page.');
    }
  };

  const onSubmit = async (data: CMSPageInput) => {
    setError(null);
    try {
      await API.post('/cms', data);
      setIsModalOpen(false);
      fetchPages();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save page.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" className="w-1/4 h-8" />
        <Skeleton variant="rect" className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-brand-walnut mb-2">
            Platform Content & Moderation
          </h1>
          <p className="text-brand-clay text-sm font-sans">
            Moderate lookbooks, manage public policy files, and monitor user reviews.
          </p>
        </div>
        {activeTab === 'pages' && (
          <Button variant="primary" onClick={handleAddClick}>
            Add Page +
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-brand-sand-dark/20 gap-6">
        <button
          onClick={() => setActiveTab('pages')}
          className={`pb-3 text-xs uppercase tracking-widest font-semibold transition-all border-b-2 ${
            activeTab === 'pages'
              ? 'border-brand-terracotta text-brand-terracotta'
              : 'border-transparent text-brand-clay hover:text-brand-walnut'
          }`}
        >
          Editorial Pages
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 text-xs uppercase tracking-widest font-semibold transition-all border-b-2 ${
            activeTab === 'reviews'
              ? 'border-brand-terracotta text-brand-terracotta'
              : 'border-transparent text-brand-clay hover:text-brand-walnut'
          }`}
        >
          Product Reviews ({reviews.length})
        </button>
      </div>

      {activeTab === 'pages' ? (
        <Card className="p-6 bg-white border border-brand-sand-dark/20" hoverEffect={false}>
          {pages.length === 0 ? (
            <div className="p-8 text-center text-brand-clay text-xs font-sans">
              No editorial CMS pages configured yet.
            </div>
          ) : (
            <Table headers={['Page Title', 'URL Slug', 'Actions']}>
              {pages.map(page => {
                const pId = page.id || (page as any)._id;
                return (
                  <tr key={String(pId)} className="hover:bg-brand-sand-light/35 transition-colors">
                    <td className="p-4 text-left font-serif font-bold text-brand-walnut">{page.title}</td>
                    <td className="p-4 font-mono text-brand-clay text-xs">/{page.slug}</td>
                    <td className="p-4 space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditClick(page)} className="p-1 text-brand-walnut font-semibold hover:underline">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(String(pId))} className="p-1 text-brand-terracotta font-semibold hover:underline">
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </Table>
          )}
        </Card>
      ) : (
        <Card className="p-6 bg-white border border-brand-sand-dark/20" hoverEffect={false}>
          {reviews.length === 0 ? (
            <div className="p-8 text-center text-brand-clay text-xs font-sans">
              No product reviews submitted yet.
            </div>
          ) : (
            <Table headers={['Customer', 'Product', 'Rating', 'Comment', 'Actions']}>
              {reviews.map(rev => {
                const rId = rev.id || (rev as any)._id;
                return (
                  <tr key={String(rId)} className="hover:bg-brand-sand-light/35 transition-colors">
                    <td className="p-4 text-left font-serif font-bold text-brand-walnut">{rev.userName}</td>
                    <td className="p-4 text-brand-clay text-xs font-sans">
                      {typeof rev.productId === 'object' && rev.productId ? (rev.productId as any).name : 'Curated Piece'}
                    </td>
                    <td className="p-4 text-brand-terracotta font-semibold text-xs">{'★'.repeat(rev.rating)}</td>
                    <td className="p-4 text-brand-clay text-xs font-sans max-w-xs truncate">{rev.comment}</td>
                    <td className="p-4">
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteReview(String(rId))} className="p-1 text-brand-terracotta font-semibold hover:underline">
                        Delete Review
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </Table>
          )}
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPage ? 'Edit Page Details' : 'Create New Page'}
        className="max-w-2xl"
      >
        {error && (
          <div className="mb-6 p-4 bg-brand-terracotta/10 text-brand-terracotta text-xs font-semibold border border-brand-terracotta/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Page Title *</label>
            <input type="text" {...register('title')} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none" />
            {errors.title && <p className="text-brand-terracotta text-[10px] mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">URL Slug *</label>
            <input type="text" {...register('slug')} disabled={!!editingPage} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none disabled:opacity-50" placeholder="e.g. shipping-returns" />
            {errors.slug && <p className="text-brand-terracotta text-[10px] mt-1">{errors.slug.message}</p>}
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Page Content (HTML/Markdown) *</label>
            <textarea {...register('content')} rows={10} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none" />
            {errors.content && <p className="text-brand-terracotta text-[10px] mt-1">{errors.content.message}</p>}
          </div>

          <div className="flex justify-end gap-3 border-t border-brand-sand-dark/20 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Page</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CMSManager;
