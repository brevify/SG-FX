/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CurrencyPair, QuotationMode } from '../types/currency';
import { Star, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface FavoritesTickerProps {
  favorites: CurrencyPair[];
  allCurrencies: CurrencyPair[];
  selectedPair: CurrencyPair;
  onSelectPair: (pair: CurrencyPair) => void;
  quotationMode: QuotationMode;
  onOpenCalculator: (pair: CurrencyPair) => void;
  onOpenChart: (pair: CurrencyPair) => void;
}

export const FavoritesTicker: React.FC<FavoritesTickerProps> = ({
  favorites,
  allCurrencies,
  selectedPair,
  onSelectPair,
  quotationMode,
  onOpenCalculator,
  onOpenChart,
}) => {
  if (favorites.length === 0) {
    return (
      <div className="bg-white border border-dashed border-slate-200 rounded-xl p-4 text-center text-xs text-slate-500">
        <span>No favorites pinned yet. Click the star</span>
        <Star className="inline w-3.5 h-3.5 text-amber-500 mx-1 fill-amber-500" />
        <span>icon next to any currency pair to pin it here for quick access.</span>
      </div>
    );
  }

  const renderRate = (pair: CurrencyPair) => {
    if (quotationMode === 'per_sgd') {
      return (
        <span className="font-mono font-semibold tabular-nums text-slate-900">
          {pair.rateFromSgd.toLocaleString('en-US', {
            minimumFractionDigits: pair.rateFromSgd > 100 ? 2 : 4,
            maximumFractionDigits: pair.rateFromSgd > 100 ? 2 : 4,
          })}
        </span>
      );
    } else if (quotationMode === 'per_foreign') {
      return (
        <span className="font-mono font-semibold tabular-nums text-slate-900">
          S${pair.rateToSgd.toFixed(4)}
        </span>
      );
    } else {
      // MAS standard
      const rate = pair.masQuotationUnit === 100 ? pair.rateToSgd * 100 : pair.rateToSgd;
      return (
        <span className="font-mono font-semibold tabular-nums text-slate-900">
          S${rate.toFixed(4)}
        </span>
      );
    }
  };

  const renderLabel = (pair: CurrencyPair) => {
    if (quotationMode === 'per_sgd') {
      return `1 SGD =`;
    } else if (quotationMode === 'per_foreign') {
      return `1 ${pair.code} =`;
    } else {
      return `${pair.masQuotationUnit} ${pair.code} =`;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <div className="flex items-center gap-1.5 font-medium text-slate-700">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Pinned Watchlist ({favorites.length})</span>
        </div>
        <span className="text-[11px] text-slate-400">Click any card to inspect chart</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {favorites.map((pair) => {
          const isSelected = selectedPair.code === pair.code;
          const isPositive = pair.change24h >= 0;

          // Normalize sparkline values to fit 60x20 SVG
          const min = Math.min(...pair.sparkline);
          const max = Math.max(...pair.sparkline);
          const range = max - min || 1;
          const points = pair.sparkline
            .map((val, i) => {
              const x = (i / (pair.sparkline.length - 1)) * 56 + 2;
              const y = 18 - ((val - min) / range) * 14;
              return `${x},${y}`;
            })
            .join(' ');

          return (
            <div
              key={pair.code}
              onClick={() => {
                onSelectPair(pair);
                onOpenChart(pair);
              }}
              className={`group bg-white rounded-xl border p-3 cursor-pointer transition-all hover:shadow-xs relative ${
                isSelected
                  ? 'border-slate-900 ring-1 ring-slate-900'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-base" role="img" aria-label={pair.country}>
                    {pair.flag}
                  </span>
                  <span className="font-bold text-xs text-slate-900">SGD/{pair.code}</span>
                </div>
                <div
                  className={`flex items-center text-[11px] font-mono tabular-nums font-medium ${
                    isPositive ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3 mr-0.5 inline" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-0.5 inline" />
                  )}
                  <span>
                    {isPositive ? '+' : ''}
                    {pair.change24h.toFixed(2)}%
                  </span>
                </div>
              </div>

              <div className="text-[10px] text-slate-400">{renderLabel(pair)}</div>
              <div className="text-base leading-tight mt-0.5">{renderRate(pair)}</div>

              {/* Mini Sparkline */}
              <div className="mt-2 flex items-center justify-between pt-1 border-t border-slate-100">
                <svg className="w-14 h-4 overflow-visible" viewBox="0 0 60 20">
                  <polyline
                    fill="none"
                    stroke={isPositive ? '#10b981' : '#f43f5e'}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                  />
                </svg>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenCalculator(pair);
                  }}
                  title={`Calculate ${pair.code}`}
                  className="text-[10px] text-slate-400 group-hover:text-slate-900 transition-colors flex items-center gap-0.5"
                >
                  <span>Calc</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
