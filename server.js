const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes')

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(cors());
app.use(bodyParser.json());

// Define Routes
app.use('/api/users', userRoutes);
// app.use('/api/posts', require('./routes/postRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
