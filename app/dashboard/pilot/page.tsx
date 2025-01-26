"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Bar, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js"
import { Calendar, Clock, Plane, Shield, Star, Fuel, Book, BatteryCharging } from "lucide-react"
import { motion } from "framer-motion"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement)

// Mock data for pilots
const pilotsData = {
  "pilot-001": {
    id: "pilot-001",
    name: "Capt. Sarah Johnson",
    totalFlightHours: 12500,
    onTimePerformance: 97,
    safetyIncidents: 0,
    customerSatisfaction: 4.8,
    fuelEfficiency: 94,
    trainingScore: 98,
    fatigueRisk: "Low",
    aircraftCertifications: ["Boeing 737", "Airbus A320", "Embraer E175"],
    recentFlights: [
      { route: "JFK-LAX", date: "2023-06-01", onTime: true },
      { route: "LAX-ORD", date: "2023-06-02", onTime: true },
      { route: "ORD-MIA", date: "2023-06-03", onTime: true },
      { route: "MIA-JFK", date: "2023-06-04", onTime: false },
      { route: "JFK-BOS", date: "2023-06-05", onTime: true },
      { route: "BOS-DCA", date: "2023-06-06", onTime: true },
      { route: "JFK-ORD", date: "2023-06-07", onTime: true },
      { route: "ORD-DFW", date: "2023-06-08", onTime: false },
    ],
    upcomingFlights: [
      { route: "DFW-SEA", date: "2023-06-10" },
      { route: "SEA-BOS", date: "2023-06-12" },
    ],
    monthlyPerformance: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      onTimeData: [96, 98, 97, 99, 98, 97, 96, 98, 97, 96, 98, 97],
      fuelEfficiencyData: [93, 94, 95, 94, 96, 94, 95, 93, 94, 95, 94, 93],
    },
  },
  "pilot-002": {
    id: "pilot-002",
    name: "First Officer Michael Chen",
    totalFlightHours: 8000,
    onTimePerformance: 95,
    safetyIncidents: 1,
    customerSatisfaction: 4.6,
    fuelEfficiency: 92,
    trainingScore: 95,
    fatigueRisk: "Low",
    aircraftCertifications: ["Boeing 737", "Airbus A320"],
    recentFlights: [
      { route: "LAX-ORD", date: "2023-06-02", onTime: true },
      { route: "ORD-DFW", date: "2023-06-04", onTime: false },
      { route: "DFW-SEA", date: "2023-06-06", onTime: true },
      { route: "SEA-SFO", date: "2023-06-08", onTime: true },
      { route: "SFO-LAX", date: "2023-06-09", onTime: true },
      { route: "LAX-JFK", date: "2023-06-10", onTime: true },
      { route: "JFK-MIA", date: "2023-06-11", onTime: false },
      { route: "MIA-ATL", date: "2023-06-12", onTime: true },
    ],
    upcomingFlights: [
      { route: "ATL-DEN", date: "2023-06-14" },
      { route: "DEN-SEA", date: "2023-06-16" },
    ],
    monthlyPerformance: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      onTimeData: [94, 95, 96, 94, 95, 95, 94, 96, 95, 94, 95, 96],
      fuelEfficiencyData: [91, 92, 93, 92, 93, 92, 91, 93, 92, 91, 92, 93],
    },
  },
  "pilot-003": {
    id: "pilot-003",
    name: "Capt. Emily Rodriguez",
    totalFlightHours: 15000,
    onTimePerformance: 98,
    safetyIncidents: 0,
    customerSatisfaction: 4.9,
    fuelEfficiency: 95,
    trainingScore: 99,
    fatigueRisk: "Low",
    aircraftCertifications: ["Boeing 737", "Airbus A320", "Boeing 787"],
    recentFlights: [
      { route: "MIA-JFK", date: "2023-06-01", onTime: true },
      { route: "JFK-LHR", date: "2023-06-03", onTime: true },
      { route: "LHR-CDG", date: "2023-06-05", onTime: true },
      { route: "CDG-JFK", date: "2023-06-07", onTime: true },
      { route: "JFK-LAX", date: "2023-06-08", onTime: true },
      { route: "LAX-HNL", date: "2023-06-09", onTime: true },
      { route: "HNL-SFO", date: "2023-06-10", onTime: false },
      { route: "SFO-SEA", date: "2023-06-11", onTime: true },
    ],
    upcomingFlights: [
      { route: "SEA-DEN", date: "2023-06-13" },
      { route: "DEN-ATL", date: "2023-06-15" },
    ],
    monthlyPerformance: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      onTimeData: [97, 98, 99, 98, 97, 98, 97, 99, 98, 97, 98, 99],
      fuelEfficiencyData: [94, 95, 96, 95, 94, 95, 94, 96, 95, 94, 95, 96],
    },
  },
  "pilot-004": {
    id: "pilot-004",
    name: "First Officer David Kim",
    totalFlightHours: 6000,
    onTimePerformance: 94,
    safetyIncidents: 1,
    customerSatisfaction: 4.5,
    fuelEfficiency: 91,
    trainingScore: 94,
    fatigueRisk: "Medium",
    aircraftCertifications: ["Boeing 737", "Embraer E175"],
    recentFlights: [
      { route: "ORD-ATL", date: "2023-06-02", onTime: true },
      { route: "ATL-MIA", date: "2023-06-04", onTime: true },
      { route: "MIA-IAH", date: "2023-06-06", onTime: false },
      { route: "IAH-DEN", date: "2023-06-08", onTime: true },
      { route: "DEN-SEA", date: "2023-06-09", onTime: true },
      { route: "SEA-SFO", date: "2023-06-10", onTime: true },
      { route: "SFO-LAX", date: "2023-06-11", onTime: false },
      { route: "LAX-JFK", date: "2023-06-12", onTime: true },
    ],
    upcomingFlights: [
      { route: "JFK-BOS", date: "2023-06-14" },
      { route: "BOS-DCA", date: "2023-06-16" },
    ],
    monthlyPerformance: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      onTimeData: [93, 94, 95, 93, 94, 94, 93, 95, 94, 93, 94, 95],
      fuelEfficiencyData: [90, 91, 92, 91, 92, 91, 90, 92, 91, 90, 91, 92],
    },
  },
  "pilot-005": {
    id: "pilot-005",
    name: "Capt. Olivia Martinez",
    totalFlightHours: 13000,
    onTimePerformance: 96,
    safetyIncidents: 0,
    customerSatisfaction: 4.7,
    fuelEfficiency: 93,
    trainingScore: 97,
    fatigueRisk: "Low",
    aircraftCertifications: ["Boeing 737", "Airbus A320", "Boeing 787"],
    recentFlights: [
      { route: "LAX-HNL", date: "2023-06-01", onTime: true },
      { route: "HNL-SFO", date: "2023-06-03", onTime: true },
      { route: "SFO-JFK", date: "2023-06-05", onTime: true },
      { route: "JFK-LHR", date: "2023-06-07", onTime: false },
      { route: "LHR-CDG", date: "2023-06-08", onTime: true },
      { route: "CDG-JFK", date: "2023-06-09", onTime: true },
      { route: "JFK-MIA", date: "2023-06-10", onTime: true },
      { route: "MIA-ATL", date: "2023-06-11", onTime: false },
    ],
    upcomingFlights: [
      { route: "ATL-DEN", date: "2023-06-13" },
      { route: "DEN-SEA", date: "2023-06-15" },
    ],
    monthlyPerformance: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      onTimeData: [95, 96, 97, 96, 95, 96, 95, 97, 96, 95, 96, 97],
      fuelEfficiencyData: [92, 93, 94, 93, 92, 93, 92, 94, 93, 92, 93, 94],
    },
  },
}

export default function PilotDashboard() {
  const searchParams = useSearchParams()
  const [pilotId, setPilotId] = useState(searchParams?.get("id") || "pilot-001")
  const [pilotData, setPilotData] = useState(pilotsData[pilotId] || null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    const data = pilotsData[pilotId]
    if (data) {
      setPilotData(data)
    } else {
      console.error(`No data found for pilot with id: ${pilotId}`)
      // Optionally, redirect to an error page or set an error state
    }
    setIsLoading(false)
  }, [pilotId])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!pilotData) {
    return <div>Error: Pilot data not found</div>
  }

  return (
    <div className="container mx-auto p-4 space-y-4 bg-[#F8F9FA] min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Pilot Efficiency Dashboard</h1>

      <Select onValueChange={setPilotId} defaultValue={pilotId}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Pilot" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(pilotsData).map((pilot) => (
            <SelectItem key={pilot.id} value={pilot.id}>
              {pilot.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Flight Hours", value: pilotData.totalFlightHours, icon: Clock },
          { title: "On-Time Performance", value: `${pilotData.onTimePerformance}%`, icon: Plane },
          { title: "Safety Record", value: `${pilotData.safetyIncidents} incidents`, icon: Shield },
          { title: "Customer Satisfaction", value: `${pilotData.customerSatisfaction}/5`, icon: Star },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          >
            <Card className="transition-all duration-300 hover:shadow-lg group overflow-hidden bg-white border-2 border-[#0078D2]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#0078D2]">{item.title}</CardTitle>
                <item.icon className="h-4 w-4 text-[#B61F23]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#0078D2] group-hover:text-[#B61F23] transition-colors duration-300">
                  {item.value}
                </div>
              </CardContent>
              <motion.div
                className="absolute inset-x-0 bottom-0 h-1 bg-[#B61F23]"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-white border-2 border-[#0078D2] hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <Line
              data={{
                labels: pilotData.monthlyPerformance.labels,
                datasets: [
                  {
                    label: "On-Time Performance",
                    data: pilotData.monthlyPerformance.onTimeData,
                    borderColor: "#0078D2",
                    backgroundColor: "rgba(0, 120, 210, 0.5)",
                  },
                  {
                    label: "Fuel Efficiency",
                    data: pilotData.monthlyPerformance.fuelEfficiencyData,
                    borderColor: "#B61F23",
                    backgroundColor: "rgba(182, 31, 35, 0.5)",
                  },
                ],
              }}
            />
          </CardContent>
        </Card>
        <Card className="bg-white border-2 border-[#0078D2] hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle>Aircraft Certifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {pilotData.aircraftCertifications.map((cert, index) => (
                <Badge key={index} variant="secondary" className="bg-[#0078D2] text-white">
                  {cert}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-white border-2 border-[#0078D2] hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle>Recent Flights</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Route</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>On Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pilotData.recentFlights.map((flight, index) => (
                  <TableRow key={index}>
                    <TableCell>{flight.route}</TableCell>
                    <TableCell>{flight.date}</TableCell>
                    <TableCell>{flight.onTime ? "✅" : "❌"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="bg-white border-2 border-[#0078D2] hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle>Upcoming Flights</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Route</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pilotData.upcomingFlights.map((flight, index) => (
                  <TableRow key={index}>
                    <TableCell>{flight.route}</TableCell>
                    <TableCell>{flight.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border-2 border-[#0078D2] hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fuel Efficiency</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pilotData.fuelEfficiency}%</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-2 border-[#0078D2] hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Score</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pilotData.trainingScore}%</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-2 border-[#0078D2] hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fatigue Risk</CardTitle>
            <BatteryCharging className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pilotData.fatigueRisk}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

