export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <header className="mb-6 border-b pb-3">
        <h2 className="text-2xl font-semibold">Gurkha Blog</h2>
      </header>
      {children}
    </div>
  )
}
