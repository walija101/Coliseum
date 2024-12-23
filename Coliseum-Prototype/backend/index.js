// index.js
// set up the routes
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const userRoutes = require('./routes/users');
const matchRoutes = require('./routes/matches');
const approvalRoutes = require('./routes/approvals');
const chatRoutes = require('./routes/chats'); // Ensure this matches the file name exactly
const authRoutes = require('./routes/auth');
const friendRoutes = require('./routes/friend');
const adminRoutes = require('./routes/admin');
const modRoutes = require('./routes/mod');
const uploadRoutes = require('./routes/upload');

const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const supabase = require('./supabaseClient');
const checkSupabaseConnection = require('./middlewares/checkSupabaseConnection');

// Set up the app and use CORS
const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// Route definitions
app.use('/users', userRoutes);
app.use('/matches', matchRoutes);
app.use('/approvals', approvalRoutes);
app.use('/chats', chatRoutes);
app.use('/auth', authRoutes);
app.use('/friend', friendRoutes);
app.use('/admin', adminRoutes);
app.use('/mod', modRoutes);
app.use('/upload', uploadRoutes);

// route protection
app.use(checkSupabaseConnection);

// graceful shutdown
async function gracefulShutdown() {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

app.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});

// Test route to fetch all users
app.get('/test/users', async (req, res) => {
  try {
    // Fetch users using Prisma
    const usersPrisma = await prisma.user.findMany();

    // Fetch users using Supabase
    const { data: usersSupabase, error } = await supabase
      .from('users')
      .select('*');

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ usersPrisma, usersSupabase });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;