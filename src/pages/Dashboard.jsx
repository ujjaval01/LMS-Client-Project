import React from 'react';
import { motion } from 'framer-motion';
import { Book, Users, BookmarkCheck, ArrowUpRight } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'Jan', issues: 400, returns: 240 },
  { name: 'Feb', issues: 300, returns: 139 },
  { name: 'Mar', issues: 200, returns: 980 },
  { name: 'Apr', issues: 278, returns: 390 },
  { name: 'May', issues: 189, returns: 480 },
  { name: 'Jun', issues: 239, returns: 380 },
];

const StatCard = ({ title, value, icon: Icon, trend, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="glass-panel p-6 relative overflow-hidden group hover:bg-slate-800/50 transition-colors"
  >
    <div className="absolute -right-6 -top-6 w-24 h-24 bg-brand-primary/10 rounded-full blur-2xl group-hover:bg-brand-primary/20 transition-colors" />
    <div className="flex items-center justify-between">
      <div>
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold mt-2 text-glow">{value}</h3>
      </div>
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 flex items-center justify-center border border-brand-primary/30">
        <Icon className="text-brand-primary w-6 h-6" />
      </div>
    </div>
    <div className="mt-4 flex items-center text-sm">
      <ArrowUpRight className="text-emerald-400 w-4 h-4 mr-1" />
      <span className="text-emerald-400 font-medium">{trend}%</span>
      <span className="text-slate-500 ml-2">vs last month</span>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { stats, activities } = useLibrary();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-glow">Dashboard Overview</h1>
        <div className="text-sm text-slate-400">Welcome back, Admin</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Books" value={stats.totalBooks} icon={Book} trend="+12" delay={0.1} />
        <StatCard title="Issued Books" value={stats.issuedBooks} icon={ArrowUpRight} trend="+5" delay={0.2} />
        <StatCard title="Returned Books" value={stats.returnedBooks} icon={BookmarkCheck} trend="+18" delay={0.3} />
        <StatCard title="Active Students" value={stats.activeStudents} icon={Users} trend="+2" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="lg:col-span-2 glass-panel p-6"
        >
          <h3 className="text-lg font-bold mb-4">Issue vs Return Analytics</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIssues" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{fill: '#94a3b8'}} axisLine={false} />
                <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="issues" stroke="#3b82f6" fillOpacity={1} fill="url(#colorIssues)" />
                <Area type="monotone" dataKey="returns" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorReturns)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="glass-panel p-6"
        >
          <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={activity.id} className="relative pl-6 pb-4 border-l border-slate-700 last:border-0 last:pb-0">
                <div className={`absolute -left-[5px] top-1 w-[10px] h-[10px] rounded-full border-2 border-dark ${
                  activity.type === 'issue' ? 'bg-brand-primary' : 
                  activity.type === 'return' ? 'bg-emerald-400' : 'bg-brand-secondary'
                }`}></div>
                <p className="text-sm text-slate-200">{activity.text}</p>
                <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
