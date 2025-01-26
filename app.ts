import express from 'express';
import cors from 'cors';
import flightRoutes from './routes/flights';

const app = express();
const port = 5001; // Use the port you configured earlier

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Flight Engine Backend!');
});

// Flight routes
app.use('/api/flights', flightRoutes);

// Start server
app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});