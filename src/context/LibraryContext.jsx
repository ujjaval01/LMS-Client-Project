import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

const LibraryContext = createContext();

export function LibraryProvider({ children }) {
  const { token } = useAuth();
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState({ totalBooks: 0, issuedBooks: 0, returnedBooks: 0, activeStudents: 0 });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWithAuth = async (url, options = {}) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(url, { ...options, headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'API Error');
    return data;
  };

  const fetchData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const [booksData, studentsData, issuesData, statsData] = await Promise.all([
        fetchWithAuth('/api/books'),
        fetchWithAuth('/api/students'),
        fetchWithAuth('/api/issues'),
        fetchWithAuth('/api/stats')
      ]);
      setBooks(booksData);
      setStudents(studentsData);
      setIssues(issuesData);
      setStats(statsData.stats);
      setActivities(statsData.activities);
    } catch (e) {
      console.error("Failed to fetch data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // Actions
  const addBook = async (book) => {
    try {
      await fetchWithAuth('/api/books', { method: 'POST', body: JSON.stringify(book) });
      toast.success('Book added');
      fetchData();
    } catch (e) { toast.error(e.message); }
  };

  const addStudent = async (student) => {
    try {
      await fetchWithAuth('/api/students', { method: 'POST', body: JSON.stringify(student) });
      toast.success('Student added');
      fetchData();
    } catch (e) { toast.error(e.message); }
  };

  const issueBook = async (bookId, studentId, dueDate) => {
    try {
      await fetchWithAuth('/api/issues/issue', { 
        method: 'POST', 
        body: JSON.stringify({ bookId: parseInt(bookId), studentId: parseInt(studentId), dueDate }) 
      });
      toast.success('Book issued');
      fetchData();
    } catch (e) { toast.error(e.message); }
  };

  const returnBook = async (issueId) => {
    try {
      await fetchWithAuth('/api/issues/return', { 
        method: 'POST', 
        body: JSON.stringify({ issueId: parseInt(issueId) }) 
      });
      toast.success('Book returned');
      fetchData();
    } catch (e) { toast.error(e.message); }
  };

  const value = {
    books, addBook,
    students, addStudent,
    issues, issueBook, returnBook,
    activities, stats,
    loading, refreshData: fetchData
  };

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export const useLibrary = () => useContext(LibraryContext);
