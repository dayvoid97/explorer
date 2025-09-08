export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black text-white py-8">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-center">
            SHAME ON THE NEPAL GOVERNMENT
          </h1>
          <p className="text-lg text-center mt-2 text-gray-300">SOLIDARITY FOR THE GEN-Z PROTEST</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Solidarity Statement Section */}
        <section className="mb-16">
          <div className="border-l-4 border-gray-800 pl-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
              19 people got killed in the protest against the government in nepal
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                The government of Nepal opened fire on kids under 18, kids wearing uniforms,
                innocent kids, kids who are their grandchildren's age.
              </p>
            </div>
          </div>
        </section>

        {/* Memorial Section */}
        <section className="mb-16 bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">
            Remembering the Victims
          </h2>
          <div className="text-center">
            <p className="text-gray-700 leading-relaxed mb-6">
              We don't know details of the victims yet. Rest in peace their innocent souls.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">Your blood will not go in vain.</p>
            <p className="text-gray-700 leading-relaxed mb-6">
              To our brothers and sisters who are injured, THE FIGHT STAYS STRONG
            </p>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">How You We Help?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">GEN-Z Protest</h3>
              <p className="text-gray-700 mb-4">
                This is a Gen-Z protest. The Gen-Z must show up and demand change. Protest must not
                stop.
              </p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Keep your resources ready
              </h3>
              <p className="text-gray-700 mb-4">
                The protest is not stopping anytime soon. Keep your resources intact for the youth
                of Nepal will need them very soon.
              </p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">WRITE ON THE PROTEST</h3>
              <p className="text-gray-700 mb-4">
                FINANCIAL GURKHA WILL STAY ALIVE THROUGHOUT THE PROTEST. Friends in Nepal, please
                keep sending us materials so we can keep the world aware.
              </p>
            </div>
          </div>
        </section>

        {/* Contact/About Section */}
        <section className="border-t pt-12">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-900">About Us</h2>
              <p className="text-gray-700 leading-relaxed">
                Hi, I am Kanchan Sharma, still a Gen-Z for another week or so. I am not in Nepal
                right now so I can't come to the protest directly. I run this website so I will be
                covering as much as I can find about the protest.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-900">Contact</h2>
              <div className="space-y-2 text-gray-700">
                <p>Email: [sharma.kanchan3154@gmail.com]</p>
                <p>WhatsApp: +1-201-954-5235</p>
                <p>US Phone No.: +1-201-954-5235</p>
                <p>Viber: +1-201-954-5235</p>

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
                    X formerly Twitter
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Financial Gurkha | Strum Collective | We stand for the
            freedom, right, justice. We stand against corruption and blatant mismanagement of our
            motherland. rights.
          </p>
        </div>
      </footer>
    </div>
  )
}
