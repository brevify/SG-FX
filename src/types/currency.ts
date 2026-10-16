/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CurrencyRegion = 'all' | 'favorites' | 'asean' | 'major' | 'apac' | 'other';

export type QuotationMode = 'per_sgd' | 'per_foreign' | 'mas_standard';

export type Timeframe = '7D' | '1M' | '3M' | '6M' | '1Y' | '5Y';

export interface CurrencyPair {
  code: string;
  name: string;
  country: string;
  region: 'asean' | 'major' | 'apac' | 'other';
  symbol: string;
  flag: string;
  /** MAS convention: some currencies are officially quoted per 100 units against SGD */
  masQuotationUnit: 1 | 100;
  /** Value of 1 Foreign Currency in SGD (e.g., 1 USD = 1.3425 SGD) */
  rateToSgd: number;
  /** Value of 1 SGD in Foreign Currency (e.g., 1 SGD = 3.4920 MYR) */
  rateFromSgd: number;
  change24h: number; // percentage, e.g., +0.24 or -0.15
  changeAmount24h: number;
  high24h: number;
  low24h: number;
  bid: number;
  ask: number;
  sparkline: number[];
  isFavorite?: boolean;
  lastUpdated: string;
}

export interface HistoricalDataPoint {
  date: string;
  rateFromSgd: number; // 1 SGD = X foreign
  rateToSgd: number;   // 1 foreign = X SGD
  high: number;
  low: number;
}

export interface RateComparison {
  provider: string;
  category: 'mas_benchmark' | 'local_bank' | 'fintech' | 'money_changer';
  rate: number;
  spreadPercent: number;
  feeSgd: number;
  receivedAmount: number;
  differenceVsBenchmarkSgd: number;
  note: string;
}
