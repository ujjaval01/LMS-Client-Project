import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'readify_super_secret_key_2026';

app.use(cors());
app.use(express.json());

// --- Authentication Middleware ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.status(401).json({ error: 'Token missing' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// --- Auth Routes ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, rollNo, department, password } = req.body;
    if (!name || !rollNo || !department || !password) return res.status(400).json({ error: 'All fields required' });

    const existingUser = await prisma.user.findUnique({ where: { rollNo } });
    if (existingUser) return res.status(400).json({ error: 'Roll number already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.$transaction([
      prisma.user.create({ data: { name, rollNo, department, password: hashedPassword, role: 'student' } }),
      prisma.student.create({ data: { name, rollNo, department } })
    ]);
    res.json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, rollNo, password, role } = req.body;
    let user;

    if (role === 'admin' && email === 'admin@library.com' && password === 'admin123') {
      user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        user = await prisma.user.create({ data: { name: 'Main Librarian', email: 'admin@library.com', password: hashedPassword, role: 'admin' } });
      }
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
      return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    }

    if (role === 'admin') {
      user = await prisma.user.findUnique({ where: { email } });
    } else {
      user = await prisma.user.findFirst({ where: { rollNo } });
    }
    
    if (!user) return res.status(400).json({ error: 'User not found' });
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.id, email: user.email, rollNo: user.rollNo, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, rollNo: user.rollNo, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    res.json({ user: { id: user.id, name: user.name, email: user.email, rollNo: user.rollNo, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { name, password } = req.body;
    const updateData = {};
    if (name && req.user.role !== 'student') updateData.name = name;
    if (password) updateData.password = await bcrypt.hash(password, 10);
    const user = await prisma.user.update({ where: { id: req.user.id }, data: updateData });
    res.json({ message: 'Profile updated', user: { name: user.name, email: user.email, rollNo: user.rollNo } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    if (req.user.role === 'student') {
      const user = await prisma.user.findUnique({ where: { id: req.user.id } });
      if (user?.rollNo) await prisma.student.delete({ where: { rollNo: user.rollNo } }).catch(() => {});
    }
    await prisma.bookRequest.deleteMany({ where: { userId: req.user.id } });
    await prisma.issue.deleteMany({ where: { userId: req.user.id } });
    await prisma.user.delete({ where: { id: req.user.id } });
    res.json({ message: 'Account deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Students Routes ---
app.get('/api/students', authenticateToken, async (req, res) => {
  const students = await prisma.student.findMany({ orderBy: { id: 'desc' } });
  res.json(students);
});

app.post('/api/students', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);
  try {
    const student = await prisma.student.create({ data: req.body });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/students/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);
  try {
    const student = await prisma.student.update({ where: { id: parseInt(req.params.id) }, data: req.body });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/students/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);
  try {
    await prisma.student.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Student deleted' });
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
  if (req.user.role !== 'admin') return res.sendStatus(403);
  try {
    const book = await prisma.book.create({ data: req.body });
    await prisma.activity.create({ data: { type: 'add', text: `Added book: ${book.title}` } });
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Book Requests Routes ---
app.get('/api/requests', authenticateToken, async (req, res) => {
  try {
    let requests;
    if (req.user.role === 'admin') {
      requests = await prisma.bookRequest.findMany({ include: { book: true, user: true }, orderBy: { createdAt: 'desc' } });
    } else {
      requests = await prisma.bookRequest.findMany({ where: { userId: req.user.id }, include: { book: true }, orderBy: { createdAt: 'desc' } });
    }
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/requests', authenticateToken, async (req, res) => {
  try {
    const request = await prisma.bookRequest.create({ data: { bookId: req.body.bookId, userId: req.user.id } });
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/requests/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);
  try {
    const { status } = req.body;
    const requestId = parseInt(req.params.id);
    const request = await prisma.bookRequest.findUnique({ where: { id: requestId }, include: { book: true, user: true } });
    
    if (!request) return res.status(404).json({ error: 'Request not found' });
    if (request.status !== 'Pending') return res.status(400).json({ error: 'Request already processed' });

    if (status === 'Approved') {
      if (request.book.status !== 'Available') return res.status(400).json({ error: 'Book not available' });
      
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);

      let studentId = null;
      if (request.user.rollNo) {
        const student = await prisma.student.findUnique({ where: { rollNo: request.user.rollNo } });
        if (student) studentId = student.id;
      }

      await prisma.$transaction([
        prisma.bookRequest.update({ where: { id: requestId }, data: { status: 'Approved' } }),
        prisma.issue.create({ 
          data: { 
            bookId: request.bookId, 
            userId: request.userId, 
            studentId: studentId,
            dueDate: dueDate 
          } 
        }),
        prisma.book.update({ where: { id: request.bookId }, data: { status: 'Issued' } }),
        prisma.activity.create({ data: { type: 'issue', text: `Issued ${request.book.title} to ${request.user.name}` } }),
        ...(studentId ? [prisma.student.update({ where: { id: studentId }, data: { activeIssues: { increment: 1 } } })] : [])
      ]);
      
      return res.json({ message: 'Request Approved' }); // FIXED: Added return res.json here
    } else {
      await prisma.bookRequest.update({ where: { id: requestId }, data: { status } });
      return res.json({ message: `Request ${status}` });
    }
  } catch (error) {
    console.error("Request Update Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/requests/:id', authenticateToken, async (req, res) => {
  try {
    const request = await prisma.bookRequest.findUnique({ where: { id: parseInt(req.params.id) } });
    if (request.userId !== req.user.id && req.user.role !== 'admin') return res.sendStatus(403);
    await prisma.bookRequest.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Request deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Issues Routes ---
app.get('/api/issues', authenticateToken, async (req, res) => {
  try {
    const issues = await prisma.issue.findMany({ include: { book: true, user: true, student: true }, orderBy: { issueDate: 'desc' } });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/issues/issue', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);
  try {
    const { bookId, studentId, userId, dueDate } = req.body;
    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book || book.status !== 'Available') return res.status(400).json({ error: 'Book not available' });

    let finalStudentId = studentId ? parseInt(studentId) : null;
    if (!finalStudentId && userId) {
      const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } });
      if (user?.rollNo) {
        const student = await prisma.student.findUnique({ where: { rollNo: user.rollNo } });
        if (student) finalStudentId = student.id;
      }
    }

    const trans = [
      prisma.issue.create({ data: { bookId, studentId: finalStudentId, userId: userId ? parseInt(userId) : null, dueDate: new Date(dueDate) } }),
      prisma.book.update({ where: { id: bookId }, data: { status: 'Issued' } }),
      prisma.activity.create({ data: { type: 'issue', text: `Issued ${book.title}` } }),
      ...(finalStudentId ? [prisma.student.update({ where: { id: finalStudentId }, data: { activeIssues: { increment: 1 } } })] : [])
    ];

    await prisma.$transaction(trans);
    res.json({ message: 'Book issued' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/issues/return', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);
  try {
    const { issueId } = req.body;
    const issue = await prisma.issue.findUnique({ where: { id: parseInt(issueId) }, include: { book: true, user: true, student: true } });
    if (!issue || issue.status !== 'Active') return res.status(400).json({ error: 'Invalid issue' });

    const trans = [
      prisma.issue.update({ where: { id: parseInt(issueId) }, data: { status: 'Returned' } }),
      prisma.book.update({ where: { id: issue.bookId }, data: { status: 'Available' } }),
      prisma.activity.create({ data: { type: 'return', text: `${issue.user?.name || issue.student?.name} returned ${issue.book.title}` } }),
      ...(issue.studentId ? [prisma.student.update({ where: { id: issue.studentId }, data: { activeIssues: { decrement: 1 } } })] : [])
    ];

    await prisma.$transaction(trans);
    res.json({ message: 'Book returned' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Stats ---
app.get('/api/stats', authenticateToken, async (req, res) => {
  try {
    const totalBooks = await prisma.book.count();
    const issuedBooks = await prisma.book.count({ where: { status: 'Issued' } });
    const returnedBooks = await prisma.book.count({ where: { status: 'Available' } });
    const userStudents = await prisma.user.count({ where: { role: 'student' } });
    const manualStudents = await prisma.student.count();
    const activities = await prisma.activity.findMany({ take: 10, orderBy: { createdAt: 'desc' } });
    res.json({ stats: { totalBooks, issuedBooks, returnedBooks, activeStudents: userStudents + manualStudents }, activities });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/seed', async (req, res) => {
  try {
    const adminEmail = 'admin@library.com';
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await prisma.user.create({ data: { name: 'Main Librarian', email: adminEmail, password: hashedPassword, role: 'admin' } });
    }
    res.json({ message: "Seeded" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
}

export default app;
