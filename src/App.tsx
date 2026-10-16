/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { CurrencyPair, QuotationMode } from './types/currency';
import { INITIAL_CURRENCIES } from './data/currencies';
import { Header } from './components/Header';
import { FavoritesTicker } from './components/FavoritesTicker';
import { CurrencyTable } from './components/CurrencyTable';
import { HistoricalChart } from './components/HistoricalChart';
import { Calculator } from './components/Calculator';
import { MasApiPanel } from './components/MasApiPanel';
import { Footer } from './components/Footer';
import {
  TrendingUp,
  TrendingDown,
  LineChart,
  ArrowLeftRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

const DEFAULT_FAVORITES = ['MYR', 'USD', 'JPY', 'EUR', 'CNY', 'THB'];

export default function App() {
  const [activeTab, setActiveTab] = useState<'rates' | 'chart' | 'calculator' | 'mas_api'>('rates');
  const [quotationMode, setQuotationMode] = useState<QuotationMode>('per_sgd');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('Just now');

  // Load favorites from localStorage or defaults
  const [favoriteCodes, setFavoriteCodes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('singaforex_favorites');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return DEFAULT_FAVORITES;
  });

  // Currencies state
  const [currencies, setCurrencies] = useState<CurrencyPair[]>(() => {
    return INITIAL_CURRENCIES.map((c) => ({
      ...c,
      isFavorite: DEFAULT_FAVORITES.includes(c.code),
    }));
  });

  // Selected pair for charting and calculation
  const [selectedPairCode, setSelectedPairCode] = useState<string>('MYR');

  // Sync favorites to currencies array and localStorage
  useEffect(() => {
    try {
      localStorage.setItem('singaforex_favorites', JSON.stringify(favoriteCodes));
    } catch {
      // ignore
    }

    setCurrencies((prev) =>
      prev.map((c) => ({
        ...c,
        isFavorite: favoriteCodes.includes(c.code),
      }))
    );
  }, [favoriteCodes]);

  const toggleFavorite = useCallback((code: string) => {
    setFavoriteCodes((prev) => {
      if (prev.includes(code)) {
        return prev.filter((c) => c !== code);
      } else {
        return [...prev, code];
      }
    });
  }, []);

  const selectedPair = useMemo(() => {
    return currencies.find((c) => c.code === selectedPairCode) || currencies[0];
  }, [currencies, selectedPairCode]);

  const favoritePairs = useMemo(() => {
    return currencies.filter((c) => favoriteCodes.includes(c.code));
  }, [currencies, favoriteCodes]);

  // Refresh rate quotes (simulation of real-time market micro-ticks)
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setCurrencies((prev) =>
        prev.map((item) => {
          // Subtle realistic micro-fluctuation (+/- 0.05%)
          const deltaPct = (Math.random() - 0.49) * 0.001;
          const newRateFromSgd = item.rateFromSgd * (1 + deltaPct);
          const newRateToSgd = 1 / newRateFromSgd;
          const change24h = item.change24h + (Math.random() - 0.48) * 0.02;

          return {
            ...item,
            rateFromSgd: Number(newRateFromSgd.toFixed(item.rateFromSgd > 100 ? 2 : 4)),
            rateToSgd: Number(newRateToSgd.toFixed(6)),
            change24h: Number(change24h.toFixed(2)),
            lastUpdated: 'Just now',
          };
        })
      );

      const now = new Date();
      setLastUpdatedTime(
        now.toLocaleTimeString('en-SG', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }) + ' SGT'
      );
      setIsRefreshing(false);
    }, 400);
  }, []);

  // Set initial time
  useEffect(() => {
    const now = new Date();
    setLastUpdatedTime(
      now.toLocaleTimeString('en-SG', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }) + ' SGT'
    );
  }, []);

  // Quick navigation handlers
  const handleOpenCalculator = (pair: CurrencyPair) => {
    setSelectedPairCode(pair.code);
    setActiveTab('calculator');
  };

  const handleOpenChart = (pair: CurrencyPair) => {
    setSelectedPairCode(pair.code);
    setActiveTab('chart');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-red-100 selection:text-red-900">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        lastUpdatedTime={lastUpdatedTime}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Watchlist Ticker Strip */}
        <FavoritesTicker
          favorites={favoritePairs}
          allCurrencies={currencies}
          selectedPair={selectedPair}
          onSelectPair={(pair) => setSelectedPairCode(pair.code)}
          quotationMode={quotationMode}
          onOpenCalculator={handleOpenCalculator}
          onOpenChart={handleOpenChart}
        />

        {/* Dynamic Tab Views */}
        {activeTab === 'rates' && (
          <div className="space-y-6">
            <CurrencyTable
              currencies={currencies}
              onToggleFavorite={toggleFavorite}
              onSelectPair={(pair) => setSelectedPairCode(pair.code)}
              selectedPair={selectedPair}
              quotationMode={quotationMode}
              setQuotationMode={setQuotationMode}
              onOpenCalculator={handleOpenCalculator}
              onOpenChart={handleOpenChart}
            />

            {/* Quick Chart Preview in Rates Tab */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3 px-1">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Featured Trend Analysis: SGD / {selectedPair.code}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Quick inspection for active selected pair ({selectedPair.name}).
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('chart')}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  <span>Expand Full Chart Suite</span>
                  <LineChart className="w-3.5 h-3.5" />
                </button>
              </div>

              <HistoricalChart
                selectedPair={selectedPair}
                allCurrencies={currencies}
                onSelectPair={(pair) => setSelectedPairCode(pair.code)}
                onOpenCalculator={handleOpenCalculator}
              />
            </div>
          </div>
        )}

        {activeTab === 'chart' && (
          <div className="space-y-6">
            <HistoricalChart
              selectedPair={selectedPair}
              allCurrencies={currencies}
              onSelectPair={(pair) => setSelectedPairCode(pair.code)}
              onOpenCalculator={handleOpenCalculator}
            />

            {/* Compact table for switching under the chart */}
            <div className="pt-2">
              <h3 className="text-sm font-bold text-slate-900 mb-2">
                All Available SGD Pairs
              </h3>
              <CurrencyTable
                currencies={currencies}
                onToggleFavorite={toggleFavorite}
                onSelectPair={(pair) => setSelectedPairCode(pair.code)}
                selectedPair={selectedPair}
                quotationMode={quotationMode}
                setQuotationMode={setQuotationMode}
                onOpenCalculator={handleOpenCalculator}
                onOpenChart={handleOpenChart}
              />
            </div>
          </div>
        )}

        {activeTab === 'calculator' && (
          <Calculator
            currencies={currencies}
            selectedPair={selectedPair}
            onSelectPair={(pair) => setSelectedPairCode(pair.code)}
            onOpenChart={handleOpenChart}
          />
        )}

        {activeTab === 'mas_api' && <MasApiPanel />}
      </main>

      <Footer />
    </div>
  );
}
