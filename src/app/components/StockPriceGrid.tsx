import React from 'react';

export interface StockCompanyInfo {
  broadGroup: string;
  companyName: string;
  country: string;
  exchange: string;
  industryGroup: string;
  primarySector: string;
  searchCountry: string;
  searchName: string;
  searchTicker: string;
  sicCode: string;
  source: string;
  ticker: string;
}

interface StockPriceGridProps {
  companies: StockCompanyInfo[];
}

const StockPriceGrid: React.FC<StockPriceGridProps> = ({ companies }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Active Stock Prices</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {companies.map((company) => (
          <div
            key={company.ticker}
            className="border rounded-lg p-4 shadow bg-white dark:bg-gray-800 flex flex-col gap-2"
          >
            <div className="font-semibold text-lg">{company.companyName}</div>
            <div className="text-sm text-gray-500">{company.exchange} | {company.country}</div>
            <div className="text-sm">Sector: {company.primarySector}</div>
            <div className="text-sm">Industry: {company.industryGroup}</div>
            <div className="text-sm">Ticker: <span className="font-mono">{company.ticker}</span></div>
            <div className="mt-4 text-xl font-bold text-green-600 dark:text-green-400">$123.45 <span className="text-xs text-gray-400">(placeholder)</span></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockPriceGrid; 