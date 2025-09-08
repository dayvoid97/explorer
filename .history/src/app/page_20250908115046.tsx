export default function Home() {
  return (
    <div
      className="min-h-screen bg-black text-white"
      style={{
        backgroundImage: "url('/your-background.jpg')", // replace with your image path
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Header */}
      <header className="bg-black bg-opacity-80 text-white py-8">
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
          <div className="border-l-4 border-gray-500 pl-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              19 people got killed in the protest against the government in Nepal
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="leading-relaxed mb-4">
                The government of Nepal opened fire on kids under 18, kids wearing uniforms,
                innocent kids, kids who are their grandchildren's age.
              </p>
            </div>
          </div>
        </section>

        {/* Memorial Section */}
        <section className="mb-16 bg-black bg-opacity-70 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Remembering the Victims</h2>
          <div className="text-center">
            <p className="leading-relaxed mb-6">
              We don't know details of the victims yet. Rest in peace their innocent souls.
            </p>
            <p className="leading-relaxed mb-6">Your blood will not go in vain.</p>
            <p className="leading-relaxed mb-6">
              To our brothers and sisters who are injured, THE FIGHT STAYS STRONG
            </p>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">How You We Help?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-black bg-opacity-70 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">GEN-Z Protest</h3>
              <p className="mb-4">
                This is a Gen-Z protest. The Gen-Z must show up and demand change. Protest must not
                stop.
              </p>
            </div>
            <div className="bg-black bg-opacity-70 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Keep your resources ready</h3>
              <p className="mb-4">
                The protest is not stopping anytime soon. Keep your resources intact for the youth
                of Nepal will need them very soon.
              </p>
            </div>
            <div className="bg-black bg-opacity-70 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">WRITE ON THE PROTEST</h3>
              <p className="mb-4">
                FINANCIAL GURKHA WILL STAY ALIVE THROUGHOUT THE PROTEST. Friends in Nepal, please
                keep sending us materials so we can keep the world aware.
              </p>
              <a href="https://financialgurkha.com/signup">
                <p className="text-green-400 font-bold mb-4">
                  Click here to create an account to post
                </p>
              </a>
            </div>
            <div className="bg-black bg-opacity-70 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">SHARE ACROSS MEDIAS</h3>
              <p className="mb-4">
                Nepal might go dark anytime soon. Make sure you're sharing what's going on in Nepal.
              </p>
              <a href="https://financialgurkha.com/signup">
                <p className="text-green-400 font-bold mb-4">
                  Click here to create an account to post
                </p>
              </a>
            </div>
          </div>
        </section>

        {/* Contact/About Section */}
        <section className="border-t border-gray-600 pt-12">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-xl font-bold mb-4">About Us</h2>
              <p className="leading-relaxed">
                Hi, I am Kanchan Sharma, still a Gen-Z for another week or so. I am not in Nepal
                right now so I can't come to the protest directly. I run this website so I will be
                covering as much as I can find about the protest.
              </p>
              <br />
              <p className="leading-relaxed">
                I will ensure the website is live, all the time. Filters will be removed from the
                website in terms of content. Everything will be visible here.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-4">Contact</h2>
              <div className="space-y-2">
                <p>Email: [sharma.kanchan3154@gmail.com]</p>
                <p>WhatsApp: +1-201-954-5235</p>
                <p>US Phone No.: +1-201-954-5235</p>
                <p>Viber: +1-201-954-5235</p>

                <div className="pt-2">
                  <a
                    href="https://www.facebook.com/dayvoid97"
                    className="text-blue-400 hover:underline mr-4"
                  >
                    Facebook
                  </a>
                  <a
                    href="https://x.com/strumcollective"
                    className="text-blue-400 hover:underline mr-4"
                  >
                    X formerly Twitter
                  </a>
                  <a
                    href="https://www.instagram.com/kanchan.strum/"
                    className="text-pink-400 hover:underline"
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
      <footer className="bg-black bg-opacity-80 text-white py-8 mt-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Financial Gurkha | Strum Collective | We stand for the
            freedom, right, justice. We stand against corruption and blatant mismanagement of our
            motherland. Rights.
          </p>
        </div>
      </footer>
    </div>
  )
}
