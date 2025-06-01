// src/app/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-600 dark:text-gray-300">
        © {new Date().getFullYear()} FinancialGurkha. All rights reserved.
      </div>
    </footer>
  )
}
