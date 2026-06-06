import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import ParticlesBackground from '../components/ui/ParticlesBackground';

const Landing = () => {
  return (
    <div className="min-h-screen bg-dark text-slate-100 relative overflow-hidden flex flex-col justify-center items-center px-4">
      <ParticlesBackground />

      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-brand-primary/20 to-transparent pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center z-10 max-w-3xl"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-brand-primary text-sm font-medium mb-8">
          <Sparkles size={16} /> Welcome to the future of libraries
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          Manage your library in <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent text-glow">Readify</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Experience seamless book management, advanced analytics, and a futuristic UI that makes library administration a breeze.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/app/dashboard" className="px-8 py-4 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all flex items-center justify-center gap-2 group">
            Go to Dashboard
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/login" className="px-8 py-4 rounded-xl glass-panel text-slate-300 font-bold text-lg hover:bg-slate-800/50 hover:text-white transition-all">
            Login / Demo
          </Link>
        </div>
      </motion.div>

      {/* Feature Showcase / Small Images */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="mt-20 w-full max-w-6xl z-10 px-4"
      >
        <h3 className="text-center text-2xl font-bold mb-10 text-slate-200">Experience the interface</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-2 rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300">
                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Dashboard View" className="w-full h-48 object-cover rounded-xl border border-slate-700/50" />
            </div>
            <div className="glass-panel p-2 rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300">
                <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Student Portal View" className="w-full h-48 object-cover rounded-xl border border-slate-700/50" />
            </div>
            <div className="glass-panel p-2 rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300">
                <img src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Library Books View" className="w-full h-48 object-cover rounded-xl border border-slate-700/50" />
            </div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="w-full mt-32 py-10 border-t border-slate-800 bg-dark/80 backdrop-blur-md z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start">
                <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">Readify LMS</span>
                <p className="text-slate-500 text-sm mt-2">© 2026 Ujjaval Saini. All rights reserved.</p>
            </div>
            
            <div className="flex gap-6 text-sm text-slate-400">
                <Link to="/terms" className="hover:text-brand-primary transition-colors">Terms & Conditions</Link>
                <Link to="/privacy" className="hover:text-brand-primary transition-colors">Privacy Policy</Link>
            </div>

            <div className="flex gap-4">
                <a href="https://github.com/ujjaval01" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-slate-400 hover:text-white hover:bg-brand-primary/20 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                </a>
                <a href="https://www.instagram.com/ujvl.sa1n1/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-slate-400 hover:text-white hover:bg-brand-accent/20 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
                <a href="https://www.facebook.com/ujjaval.saini.96" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600/20 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a href="https://www.linkedin.com/in/ujjavalsaini/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-500/20 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
