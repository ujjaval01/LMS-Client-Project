import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import ParticlesBackground from '../ui/ParticlesBackground';

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-dark text-slate-100 overflow-hidden relative transition-colors duration-300">
      <ParticlesBackground />
      
      <Sidebar />
      
      <div className="flex-1 flex flex-col relative z-10 w-full overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-dark/40 backdrop-blur-3xl hide-scrollbar p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
