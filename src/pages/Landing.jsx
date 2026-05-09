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
          Manage your library in <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent text-glow">AntiGravity</span>
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
      
      {/* Mock UI Preview */}
      <motion.div 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="mt-20 w-full max-w-5xl h-64 glass-panel rounded-t-3xl border-b-0 overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent z-10"></div>
        <div className="p-6 flex gap-4 opacity-50">
          <div className="w-1/4 h-32 rounded-xl bg-slate-800/50 border border-slate-700"></div>
          <div className="w-1/4 h-32 rounded-xl bg-slate-800/50 border border-slate-700"></div>
          <div className="w-1/4 h-32 rounded-xl bg-slate-800/50 border border-slate-700"></div>
          <div className="w-1/4 h-32 rounded-xl bg-slate-800/50 border border-slate-700"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default Landing;
