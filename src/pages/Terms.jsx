import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ParticlesBackground from '../components/ui/ParticlesBackground';

const Terms = () => {
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
        
        <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">Terms & Conditions</h1>
        
        <div className="space-y-6 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using AntiGravity LMS, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">2. Description of Service</h2>
            <p>AntiGravity LMS provides users with access to a rich collection of resources, including various tools, educational content, and personalized content. You understand and agree that the service is provided "AS-IS" and that AntiGravity assumes no responsibility for the timeliness, deletion, mis-delivery or failure to store any user communications or personalization settings.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">3. User Conduct</h2>
            <p>You agree to use the service only for lawful purposes. You agree not to take any action that might compromise the security of the site, render the site inaccessible to others or otherwise cause damage to the site or the content.</p>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default Terms;
