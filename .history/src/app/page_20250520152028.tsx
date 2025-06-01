export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold">🌍 Financial Gurkha Explorer</h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
        Explore public equities by name, ticker, or region.
      </p>
      <a
        href="/explorer"
        className="mt-8 px-6 py-3 bg-primary-500 text-black rounded-lg hover:bg-primary-600 transition"
      >
        Launch Explorer
      </a>
      <a
        href="/"
        className="mt-8 px-6 py-3 bg-primary-500 text-black rounded-lg hover:bg-primary-600 transition"
      >
        Back Home
      </a>
    </main>
  )
}
