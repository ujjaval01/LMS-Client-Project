import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Book, Server, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-glow">Settings & Info</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Admin Profile Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6"
        >
          <h2 className="text-xl font-bold mb-6 text-[var(--color-slate-100)] flex items-center gap-2">
            <User className="text-brand-primary" /> Admin Profile
          </h2>
          
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-secondary to-brand-primary p-[2px]">
              <div className="w-full h-full rounded-2xl bg-[var(--color-bg)] flex items-center justify-center overflow-hidden">
                <User className="w-10 h-10 text-[var(--color-slate-300)]" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[var(--color-slate-100)]">{user?.name || 'Administrator'}</h3>
              <p className="text-brand-primary font-medium capitalize">{user?.role === 'admin' ? 'Super Admin' : (user?.role || 'Librarian')}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-bg-lighter)] border border-[var(--glass-border)]">
              <div className="flex items-center gap-3">
                <Mail className="text-[var(--color-slate-400)] w-5 h-5" />
                <div>
                  <p className="text-sm text-[var(--color-slate-400)]">Email Address</p>
                  <p className="font-medium text-[var(--color-slate-100)]">{user?.email || 'admin@library.com'}</p>
                </div>
              </div>
              <button className="text-sm text-brand-primary hover:text-brand-accent transition-colors">Edit</button>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-bg-lighter)] border border-[var(--glass-border)]">
              <div className="flex items-center gap-3">
                <Shield className="text-[var(--color-slate-400)] w-5 h-5" />
                <div>
                  <p className="text-sm text-[var(--color-slate-400)]">Password</p>
                  <p className="font-medium text-[var(--color-slate-100)]">••••••••</p>
                </div>
              </div>
              <button className="text-sm text-brand-primary hover:text-brand-accent transition-colors">Change</button>
            </div>
          </div>
        </motion.div>

        {/* System Info Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-6"
        >
          <h2 className="text-xl font-bold mb-6 text-[var(--color-slate-100)] flex items-center gap-2">
            <Server className="text-brand-secondary" /> System Information
          </h2>
          
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[var(--color-bg-lighter)] border border-[var(--glass-border)] flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-brand-primary/20 flex items-center justify-center shrink-0">
                <Book className="text-brand-primary w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-[var(--color-slate-100)]">AntiGravity LMS</h4>
                <p className="text-sm text-[var(--color-slate-400)] mt-1">Version 2.0.0 (Full-Stack Edition)</p>
                <p className="text-xs text-[var(--color-slate-500)] mt-2">A futuristic, high-performance library management system built with React, Vite, Tailwind CSS, Framer Motion, Express, and Prisma SQLite.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[var(--color-bg-lighter)] border border-[var(--glass-border)]">
                <div className="flex items-center gap-2 text-emerald-500 mb-2">
                  <ShieldCheck size={16} /> <span className="text-sm font-bold">Status</span>
                </div>
                <p className="text-xs text-[var(--color-slate-400)]">All systems operational</p>
              </div>
              <div className="p-4 rounded-xl bg-[var(--color-bg-lighter)] border border-[var(--glass-border)]">
                <div className="flex items-center gap-2 text-brand-secondary mb-2">
                  <Server size={16} /> <span className="text-sm font-bold">Database</span>
                </div>
                <p className="text-xs text-[var(--color-slate-400)]">SQLite (Local via Prisma)</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
