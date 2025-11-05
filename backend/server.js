require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./authRoutes');
const noteRoutes = require('./noteRoutes');
const chatRoutes  = require("./chat.js");
const cors = require('cors');
const cookieParser = require('cookie-parser');
connectDB();

const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',  // your frontend URL
  credentials: true,
}));


app.use('/api/auth', authRoutes);
app.use("/api/notes", noteRoutes);
const chatRouter = require("./chat.js");
app.use("/api", chatRouter);

const PORT = process.env.PORT || 5000;

app.listen(5000, () => console.log(`Server running on port ${5000}`));
