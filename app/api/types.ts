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
}

export interface Flight {
  id: string
  pilotId: string
  route: string
  date: string
  onTime: boolean
  fuelEfficiency: number
}

export interface DashboardStats {
  totalFlights: number
  averageEfficiency: number
  topPerformingPilot: string
  revenuePassengerKilometers: number
  availableSeatKilometers: number
}

