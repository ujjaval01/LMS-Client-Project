import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, MoreHorizontal, X } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';

const Students = () => {
  const { students, addStudent } = useLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', rollNo: '', department: '' });

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addStudent(newStudent);
    setShowAddModal(false);
    setNewStudent({ name: '', rollNo: '', department: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-glow">Students Directory</h1>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-gradient-to-r from-brand-primary to-brand-secondary px-4 py-2 rounded-xl text-white font-medium hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all">
          <Plus size={20} /> Add Student
        </button>
      </div>

      <div className="glass-panel p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-slate-400)] w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by name or roll number..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[var(--color-bg-lighter)] border border-[var(--glass-border)] rounded-xl focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-[var(--color-slate-100)] placeholder-[var(--color-slate-400)]"
          />
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--glass-border)] bg-[var(--color-bg-lighter)] text-[var(--color-slate-400)] text-sm">
                <th className="py-4 px-6 font-medium">Student Name</th>
                <th className="py-4 px-6 font-medium">Roll Number</th>
                <th className="py-4 px-6 font-medium">Department</th>
                <th className="py-4 px-6 font-medium text-center">Active Issues</th>
                <th className="py-4 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, i) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={student.id} 
                  className="border-b border-[var(--glass-border)] last:border-0 hover:bg-[var(--color-bg-lightest)] transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-secondary to-brand-primary p-[2px]">
                        <div className="w-full h-full rounded-full bg-[var(--color-bg)] flex items-center justify-center font-bold text-sm text-[var(--color-slate-100)]">
                          {student.name.charAt(0)}
                        </div>
                      </div>
                      <span className="font-medium text-[var(--color-slate-100)]">{student.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-[var(--color-slate-300)]">{student.rollNo}</td>
                  <td className="py-4 px-6 text-[var(--color-slate-300)]">{student.department}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                      student.activeIssues > 0 ? 'bg-amber-400/20 text-amber-500 font-bold' : 'bg-[var(--color-bg-lighter)] text-[var(--color-slate-400)]'
                    }`}>
                      {student.activeIssues}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="p-2 text-[var(--color-slate-400)] hover:text-brand-primary transition-colors">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel p-6 w-full max-w-md relative"
            >
              <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-[var(--color-slate-400)] hover:text-brand-primary">
                <X size={20} />
              </button>
              <h2 className="text-2xl font-bold mb-6 text-glow">Add Student</h2>
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-[var(--color-slate-400)] mb-1">Name</label>
                  <input type="text" required value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} className="w-full px-4 py-2 bg-[var(--color-bg-lighter)] border border-[var(--glass-border)] rounded-xl focus:outline-none focus:border-brand-primary text-[var(--color-slate-100)]" />
                </div>
                <div>
                  <label className="block text-sm text-[var(--color-slate-400)] mb-1">Roll Number</label>
                  <input type="text" required value={newStudent.rollNo} onChange={e => setNewStudent({...newStudent, rollNo: e.target.value})} className="w-full px-4 py-2 bg-[var(--color-bg-lighter)] border border-[var(--glass-border)] rounded-xl focus:outline-none focus:border-brand-primary text-[var(--color-slate-100)]" />
                </div>
                <div>
                  <label className="block text-sm text-[var(--color-slate-400)] mb-1">Department</label>
                  <input type="text" required value={newStudent.department} onChange={e => setNewStudent({...newStudent, department: e.target.value})} className="w-full px-4 py-2 bg-[var(--color-bg-lighter)] border border-[var(--glass-border)] rounded-xl focus:outline-none focus:border-brand-primary text-[var(--color-slate-100)]" />
                </div>
                <button type="submit" className="w-full py-3 mt-4 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl text-white font-bold hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all">
                  Save Student
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default Students;
