const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',  // your frontend URL
  credentials: true,
}));


app.use('/api/auth', authRoutes);
app.use("/api/notes", noteRoutes);


const PORT = process.env.PORT || 5000;

app.listen(5000, () => console.log(`Server running on port ${5000}`));
