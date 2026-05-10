import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

const LibraryContext = createContext();

export function LibraryProvider({ children }) {
  const { token, user } = useAuth();
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [issues, setIssues] = useState([]);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ totalBooks: 0, issuedBooks: 0, returnedBooks: 0, activeStudents: 0 });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWithAuth = async (url, options = {}) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    try {
      const res = await fetch(url, { ...options, headers });
      if (res.status === 204) return null;
      
      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        return null;
      }

      if (!res.ok) {
        console.error(`API Error (${url}):`, data.error || res.statusText);
        return null;
      }
      return data;
    } catch (e) {
      console.error(`Network Error (${url}):`, e);
      return null;
    }
  };

  const fetchData = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      
      // Fetch core data (books are public-ish, but we fetch with auth for consistency)
      const booksData = await fetchWithAuth('/api/books');
      if (booksData) setBooks(booksData);

      const requestsData = await fetchWithAuth('/api/requests');
      if (requestsData) setRequests(requestsData);

      const statsData = await fetchWithAuth('/api/stats');
      if (statsData) {
        setStats(statsData.stats || { totalBooks: 0, issuedBooks: 0, returnedBooks: 0, activeStudents: 0 });
        setActivities(statsData.activities || []);
      }
      
      // Fetch Admin-only data
      if (user?.role === 'admin') {
        const studentsData = await fetchWithAuth('/api/students');
        if (studentsData) setStudents(studentsData);

        const issuesData = await fetchWithAuth('/api/issues');
        if (issuesData) setIssues(issuesData);
      }
    } catch (e) {
      console.error("Critical error in fetchData:", e);
    } finally {
      setLoading(false);
    }
  }, [token, user?.role]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Actions
  const addBook = async (book) => {
    try {
      const res = await fetchWithAuth('/api/books', { method: 'POST', body: JSON.stringify(book) });
      if (res) {
        toast.success('Book added');
        fetchData();
      }
    } catch (e) { toast.error(e.message); }
  };

  const addStudent = async (student) => {
    try {
      const res = await fetchWithAuth('/api/students', { method: 'POST', body: JSON.stringify(student) });
      if (res) {
        toast.success('Student added');
        fetchData();
      }
    } catch (e) { toast.error(e.message); }
  };

  const updateStudent = async (studentId, data) => {
    try {
      const res = await fetchWithAuth(`/api/students/${studentId}`, { method: 'PATCH', body: JSON.stringify(data) });
      if (res) {
        toast.success('Student updated');
        fetchData();
      }
    } catch (e) { toast.error(e.message); }
  };

  const deleteStudent = async (studentId) => {
    try {
      const res = await fetchWithAuth(`/api/students/${studentId}`, { method: 'DELETE' });
      if (res !== undefined) {
        toast.success('Student deleted');
        fetchData();
      }
    } catch (e) { toast.error(e.message); }
  };

  const issueBook = async (bookId, studentId, dueDate) => {
    try {
      const res = await fetchWithAuth('/api/issues/issue', { 
        method: 'POST', 
        body: JSON.stringify({ bookId: parseInt(bookId), studentId: parseInt(studentId), dueDate }) 
      });
      if (res) {
        toast.success('Book issued');
        fetchData();
      }
    } catch (e) { toast.error(e.message); }
  };

  const returnBook = async (issueId) => {
    try {
      const res = await fetchWithAuth('/api/issues/return', { 
        method: 'POST', 
        body: JSON.stringify({ issueId: parseInt(issueId) }) 
      });
      if (res) {
        toast.success('Book returned');
        fetchData();
      }
    } catch (e) { toast.error(e.message); }
  };

  const requestBook = async (bookId) => {
    try {
      const res = await fetchWithAuth('/api/requests', {
        method: 'POST',
        body: JSON.stringify({ bookId: parseInt(bookId) })
      });
      if (res) {
        toast.success('Book request sent');
        fetchData();
      }
    } catch (e) { toast.error(e.message); }
  };

  const updateRequestStatus = async (requestId, status) => {
    try {
      const res = await fetchWithAuth(`/api/requests/${requestId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      if (res) {
        toast.success(`Request ${status.toLowerCase()}`);
        fetchData();
      }
    } catch (e) { toast.error(e.message); }
  };

  const cancelRequest = async (requestId) => {
    try {
      const res = await fetchWithAuth(`/api/requests/${requestId}`, { method: 'DELETE' });
      if (res !== undefined) {
        toast.success('Request cancelled');
        fetchData();
      }
    } catch (e) { toast.error(e.message); }
  };

  const value = {
    books, addBook,
    students, addStudent, updateStudent, deleteStudent,
    issues, issueBook, returnBook,
    requests, requestBook, updateRequestStatus, cancelRequest,
    activities, stats,
    loading, refreshData: fetchData
  };

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export const useLibrary = () => useContext(LibraryContext);
