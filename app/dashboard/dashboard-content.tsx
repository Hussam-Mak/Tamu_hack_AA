"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { User, UserCircle, Users, Plane, Clock, Calendar, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { motion, useInView, useAnimation } from "framer-motion"
import Image from "next/image"
import type { Pilot, Flight, DashboardStats } from "../types"

interface DashboardContentProps {
  pilots: Pilot[]
  flights: Flight[]
  stats: DashboardStats
}

const pilotColors = [
  "#FF6B6B", // Coral Red
  "#4ECDC4", // Caribbean Green
  "#45B7D1", // Blue Grotto
  "#FFA07A", // Light Salmon
  "#98D8C8", // Eton Blue
  "#F7DC6F", // Maize
  "#BB8FCE", // Lilac
]

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const AnimatedCard = ({ children, delay = 0 }) => {
  const controls = useAnimation()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  return (
    <motion.div ref={ref} animate={controls} initial="hidden" variants={fadeInUp} transition={{ duration: 0.5, delay }}>
      {children}
    </motion.div>
  )
}

export function DashboardContent({ pilots, flights, stats }: DashboardContentProps) {
  const [tooltip, setTooltip] = useState<{
    show: boolean
    x: number
    y: number
    data: { pilot: string; hours: number; efficiency: number } | null
  }>({
    show: false,
    x: 0,
    y: 0,
    data: null,
  })

  const [searchTerm, setSearchTerm] = useState("")

  const router = useRouter()

  const handlePilotClick = (pilotId: string) => {
    router.push(`/dashboard/pilot?id=${pilotId}`)
  }

  const pilotData = pilots.map((pilot, index) => ({
    ...pilot,
    color: pilotColors[index % pilotColors.length],
    icon: [User, UserCircle, Users][Math.floor(Math.random() * 3)],
    data: pilot.efficiency.map((eff, index) => ({
      hours: index * 200,
      efficiency: eff,
    })),
  }))

  const filteredPilots = pilotData.filter((pilot) => pilot.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const totalFlightsData = flights.reduce(
    (acc, flight) => {
      const date = new Date(flight.date).toISOString().split("T")[0]
      const existingEntry = acc.find((entry) => entry.date === date)
      if (existingEntry) {
        existingEntry.totalFlights++
      } else {
        acc.push({ date, totalFlights: 1 })
      }
      return acc
    },
    [] as { date: string; totalFlights: number }[],
  )

  const flightsByAircraft = flights.reduce(
    (acc, flight) => {
      acc[flight.aircraft] = (acc[flight.aircraft] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const flightsByAircraftData = Object.entries(flightsByAircraft).map(([aircraft, count]) => ({
    aircraft,
    count,
  }))

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F9FA] to-[#E9ECEF] p-8">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Flights", value: stats.totalFlights.toLocaleString(), icon: Plane },
          { title: "On-Time Performance", value: `${stats.onTimePerformance}%`, icon: Clock },
          { title: "Total Pilots", value: stats.totalPilots, icon: Users },
          { title: "Total Aircraft", value: stats.totalAircraft, icon: Plane },
        ].map((item, index) => (
          <AnimatedCard key={index} delay={index * 0.1}>
            <Card className="transition-all duration-300 hover:shadow-lg group overflow-hidden bg-gradient-to-br from-white to-[#F1F3F5] border-2 border-[#0078D2]">
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
                className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#0078D2] to-[#B61F23]"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </Card>
          </AnimatedCard>
        ))}
      </div>

      {/* Aircraft Image */}
      <AnimatedCard delay={0.4}>
        <div className="mt-6 rounded-lg overflow-hidden shadow-lg">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-3Vkysat9i32yySDn1HijfXJyXZgxgL.png"
            alt="American Airlines Aircraft"
            width={1920}
            height={400}
            className="w-full h-auto object-cover"
          />
        </div>
      </AnimatedCard>

      {/* Fuel Efficiency Panel */}
      <AnimatedCard delay={0.5}>
        <Card className="mt-6 bg-gradient-to-br from-white to-[#F1F3F5] border-2 border-[#0078D2] hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle>Pilot Fuel Efficiency Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-[540px] w-full">
              {/* Grid lines */}
              <div className="absolute inset-0 grid grid-cols-1 grid-rows-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="border-t border-gray-200" />
                ))}
              </div>

              {/* Y-axis label */}
              <div className="absolute -left-50 top-1/2 -translate-y-1/2 -rotate-90 text-sm text-gray-500">
                Fuel Efficiency
              </div>

              {/* Y-axis values */}
              <div className="absolute left-0 inset-y-4 w-10 flex flex-col justify-between text-sm text-gray-500">
                <span>4.5</span>
                <span>4.25</span>
                <span>4.0</span>
                <span>3.75</span>
                <span>3.5</span>
              </div>

              {/* Graph area */}
              <div className="absolute inset-0 ml-12 mr-20 mb-8 mt-4">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 920 360"
                  preserveAspectRatio="none"
                  onMouseLeave={() => setTooltip((prev) => ({ ...prev, show: false }))}
                >
                  {pilotData.map((pilot) => (
                    <g key={pilot.id}>
                      <path
                        d={`M ${pilot.data.map((d) => `${d.hours},${360 - (d.efficiency - 3.5) * 360}`).join(" L ")}`}
                        fill="none"
                        stroke={pilot.color}
                        strokeWidth="2"
                      />
                      {pilot.data.map((point, i) => (
                        <circle
                          key={i}
                          cx={point.hours}
                          cy={360 - (point.efficiency - 3.5) * 360}
                          r="6"
                          fill={pilot.color}
                          className="cursor-pointer transition-all duration-200"
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect()
                            setTooltip({
                              show: true,
                              x: rect.left,
                              y: rect.top,
                              data: {
                                pilot: pilot.name,
                                hours: point.hours,
                                efficiency: point.efficiency,
                              },
                            })
                          }}
                        />
                      ))}
                    </g>
                  ))}
                </svg>
              </div>

              {/* X-axis label */}
              <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 text-sm text-gray-500">Hours</div>

              {/* X-axis values */}
              <div className="absolute bottom-[-28px] left-12 right-20 flex justify-between text-sm text-gray-500">
                <span>0</span>
                <span>200</span>
                <span>400</span>
                <span>600</span>
                <span>800</span>
                <span>1000</span>
              </div>

              {/* Tooltip */}
              {tooltip.show && tooltip.data && (
                <div
                  className="absolute z-10 bg-white p-3 rounded-lg shadow-lg text-sm border border-gray-200"
                  style={{
                    left: `${tooltip.x}px`,
                    top: `${tooltip.y - 100}px`,
                    transform: "translateX(-50%)",
                  }}
                >
                  <div className="font-bold text-gray-700">{tooltip.data.pilot}</div>
                  <div className="text-gray-600">Hours: {tooltip.data.hours}</div>
                  <div className="text-gray-600">Efficiency: {tooltip.data.efficiency.toFixed(2)}</div>
                </div>
              )}

              {/* Legend */}
              <div className="absolute top-2 right-2 flex flex-col gap-2 bg-white bg-opacity-80 p-2 rounded">
                {pilotData.map((pilot) => (
                  <div key={pilot.id} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: pilot.color }} />
                    <span className="text-sm">{pilot.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedCard>

      {/* Rest of the panels */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 mt-6">
        <AnimatedCard delay={0.6}>
          <Card className="bg-gradient-to-br from-white to-[#F1F3F5] border-2 border-[#0078D2] hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle>Total Flights</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  totalFlights: {
                    label: "Total Flights",
                    color: "#B61F23",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={totalFlightsData}>
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                      label={{ value: "Date", position: "insideBottom", offset: -10 }}
                    />
                    <YAxis label={{ value: "Total Flights", angle: -90, position: "insideLeft", offset: 10 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="totalFlights" stroke="#B61F23" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.7}>
          <Card className="bg-gradient-to-br from-white to-[#F1F3F5] border-2 border-[#0078D2] hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle>Flights by Aircraft Type</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  count: {
                    label: "Number of Flights",
                    color: "#B61F23",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={flightsByAircraftData}>
                    <XAxis dataKey="aircraft" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="#B61F23" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </AnimatedCard>
      </div>

      {/* Pilot Directory Panel */}
      <AnimatedCard delay={0.8}>
        <Card className="mt-6 bg-gradient-to-br from-white to-[#F1F3F5] border-2 border-[#0078D2] hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle>Pilot Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 relative">
              <Input
                type="text"
                placeholder="Search pilots..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <div className="space-y-4">
              {filteredPilots.map((pilot, index) => (
                <motion.div
                  key={pilot.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  className="flex items-center space-x-4 p-2 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handlePilotClick(pilot.id)}
                >
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full">
                    {pilot.icon && <pilot.icon size={24} className="text-gray-600" />}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold">{pilot.name}</h3>
                    <p className="text-sm text-gray-500">Total Hours: {pilot.totalHours}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">Total Flights</p>
                    <p className="text-lg text-blue-600">{pilot.totalFlights}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">Based At</p>
                    <p className="text-lg text-blue-600">{pilot.basedAt}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </AnimatedCard>
    </div>
  )
}

