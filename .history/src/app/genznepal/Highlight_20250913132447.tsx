'use client'

import { motion } from 'framer-motion'
import ProtestCarousel from '../components/CarouselCard'

export default function NepalHighlight() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 p-6">
      {/* Text Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="flex-1 text-center md:text-left"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold text-red-600">NEPAL IS BURNING</h1>
        <p className="mt-6 text-lg md:text-2xl font-semibold text-gray-200 max-w-2xl">
          Innocent kids are being killed. Search what’s happening in Nepal. Stand with the Gen-Z
          protest against corruption and brutality.
        </p>

        <p className="mt-6 text-lg md:text-2xl font-semibold text-gray-200 max-w-2xl">
          To the global community, please search about Nepal and Gen Z Protest across social media
          and internet. It is important for the world to know the shameless government of Nepal
          slaughtered their own kids and grandkids.
        </p>
      </motion.div>

      {/* Carousel Section */}
      <div className="flex-1 w-full">
        <ProtestCarousel />
      </div>
    </div>
  )
}
