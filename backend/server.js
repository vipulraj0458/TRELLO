const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');

const boardRoutes = require('./routes/boardRoutes');
const listRoutes = require('./routes/listRoutes');
const cardRoutes = require('./routes/cardRoutes');

const app = express();

const corsOptions = process.env.CORS_ORIGIN
  ? { origin: process.env.CORS_ORIGIN, credentials: true }
  : {};
app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ ok: true, service: 'trello-clone-api', version: '1.0.0' });
});

app.get('/test-db', async (req, res) => {
  try {
    await db.query("SELECT 1");
    res.json({ message: "DB connected" });
  } catch (err) {
    console.error("DB CONNECTION ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.use('/boards', boardRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/cards', cardRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
