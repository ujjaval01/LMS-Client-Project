import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'antigravity_super_secret_key_2026';

app.use(cors());
app.use(express.json());

// --- Authentication Middleware ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- Auth Routes ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });
    res.json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    res.json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Books Routes ---
app.get('/api/books', async (req, res) => {
  const books = await prisma.book.findMany({ orderBy: { id: 'desc' } });
  res.json(books);
});

app.post('/api/books', authenticateToken, async (req, res) => {
  try {
    const book = await prisma.book.create({ data: req.body });
    await prisma.activity.create({ data: { type: 'add', text: `Added new book: ${book.title}` } });
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Students Routes ---
app.get('/api/students', async (req, res) => {
  const students = await prisma.student.findMany({ orderBy: { id: 'desc' } });
  res.json(students);
});

app.post('/api/students', authenticateToken, async (req, res) => {
  try {
    const student = await prisma.student.create({ data: req.body });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Issues Routes ---
app.get('/api/issues', async (req, res) => {
  const issues = await prisma.issue.findMany({
    include: { book: true, student: true },
    orderBy: { issueDate: 'desc' }
  });
  res.json(issues);
});

app.post('/api/issues/issue', authenticateToken, async (req, res) => {
  try {
    const { bookId, studentId, dueDate } = req.body;
    
    // Check if book is available
    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book || book.status !== 'Available') return res.status(400).json({ error: 'Book is not available' });

    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (!student) return res.status(400).json({ error: 'Student not found' });

    // Transaction
    const [issue] = await prisma.$transaction([
      prisma.issue.create({
        data: { bookId, studentId, dueDate: new Date(dueDate) }
      }),
      prisma.book.update({
        where: { id: bookId }, data: { status: 'Issued' }
      }),
      prisma.student.update({
        where: { id: studentId }, data: { activeIssues: { increment: 1 } }
      }),
      prisma.activity.create({
        data: { type: 'issue', text: `${student.name} issued ${book.title}` }
      })
    ]);

    res.json(issue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/issues/return', authenticateToken, async (req, res) => {
  try {
    const { issueId } = req.body;
    
    const issue = await prisma.issue.findUnique({ where: { id: issueId }, include: { book: true, student: true } });
    if (!issue || issue.status !== 'Active') return res.status(400).json({ error: 'Invalid or already returned issue' });

    // Transaction
    const [updatedIssue] = await prisma.$transaction([
      prisma.issue.update({
        where: { id: issueId }, data: { status: 'Returned' }
      }),
      prisma.book.update({
        where: { id: issue.bookId }, data: { status: 'Available' }
      }),
      prisma.student.update({
        where: { id: issue.studentId }, data: { activeIssues: { decrement: 1 } }
      }),
      prisma.activity.create({
        data: { type: 'return', text: `${issue.student.name} returned ${issue.book.title}` }
      })
    ]);

    res.json(updatedIssue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Dashboard Stats ---
app.get('/api/stats', authenticateToken, async (req, res) => {
  try {
    const totalBooks = await prisma.book.count();
    const issuedBooks = await prisma.book.count({ where: { status: 'Issued' } });
    const returnedBooks = await prisma.book.count({ where: { status: 'Available' } });
    const activeStudents = await prisma.student.count();
    const activities = await prisma.activity.findMany({ take: 10, orderBy: { createdAt: 'desc' } });

    res.json({
      stats: { totalBooks, issuedBooks, returnedBooks, activeStudents },
      activities
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Seed data route (for convenience)
app.post('/api/seed', async (req, res) => {
  try {
    await prisma.book.createMany({
      data: [
        { title: "The Martian", author: "Andy Weir", category: "Sci-Fi", status: "Available", cover: "https://images.unsplash.com/photo-1614285457768-646f65cb854e?w=800&q=80" },
        { title: "Atomic Habits", author: "James Clear", category: "Self-Help", status: "Available", cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80" },
      ]
    });
    await prisma.student.createMany({
      data: [
        { name: "Alice Johnson", rollNo: "CS-001", department: "Computer Science" },
        { name: "Bob Smith", rollNo: "ME-042", department: "Mechanical" }
      ]
    });
    res.json({ message: "Seeded dummy data" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
