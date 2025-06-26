'use client'

import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function AboutLandingPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-white dark:bg-black px-6 py-16 flex flex-col items-center justify-center space-y-10">
      <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
        Meet the Creators
      </h1>

      <div className="flex flex-wrap justify-center gap-10">
        <div
          className="cursor-pointer hover:scale-105 transition-transform duration-300 text-center"
          onClick={() => router.push('/about/akash')}
        >
          <Image
            src="/akash.jpg"
            alt="Akash Pariyar"
            width={200}
            height={200}
            className="rounded-full object-cover"
          />
          <p className="mt-4 text-lg font-medium text-gray-800 dark:text-gray-200">Akash</p>
        </div>

        <div
          className="cursor-pointer hover:scale-105 transition-transform duration-300 text-center"
          onClick={() => router.push('/about/kanchan')}
        >
          <Image
            src="/kanchan.jpg"
            alt="Kanchan Sharma"
            width={200}
            height={200}
            className="rounded-full object-cover"
          />
          <p className="mt-4 text-lg font-medium text-gray-800 dark:text-gray-200">Kanchan</p>
        </div>
      </div>
    </main>
  )
}
