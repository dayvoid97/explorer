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
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">How You Can Help</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">[Action Title 1]</h3>
              <p className="text-gray-700 mb-4">
                [Description of how people can help - donations, awareness, contacting
                representatives, etc.]
              </p>
              <a
                href="[YOUR_LINK]"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                [Action Button Text]
              </a>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">[Action Title 2]</h3>
              <p className="text-gray-700 mb-4">[Second way people can help or get involved]</p>
              <a
                href="[YOUR_LINK]"
                className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                [Action Button Text]
              </a>
            </div>
          </div>
        </section>

        {/* Contact/About Section */}
        <section className="border-t pt-12">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-900">About Us</h2>
              <p className="text-gray-700 leading-relaxed">
                [Brief description of your organization, its mission, and why you're speaking out on
                this issue.]
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-900">Contact</h2>
              <div className="space-y-2 text-gray-700">
                <p>Email: [your-email@example.com]</p>
                <p>Phone: [Your phone number]</p>
                <p>Address: [Your address if applicable]</p>
                <div className="pt-2">
                  <a href="[SOCIAL_LINK]" className="text-blue-600 hover:underline mr-4">
                    Facebook
                  </a>
                  <a href="[SOCIAL_LINK]" className="text-blue-600 hover:underline mr-4">
                    Twitter
                  </a>
                  <a href="[SOCIAL_LINK]" className="text-blue-600 hover:underline">
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
            © {new Date().getFullYear()} [Your Organization Name]. Standing for justice and human
            rights.
          </p>
        </div>
      </footer>
    </div>
  )
}
