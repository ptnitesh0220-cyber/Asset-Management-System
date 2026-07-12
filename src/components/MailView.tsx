import React, { useState } from 'react';
import { Mail, Send, ChevronRight, User, Clock, CheckCircle2 } from 'lucide-react';
import { MailMessage } from '../types';

interface MailViewProps {
  mails: MailMessage[];
  onMarkMailAsRead: (id: string) => void;
  onSendMail: (subject: string, body: string, recipientName: string) => void;
}

export default function MailView({ mails, onMarkMailAsRead, onSendMail }: MailViewProps) {
  const [selectedMailId, setSelectedMailId] = useState<string | null>(mails[0]?.id || null);
  const [isComposing, setIsComposing] = useState(false);

  // Compose States
  const [subject, setSubject] = useState('');
  const [recipient, setRecipient] = useState('Karan Malhotra (IT Support)');
  const [body, setBody] = useState('');
  const [sendToast, setSendToast] = useState(false);

  // Active selected mail object
  const activeMail = mails.find(m => m.id === selectedMailId);

  const handleSelectMail = (id: string) => {
    setSelectedMailId(id);
    onMarkMailAsRead(id);
    setIsComposing(false);
  };

  const handleSendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !body) return;

    onSendMail(subject, body, recipient.split(' ')[0]);
    setSubject('');
    setBody('');
    setIsComposing(false);
    
    // Show Toast
    setSendToast(true);
    setTimeout(() => setSendToast(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="mail-view-root">
      {/* Toast */}
      {sendToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1e293b] border-l-4 border-blue-500 text-white p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up">
          <CheckCircle2 className="h-5 w-5 text-blue-400 shrink-0" />
          <span className="text-xs font-semibold">Internal approval mail dispatched successfully!</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Mail Center</h1>
          <p className="text-slate-400 text-sm">Review employee requests, system permissions, and hardware order approvals.</p>
        </div>
        
        <button
          onClick={() => setIsComposing(!isComposing)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 cursor-pointer self-start sm:self-auto"
          id="compose-mail-btn"
        >
          <Send className="h-4 w-4" />
          <span>{isComposing ? 'View Inbox' : 'Compose Message'}</span>
        </button>
      </div>

      {/* Two-Pane Layout */}
      {isComposing ? (
        /* Compose Form Pane */
        <div className="bg-[#0f1830] border border-slate-800 rounded-xl p-6 max-w-2xl mx-auto shadow-2xl">
          <h3 className="text-white font-semibold mb-4 text-sm flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-500" />
            <span>Compose Internal Correspondence</span>
          </h3>

          <form onSubmit={handleSendSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Recipient Employee</label>
              <select
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full bg-[#0a1122] text-sm text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="Karan Malhotra (IT Support)">Karan Malhotra (IT Support)</option>
                <option value="Sneha Patil (Lead UX Designer)">Sneha Patil (Lead UX Designer)</option>
                <option value="Priya Nair (HR Specialist)">Priya Nair (HR Specialist)</option>
                <option value="Amit Sharma (Senior Backend)">Amit Sharma (Senior Backend)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Subject Heading</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Asset allocation authorization approval request"
                className="w-full bg-[#0a1122] text-sm text-white placeholder-slate-500 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Message Body Text</label>
              <textarea
                required
                rows={8}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write message contents, requested device IDs, dates and authorization reasons..."
                className="w-full bg-[#0a1122] text-sm text-white placeholder-slate-500 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 resize-none text-xs"
              />
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsComposing(false)}
                className="bg-slate-800/60 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-blue-600/10 flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span>Dispatch Mail</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Two-Pane Inbox View */
        <div className="grid grid-cols-1 md:grid-cols-3 bg-[#0f1830] border border-slate-800 rounded-xl overflow-hidden shadow-2xl h-[600px]" id="mail-two-pane">
          
          {/* Left Pane: Messages list */}
          <div className="border-r border-slate-800 flex flex-col h-full overflow-hidden">
            <div className="px-4 py-3 bg-[#131d3a] border-b border-slate-800 flex items-center justify-between shrink-0">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Internal Inbox</span>
              <span className="text-xxs font-mono text-slate-400 font-bold bg-slate-800 px-2 py-0.5 rounded-full">
                {mails.filter(m => m.isUnread).length} Unread
              </span>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
              {mails.map((m) => (
                <div
                  key={m.id}
                  onClick={() => handleSelectMail(m.id)}
                  className={`p-4 flex gap-3 hover:bg-slate-800/20 transition-all cursor-pointer relative text-left ${
                    selectedMailId === m.id ? 'bg-slate-800/30' : ''
                  } ${m.isUnread ? 'bg-blue-500/[0.01]' : ''}`}
                >
                  {/* Left edge blue dot */}
                  {m.isUnread && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                  )}

                  <img
                    src={m.senderAvatar}
                    alt={m.senderName}
                    className="h-9 w-9 rounded-full object-cover border border-slate-700 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline gap-1.5">
                      <span className={`text-xs truncate ${m.isUnread ? 'font-bold text-white' : 'text-slate-300'}`}>
                        {m.senderName}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0">
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className={`text-xs truncate mt-0.5 ${m.isUnread ? 'font-semibold text-white' : 'text-slate-400'}`}>
                      {m.subject}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate mt-1 leading-tight">
                      {m.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Pane: Message Preview */}
          <div className="md:col-span-2 h-full flex flex-col overflow-hidden bg-[#091021]/30">
            {activeMail ? (
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-slate-800 bg-[#131d3a]/25">
                  <div className="flex items-center gap-4">
                    <img
                      src={activeMail.senderAvatar}
                      alt={activeMail.senderName}
                      className="h-12 w-12 rounded-full object-cover border border-slate-700"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h3 className="font-bold text-white text-base">{activeMail.senderName}</h3>
                      <p className="text-slate-400 text-xs mt-0.5 flex items-center gap-1.5">
                        <User className="h-3 w-3 text-blue-400" />
                        <span>{activeMail.senderRole}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-1">
                    <p className="text-slate-500 text-xxs uppercase tracking-wider font-semibold">Subject Title</p>
                    <h2 className="text-white font-semibold text-sm">{activeMail.subject}</h2>
                  </div>
                </div>

                {/* Message Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  <div className="flex items-center gap-1.5 text-xxs text-slate-500 font-mono">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Dispatched on {new Date(activeMail.timestamp).toLocaleDateString()} at {new Date(activeMail.timestamp).toLocaleTimeString()}</span>
                  </div>

                  <div className="text-slate-300 text-xs leading-relaxed whitespace-pre-line bg-[#0a1122]/70 border border-slate-800/80 p-5 rounded-xl max-w-none">
                    {activeMail.body}
                  </div>
                </div>

                {/* Reply action suggestion footer */}
                <div className="p-4 border-t border-slate-800 bg-[#131d3a]/20 flex items-center justify-between">
                  <span className="text-xxs text-slate-500 italic">This is an internal system authorized channel</span>
                  <button
                    onClick={() => {
                      setIsComposing(true);
                      setSubject(`Re: ${activeMail.subject}`);
                      setRecipient(`${activeMail.senderName} (${activeMail.senderRole.split(' ')[0]})`);
                    }}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg transition-all cursor-pointer"
                  >
                    <span>Reply to Message</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-500">
                <Mail className="h-12 w-12 text-slate-700 mb-4" />
                <p className="font-semibold text-white">No Message Selected</p>
                <p className="text-slate-400 text-xs mt-1">Select an item from the left roster list to view detailed contents.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
