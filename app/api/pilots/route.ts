import { NextResponse } from "next/server"
import type { Pilot } from "../types"

const pilots: Pilot[] = [
  {
    id: "pilot-a",
    name: "John Doe",
    totalHours: 1000,
    totalFlights: 150,
    efficiency: [3.2, 3.5, 3.8, 3.4, 3.6, 3.5],
    onTimePerformance: 95,
    safetyIncidents: 0,
    customerSatisfaction: 4.8,
    fuelEfficiency: 92,
    trainingScore: 95,
    fatigueRisk: "Low",
    aircraftCertifications: ["Boeing 737", "Airbus A320", "Embraer E175"],
  },
  {
    id: "pilot-b",
    name: "Jane Smith",
    totalHours: 800,
    totalFlights: 120,
    efficiency: [3.4, 3.7, 3.5, 3.3, 3.2],
    onTimePerformance: 93,
    safetyIncidents: 1,
    customerSatisfaction: 4.6,
    fuelEfficiency: 90,
    trainingScore: 92,
    fatigueRisk: "Medium",
    aircraftCertifications: ["Boeing 737", "Airbus A320"],
  },
  {
    id: "pilot-c",
    name: "Mike Johnson",
    totalHours: 1200,
    totalFlights: 180,
    efficiency: [3.6, 3.3, 3.7, 3.5, 3.7, 3.6, 3.8],
    onTimePerformance: 97,
    safetyIncidents: 0,
    customerSatisfaction: 4.9,
    fuelEfficiency: 94,
    trainingScore: 98,
    fatigueRisk: "Low",
    aircraftCertifications: ["Boeing 737", "Airbus A320", "Boeing 787"],
  },
]

export async function GET() {
  console.log("GET /api/pilots called")
  try {
    return NextResponse.json(pilots)
  } catch (error) {
    console.error("Error in /api/pilots GET:", error)
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  console.log("POST /api/pilots called")
  try {
    const pilot: Pilot = await request.json()
    pilots.push(pilot)
    return NextResponse.json(pilot, { status: 201 })
  } catch (error) {
    console.error("Error in /api/pilots POST:", error)
    return NextResponse.json(
      { error: "Invalid request body", details: error instanceof Error ? error.message : String(error) },
      { status: 400 },
    )
  }
}

