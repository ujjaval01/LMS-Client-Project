import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, ArrowLeftRight, Clock, CheckCircle, XCircle, MoreVertical, RefreshCcw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLibrary } from '../context/LibraryContext';

const data = [
  { name: 'Mon', issues: 40, returns: 24 },
  { name: 'Tue', issues: 30, returns: 13 },
  { name: 'Wed', issues: 20, returns: 98 },
  { name: 'Thu', issues: 27, returns: 39 },
  { name: 'Fri', issues: 18, returns: 48 },
  { name: 'Sat', issues: 23, returns: 38 },
  { name: 'Sun', issues: 34, returns: 43 },
];

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-panel p-6 relative overflow-hidden group hover:border-brand-primary/50 transition-colors"
  >
    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
      <Icon size={80} />
    </div>
    <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
    <h3 className="text-3xl font-bold text-slate-100 mb-4">{value}</h3>
    <div className="flex items-center gap-2 text-xs font-bold">
      <span className={color}>+12%</span>
      <span className="text-slate-500">from last week</span>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { stats, activities, requests, updateRequestStatus, refreshData, loading } = useLibrary();
  const [processingId, setProcessingId] = React.useState(null);

  const handleUpdateStatus = async (id, status) => {
    setProcessingId(id);
    await updateRequestStatus(id, status);
    setProcessingId(null);
  };

  const pendingRequests = requests?.filter(r => r.status === 'Pending') || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-glow">Librarian Dashboard</h1>
          <p className="text-slate-400 mt-1">Overview of the library system and pending actions.</p>
        </div>
        <button 
          onClick={refreshData}
          className={`p-2 rounded-xl glass-panel hover:bg-[var(--color-bg-lighter)] transition-all ${loading ? 'animate-spin' : ''}`}
          title="Refresh Data"
        >
          <RefreshCcw size={20} className="text-brand-primary" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Books" value={stats.totalBooks} icon={BookOpen} color="text-brand-primary" delay={0.1} />
        <StatCard title="Issued Books" value={stats.issuedBooks} icon={ArrowLeftRight} color="text-brand-secondary" delay={0.2} />
        <StatCard title="Returned Books" value={stats.returnedBooks} icon={CheckCircle} color="text-emerald-500" delay={0.3} />
        <StatCard title="Active Students" value={stats.activeStudents} icon={Users} color="text-brand-accent" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Analytics Chart */}
        <div className="xl:col-span-2 glass-panel p-6 min-h-[400px]">
          <h2 className="text-xl font-bold mb-6 text-slate-100 flex items-center gap-2">
            <Clock className="text-brand-primary" /> Weekly Analytics
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
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
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    backdropBlur: '8px'
                  }}
                />
                <Area type="monotone" dataKey="issues" stroke="#3b82f6" fillOpacity={1} fill="url(#colorIssues)" />
                <Area type="monotone" dataKey="returns" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorReturns)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-panel p-6 h-fit max-h-[400px] overflow-hidden flex flex-col">
          <h2 className="text-xl font-bold mb-6 text-slate-100 flex items-center gap-2 shrink-0">
            <MoreVertical className="text-brand-secondary rotate-90" /> Activity Log
          </h2>
          <div className="space-y-4 overflow-y-auto pr-2 hide-scrollbar flex-1">
            {activities.map((activity, i) => (
              <div key={activity.id} className="flex gap-4 items-start">
                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                  activity.type === 'issue' ? 'bg-brand-primary' : activity.type === 'return' ? 'bg-emerald-500' : 'bg-brand-secondary'
                }`} />
                <div>
                  <p className="text-sm text-slate-300">{activity.text}</p>
                  <p className="text-[10px] text-slate-500">{new Date(activity.createdAt).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Book Requests Section (Admin only) */}
      <div className="glass-panel p-6">
        <h2 className="text-xl font-bold mb-6 text-slate-100 flex items-center gap-2">
          <ArrowLeftRight className="text-brand-accent" /> Pending Book Requests
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pendingRequests.length === 0 ? (
            <div className="col-span-full py-8 text-center text-slate-500 text-sm">No pending requests.</div>
          ) : (
            pendingRequests.map(req => (
              <div key={req.id} className="p-4 rounded-xl bg-[var(--color-bg-lighter)] border border-[var(--glass-border)] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                    <BookOpen size={18} className="text-brand-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100 line-clamp-1">{req.book?.title}</h4>
                    <p className="text-xs text-slate-500">Requested by: {req.user?.name}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleUpdateStatus(req.id, 'Approved')}
                    disabled={processingId === req.id}
                    className={`p-2 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white transition-all ${processingId === req.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title="Approve"
                  >
                    <CheckCircle size={16} />
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(req.id, 'Rejected')}
                    disabled={processingId === req.id}
                    className={`p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all ${processingId === req.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title="Reject"
                  >
                    <XCircle size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
