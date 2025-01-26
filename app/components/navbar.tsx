"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Plane, BarChart, Users, Settings } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()

  const navItems = [{ name: "Dashboard", href: "/dashboard", icon: BarChart }]

  return (
    <nav className="bg-white shadow-sm">
      <div className="pl-4 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <img
                  className="h-10 w-auto"
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-nM0BkvHpLvLoX3JeDYnIRYFugNjWkV.png"
                  alt="American Airlines"
                />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname === item.href
                      ? "border-[#0078D2] text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="sm:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`${
                pathname === item.href
                  ? "bg-[#0078D2] text-white"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              } block px-3 py-2 rounded-md text-base font-medium`}
            >
              <div className="flex items-center">
                <item.icon className="mr-2 h-5 w-5" />
                {item.name}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

