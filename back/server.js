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
  credentials: true,
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json());

if (typeof connectingDB === 'function') connectingDB();
if (typeof connectingcloudinary === 'function') connectingcloudinary();

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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});