import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, Book, Users, Activity } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLibrary } from '../../context/LibraryContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { books, students, activities } = useLibrary();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const searchRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter logic
  const filteredBooks = books.filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3);
  const filteredStudents = students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3);

  return (
    <header className="h-20 glass-panel rounded-none border-x-0 border-t-0 flex items-center justify-between px-6 z-30">
      <div className="flex-1 max-w-md" ref={searchRef}>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[var(--color-slate-400)] group-focus-within:text-brand-primary transition-colors" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearch(true);
            }}
            onFocus={() => setShowSearch(true)}
            className="block w-full pl-10 pr-3 py-2 border border-[var(--glass-border)] rounded-xl leading-5 bg-[var(--color-bg-lighter)] text-[var(--color-slate-100)] placeholder-[var(--color-slate-400)] focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition-all duration-300 shadow-inner"
            placeholder="Search books, students..."
          />
          
          {/* Search Dropdown */}
          {showSearch && searchQuery.trim() !== '' && (
            <div className="absolute top-full left-0 w-full mt-2 glass-panel p-2 shadow-2xl max-h-96 overflow-y-auto z-50">
              {filteredBooks.length === 0 && filteredStudents.length === 0 ? (
                <div className="p-4 text-center text-[var(--color-slate-400)] text-sm">No results found</div>
              ) : (
                <>
                  {filteredBooks.length > 0 && (
                    <div className="mb-2">
                      <h4 className="text-xs font-bold text-[var(--color-slate-500)] uppercase px-3 mb-1">Books</h4>
                      {filteredBooks.map(b => (
                        <div key={b.id} onClick={() => { navigate('/app/books'); setShowSearch(false); }} className="flex items-center gap-3 p-2 hover:bg-[var(--color-bg-lighter)] rounded-lg cursor-pointer transition-colors">
                          <Book size={16} className="text-brand-primary" />
                          <span className="text-sm text-[var(--color-slate-200)]">{b.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {filteredStudents.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-[var(--color-slate-500)] uppercase px-3 mb-1">Students</h4>
                      {filteredStudents.map(s => (
                        <div key={s.id} onClick={() => { navigate('/app/students'); setShowSearch(false); }} className="flex items-center gap-3 p-2 hover:bg-[var(--color-bg-lighter)] rounded-lg cursor-pointer transition-colors">
                          <Users size={16} className="text-brand-secondary" />
                          <span className="text-sm text-[var(--color-slate-200)]">{s.name} ({s.rollNo})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 relative">
        <div ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full hover:bg-[var(--color-bg-lighter)] transition-colors text-[var(--color-slate-400)] hover:text-brand-primary group"
          >
            <Bell className="w-5 h-5 group-hover:animate-swing" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_5px_#ef4444]"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute top-full right-0 mt-4 w-80 glass-panel shadow-2xl overflow-hidden z-50">
              <div className="p-4 border-b border-[var(--glass-border)] flex justify-between items-center bg-[var(--color-bg-lighter)]">
                <h3 className="font-bold text-[var(--color-slate-100)]">Notifications</h3>
                <span className="text-xs bg-brand-primary/20 text-brand-primary px-2 py-1 rounded-full">{activities.length} New</span>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {activities.length === 0 ? (
                  <div className="p-6 text-center text-sm text-[var(--color-slate-400)]">No recent activity</div>
                ) : (
                  activities.map(act => (
                    <div key={act.id} className="p-4 border-b border-[var(--glass-border)] last:border-0 hover:bg-[var(--color-bg-lighter)] transition-colors cursor-pointer">
                      <div className="flex gap-3">
                        <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${act.type === 'issue' ? 'bg-brand-primary' : act.type === 'return' ? 'bg-emerald-500' : 'bg-brand-secondary'}`} />
                        <div>
                          <p className="text-sm text-[var(--color-slate-200)]">{act.text}</p>
                          <p className="text-xs text-[var(--color-slate-500)] mt-1">{new Date(act.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-[var(--color-bg-lighter)] transition-colors text-[var(--color-slate-400)] text-xl"
          title="Toggle Theme"
        >
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-[var(--glass-border)] cursor-pointer group" onClick={() => navigate('/app/settings')}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-secondary to-brand-primary p-[2px]">
            <div className="w-full h-full rounded-full bg-[var(--color-bg)] flex items-center justify-center overflow-hidden">
              <User className="w-5 h-5 text-[var(--color-slate-300)] group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-[var(--color-slate-200)] line-clamp-1">{user?.name || 'User'}</p>
            <p className="text-xs text-brand-primary capitalize">{user?.role || 'Guest'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
