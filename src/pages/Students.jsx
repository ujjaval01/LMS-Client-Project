import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, MoreHorizontal, X, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { toast } from 'react-hot-toast';

const Students = () => {
  const { students, addStudent, updateStudent, deleteStudent } = useLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [newStudent, setNewStudent] = useState({ name: '', rollNo: '', department: '' });
  const [editingStudent, setEditingStudent] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

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

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateStudent(editingStudent.id, {
      name: editingStudent.name,
      rollNo: editingStudent.rollNo,
      department: editingStudent.department
    });
    setShowEditModal(false);
    setEditingStudent(null);
  };

  const handleDelete = () => {
    deleteStudent(deletingId);
    setShowDeleteConfirm(false);
    setDeletingId(null);
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
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => { setEditingStudent(student); setShowEditModal(true); }}
                        className="p-2 text-[var(--color-slate-400)] hover:text-brand-primary transition-colors"
                        title="Edit Student"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => { setDeletingId(student.id); setShowDeleteConfirm(true); }}
                        className="p-2 text-[var(--color-slate-400)] hover:text-red-500 transition-colors"
                        title="Delete Student"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-panel p-6 w-full max-w-md relative">
              <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-[var(--color-slate-400)] hover:text-brand-primary"><X size={20} /></button>
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
                <button type="submit" className="w-full py-3 mt-4 bg-brand-primary rounded-xl text-white font-bold hover:shadow-lg transition-all">Save Student</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && editingStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-panel p-6 w-full max-w-md relative">
              <button onClick={() => setShowEditModal(false)} className="absolute top-4 right-4 text-[var(--color-slate-400)] hover:text-brand-primary"><X size={20} /></button>
              <h2 className="text-2xl font-bold mb-6 text-glow">Edit Student</h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-[var(--color-slate-400)] mb-1">Name</label>
                  <input type="text" required value={editingStudent.name} onChange={e => setEditingStudent({...editingStudent, name: e.target.value})} className="w-full px-4 py-2 bg-[var(--color-bg-lighter)] border border-[var(--glass-border)] rounded-xl focus:outline-none focus:border-brand-primary text-[var(--color-slate-100)]" />
                </div>
                <div>
                  <label className="block text-sm text-[var(--color-slate-400)] mb-1">Roll Number</label>
                  <input type="text" required value={editingStudent.rollNo} onChange={e => setEditingStudent({...editingStudent, rollNo: e.target.value})} className="w-full px-4 py-2 bg-[var(--color-bg-lighter)] border border-[var(--glass-border)] rounded-xl focus:outline-none focus:border-brand-primary text-[var(--color-slate-100)]" />
                </div>
                <div>
                  <label className="block text-sm text-[var(--color-slate-400)] mb-1">Department</label>
                  <input type="text" required value={editingStudent.department} onChange={e => setEditingStudent({...editingStudent, department: e.target.value})} className="w-full px-4 py-2 bg-[var(--color-bg-lighter)] border border-[var(--glass-border)] rounded-xl focus:outline-none focus:border-brand-primary text-[var(--color-slate-100)]" />
                </div>
                <button type="submit" className="w-full py-3 mt-4 bg-brand-primary rounded-xl text-white font-bold hover:shadow-lg transition-all">Update Student</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-panel p-8 max-w-sm w-full relative">
              <div className="flex flex-col items-center text-center">
                <AlertCircle size={48} className="text-red-500 mb-4" />
                <h3 className="text-xl font-bold text-slate-100 mb-2">Delete Student?</h3>
                <p className="text-slate-400 text-sm mb-8">This will permanently remove the student from the directory.</p>
                <div className="flex gap-4 w-full">
                  <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-3 bg-[var(--color-bg-lighter)] text-slate-100 rounded-xl font-bold hover:bg-slate-700 transition-all">Cancel</button>
                  <button onClick={handleDelete} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all">Delete</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Students;
