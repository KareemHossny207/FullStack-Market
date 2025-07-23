require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectingDB = require('./config/mongo');
const connectingcloudinary = require('./config/cloudinary');
const userRouter = require("./routes/user")
const productRouter = require("./routes/product")
const cartRouter=require("./routes/cart")
const orderRouter=require("./routes/order")
const app = express()

const allowedOrigins = process.env.FRONTEND_URL.split(',');

app.use(cors({
  origin: function(origin, callback) {
    const allowed = [
      'https://backend-market-one.vercel.app',
      'https://frontend-market-weld.vercel.app',
      'http://localhost:3000',
      'http://localhost:3001'
    ];
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin || allowed.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token']
}));
app.use(express.json());

if (typeof connectingDB === 'function') connectingDB();
if (typeof connectingcloudinary === 'function') connectingcloudinary();

app.use('/', (req, res) => {
  res.send('API is running!');
});

app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
const PORT = process.env.PORT || 7777;

if (process.env.VERCEL !== "1") {
  app.listen(PORT, (err) => {
    if (err) {
      console.error('Error starting server:', err);
      return;
    }
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;