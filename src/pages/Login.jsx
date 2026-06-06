import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, BookOpen, Shield, GraduationCap, Contact, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ParticlesBackground from '../components/ui/ParticlesBackground';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [role, setRole] = useState('admin'); // 'admin' or 'student'
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    rollNo: '', 
    department: '', 
    password: '' 
  });
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      const credentials = role === 'admin' 
        ? { email: formData.email, password: formData.password }
        : { rollNo: formData.rollNo, password: formData.password };
      
      const success = await login(credentials, role);
      if (success) navigate('/app/dashboard');
    } else {
      const success = await register({
        name: formData.name,
        rollNo: formData.rollNo,
        department: formData.department,
        password: formData.password
      });
      if (success) setIsLogin(true);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4 relative overflow-hidden">
      <ParticlesBackground />
      
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-secondary/20 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-panel p-8 relative z-10"
      >
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)]">
            <BookOpen className="text-white w-7 h-7" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-glow mb-2">
          Readify Library
        </h2>
        
        {/* Role Selector */}
        <div className="flex p-1 bg-[var(--color-bg-lighter)] rounded-xl border border-[var(--glass-border)] mb-8">
          <button 
            onClick={() => { setRole('admin'); setIsLogin(true); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${role === 'admin' ? 'bg-brand-primary text-white shadow-lg' : 'text-[var(--color-slate-400)] hover:text-[var(--color-slate-200)]'}`}
          >
            <Shield size={16} /> <span className="text-sm font-medium">Librarian</span>
          </button>
          <button 
            onClick={() => { setRole('student'); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${role === 'student' ? 'bg-brand-secondary text-white shadow-lg' : 'text-[var(--color-slate-400)] hover:text-[var(--color-slate-200)]'}`}
          >
            <GraduationCap size={18} /> <span className="text-sm font-medium">Student</span>
          </button>
        </div>

        <p className="text-[var(--color-slate-400)] text-center mb-8 text-sm">
          {role === 'admin' 
            ? 'Administrator login only.' 
            : (isLogin ? 'Student portal. Log in with your Roll No.' : 'Register your student account.')}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {!isLogin && role === 'student' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-slate-400)] w-5 h-5" />
                  <input 
                    type="text" name="name"
                    value={formData.name} onChange={handleChange}
                    placeholder="Full Name" 
                    className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg-lighter)] border border-[var(--glass-border)] rounded-xl focus:outline-none focus:border-brand-primary transition-all text-[var(--color-slate-100)] placeholder-[var(--color-slate-500)]"
                    required
                  />
                </div>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-slate-400)] w-5 h-5" />
                  <input 
                    type="text" name="department"
                    value={formData.department} onChange={handleChange}
                    placeholder="Department (e.g. CS, ME)" 
                    className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg-lighter)] border border-[var(--glass-border)] rounded-xl focus:outline-none focus:border-brand-primary transition-all text-[var(--color-slate-100)] placeholder-[var(--color-slate-500)]"
                    required
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {role === 'admin' ? (
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-slate-400)] w-5 h-5" />
              <input 
                type="email" name="email"
                value={formData.email} onChange={handleChange}
                placeholder="Email Address" 
                className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg-lighter)] border border-[var(--glass-border)] rounded-xl focus:outline-none focus:border-brand-primary transition-all text-[var(--color-slate-100)] placeholder-[var(--color-slate-500)]"
                required
              />
            </div>
          ) : (
            <div className="relative">
              <Contact className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-slate-400)] w-5 h-5" />
              <input 
                type="text" name="rollNo"
                value={formData.rollNo} onChange={handleChange}
                placeholder="Roll Number (ID)" 
                className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg-lighter)] border border-[var(--glass-border)] rounded-xl focus:outline-none focus:border-brand-secondary transition-all text-[var(--color-slate-100)] placeholder-[var(--color-slate-500)]"
                required
              />
            </div>
          )}

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-slate-400)] w-5 h-5" />
            <input 
              type="password" name="password"
              value={formData.password} onChange={handleChange}
              placeholder="Password" 
              className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg-lighter)] border border-[var(--glass-border)] rounded-xl focus:outline-none focus:border-brand-primary transition-all text-[var(--color-slate-100)] placeholder-[var(--color-slate-500)]"
              required
            />
          </div>

          <button 
            type="submit" 
            className={`w-full py-3 mt-4 bg-gradient-to-r ${role === 'admin' ? 'from-brand-primary to-brand-accent' : 'from-brand-secondary to-brand-primary'} rounded-xl text-white font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 group`}
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {role === 'student' && (
          <div className="mt-8 text-center text-sm text-[var(--color-slate-400)]">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              type="button"
              className="text-brand-secondary font-medium hover:text-brand-primary transition-colors"
            >
              {isLogin ? 'Create one' : 'Sign in'}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
