import { NextResponse } from "next/server"
import type { Flight } from "../types"

const flights: Flight[] = [
  { id: "flight-1", pilotId: "pilot-a", route: "JFK-LAX", date: "2023-06-01", onTime: true, fuelEfficiency: 91 },
  { id: "flight-2", pilotId: "pilot-b", route: "LAX-ORD", date: "2023-06-03", onTime: true, fuelEfficiency: 89 },
  { id: "flight-3", pilotId: "pilot-c", route: "ORD-MIA", date: "2023-06-05", onTime: false, fuelEfficiency: 92 },
  { id: "flight-4", pilotId: "pilot-a", route: "MIA-DFW", date: "2023-06-07", onTime: true, fuelEfficiency: 90 },
  { id: "flight-5", pilotId: "pilot-b", route: "DFW-SEA", date: "2023-06-10", onTime: true, fuelEfficiency: 88 },
  { id: "flight-6", pilotId: "pilot-c", route: "SEA-BOS", date: "2023-06-12", onTime: true, fuelEfficiency: 93 },
]

export async function GET() {
  console.log("GET /api/flights called")
  try {
    return NextResponse.json(flights)
  } catch (error) {
    console.error("Error in /api/flights GET:", error)
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  console.log("POST /api/flights called")
  try {
    const flight: Flight = await request.json()
    flights.push(flight)
    return NextResponse.json(flight, { status: 201 })
  } catch (error) {
    console.error("Error in /api/flights POST:", error)
    return NextResponse.json(
      { error: "Invalid request body", details: error instanceof Error ? error.message : String(error) },
      { status: 400 },
    )
  }
}

