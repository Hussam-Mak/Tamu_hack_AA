export interface Pilot {
  id: string
  name: string
  totalHours: number
  totalFlights: number
  efficiency: number[]
  onTimePerformance: number
  safetyIncidents: number
  customerSatisfaction: number
  fuelEfficiency: number
  trainingScore: number
  fatigueRisk: "Low" | "Medium" | "High"
  aircraftCertifications: string[]
  yearsOfExperience: number
  basedAt: string
}

export interface Flight {
  id: string
  pilotId: string
  route: string
  date: string
  onTime: boolean
  fuelEfficiency: number
  departureTime: string
  arrivalTime: string
  aircraft: string
  passengerCount: number
}

export interface DashboardStats {
  totalFlights: number
  averageEfficiency: number
  topPerformingPilot: string
  revenuePassengerKilometers: number
  availableSeatKilometers: number
  onTimePerformance: number
  customerSatisfactionAverage: number
  totalPilots: number
  totalAircraft: number
}

