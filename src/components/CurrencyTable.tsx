/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { CurrencyPair, CurrencyRegion, QuotationMode } from '../types/currency';
import {
  Search,
  Star,
  LineChart,
  Calculator as CalcIcon,
  TrendingUp,
  TrendingDown,
  Info,
  X,
  SlidersHorizontal,
} from 'lucide-react';

interface CurrencyTableProps {
  currencies: CurrencyPair[];
  onToggleFavorite: (code: string) => void;
  onSelectPair: (pair: CurrencyPair) => void;
  selectedPair: CurrencyPair;
  quotationMode: QuotationMode;
  setQuotationMode: (mode: QuotationMode) => void;
  onOpenCalculator: (pair: CurrencyPair) => void;
  onOpenChart: (pair: CurrencyPair) => void;
}

export const CurrencyTable: React.FC<CurrencyTableProps> = ({
  currencies,
  onToggleFavorite,
  onSelectPair,
  selectedPair,
  quotationMode,
  setQuotationMode,
  onOpenCalculator,
  onOpenChart,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<CurrencyRegion>('all');
  const [sortField, setSortField] = useState<'code' | 'rate' | 'change'>('code');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filter and sort currencies
  const filteredCurrencies = useMemo(() => {
    return currencies
      .filter((pair) => {
        // Region filter
        if (selectedRegion === 'favorites') {
          if (!pair.isFavorite) return false;
        } else if (selectedRegion !== 'all' && pair.region !== selectedRegion) {
          return false;
        }

        // Search query
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase().trim();
          const matchCode = pair.code.toLowerCase().includes(q);
          const matchName = pair.name.toLowerCase().includes(q);
          const matchCountry = pair.country.toLowerCase().includes(q);
          return matchCode || matchName || matchCountry;
        }

        return true;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortField === 'code') {
          diff = a.code.localeCompare(b.code);
        } else if (sortField === 'rate') {
          diff = a.rateFromSgd - b.rateFromSgd;
        } else if (sortField === 'change') {
          diff = a.change24h - b.change24h;
        }
        return sortDirection === 'asc' ? diff : -diff;
      });
  }, [currencies, selectedRegion, searchQuery, sortField, sortDirection]);

  const handleSort = (field: 'code' | 'rate' | 'change') => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection(field === 'change' ? 'desc' : 'asc');
    }
  };

  const formatRate = (pair: CurrencyPair) => {
    if (quotationMode === 'per_sgd') {
      return pair.rateFromSgd.toLocaleString('en-US', {
        minimumFractionDigits: pair.rateFromSgd > 100 ? 2 : 4,
        maximumFractionDigits: pair.rateFromSgd > 100 ? 2 : 4,
      });
    } else if (quotationMode === 'per_foreign') {
      return `S$${pair.rateToSgd.toFixed(4)}`;
    } else {
      // MAS format: per 1 or per 100
      const rate = pair.masQuotationUnit === 100 ? pair.rateToSgd * 100 : pair.rateToSgd;
      return `S$${rate.toFixed(4)}`;
    }
  };

  const getRateSubtext = (pair: CurrencyPair) => {
    if (quotationMode === 'per_sgd') {
      return `1 SGD = ${pair.code}`;
    } else if (quotationMode === 'per_foreign') {
      return `1 ${pair.code} = SGD`;
    } else {
      return `${pair.masQuotationUnit} ${pair.code} = SGD`;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Table Controls Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              SGD Exchange Rates & Market Spreads
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span>Monetary Authority of Singapore (MAS) Benchmark Rates</span>
              <span aria-hidden="true">·</span>
              <span>20 Active Pairs</span>
            </div>
          </div>

          {/* Quotation Mode Switcher */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <span className="text-xs text-slate-500 mr-1 hidden lg:inline">Quote mode:</span>
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs font-medium">
              <button
                onClick={() => setQuotationMode('per_sgd')}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                  quotationMode === 'per_sgd'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="View how many foreign units you receive for 1 SGD"
              >
                1 SGD = Foreign
              </button>
              <button
                onClick={() => setQuotationMode('per_foreign')}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                  quotationMode === 'per_foreign'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="View SGD cost for 1 Foreign unit"
              >
                1 Foreign = SGD
              </button>
              <button
                onClick={() => setQuotationMode('mas_standard')}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                  quotationMode === 'mas_standard'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Monetary Authority of Singapore (MAS) official quotation (per 1 or 100 units)"
              >
                MAS Official
              </button>
            </div>
          </div>
        </div>

        {/* Filter bar and search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search code, country or currency (e.g. MYR, Ringgit, Japan)..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Region Tabs (Functional Buttons) */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Pairs' },
              { id: 'favorites', label: '⭐ Favorites' },
              { id: 'asean', label: 'ASEAN' },
              { id: 'major', label: 'Majors' },
              { id: 'apac', label: 'Asia-Pac' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedRegion(tab.id as CurrencyRegion)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  selectedRegion === tab.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
              <th className="py-3 pl-4 pr-2 w-10 text-center">⭐</th>
              <th
                onClick={() => handleSort('code')}
                className="py-3 px-3 cursor-pointer hover:text-slate-900 select-none whitespace-nowrap"
              >
                Currency Pair {sortField === 'code' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('rate')}
                className="py-3 px-3 text-right cursor-pointer hover:text-slate-900 select-none whitespace-nowrap"
              >
                MAS Benchmark Rate {sortField === 'rate' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="py-3 px-3 text-right hidden sm:table-cell whitespace-nowrap">
                Bid (Buy)
              </th>
              <th className="py-3 px-3 text-right hidden sm:table-cell whitespace-nowrap">
                Ask (Sell)
              </th>
              <th
                onClick={() => handleSort('change')}
                className="py-3 px-3 text-right cursor-pointer hover:text-slate-900 select-none whitespace-nowrap"
              >
                24h Change {sortField === 'change' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="py-3 px-3 text-center hidden md:table-cell whitespace-nowrap">
                24h Range
              </th>
              <th className="py-3 px-3 text-center hidden lg:table-cell whitespace-nowrap">
                7D Trend
              </th>
              <th className="py-3 pr-4 pl-3 text-right whitespace-nowrap">Quick Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredCurrencies.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400">
                  <div className="max-w-xs mx-auto space-y-2">
                    <p className="text-sm font-medium text-slate-600">No currency pairs found</p>
                    <p className="text-xs text-slate-400">
                      No matching rates for "{searchQuery}". Try searching for another country or code.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedRegion('all');
                      }}
                      className="mt-2 text-xs text-slate-900 underline hover:text-red-600"
                    >
                      Reset filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredCurrencies.map((pair) => {
                const isSelected = selectedPair.code === pair.code;
                const isPositive = pair.change24h >= 0;

                // Sparkline coordinates
                const min = Math.min(...pair.sparkline);
                const max = Math.max(...pair.sparkline);
                const range = max - min || 1;
                const sparkPoints = pair.sparkline
                  .map((val, i) => {
                    const x = (i / (pair.sparkline.length - 1)) * 56 + 2;
                    const y = 18 - ((val - min) / range) * 14;
                    return `${x},${y}`;
                  })
                  .join(' ');

                // 24h range percentage
                const dayRange = pair.high24h - pair.low24h || 1;
                const currentPos = Math.min(
                  100,
                  Math.max(0, ((pair.rateFromSgd - pair.low24h) / dayRange) * 100)
                );

                return (
                  <tr
                    key={pair.code}
                    onClick={() => onSelectPair(pair)}
                    className={`hover:bg-slate-50/80 transition-colors cursor-pointer group ${
                      isSelected ? 'bg-slate-50' : ''
                    }`}
                  >
                    {/* Star toggle */}
                    <td className="py-3.5 pl-4 pr-2 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onToggleFavorite(pair.code)}
                        className="text-slate-300 hover:text-amber-500 transition-colors p-1"
                        title={pair.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            pair.isFavorite ? 'text-amber-500 fill-amber-500' : ''
                          }`}
                        />
                      </button>
                    </td>

                    {/* Pair Identity */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl leading-none" role="img" aria-label={pair.country}>
                          {pair.flag}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900">SGD/{pair.code}</span>
                            {pair.masQuotationUnit === 100 && (
                              <span className="text-[10px] text-slate-400 font-mono">
                                (per 100 {pair.code})
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500">{pair.name}</div>
                        </div>
                      </div>
                    </td>

                    {/* Benchmark Rate */}
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <div className="font-mono font-bold text-sm text-slate-900 tabular-nums">
                        {formatRate(pair)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {getRateSubtext(pair)}
                      </div>
                    </td>

                    {/* Bid Rate */}
                    <td className="py-3.5 px-3 text-right hidden sm:table-cell whitespace-nowrap font-mono tabular-nums text-slate-600">
                      {pair.bid.toFixed(pair.bid > 100 ? 2 : 4)}
                    </td>

                    {/* Ask Rate */}
                    <td className="py-3.5 px-3 text-right hidden sm:table-cell whitespace-nowrap font-mono tabular-nums text-slate-600">
                      {pair.ask.toFixed(pair.ask > 100 ? 2 : 4)}
                    </td>

                    {/* 24h Change */}
                    <td className="py-3.5 px-3 text-right whitespace-nowrap font-mono tabular-nums">
                      <div
                        className={`font-semibold inline-flex items-center gap-0.5 ${
                          isPositive ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {isPositive ? (
                          <TrendingUp className="w-3.5 h-3.5 inline" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5 inline" />
                        )}
                        <span>
                          {isPositive ? '+' : ''}
                          {pair.change24h.toFixed(2)}%
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {isPositive ? '+' : ''}
                        {pair.changeAmount24h > 10
                          ? pair.changeAmount24h.toFixed(1)
                          : pair.changeAmount24h.toFixed(4)}
                      </div>
                    </td>

                    {/* 24h Range Bar */}
                    <td className="py-3.5 px-3 hidden md:table-cell whitespace-nowrap">
                      <div className="w-28 mx-auto space-y-1">
                        <div className="h-1.5 w-full bg-slate-100 rounded-full relative overflow-hidden">
                          <div
                            className="h-full bg-slate-400 rounded-full"
                            style={{ width: `${currentPos}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] font-mono text-slate-400 tabular-nums">
                          <span>{pair.low24h > 100 ? pair.low24h.toFixed(0) : pair.low24h.toFixed(2)}</span>
                          <span>{pair.high24h > 100 ? pair.high24h.toFixed(0) : pair.high24h.toFixed(2)}</span>
                        </div>
                      </div>
                    </td>

                    {/* 7D Trend */}
                    <td className="py-3.5 px-3 text-center hidden lg:table-cell whitespace-nowrap">
                      <svg className="w-16 h-5 mx-auto overflow-visible" viewBox="0 0 60 20">
                        <polyline
                          fill="none"
                          stroke={isPositive ? '#10b981' : '#f43f5e'}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={sparkPoints}
                        />
                      </svg>
                    </td>

                    {/* Actions */}
                    <td
                      className="py-3.5 pr-4 pl-3 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => onOpenChart(pair)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Open historical trend chart"
                        >
                          <LineChart className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onOpenCalculator(pair)}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors inline-flex items-center gap-1"
                          title="Convert in calculator"
                        >
                          <CalcIcon className="w-3 h-3 text-slate-500" />
                          <span>Convert</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer info */}
      <div className="p-3 bg-slate-50/70 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>
            Rates reflect Monetary Authority of Singapore (MAS) wholesale interbank closing & intraday midpoints.
          </span>
        </div>
        <div className="text-[11px] text-slate-400 font-mono">
          Showing {filteredCurrencies.length} of {currencies.length} currency pairs
        </div>
      </div>
    </div>
  );
};
