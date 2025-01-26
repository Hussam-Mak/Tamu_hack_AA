import { NextResponse } from "next/server"
import type { DashboardStats } from "../types"

const dashboardStats: DashboardStats = {
  totalFlights: 450,
  averageEfficiency: 3.6,
  topPerformingPilot: "Mike Johnson",
  revenuePassengerKilometers: 1000000,
  availableSeatKilometers: 1200000,
}

export async function GET() {
  console.log("GET /api/dashboard-stats called")
  try {
    return NextResponse.json(dashboardStats)
  } catch (error) {
    console.error("Error in /api/dashboard-stats GET:", error)
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

