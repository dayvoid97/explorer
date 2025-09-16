'use client'

import React from 'react'
import { motion } from 'framer-motion'
import ProtestCarousel from '../components/CarouselCard'

export default function NepalProtest() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Highlight Section */}
      <section className="flex flex-col md:flex-row items-center justify-center gap-8 p-6 bg-black">
        <div className="flex-1 w-full">
          <ProtestCarousel />
        </div>
      </section>

      {/* Main Protest Content */}

      <main className="max-w-4xl mx-auto px-6 py-12 rounded-lg mt-8">
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            72 martyrs sacrificed their lives for the protest against the corrupt government.
          </h2>
          <p className=" mb-4">
            The government of Nepal opened fire on minors—children in school uniforms—innocent kids
            who could be their grandchildren’s age.
          </p>
        </section>

        <section className="mb-16 bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Remembering the Victims</h2>
          <p className="text-center text-gray-700 mb-6">
            Rest in peace, innocent souls. Your blood will not go in vain. To our injured brothers
            and sisters: the fight stays strong.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">
            MEDIA FROM THE FRONT LINES AND ACROSS THE INTERNET
          </h2>
          <p className="mb-4">
            Nepal is burning. The younger generation needs global attention for their success.
            Please do not let their sacrifice fade.
          </p>
          <ProtestCarousel />
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">How You Can Help</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg text-black">
              <h3 className="text-xl font-semibold mb-3">GEN-Z Protest</h3>
              <p>This is a Gen-Z movement. Show up, speak out, and demand change. Do not stop.</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg text-black">
              <h3 className="text-xl font-semibold mb-3">Keep Resources Ready</h3>
              <p>
                The protest isn’t stopping soon. Support the youth of Nepal—keep resources ready and
                stay informed.
              </p>
            </div>
            <div className="bg-red-50 p-6 rounded-lg text-black">
              <h3 className="text-xl font-semibold mb-3">WRITE ON THE PROTEST</h3>
              <p>
                Share stories and updates to keep the world aware. Friends in Nepal, send materials
                for global visibility.
              </p>
            </div>
            <div className="bg-black p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-white">SHARE ACROSS MEDIAS</h3>
              <p className="text-white">
                Help spread the truth about Nepal’s struggle. Share widely before the lights go out.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t pt-12">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-xl font-bold mb-4">About Us</h2>
              <p className="text-gray-700">
                I am Kanchan Sharma, a Gen-Z member running this website to amplify the protest from
                afar. I will keep this site live and unfiltered to ensure the truth is visible.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-4">Contact</h2>
              <div className="space-y-2 text-gray-700">
                <p>Email: sharma.kanchan3154@gmail.com</p>
                <p>WhatsApp / Viber / Phone: +1-201-954-5235</p>
                <div className="pt-2">
                  <a
                    href="https://www.facebook.com/dayvoid97"
                    className="text-blue-600 hover:underline mr-4"
                  >
                    Facebook
                  </a>
                  <a
                    href="https://x.com/strumcollective"
                    className="text-blue-600 hover:underline mr-4"
                  >
                    X (Twitter)
                  </a>
                  <a
                    href="https://www.instagram.com/kanchan.strum/"
                    className="text-blue-600 hover:underline"
                  >
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-4xl mx-auto px-6 text-center text-gray-400">
          © {new Date().getFullYear()} Financial Gurkha | Strum Collective — Standing for freedom,
          justice, and against corruption.
        </div>
      </footer>
    </div>
  )
}
