'use client'

import { motion } from 'framer-motion'

import ProtestCarousel from '../components/CarouselCard'

export default function NepalHighlight() {
  return (
    <>
      <div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-red-600">NEPAL IS BURNING</h1>
          <p className="mt-6 text-lg md:text-2xl font-semibold text-gray-200 max-w-2xl mx-auto">
            Innocent kids are being killed. Search what’s happening in Nepal. Stand with the Gen-Z
            protest against corruption and brutality.
          </p>

          <h1 className="text-4xl md:text-6xl font-extrabold text-red-600">
            DISCOVERER WHAT IS GOING ON IN NEPAL
          </h1>

          <p className="mt-6 text-lg md:text-2xl font-semibold text-gray-200 max-w-2xl mx-auto">
            To the global community, please search about Nepal and Gen Z Protest across social media
            and internet. It is important for the world to know the shameless government of Nepal
            slaughtered their own kids and grandkids.
          </p>
        </motion.div>
      </div>
      <div>
        <ProtestCarousel />
      </div>
    </>
  )
}
