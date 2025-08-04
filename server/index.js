const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

// Load env vars
dotenv.config();

// Middlewares
app.use(cors());
app.use(express.json());

// ✅ Default route
app.get('/', (req, res) => {
  res.send('🚀 Welcome to CrypTap Offramp Server');
});

// ✅ Health check
app.get('/ping', (req, res) => {
  res.send('pong');
});

// ✅ Offramp route
const offrampRoutes = require('./routes/offramp');
app.use('/api/offramp', offrampRoutes);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port http://localhost:${PORT}`);
});
