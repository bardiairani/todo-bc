const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const axios = require('axios');

const app = express();
const server = http.createServer(app);

// پیکربندی CORS برای Express
app.use(cors({
  origin: 'http://localhost:8080',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// پیکربندی CORS برای Socket.IO
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
  }
});

// 📌 مسیر تست ساده
app.get('/', (req, res) => {
  res.send('🚀 سرور در حال اجراست...');
});

// 📌 تابع دریافت آمار از یک URL
const getStats = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/stats');
    return response.data;
  } catch (err) {
    console.error('❌ خطا در دریافت آمار:', err.message);
    return {
      totalTodos: 0,
      completedTodos: 0,
      pendingTodos: 0,
      updatedAt: new Date()
    };
  }
};

// 📡 مدیریت اتصال سوکت‌ها
io.on('connection', (socket) => {
  console.log('✅ کاربر متصل شد');

  // ارسال آمار کلی اولیه
  getStats().then(stats => socket.emit('stats', stats));

  // ارسال آمار هر ۱۰ ثانیه
  const statsInterval = setInterval(async () => {
    const stats = await getStats();
    socket.emit('stats', stats);
  }, 10000);

  socket.on('disconnect', () => {
    console.log('❌ کاربر قطع شد');
    clearInterval(statsInterval);
  });
});

// 📌 یک API فرضی که آمار را تولید می‌کند
app.get('/api/todo-stats', (req, res) => {
  // اینجا به دیتابیس وصل کن یا دیتا ساختگی بده
  res.json({
    totalTodos: 50,
    completedTodos: 35,
    pendingTodos: 15,
    updatedAt: new Date()
  });
});

// اجرای سرور
const PORT = 5001;
server.listen(PORT, () => {
  console.log(`🚀 سرور روی پورت ${PORT} اجرا شد`);
});
