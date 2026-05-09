import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ParticlesBackground from '../components/ui/ParticlesBackground';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      const success = await login(formData.email, formData.password);
      if (success) navigate('/app/dashboard');
    } else {
      const success = await register(formData.name, formData.email, formData.password);
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
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)]">
            <BookOpen className="text-white w-7 h-7" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-glow mb-2">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-[var(--color-slate-400)] text-center mb-8 text-sm">
          {isLogin ? 'Enter your credentials to access the system' : 'Sign up to start managing your library'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="relative"
              >
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-slate-400)] w-5 h-5" />
                <input 
                  type="text" name="name"
                  value={formData.name} onChange={handleChange}
                  placeholder="Full Name" 
                  className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg-lighter)] border border-[var(--glass-border)] rounded-xl focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-[var(--color-slate-100)] placeholder-[var(--color-slate-500)]"
                  required={!isLogin}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-slate-400)] w-5 h-5" />
            <input 
              type="email" name="email"
              value={formData.email} onChange={handleChange}
              placeholder="Email Address" 
              className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg-lighter)] border border-[var(--glass-border)] rounded-xl focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-[var(--color-slate-100)] placeholder-[var(--color-slate-500)]"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-slate-400)] w-5 h-5" />
            <input 
              type="password" name="password"
              value={formData.password} onChange={handleChange}
              placeholder="Password" 
              className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg-lighter)] border border-[var(--glass-border)] rounded-xl focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-[var(--color-slate-100)] placeholder-[var(--color-slate-500)]"
              required
            />
          </div>

          {isLogin && (
            <div className="flex justify-end">
              <a href="#" className="text-sm text-brand-primary hover:text-brand-accent transition-colors">Forgot Password?</a>
            </div>
          )}

          <button 
            type="submit" 
            className="w-full py-3 mt-4 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl text-white font-bold hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all flex items-center justify-center gap-2 group"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-[var(--color-slate-400)]">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            type="button"
            className="text-brand-primary font-medium hover:text-brand-accent transition-colors"
          >
            {isLogin ? 'Create one' : 'Sign in'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
