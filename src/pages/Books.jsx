import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Filter, MoreVertical, Edit2, Trash2, X } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';

const Books = () => {
  const { books, addBook } = useLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBook, setNewBook] = useState({ title: '', author: '', category: '', cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80' });

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addBook(newBook);
    setShowAddModal(false);
    setNewBook({ title: '', author: '', category: '', cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80' });
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-glow">Book Management</h1>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-gradient-to-r from-brand-primary to-brand-secondary px-4 py-2 rounded-xl text-white font-medium hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all">
          <Plus size={20} /> Add New Book
        </button>
      </div>

      <div className="glass-panel p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-slate-400)] w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by title or author..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[var(--color-bg-lighter)] border border-[var(--glass-border)] rounded-xl focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-[var(--color-slate-100)] placeholder-[var(--color-slate-400)]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredBooks.map((book, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={book.id} 
            className="glass-panel p-4 flex gap-4 group hover:border-brand-primary/50 transition-colors"
          >
            <div className="w-24 h-36 rounded-lg overflow-hidden shrink-0 shadow-lg">
              <img src={book.cover} alt={book.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="flex-1 flex flex-col justify-between py-1">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg text-[var(--color-slate-100)] line-clamp-1" title={book.title}>{book.title}</h3>
                  <button className="text-[var(--color-slate-400)] hover:text-brand-primary transition-colors">
                    <MoreVertical size={16} />
                  </button>
                </div>
                <p className="text-sm text-brand-primary font-medium">{book.author}</p>
                <div className="mt-2 inline-block px-2 py-1 bg-[var(--color-bg-lighter)] rounded border border-[var(--glass-border)] text-xs text-[var(--color-slate-300)]">
                  {book.category}
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  book.status === 'Available' ? 'bg-emerald-400/10 text-emerald-500 border border-emerald-400/20' : 'bg-amber-400/10 text-amber-500 border border-amber-400/20'
                }`}>
                  {book.status}
                </span>
                <div className="flex gap-2">
                  <button className="p-1.5 text-[var(--color-slate-400)] hover:text-brand-primary bg-[var(--color-bg-lighter)] rounded transition-colors"><Edit2 size={14} /></button>
                  <button className="p-1.5 text-[var(--color-slate-400)] hover:text-red-500 bg-[var(--color-bg-lighter)] rounded transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {filteredBooks.length === 0 && (
          <div className="col-span-full py-12 text-center text-[var(--color-slate-400)]">
            No books found matching your search.
          </div>
        )}
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel p-6 w-full max-w-md relative"
            >
              <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-[var(--color-slate-400)] hover:text-brand-primary">
                <X size={20} />
              </button>
              <h2 className="text-2xl font-bold mb-6 text-glow">Add New Book</h2>
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-[var(--color-slate-400)] mb-1">Title</label>
                  <input type="text" required value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} className="w-full px-4 py-2 bg-[var(--color-bg-lighter)] border border-[var(--glass-border)] rounded-xl focus:outline-none focus:border-brand-primary text-[var(--color-slate-100)]" />
                </div>
                <div>
                  <label className="block text-sm text-[var(--color-slate-400)] mb-1">Author</label>
                  <input type="text" required value={newBook.author} onChange={e => setNewBook({...newBook, author: e.target.value})} className="w-full px-4 py-2 bg-[var(--color-bg-lighter)] border border-[var(--glass-border)] rounded-xl focus:outline-none focus:border-brand-primary text-[var(--color-slate-100)]" />
                </div>
                <div>
                  <label className="block text-sm text-[var(--color-slate-400)] mb-1">Category</label>
                  <input type="text" required value={newBook.category} onChange={e => setNewBook({...newBook, category: e.target.value})} className="w-full px-4 py-2 bg-[var(--color-bg-lighter)] border border-[var(--glass-border)] rounded-xl focus:outline-none focus:border-brand-primary text-[var(--color-slate-100)]" />
                </div>
                <div>
                  <label className="block text-sm text-[var(--color-slate-400)] mb-1">Cover Image URL</label>
                  <input type="url" value={newBook.cover} onChange={e => setNewBook({...newBook, cover: e.target.value})} className="w-full px-4 py-2 bg-[var(--color-bg-lighter)] border border-[var(--glass-border)] rounded-xl focus:outline-none focus:border-brand-primary text-[var(--color-slate-100)]" />
                </div>
                <button type="submit" className="w-full py-3 mt-4 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl text-white font-bold hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all">
                  Save Book
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default Books;
