const express = require('express');
const dotenv = require('dotenv').config();
const morgan = require('morgan');
const cors = require('cors');
const {connectDB} = require('./config/db')
const cookie = require('cookie-parser')
const RequestRoutes = require('./routes/requestRoutes');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookie())

const allowedOrigins = process.env.ORIGINS.split(',');

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'DELETE', 'UPDATE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.get('/', (req, res) => {
    return res.send('Hello server is running')
});

app.use('/api', RequestRoutes)

const PORT = process.env.PORT || 5008;

app.listen(PORT, () => {
    console.log('Server is running on http://localhost:5008')
});

connectDB()