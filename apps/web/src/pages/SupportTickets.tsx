import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);

  // New ticket form
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  const fetchTickets = async () => {
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
    if (!user) {
      navigate('/login?redirect=/profile/tickets');
      return;
    }
    fetchTickets();
  }, [user, navigate]);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;
    setSending(true);
    try {
      await API.post('/tickets', { subject, message });
      setIsCreateOpen(false);
      setSubject('');
      setMessage('');
      fetchTickets();
    } catch (err) {
      alert('Failed to submit ticket.');
    } finally {
      setSending(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText || !activeTicket) return;
    setSending(true);
    try {
      const res = await API.post(`/tickets/${activeTicket.id}/reply`, { message: replyText });
      setActiveTicket(res.data.data);
      setReplyText('');
      fetchTickets();
    } catch (err) {
      alert('Failed to send reply.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        <Skeleton variant="text" className="w-1/4 h-8" />
        <Skeleton variant="rect" className="h-64" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-8 bg-brand-linen-light min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-brand-walnut mb-2">Support Center</h1>
          <p className="text-brand-clay text-sm font-sans">Open support tickets to chat directly with our platform staff.</p>
        </div>
        <Button variant="primary" onClick={() => setIsCreateOpen(true)}>Create Ticket +</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ticket List */}
        <div className="lg:col-span-2">
          <Card className="p-6 bg-white border border-brand-sand-dark/20" hoverEffect={false}>
            {tickets.length === 0 ? (
              <p className="text-center text-brand-clay text-xs py-8">No support tickets submitted yet.</p>
            ) : (
              <Table headers={['Topic', 'Status', 'Last Update', 'Actions']}>
                {tickets.map(t => (
                  <tr key={t.id} className="hover:bg-brand-sand-light/35 text-xs text-brand-walnut border-b border-brand-sand-dark/10">
                    <td className="p-4 font-serif font-bold text-left">{t.subject}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        t.status === 'open' ? 'bg-brand-terracotta/10 text-brand-terracotta' :
                        t.status === 'in-progress' ? 'bg-brand-sage/10 text-brand-sage' : 'bg-brand-sand-dark/30 text-brand-clay'
                      }`}>
                        {t.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <Button variant="ghost" size="sm" onClick={() => setActiveTicket(t)} className="text-brand-sage hover:underline">
                        Open Chat
                      </Button>
                    </td>
                  </tr>
                ))}
              </Table>
            )}
          </Card>
        </div>

        {/* Chat Thread */}
        <div className="lg:col-span-1">
          {activeTicket ? (
            <Card className="p-6 bg-white border border-brand-sand-dark/20 flex flex-col h-[500px]" hoverEffect={false}>
              <div className="border-b border-brand-sand-dark/20 pb-4 mb-4 text-left">
                <h3 className="font-serif font-bold text-brand-walnut text-sm">{activeTicket.subject}</h3>
                <span className="text-[10px] uppercase font-mono text-brand-clay">Status: {activeTicket.status}</span>
              </div>

              {/* Message scroll log */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
                {/* Original ticket desc */}
                <div className="bg-brand-linen-light p-3 border border-brand-sand-dark/15">
                  <p className="font-semibold text-[10px] text-brand-walnut mb-1">Customer (Origin)</p>
                  <p className="text-brand-clay leading-relaxed">{activeTicket.message}</p>
                </div>

                {activeTicket.replies.map((reply, idx) => (
                  <div key={idx} className={`p-3 border ${
                    reply.senderRole === 'customer' 
                      ? 'bg-brand-linen-light border-brand-sand-dark/15 text-left ml-4' 
                      : 'bg-brand-sage/5 border-brand-sage/20 text-left mr-4'
                  }`}>
                    <p className="font-semibold text-[10px] text-brand-walnut mb-1">
                      {reply.senderName} ({reply.senderRole})
                    </p>
                    <p className="text-brand-clay leading-relaxed">{reply.message}</p>
                  </div>
                ))}
              </div>

              {activeTicket.status !== 'closed' ? (
                <form onSubmit={handleSendReply} className="mt-4 pt-4 border-t border-brand-sand-dark/20 space-y-2">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={2}
                    placeholder="Type support reply..."
                    className="w-full bg-brand-linen-light border border-brand-sand-dark/35 p-2 text-xs font-sans text-brand-walnut focus:outline-none"
                  />
                  <Button type="submit" variant="primary" disabled={sending} className="w-full text-xs py-2">
                    {sending ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              ) : (
                <div className="text-center text-[10px] text-brand-clay pt-4">This ticket has been marked closed.</div>
              )}
            </Card>
          ) : (
            <div className="border border-dashed border-brand-sand-dark/45 p-12 text-center text-brand-clay text-xs h-[500px] flex items-center justify-center">
              Select a support ticket to view its active communication thread.
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="File Support Ticket">
        <form onSubmit={handleCreateTicket} className="space-y-4 text-left">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Subject / Topic *</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none"
              placeholder="e.g. Broken packaging / Delivery issues"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Message Description *</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none"
              placeholder="Please explain in detail what happened..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-brand-sand-dark/20">
            <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={sending}>{sending ? 'Submitting...' : 'File Ticket'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SupportTickets;
