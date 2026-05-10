import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Book, Server, ShieldCheck, Trash2, Save, Key, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const Settings = () => {
  const { user, logout, refreshUser } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    password: '',
  });

  const isStudent = user?.role === 'student';

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setIsUpdating(true);
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success('Profile updated successfully!');
      setFormData(prev => ({ ...prev, password: '' }));
      refreshUser();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      if (!res.ok) throw new Error('Failed to delete account');
      toast.success('Account deleted successfully');
      logout();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-glow">Settings & Security</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Management Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 flex flex-col h-full"
        >
          <h2 className="text-xl font-bold mb-6 text-[var(--color-slate-100)] flex items-center gap-2">
            <User className="text-brand-primary" /> Profile Management
          </h2>
          
          <form onSubmit={handleUpdateProfile} className="space-y-4 flex-1">
            <div className="space-y-1">
              <label className="text-sm text-[var(--color-slate-400)] ml-1 flex items-center gap-2">
                Full Name {isStudent && <Lock size={12} className="text-[var(--color-slate-500)]" />}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-slate-500)] w-4 h-4" />
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={isStudent}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl transition-all ${
                    isStudent 
                    ? 'bg-[var(--color-bg)] border-[var(--glass-border)] text-[var(--color-slate-500)] cursor-not-allowed opacity-70' 
                    : 'bg-[var(--color-bg-lighter)] border-[var(--glass-border)] focus:border-brand-primary text-[var(--color-slate-100)]'
                  }`}
                  placeholder="Your Name"
                />
              </div>
              {isStudent && <p className="text-[10px] text-[var(--color-slate-500)] ml-1">Students cannot change their profile name.</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm text-[var(--color-slate-400)] ml-1">New Password (leave blank to keep current)</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-slate-500)] w-4 h-4" />
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-bg-lighter)] border border-[var(--glass-border)] rounded-xl focus:outline-none focus:border-brand-primary transition-all text-[var(--color-slate-100)]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-brand-primary/5 border border-brand-primary/10 flex items-center gap-3">
              <Mail className="text-brand-primary w-5 h-5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[var(--color-slate-400)]">Email Address</p>
                  <Lock size={12} className="text-[var(--color-slate-500)]" />
                </div>
                <p className="text-sm font-medium text-[var(--color-slate-200)]">{user?.email}</p>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isUpdating}
              className="w-full py-3 mt-4 bg-brand-primary text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Save size={18} /> {isUpdating ? 'Saving...' : 'Update Password'}
            </button>
          </form>
        </motion.div>

        {/* System & Info Section */}
        <div className="space-y-6 flex flex-col">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 flex-1"
          >
            <h2 className="text-xl font-bold mb-6 text-[var(--color-slate-100)] flex items-center gap-2">
              <Server className="text-brand-secondary" /> System Info
            </h2>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[var(--color-bg-lighter)] border border-[var(--glass-border)]">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldCheck className="text-emerald-500 w-5 h-5" />
                  <p className="font-bold text-[var(--color-slate-100)]">LMS Version 2.2.0</p>
                </div>
                <p className="text-xs text-[var(--color-slate-500)]">Tab isolation & enhanced security enabled.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[var(--color-bg-lighter)] border border-[var(--glass-border)]">
                  <p className="text-[10px] text-[var(--color-slate-500)] uppercase font-bold">Role</p>
                  <p className="text-brand-secondary font-bold capitalize">{user?.role}</p>
                </div>
                <div className="p-3 rounded-xl bg-[var(--color-bg-lighter)] border border-[var(--glass-border)]">
                  <p className="text-[10px] text-[var(--color-slate-500)] uppercase font-bold">Session</p>
                  <p className="text-emerald-500 font-bold italic">Isolated</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 border-red-500/20 bg-red-500/5"
          >
            <h2 className="text-xl font-bold mb-2 text-red-500 flex items-center gap-2">
              <Trash2 size={20} /> Danger Zone
            </h2>
            <p className="text-xs text-[var(--color-slate-400)] mb-6">
              Deleting your account is permanent. All your data will be wiped from the database.
            </p>
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full py-3 border border-red-500/50 text-red-500 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              Delete My Account
            </button>
          </motion.div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute inset-0 bg-dark/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-panel p-8 max-w-sm w-full relative z-10 border-red-500/30"
            >
              <h3 className="text-2xl font-bold text-slate-100 mb-2">Are you sure?</h3>
              <p className="text-slate-400 text-sm mb-8">
                This action cannot be undone. All your data will be permanently removed.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 bg-[var(--color-bg-lighter)] text-slate-100 rounded-xl font-bold hover:bg-slate-700 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteAccount}
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;
