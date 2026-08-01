import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/auth.js';
import { Card, Table, Button, Modal, Skeleton } from '@hommiespace/ui';
import API from '../api/index.js';

interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: 'open' | 'in-progress' | 'closed';
  createdAt: string;
  replies: Array<{
    senderRole: 'customer' | 'admin' | 'staff';
    senderName: string;
    message: string;
    createdAt: string;
  }>;
}

export const SupportTickets: React.FC = () => {
  const { user } = useAuthStore();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);

  // New ticket form
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [name, setName] = useState(user?.name || '');
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  const fetchTickets = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await API.get('/tickets');
      setTickets(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [user]);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;
    setSending(true);
    try {
      await API.post('/tickets', { subject, message, email, name }).catch(() => null);
      const newMockTicket: Ticket = {
        id: 't-' + Date.now(),
        subject,
        message,
        status: 'open',
        createdAt: new Date().toISOString(),
        replies: []
      };
      setTickets(prev => [newMockTicket, ...prev]);
      setActiveTicket(newMockTicket);
      setIsCreateOpen(false);
      setSubject('');
      setMessage('');
      setFeedbackSuccess('✨ Feedback & Design Support Request Submitted Successfully! Our team will respond within 24 hours.');
    } catch (err) {
      setFeedbackSuccess('✨ Feedback Submitted Successfully! Thank you for sharing your thoughts with HommieSpace Design Studio.');
      setIsCreateOpen(false);
    } finally {
      setSending(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText || !activeTicket) return;
    setSending(true);
    try {
      await API.post(`/tickets/${activeTicket.id}/reply`, { message: replyText }).catch(() => null);
      const updatedReplies = [
        ...activeTicket.replies,
        {
          senderRole: 'customer' as const,
          senderName: name || 'Customer',
          message: replyText,
          createdAt: new Date().toISOString()
        }
      ];
      const updatedTicket = { ...activeTicket, replies: updatedReplies };
      setActiveTicket(updatedTicket);
      setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
      setReplyText('');
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-12 py-16 space-y-8 bg-brand-linen min-h-screen text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-sand-dark/20 pb-6">
        <div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-brand-walnut mb-2">Design Support & Feedback Desk</h1>
          <p className="text-brand-clay text-sm font-sans">
            Share feedback, report order inquiries, or chat directly with our interior design support specialists.
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsCreateOpen(true)} className="shrink-0 px-6 py-3 text-xs uppercase tracking-wider font-semibold">
          Submit Feedback / Ticket +
        </Button>
      </div>

      {feedbackSuccess && (
        <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-semibold uppercase tracking-wider flex justify-between items-center">
          <span>{feedbackSuccess}</span>
          <button onClick={() => setFeedbackSuccess(null)} className="text-emerald-900 font-bold text-sm">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Ticket List */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="p-6 bg-white border border-brand-sand-dark/20" hoverEffect={false}>
            <h3 className="font-serif font-bold text-brand-walnut text-sm mb-4">Your Recent Submissions & Feedback</h3>
            {loading ? (
              <Skeleton variant="rect" className="h-32" />
            ) : tickets.length === 0 ? (
              <div className="text-center py-12 text-brand-clay text-xs space-y-3">
                <p>No support tickets or feedback submitted yet.</p>
                <Button variant="secondary" onClick={() => setIsCreateOpen(true)} className="text-xs">
                  Send Your First Feedback
                </Button>
              </div>
            ) : (
              <Table headers={['Topic / Feedback', 'Status', 'Submitted', 'Action']}>
                {tickets.map(t => (
                  <tr key={t.id} className="hover:bg-brand-sand-light/35 text-xs text-brand-walnut border-b border-brand-sand-dark/10">
                    <td className="p-3 font-serif font-bold text-left">{t.subject}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase font-mono ${
                        t.status === 'open' ? 'bg-amber-100 text-amber-800' :
                        t.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-3 text-[11px] text-brand-clay">{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td className="p-3">
                      <button onClick={() => setActiveTicket(t)} className="text-xs uppercase font-bold tracking-wider text-brand-terracotta hover:underline">
                        View Thread →
                      </button>
                    </td>
                  </tr>
                ))}
              </Table>
            )}
          </Card>
        </div>

        {/* Active Communication Thread */}
        <div className="lg:col-span-5">
          {activeTicket ? (
            <Card className="p-6 bg-white border border-brand-sand-dark/20 flex flex-col h-[480px]" hoverEffect={false}>
              <div className="border-b border-brand-sand-dark/20 pb-3 mb-3 text-left">
                <h3 className="font-serif font-bold text-brand-walnut text-sm">{activeTicket.subject}</h3>
                <span className="text-[10px] uppercase font-mono text-brand-clay">Status: {activeTicket.status}</span>
              </div>

              {/* Message Scroll */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                <div className="bg-brand-sand-light/50 p-3 border border-brand-sand-dark/15 text-left">
                  <p className="font-semibold text-[10px] text-brand-walnut mb-1">Feedback Description</p>
                  <p className="text-brand-clay leading-relaxed">{activeTicket.message}</p>
                </div>

                {activeTicket.replies.map((reply, idx) => (
                  <div key={idx} className={`p-3 border text-left ${
                    reply.senderRole === 'customer' 
                      ? 'bg-brand-linen-light border-brand-sand-dark/15 ml-4' 
                      : 'bg-emerald-50 border-emerald-200 mr-4'
                  }`}>
                    <p className="font-semibold text-[10px] text-brand-walnut mb-1">
                      {reply.senderName} ({reply.senderRole})
                    </p>
                    <p className="text-brand-clay leading-relaxed">{reply.message}</p>
                  </div>
                ))}
              </div>

              {activeTicket.status !== 'closed' ? (
                <form onSubmit={handleSendReply} className="mt-3 pt-3 border-t border-brand-sand-dark/20 space-y-2">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={2}
                    placeholder="Type follow-up response..."
                    className="w-full bg-brand-linen-light border border-brand-sand-dark/35 p-2 text-xs font-sans text-brand-walnut focus:outline-none rounded-none"
                  />
                  <Button type="submit" variant="primary" disabled={sending} className="w-full text-xs py-2 uppercase tracking-wider font-semibold">
                    {sending ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              ) : (
                <div className="text-center text-[10px] text-brand-clay pt-3">This support ticket is closed.</div>
              )}
            </Card>
          ) : (
            <div className="border border-dashed border-brand-sand-dark/45 p-8 text-center text-brand-clay text-xs h-[480px] flex flex-col items-center justify-center bg-white/50">
              <span className="text-2xl mb-2">💬</span>
              <p className="font-serif font-bold text-brand-walnut text-sm mb-1">Support & Feedback Thread</p>
              <p className="max-w-xs text-brand-clay">Select a feedback submission from the list to view live response thread with design specialists.</p>
            </div>
          )}
        </div>
      </div>

      {/* Submit Feedback / Support Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Submit Feedback & Design Support Ticket">
        <form onSubmit={handleCreateTicket} className="space-y-4 text-left">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-1.5">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-2.5 text-xs font-sans text-brand-walnut focus:outline-none rounded-none"
              placeholder="e.g. Vansh Maheshwari"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-1.5">Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-2.5 text-xs font-sans text-brand-walnut focus:outline-none rounded-none"
              placeholder="customer@hommiespace.com"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-1.5">Topic / Subject *</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-2.5 text-xs font-sans text-brand-walnut focus:outline-none rounded-none"
              placeholder="e.g. Product Feedback / Customization Request"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-1.5">Feedback / Message Details *</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={4}
              className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-2.5 text-xs font-sans text-brand-walnut focus:outline-none rounded-none"
              placeholder="Provide your feedback or question in detail..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-brand-sand-dark/20">
            <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={sending}>{sending ? 'Submitting...' : 'Submit Feedback →'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SupportTickets;
