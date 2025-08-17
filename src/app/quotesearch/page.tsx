"use client"

import React, { useState } from "react";

export default function QuoteSearchPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/gurkha/getQuotes?query=${encodeURIComponent(query.trim())}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to fetch quotes");
      }
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch quotes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black px-4 py-12">
      <div className="w-full max-w-xl mx-auto">
        <h1 className="text-3xl font-black text-black dark:text-white mb-8 text-center">Live Quote Search</h1>
        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Enter ticker or company name..."
            className="flex-1 px-4 py-3 rounded-l-lg border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-lg"
            autoFocus
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-r-lg bg-black text-white font-bold hover:bg-gray-900 transition text-lg"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
        {error && (
          <div className="text-red-600 dark:text-red-400 text-center mb-4">{error}</div>
        )}
        {result && (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 shadow text-black dark:text-white">
            <pre className="whitespace-pre-wrap break-all text-sm">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </main>
  );
} 