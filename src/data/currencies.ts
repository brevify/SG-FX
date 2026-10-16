/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CurrencyPair, HistoricalDataPoint, Timeframe } from '../types/currency';

export const INITIAL_CURRENCIES: CurrencyPair[] = [
  {
    code: 'MYR',
    name: 'Malaysian Ringgit',
    country: 'Malaysia',
    region: 'asean',
    symbol: 'RM',
    flag: '🇲🇾',
    masQuotationUnit: 1,
    rateToSgd: 0.2864, // 1 MYR = 0.2864 SGD
    rateFromSgd: 3.4916, // 1 SGD = 3.4916 MYR
    change24h: 0.18,
    changeAmount24h: 0.0062,
    high24h: 3.4985,
    low24h: 3.4820,
    bid: 3.4890,
    ask: 3.4942,
    sparkline: [3.475, 3.478, 3.481, 3.489, 3.484, 3.488, 3.492],
    isFavorite: true,
    lastUpdated: 'Just now',
  },
  {
    code: 'USD',
    name: 'US Dollar',
    country: 'United States',
    region: 'major',
    symbol: '$',
    flag: '🇺🇸',
    masQuotationUnit: 1,
    rateToSgd: 1.3418, // 1 USD = 1.3418 SGD
    rateFromSgd: 0.7453, // 1 SGD = 0.7453 USD
    change24h: -0.12,
    changeAmount24h: -0.0009,
    high24h: 0.7475,
    low24h: 0.7438,
    bid: 0.7450,
    ask: 0.7456,
    sparkline: [0.748, 0.747, 0.746, 0.745, 0.746, 0.744, 0.745],
    isFavorite: true,
    lastUpdated: 'Just now',
  },
  {
    code: 'JPY',
    name: 'Japanese Yen',
    country: 'Japan',
    region: 'major',
    symbol: '¥',
    flag: '🇯🇵',
    masQuotationUnit: 100, // Quoted per 100 JPY in MAS standard
    rateToSgd: 0.00892, // 1 JPY = 0.00892 SGD (100 JPY = 0.892 SGD)
    rateFromSgd: 112.10, // 1 SGD = 112.10 JPY
    change24h: 0.45,
    changeAmount24h: 0.50,
    high24h: 112.65,
    low24h: 111.40,
    bid: 111.95,
    ask: 112.25,
    sparkline: [110.8, 111.1, 111.4, 111.9, 111.7, 112.3, 112.1],
    isFavorite: true,
    lastUpdated: 'Just now',
  },
  {
    code: 'EUR',
    name: 'Euro',
    country: 'Eurozone',
    region: 'major',
    symbol: '€',
    flag: '🇪🇺',
    masQuotationUnit: 1,
    rateToSgd: 1.4580,
    rateFromSgd: 0.6859,
    change24h: -0.22,
    changeAmount24h: -0.0015,
    high24h: 0.6890,
    low24h: 0.6845,
    bid: 0.6855,
    ask: 0.6863,
    sparkline: [0.689, 0.688, 0.687, 0.686, 0.685, 0.687, 0.686],
    isFavorite: true,
    lastUpdated: 'Just now',
  },
  {
    code: 'GBP',
    name: 'British Pound',
    country: 'United Kingdom',
    region: 'major',
    symbol: '£',
    flag: '🇬🇧',
    masQuotationUnit: 1,
    rateToSgd: 1.7420,
    rateFromSgd: 0.5741,
    change24h: 0.08,
    changeAmount24h: 0.0005,
    high24h: 0.5760,
    low24h: 0.5725,
    bid: 0.5738,
    ask: 0.5744,
    sparkline: [0.571, 0.573, 0.572, 0.574, 0.575, 0.573, 0.574],
    isFavorite: false,
    lastUpdated: 'Just now',
  },
  {
    code: 'CNY',
    name: 'Chinese Yuan Renminbi',
    country: 'China',
    region: 'major',
    symbol: '¥',
    flag: '🇨🇳',
    masQuotationUnit: 1,
    rateToSgd: 0.1872,
    rateFromSgd: 5.3418,
    change24h: -0.05,
    changeAmount24h: -0.0027,
    high24h: 5.3580,
    low24h: 5.3340,
    bid: 5.3390,
    ask: 5.3446,
    sparkline: [5.33, 5.34, 5.35, 5.345, 5.338, 5.345, 5.342],
    isFavorite: true,
    lastUpdated: 'Just now',
  },
  {
    code: 'AUD',
    name: 'Australian Dollar',
    country: 'Australia',
    region: 'major',
    symbol: 'A$',
    flag: '🇦🇺',
    masQuotationUnit: 1,
    rateToSgd: 0.8845,
    rateFromSgd: 1.1306,
    change24h: 0.32,
    changeAmount24h: 0.0036,
    high24h: 1.1340,
    low24h: 1.1260,
    bid: 1.1298,
    ask: 1.1314,
    sparkline: [1.122, 1.125, 1.128, 1.126, 1.129, 1.132, 1.131],
    isFavorite: false,
    lastUpdated: 'Just now',
  },
  {
    code: 'THB',
    name: 'Thai Baht',
    country: 'Thailand',
    region: 'asean',
    symbol: '฿',
    flag: '🇹🇭',
    masQuotationUnit: 100, // Quoted per 100 THB in MAS
    rateToSgd: 0.0386, // 100 THB = 3.86 SGD
    rateFromSgd: 25.9067,
    change24h: 0.28,
    changeAmount24h: 0.072,
    high24h: 26.02,
    low24h: 25.78,
    bid: 25.88,
    ask: 25.93,
    sparkline: [25.75, 25.80, 25.82, 25.89, 25.85, 25.95, 25.91],
    isFavorite: true,
    lastUpdated: 'Just now',
  },
  {
    code: 'IDR',
    name: 'Indonesian Rupiah',
    country: 'Indonesia',
    region: 'asean',
    symbol: 'Rp',
    flag: '🇮🇩',
    masQuotationUnit: 100, // Quoted per 100 IDR in MAS
    rateToSgd: 0.0000846, // 100 IDR = 0.00846 SGD
    rateFromSgd: 11820.35,
    change24h: -0.15,
    changeAmount24h: -17.7,
    high24h: 11870,
    low24h: 11780,
    bid: 11810,
    ask: 11830,
    sparkline: [11850, 11830, 11840, 11810, 11800, 11830, 11820],
    isFavorite: false,
    lastUpdated: 'Just now',
  },
  {
    code: 'HKD',
    name: 'Hong Kong Dollar',
    country: 'Hong Kong',
    region: 'apac',
    symbol: 'HK$',
    flag: '🇭🇰',
    masQuotationUnit: 1,
    rateToSgd: 0.1719,
    rateFromSgd: 5.8173,
    change24h: -0.09,
    changeAmount24h: -0.0052,
    high24h: 5.8320,
    low24h: 5.8080,
    bid: 5.8140,
    ask: 5.8206,
    sparkline: [5.83, 5.825, 5.82, 5.815, 5.82, 5.812, 5.817],
    isFavorite: false,
    lastUpdated: 'Just now',
  },
  {
    code: 'KRW',
    name: 'South Korean Won',
    country: 'South Korea',
    region: 'apac',
    symbol: '₩',
    flag: '🇰🇷',
    masQuotationUnit: 100, // Quoted per 100 KRW in MAS
    rateToSgd: 0.000985,
    rateFromSgd: 1015.22,
    change24h: 0.54,
    changeAmount24h: 5.48,
    high24h: 1022.0,
    low24h: 1008.5,
    bid: 1013.8,
    ask: 1016.6,
    sparkline: [1005, 1008, 1012, 1010, 1014, 1020, 1015],
    isFavorite: false,
    lastUpdated: 'Just now',
  },
  {
    code: 'TWD',
    name: 'New Taiwan Dollar',
    country: 'Taiwan',
    region: 'apac',
    symbol: 'NT$',
    flag: '🇹🇼',
    masQuotationUnit: 100,
    rateToSgd: 0.0416,
    rateFromSgd: 24.0385,
    change24h: 0.14,
    changeAmount24h: 0.0336,
    high24h: 24.12,
    low24h: 23.95,
    bid: 24.01,
    ask: 24.07,
    sparkline: [23.9, 23.95, 24.0, 24.05, 24.02, 24.06, 24.04],
    isFavorite: false,
    lastUpdated: 'Just now',
  },
  {
    code: 'INR',
    name: 'Indian Rupee',
    country: 'India',
    region: 'apac',
    symbol: '₹',
    flag: '🇮🇳',
    masQuotationUnit: 100,
    rateToSgd: 0.01568,
    rateFromSgd: 63.7755,
    change24h: -0.18,
    changeAmount24h: -0.115,
    high24h: 63.95,
    low24h: 63.60,
    bid: 63.72,
    ask: 63.83,
    sparkline: [63.9, 63.85, 63.8, 63.75, 63.82, 63.72, 63.78],
    isFavorite: false,
    lastUpdated: 'Just now',
  },
  {
    code: 'VND',
    name: 'Vietnamese Dong',
    country: 'Vietnam',
    region: 'asean',
    symbol: '₫',
    flag: '🇻🇳',
    masQuotationUnit: 100,
    rateToSgd: 0.0000532,
    rateFromSgd: 18796.99,
    change24h: 0.22,
    changeAmount24h: 41.35,
    high24h: 18880,
    low24h: 18720,
    bid: 18770,
    ask: 18824,
    sparkline: [18720, 18740, 18770, 18790, 18780, 18810, 18797],
    isFavorite: false,
    lastUpdated: 'Just now',
  },
  {
    code: 'PHP',
    name: 'Philippine Peso',
    country: 'Philippines',
    region: 'asean',
    symbol: '₱',
    flag: '🇵🇭',
    masQuotationUnit: 100,
    rateToSgd: 0.0234,
    rateFromSgd: 42.7350,
    change24h: -0.31,
    changeAmount24h: -0.133,
    high24h: 42.95,
    low24h: 42.60,
    bid: 42.68,
    ask: 42.79,
    sparkline: [42.9, 42.85, 42.8, 42.7, 42.75, 42.68, 42.74],
    isFavorite: false,
    lastUpdated: 'Just now',
  },
  {
    code: 'NZD',
    name: 'New Zealand Dollar',
    country: 'New Zealand',
    region: 'apac',
    symbol: 'NZ$',
    flag: '🇳🇿',
    masQuotationUnit: 1,
    rateToSgd: 0.8115,
    rateFromSgd: 1.2323,
    change24h: 0.19,
    changeAmount24h: 0.0023,
    high24h: 1.2370,
    low24h: 1.2280,
    bid: 1.2312,
    ask: 1.2334,
    sparkline: [1.226, 1.229, 1.231, 1.228, 1.234, 1.235, 1.232],
    isFavorite: false,
    lastUpdated: 'Just now',
  },
  {
    code: 'CAD',
    name: 'Canadian Dollar',
    country: 'Canada',
    region: 'major',
    symbol: 'C$',
    flag: '🇨🇦',
    masQuotationUnit: 1,
    rateToSgd: 0.9785,
    rateFromSgd: 1.0220,
    change24h: -0.06,
    changeAmount24h: -0.0006,
    high24h: 1.0255,
    low24h: 1.0190,
    bid: 1.0212,
    ask: 1.0228,
    sparkline: [1.024, 1.023, 1.021, 1.02, 1.022, 1.021, 1.022],
    isFavorite: false,
    lastUpdated: 'Just now',
  },
  {
    code: 'CHF',
    name: 'Swiss Franc',
    country: 'Switzerland',
    region: 'major',
    symbol: 'CHF',
    flag: '🇨🇭',
    masQuotationUnit: 1,
    rateToSgd: 1.5240,
    rateFromSgd: 0.6562,
    change24h: -0.15,
    changeAmount24h: -0.0010,
    high24h: 0.6590,
    low24h: 0.6545,
    bid: 0.6558,
    ask: 0.6566,
    sparkline: [0.658, 0.657, 0.656, 0.655, 0.656, 0.655, 0.656],
    isFavorite: false,
    lastUpdated: 'Just now',
  },
  {
    code: 'AED',
    name: 'UAE Dirham',
    country: 'United Arab Emirates',
    region: 'other',
    symbol: 'AED',
    flag: '🇦🇪',
    masQuotationUnit: 1,
    rateToSgd: 0.3653,
    rateFromSgd: 2.7375,
    change24h: -0.11,
    changeAmount24h: -0.0030,
    high24h: 2.7440,
    low24h: 2.7310,
    bid: 2.7360,
    ask: 2.7390,
    sparkline: [2.742, 2.74, 2.738, 2.736, 2.739, 2.735, 2.738],
    isFavorite: false,
    lastUpdated: 'Just now',
  },
  {
    code: 'SAR',
    name: 'Saudi Riyal',
    country: 'Saudi Arabia',
    region: 'other',
    symbol: 'SAR',
    flag: '🇸🇦',
    masQuotationUnit: 1,
    rateToSgd: 0.3577,
    rateFromSgd: 2.7956,
    change24h: -0.08,
    changeAmount24h: -0.0022,
    high24h: 2.8020,
    low24h: 2.7890,
    bid: 2.7940,
    ask: 2.7972,
    sparkline: [2.801, 2.798, 2.796, 2.794, 2.797, 2.793, 2.796],
    isFavorite: false,
    lastUpdated: 'Just now',
  },
];

/**
 * Deterministic pseudo-random historical data generator for realistic trend charts
 */
export function generateHistoricalData(pair: CurrencyPair, timeframe: Timeframe): HistoricalDataPoint[] {
  let days = 7;
  let intervalHours = 24;

  switch (timeframe) {
    case '7D':
      days = 7;
      intervalHours = 6; // 28 data points
      break;
    case '1M':
      days = 30;
      intervalHours = 24; // 30 points
      break;
    case '3M':
      days = 90;
      intervalHours = 48; // 45 points
      break;
    case '6M':
      days = 180;
      intervalHours = 72; // 60 points
      break;
    case '1Y':
      days = 365;
      intervalHours = 120; // ~73 points
      break;
    case '5Y':
      days = 1825;
      intervalHours = 480; // ~91 points
      break;
  }

  const baseRate = pair.rateFromSgd;
  const points: HistoricalDataPoint[] = [];
  const now = new Date();

  // Create a seeded random walk based on currency code
  let seed = pair.code.charCodeAt(0) * 13 + pair.code.charCodeAt(1) * 7 + (pair.code.charCodeAt(2) || 0);
  const pseudoRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const totalPoints = Math.floor((days * 24) / intervalHours);
  let currentVal = baseRate;

  // For historical walk, we start from past and walk forward to reach currentVal
  const volatility = pair.code === 'IDR' || pair.code === 'VND' || pair.code === 'KRW' ? 0.005 : 0.003;
  const path: number[] = [currentVal];

  for (let i = 1; i <= totalPoints; i++) {
    // Generate backwards so currentVal is at index 0 (today)
    const shock = (pseudoRandom() - 0.495) * volatility * baseRate;
    currentVal = Math.max(baseRate * 0.7, currentVal - shock);
    path.push(currentVal);
  }

  // Reverse path so oldest date is first
  path.reverse();

  for (let i = 0; i < path.length; i++) {
    const pointDate = new Date(now.getTime() - (path.length - 1 - i) * intervalHours * 3600 * 1000);
    const rateFrom = path[i];
    const rateTo = 1 / rateFrom;
    const spread = rateFrom * 0.002;

    const formattedDate = pointDate.toLocaleDateString('en-SG', {
      day: 'numeric',
      month: 'short',
      year: days > 365 ? 'numeric' : undefined,
    });

    points.push({
      date: formattedDate,
      rateFromSgd: Number(rateFrom.toFixed(pair.rateFromSgd > 100 ? 2 : 4)),
      rateToSgd: Number(rateTo.toFixed(6)),
      high: Number((rateFrom + spread).toFixed(pair.rateFromSgd > 100 ? 2 : 4)),
      low: Number((rateFrom - spread).toFixed(pair.rateFromSgd > 100 ? 2 : 4)),
    });
  }

  return points;
}

/**
 * Calculates provider comparisons for Singapore travelers and businesses
 */
export function calculateComparisons(amountSgd: number, pair: CurrencyPair) {
  const masMidRate = pair.rateFromSgd;
  const benchmarkTotal = amountSgd * masMidRate;

  return [
    {
      provider: 'MAS Official Benchmark',
      category: 'mas_benchmark' as const,
      rate: masMidRate,
      spreadPercent: 0.0,
      feeSgd: 0,
      receivedAmount: benchmarkTotal,
      differenceVsBenchmarkSgd: 0,
      note: 'Monetary Authority of Singapore wholesale interbank benchmark',
    },
    {
      provider: 'Multi-Currency Digital Card (YouTrip / Wise)',
      category: 'fintech' as const,
      rate: masMidRate * 0.996,
      spreadPercent: 0.4,
      feeSgd: 0,
      receivedAmount: benchmarkTotal * 0.996,
      differenceVsBenchmarkSgd: amountSgd * 0.004,
      note: 'Zero FX transaction fee, ~0.4% wholesale network spread',
    },
    {
      provider: 'The Arcade / Chinatown Money Changers',
      category: 'money_changer' as const,
      rate: masMidRate * 0.992,
      spreadPercent: 0.8,
      feeSgd: 0,
      receivedAmount: benchmarkTotal * 0.992,
      differenceVsBenchmarkSgd: amountSgd * 0.008,
      note: 'Cash physical banknotes, competitive Raffles Place street rates',
    },
    {
      provider: 'Singapore Major Retail Banks (DBS / OCBC / UOB)',
      category: 'local_bank' as const,
      rate: masMidRate * 0.982,
      spreadPercent: 1.8,
      feeSgd: 0,
      receivedAmount: benchmarkTotal * 0.982,
      differenceVsBenchmarkSgd: amountSgd * 0.018,
      note: 'Standard retail counter / credit card cross-border spread (1.8% - 2.5%)',
    },
  ];
}
