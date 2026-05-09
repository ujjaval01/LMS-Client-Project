import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Users, LayoutDashboard, ArrowLeftRight, Settings, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
    { name: 'Books', path: '/app/books', icon: BookOpen },
    { name: 'Students', path: '/app/students', icon: Users },
    { name: 'Issue & Return', path: '/app/issues', icon: ArrowLeftRight },
    { name: 'Settings', path: '/app/settings', icon: Settings },
  ];

  return (
    <motion.aside 
      initial={{ width: 256 }}
      animate={{ width: collapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="glass-panel rounded-none border-y-0 border-l-0 relative z-20 flex flex-col h-full"
    >
      <div className="h-20 flex items-center justify-center border-b border-[var(--glass-border)] relative">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
          <BookOpen className="text-white w-6 h-6" />
        </div>
        {!collapsed && (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-accent text-glow whitespace-nowrap"
          >
            AntiGravity
          </motion.span>
        )}
      </div>

      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-4 top-24 w-8 h-8 glass-panel rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all z-30"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <nav className="flex-1 py-6 flex flex-col gap-2 px-3 overflow-y-auto hide-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center px-3 py-3 rounded-xl transition-all duration-300 group relative
              ${isActive ? 'bg-gradient-to-r from-brand-primary/20 to-transparent text-brand-primary border border-brand-primary/30 shadow-[inset_4px_0_0_0_#3b82f6]' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'}
            `}
          >
            <item.icon className={`w-5 h-5 flex-shrink-0 ${collapsed ? 'mx-auto' : 'mr-3'} group-hover:animate-pulse-glow`} />
            {!collapsed && (
              <span className="font-medium whitespace-nowrap">{item.name}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-[var(--glass-border)]">
        <button className="flex items-center w-full px-3 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors group">
          <LogOut className={`w-5 h-5 flex-shrink-0 ${collapsed ? 'mx-auto' : 'mr-3'} group-hover:text-red-400`} />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
