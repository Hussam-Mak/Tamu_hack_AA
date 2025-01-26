// In src/services/flightService.ts
import axios from 'axios';

interface PilotStats {
  id: string;
  name: string;
  totalFlights: number;
  totalMiles: number;
  totalHours: number;
  weatherConditions: Set<string>;
  highestElevation: number;
  fuelEfficiencies: number[];
}

// In src/services/flightService.ts
export const fetchFlights = async () => {
  try {
    const response = await axios.get('http://localhost:4000/flights?date=2020-01-01');
    const allFlights = response.data as unknown[];  // Type assertion here

    // Initialize totals
    let totalMiles = 0;
    let totalFuelUsed = 0;
    let totalHours = 0;
    const pilotStatsMap = new Map<string, PilotStats>();

    // Process only first 100 flights
    const maxFlights = 100;
    const processedFlights = allFlights.slice(0, maxFlights);

    processedFlights.forEach((flight: any, index: number) => {
      // Update global totals
      totalMiles += flight.distance;
      totalFuelUsed += flight.fuelUsed;
      totalHours += flight.duration.hours + (flight.duration.minutes / 60);

      // Update pilot stats
      const pilot = flight.pilot;
      if (!pilot) return;

      const stats = pilotStatsMap.get(pilot.id) || {
        id: pilot.id,
        name: pilot.name,
        totalFlights: 0,
        totalMiles: 0,
        totalHours: 0,
        weatherConditions: new Set(),
        highestElevation: 0,
        fuelEfficiencies: [] as number[]
      };

      stats.totalFlights += 1;
      stats.totalMiles += flight.distance;
      stats.totalHours += flight.duration.hours + (flight.duration.minutes / 60);
      stats.weatherConditions.add(flight.weather.toLowerCase());
      stats.highestElevation = Math.max(stats.highestElevation, flight.highestElevation);
      
      if (flight.fuelUsed > 0) {
        stats.fuelEfficiencies.push(flight.fuelUsed / flight.distance);
      }

      pilotStatsMap.set(pilot.id, stats);
      
      // Log progress every 10 flights
      if ((index + 1) % 10 === 0) {
        console.log(`Processed ${index + 1} flights...`);
      }
    });

    console.log(`Finished processing ${processedFlights.length} flights`);

    // Process results with rounding
    const pilots = Array.from(pilotStatsMap.values()).map(pilot => {
      const avgEff = pilot.fuelEfficiencies.length > 0 
        ? pilot.fuelEfficiencies.reduce((a, b) => a + b, 0) / pilot.fuelEfficiencies.length
        : 0;

      return {
        ...pilot,
        totalMiles: Number(pilot.totalMiles.toFixed(4)),
        totalHours: Number(pilot.totalHours.toFixed(4)),
        highestElevation: Number(pilot.highestElevation.toFixed(4)),
        averageFuelEfficiency: Number(avgEff.toFixed(4)),
        weatherConditions: Array.from(pilot.weatherConditions)
      };
    });

    return {
      totals: {
        miles: Number(totalMiles.toFixed(4)),
        fuelUsed: Number(totalFuelUsed.toFixed(4)),
        hours: Number(totalHours.toFixed(4)),
        processedFlights: processedFlights.length
      },
      pilots: pilots.sort((a, b) => b.totalFlights - a.totalFlights)
    };
  } catch (error) {
    throw new Error('Failed to fetch flights');
  }
};
