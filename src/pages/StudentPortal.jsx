import React from 'react';
import { motion } from 'framer-motion';
import { Book, Clock, CheckCircle, AlertCircle, Search, XCircle } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { useAuth } from '../context/AuthContext';

const StudentPortal = () => {
  const { books, requests, requestBook, cancelRequest } = useLibrary();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = React.useState('');

  const myRequests = requests || [];
  const availableBooks = books.filter(b => 
    b.status === 'Available' && 
    b.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'Rejected': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-glow">Student Portal</h1>
          <p className="text-[var(--color-slate-400)] mt-1">Welcome back, {user?.name}. Browse and request books.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Available Books Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[var(--color-slate-100)] flex items-center gap-2">
              <Book className="text-brand-primary" /> Available Books
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-slate-500)] w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-[var(--color-bg-lighter)] border border-[var(--glass-border)] rounded-lg text-sm focus:outline-none focus:border-brand-primary w-48 md:w-64"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableBooks.map((book, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={book.id} 
                className="glass-panel p-4 flex gap-4 group"
              >
                <div className="w-16 h-24 rounded bg-[var(--color-bg-lighter)] overflow-hidden shrink-0">
                  <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-[var(--color-slate-100)] line-clamp-1">{book.title}</h4>
                    <p className="text-xs text-[var(--color-slate-400)]">{book.author}</p>
                  </div>
                  <button 
                    onClick={() => requestBook(book.id)}
                    className="mt-2 text-xs py-1.5 px-3 bg-brand-primary/20 text-brand-primary rounded-lg font-bold hover:bg-brand-primary hover:text-white transition-all w-fit"
                  >
                    Request Issue
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* My Requests Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-[var(--color-slate-100)] flex items-center gap-2">
            <Clock className="text-brand-secondary" /> My Requests
          </h2>
          <div className="space-y-4">
            {myRequests.length === 0 ? (
              <div className="glass-panel p-8 text-center">
                <AlertCircle className="mx-auto text-[var(--color-slate-500)] mb-2" />
                <p className="text-sm text-[var(--color-slate-400)]">No requests sent yet.</p>
              </div>
            ) : (
              myRequests.map((req, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={req.id} 
                  className="glass-panel p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-brand-secondary/10 flex items-center justify-center">
                      <Book size={14} className="text-brand-secondary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[var(--color-slate-100)] line-clamp-1">{req.book?.title}</h4>
                      <p className="text-[10px] text-[var(--color-slate-500)]">{new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${getStatusColor(req.status)}`}>
                      {req.status}
                    </span>
                    {req.status === 'Pending' && (
                      <button 
                        onClick={() => cancelRequest(req.id)}
                        className="p-1 text-[var(--color-slate-400)] hover:text-red-500 transition-colors"
                        title="Cancel Request"
                      >
                        <XCircle size={14} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPortal;
