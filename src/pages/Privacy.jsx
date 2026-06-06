import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ParticlesBackground from '../components/ui/ParticlesBackground';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-dark text-slate-100 relative overflow-hidden flex flex-col items-center px-4 py-20">
      <ParticlesBackground />
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-brand-primary/20 to-transparent pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-4xl glass-panel p-8 md:p-12 rounded-3xl"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-accent transition-colors mb-8">
          <ArrowLeft size={20} /> Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">Privacy Policy</h1>
        
        <div className="space-y-6 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">1. Information Collection</h2>
            <p>We collect information from you when you register on our site, place an order, subscribe to our newsletter, respond to a survey or fill out a form. Any data we request that is not required will be specified as voluntary or optional.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">2. Information Usage</h2>
            <p>Any of the information we collect from you may be used in one of the following ways: To personalize your experience, to improve our website, to improve customer service, to process transactions, or to send periodic emails.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">3. Data Protection</h2>
            <p>We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information. We offer the use of a secure server.</p>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default Privacy;
