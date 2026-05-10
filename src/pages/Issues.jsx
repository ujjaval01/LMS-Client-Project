import React, { useState } from 'react';
import { BookOpen, User, Calendar, CheckCircle, X } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const Issues = () => {
  const { issues, books, students, issueBook, returnBook } = useLibrary();
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  
  const [issueData, setIssueData] = useState({ bookId: '', studentId: '', dueDate: '' });
  const [returnIssueId, setReturnIssueId] = useState('');

  const handleIssueSubmit = (e) => {
    e.preventDefault();
    if (!issueData.bookId || !issueData.studentId || !issueData.dueDate) return toast.error("All fields required");
    issueBook(issueData.bookId, issueData.studentId, issueData.dueDate);
    setShowIssueModal(false);
    setIssueData({ bookId: '', studentId: '', dueDate: '' });
  };

  const handleReturnSubmit = (e) => {
    e.preventDefault();
    if (!returnIssueId) return toast.error("Issue ID required");
    returnBook(returnIssueId);
    setShowReturnModal(false);
    setReturnIssueId('');
  };

  const availableBooks = books.filter(b => b.status === 'Available');

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-glow">Issue & Return System</h1>
        <div className="flex gap-4 w-full sm:w-auto">
          <button onClick={() => setShowIssueModal(true)} className="flex-1 sm:flex-none bg-gradient-to-r from-brand-primary to-brand-secondary px-6 py-2 rounded-xl text-white font-medium hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all">
            Issue Book
          </button>
          <button onClick={() => setShowReturnModal(true)} className="flex-1 sm:flex-none glass-panel px-6 py-2 rounded-xl text-[var(--color-slate-300)] hover:text-brand-primary transition-colors">
            Return Book
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-[var(--color-slate-200)]">Active Issues</h2>
          {issues.map((issue, i) => {
            if (issue.status !== 'Active') return null;
            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={issue.id} 
                className="glass-panel p-6 flex flex-col md:flex-row gap-6 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-4">
                  <span className="bg-amber-400/10 text-amber-500 border border-amber-400/20 text-xs font-bold px-3 py-1 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.2)]">
                    {issue.status}
                  </span>
                </div>
                
                <div className="flex-1 flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-brand-primary/20 flex items-center justify-center shrink-0">
                    <BookOpen className="text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--color-slate-400)]">Book Details</p>
                    <h3 className="font-bold text-lg text-[var(--color-slate-100)]">{issue.book?.title}</h3>
                    <p className="text-sm text-brand-primary">ID: {issue.bookId}</p>
                  </div>
                </div>

                <div className="hidden md:block w-px bg-[var(--glass-border)]"></div>

                <div className="flex-1 flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-brand-secondary/20 flex items-center justify-center shrink-0">
                    <User className="text-brand-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--color-slate-400)]">Issued To</p>
                    <h3 className="font-bold text-lg text-[var(--color-slate-100)]">{issue.user?.name || issue.student?.name}</h3>
                    <p className="text-sm text-[var(--color-slate-400)]">{issue.user?.email || issue.student?.rollNo}</p>
                  </div>
                </div>

                <div className="hidden md:block w-px bg-[var(--glass-border)]"></div>

                <div className="flex-1 flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-emerald-400/20 flex items-center justify-center shrink-0">
                    <Calendar className="text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--color-slate-400)]">Due Date</p>
                    <h3 className="font-bold text-lg text-[var(--color-slate-100)]">{new Date(issue.dueDate).toLocaleDateString()}</h3>
                    <p className="text-xs text-[var(--color-slate-500)]">Issue ID: {issue.id}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
          {issues.filter(i => i.status === 'Active').length === 0 && (
            <div className="glass-panel p-12 text-center text-[var(--color-slate-400)]">
              No active issues right now.
            </div>
          )}
        </div>

        <div>
          <div className="glass-panel p-6 sticky top-6">
            <h2 className="text-xl font-bold text-[var(--color-slate-200)] mb-6">Quick Actions</h2>
            <div className="space-y-4">
              <div onClick={() => setShowReturnModal(true)} className="p-4 rounded-xl bg-[var(--color-bg-lighter)] border border-[var(--glass-border)] hover:border-brand-primary/50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="text-brand-primary w-5 h-5" />
                  <h3 className="font-bold text-[var(--color-slate-100)]">Mark as Returned</h3>
                </div>
                <p className="text-sm text-[var(--color-slate-400)]">Quickly process a book return by entering the Issue ID.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showIssueModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel p-6 w-full max-w-md relative"
            >
              <button onClick={() => setShowIssueModal(false)} className="absolute top-4 right-4 text-[var(--color-slate-400)] hover:text-brand-primary">
                <X size={20} />
              </button>
              <h2 className="text-2xl font-bold mb-6 text-glow">Issue Book</h2>
              <form onSubmit={handleIssueSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-[var(--color-slate-400)] mb-1">Select Book</label>
                  <select required value={issueData.bookId} onChange={e => setIssueData({...issueData, bookId: e.target.value})} className="w-full px-4 py-2 bg-[var(--color-bg-lighter)] border border-[var(--glass-border)] rounded-xl focus:outline-none focus:border-brand-primary text-[var(--color-slate-100)]">
                    <option value="">-- Choose Available Book --</option>
                    {availableBooks.map(b => <option key={b.id} value={b.id}>{b.title} (ID: {b.id})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[var(--color-slate-400)] mb-1">Select Student</label>
                  <select required value={issueData.studentId} onChange={e => setIssueData({...issueData, studentId: e.target.value})} className="w-full px-4 py-2 bg-[var(--color-bg-lighter)] border border-[var(--glass-border)] rounded-xl focus:outline-none focus:border-brand-primary text-[var(--color-slate-100)]">
                    <option value="">-- Choose Student --</option>
                    {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[var(--color-slate-400)] mb-1">Due Date</label>
                  <input type="date" required value={issueData.dueDate} onChange={e => setIssueData({...issueData, dueDate: e.target.value})} className="w-full px-4 py-2 bg-[var(--color-bg-lighter)] border border-[var(--glass-border)] rounded-xl focus:outline-none focus:border-brand-primary text-[var(--color-slate-100)]" />
                </div>
                <button type="submit" className="w-full py-3 mt-4 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl text-white font-bold hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all">
                  Issue Book
                </button>
              </form>
            </motion.div>
          </div>
        )}
        {showReturnModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel p-6 w-full max-w-md relative"
            >
              <button onClick={() => setShowReturnModal(false)} className="absolute top-4 right-4 text-[var(--color-slate-400)] hover:text-brand-primary">
                <X size={20} />
              </button>
              <h2 className="text-2xl font-bold mb-6 text-glow">Return Book</h2>
              <form onSubmit={handleReturnSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-[var(--color-slate-400)] mb-1">Select Active Issue</label>
                  <select required value={returnIssueId} onChange={e => setReturnIssueId(e.target.value)} className="w-full px-4 py-2 bg-[var(--color-bg-lighter)] border border-[var(--glass-border)] rounded-xl focus:outline-none focus:border-brand-primary text-[var(--color-slate-100)]">
                    <option value="">-- Choose Issue --</option>
                    {issues.filter(i => i.status === 'Active').map(i => <option key={i.id} value={i.id}>Issue #{i.id} - {i.book?.title}</option>)}
                  </select>
                </div>
                <button type="submit" className="w-full py-3 mt-4 bg-emerald-500 rounded-xl text-white font-bold hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all">
                  Process Return
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default Issues;
