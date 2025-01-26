"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export default function Page() {
  const router = useRouter()

  const handleLearnMore = () => {
    document.body.style.overflow = "hidden"
    router.push("/dashboard")
  }

  return (
    <motion.div
      className="min-h-screen bg-white font-sans pt-16"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, x: "-100%" }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <main className="relative px-4 pl-4 md:px-6 py-12 md:py-24">
        <div className="relative">
          <div className="absolute z-10 bottom-[60%] left-4 max-w-4xl">
            <div className="flex flex-col md:flex-row md:items-end md:space-x-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl leading-tight mb-4 md:mb-0">
                <span className="text-[#36495A] text-2xl md:text-3xl lg:text-4xl font-normal block">Fly the</span>
                <span className="text-[#0078D2] font-bold block">American Airline Way</span>
              </h1>
              <Button className="bg-[#0078D2] hover:bg-[#005a9e] text-white self-start" onClick={handleLearnMore}>
                Learn More
              </Button>
            </div>
          </div>
          <div className="-mx-4 md:-mx-6">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-LDz9k2UvgppkZtdUqTR1EYc0rv1Yqu.png"
              alt="American Airlines Aircraft"
              width={1920}
              height={1080}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </main>
    </motion.div>
  )
}

