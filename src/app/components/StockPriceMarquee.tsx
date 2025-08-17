// import React, { useEffect, useState } from 'react';
// import { fetchLivePrices } from '../lib/fetcher';

// export interface StockCompanyInfo {
//   broadGroup: string;
//   companyName: string;
//   country: string;
//   exchange: string;
//   industryGroup: string;
//   primarySector: string;
//   searchCountry: string;
//   searchName: string;
//   searchTicker: string;
//   sicCode: string;
//   source: string;
//   ticker: string;
// }

// interface StockPriceMarqueeProps {
//   companies: StockCompanyInfo[];
// }

// const StockPriceMarquee: React.FC<StockPriceMarqueeProps> = ({ companies }) => {
//   const [prices, setPrices] = useState<Record<string, number>>({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let interval: NodeJS.Timeout;
//     const tickers = companies.map((c) => c.ticker);
//     const fetchPrices = async () => {
//       try {
//         setLoading(true);
//         const data = await fetchLivePrices(tickers);
//         setPrices(data);
//       } catch (err) {
//         setPrices({});
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPrices();
//     interval = setInterval(fetchPrices, 12000); // 12 seconds
//     return () => clearInterval(interval);
//   }, [companies]);

//   return (
//     <div className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
//       <div className="px-4 py-1 text-xs text-gray-500 dark:text-gray-400 text-right">
//         Prices refresh every 12 seconds (API limit)
//       </div>
//       <div className="overflow-hidden">
//         <div className="flex animate-marquee whitespace-nowrap">
//           {companies.map((company, index) => (
//             <div
//               key={`${company.ticker}-${index}`}
//               className="flex-shrink-0 px-6 py-3 border-r border-gray-200 dark:border-gray-700 min-w-[280px]"
//             >
//               <div className="flex items-center justify-between">
//                 <div className="flex-1 min-w-0">
//                   <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
//                     {company.companyName}
//                   </div>
//                   <div className="text-xs text-gray-500 dark:text-gray-400">
//                     {company.exchange} | {company.country}
//                   </div>
//                   <div className="text-xs text-gray-500 dark:text-gray-400">
//                     {company.primarySector} | {company.industryGroup}
//                   </div>
//                 </div>
//                 <div className="ml-4 text-right">
//                   <div className="text-sm font-mono font-bold text-green-600 dark:text-green-400">
//                     {loading ? '...' : prices[company.ticker] !== undefined ? `$${prices[company.ticker].toFixed(2)}` : 'N/A'}
//                   </div>
//                   <div className="text-xs text-gray-500 dark:text-gray-400">
//                     {company.ticker}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//           {/* Duplicate for seamless loop */}
//           {companies.map((company, index) => (
//             <div
//               key={`${company.ticker}-duplicate-${index}`}
//               className="flex-shrink-0 px-6 py-3 border-r border-gray-200 dark:border-gray-700 min-w-[280px]"
//             >
//               <div className="flex items-center justify-between">
//                 <div className="flex-1 min-w-0">
//                   <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
//                     {company.companyName}
//                   </div>
//                   <div className="text-xs text-gray-500 dark:text-gray-400">
//                     {company.exchange} | {company.country}
//                   </div>
//                   <div className="text-xs text-gray-500 dark:text-gray-400">
//                     {company.primarySector} | {company.industryGroup}
//                   </div>
//                 </div>
//                 <div className="ml-4 text-right">
//                   <div className="text-sm font-mono font-bold text-green-600 dark:text-green-400">
//                     {loading ? '...' : prices[company.ticker] !== undefined ? `$${prices[company.ticker].toFixed(2)}` : 'N/A'}
//                   </div>
//                   <div className="text-xs text-gray-500 dark:text-gray-400">
//                     {company.ticker}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StockPriceMarquee; 