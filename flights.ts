import { Router } from 'express';
import { fetchFlights } from '../services/flightService';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const result = await fetchFlights();
    res.json({
      systemTotals: result.totals,
      pilotStatistics: result.pilots
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch flights' });
  }
});

export default router;