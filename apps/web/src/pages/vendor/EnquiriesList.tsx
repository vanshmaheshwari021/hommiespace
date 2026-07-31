import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Modal, Skeleton } from '@hommiespace/ui';
import API from '../../api/index.js';

interface Enquiry {
  id: string;
  message: string;
  status: string;
  createdAt: string;
  productId?: {
    id: string;
    name: string;
  };
  replies: Array<{
    senderName: string;
    message: string;
    createdAt: string;
  }>;
}

export const VendorEnquiriesList: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeEnquiry, setActiveEnquiry] = useState<Enquiry | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [sending, setSending] = useState(false);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const response = await API.get('/enquiries');
      setEnquiries(response.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage || !activeEnquiry) return;
    setSending(true);
    const activeEnqId = activeEnquiry.id || (activeEnquiry as any)._id;
    try {
      const response = await API.post(`/enquiries/${String(activeEnqId)}/reply`, {
        replyMessage
      });
      setEnquiries(prev =>
        prev.map(enq => {
          const enqId = enq.id || (enq as any)._id;
          return String(enqId) === String(activeEnqId) ? response.data.data : enq;
        })
      );
      setActiveEnquiry(null);
      setReplyMessage('');
    } catch (err) {
      alert('Failed to submit reply.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" className="w-1/4 h-8" />
        <Skeleton variant="rect" className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl lg:text-3xl font-bold text-brand-walnut mb-2">Product Enquiries</h1>
        <p className="text-brand-clay text-sm font-sans">Reply to sizing, material, or custom design queries from customers.</p>
      </div>

      <Card className="p-6 bg-white border border-brand-sand-dark/20" hoverEffect={false}>
        {enquiries.length === 0 ? (
          <div className="p-8 text-center text-brand-clay text-xs font-sans">No customer product enquiries recorded yet.</div>
        ) : (
          <Table headers={['Product Name', 'Message Preview', 'Status', 'Date Received', 'Actions']}>
            {enquiries.map(enq => {
              const enqId = enq.id || (enq as any)._id;
              return (
                <tr key={String(enqId)} className="hover:bg-brand-sand-light/35 text-xs text-brand-walnut border-b border-brand-sand-dark/10">
                  <td className="p-4 font-serif font-bold text-left">{enq.productId?.name || 'Unknown Item'}</td>
                  <td className="p-4 text-left max-w-xs truncate">{enq.message}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono ${
                      enq.status === 'replied' ? 'bg-brand-sage/10 text-brand-sage' : 'bg-brand-terracotta/10 text-brand-terracotta'
                    }`}>
                      {enq.status}
                    </span>
                  </td>
                  <td className="p-4">{new Date(enq.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <Button variant="ghost" size="sm" onClick={() => setActiveEnquiry(enq)} className="text-brand-sage font-semibold hover:underline">
                      {enq.status === 'replied' ? 'View Thread' : 'Add Reply'}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </Table>
        )}
      </Card>

      <Modal isOpen={!!activeEnquiry} onClose={() => setActiveEnquiry(null)} title="Enquiry Communication Thread">
        {activeEnquiry && (
          <div className="space-y-6 text-left">
            <div className="bg-brand-linen-light p-4 border border-brand-sand-dark/15 text-xs">
              <p className="font-semibold text-brand-walnut mb-1">Customer Query:</p>
              <p className="text-brand-clay leading-relaxed">{activeEnquiry.message}</p>
            </div>

            <div className="space-y-4 max-h-40 overflow-y-auto pr-2 text-xs">
              {activeEnquiry.replies.map((rep, idx) => (
                <div key={idx} className="border-l-2 border-brand-sage pl-4 py-1 text-left">
                  <p className="font-semibold text-brand-walnut">{rep.senderName}</p>
                  <p className="text-brand-clay leading-relaxed mt-0.5">{rep.message}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleReplySubmit} className="space-y-4 pt-4 border-t border-brand-sand-dark/20">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Reply Message *</label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={3}
                  className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none"
                  placeholder="Type reply message to customer..."
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => setActiveEnquiry(null)}>Cancel</Button>
                <Button type="submit" variant="primary" disabled={sending}>{sending ? 'Sending...' : 'Post Reply'}</Button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default VendorEnquiriesList;
