/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { CurrencyPair } from '../types/currency';
import { calculateComparisons } from '../data/currencies';
import {
  ArrowUpDown,
  Copy,
  Check,
  TrendingUp,
  Percent,
  Wallet,
  Building2,
  Store,
  Sparkles,
  ChevronDown,
  Info,
} from 'lucide-react';

interface CalculatorProps {
  currencies: CurrencyPair[];
  selectedPair: CurrencyPair;
  onSelectPair: (pair: CurrencyPair) => void;
  onOpenChart: (pair: CurrencyPair) => void;
}

export const Calculator: React.FC<CalculatorProps> = ({
  currencies,
  selectedPair,
  onSelectPair,
  onOpenChart,
}) => {
  const [baseCode, setBaseCode] = useState<string>('SGD');
  const [targetCode, setTargetCode] = useState<string>(selectedPair.code);
  const [amountStr, setAmountStr] = useState<string>('1000');
  const [copied, setCopied] = useState(false);

  // Sync target code if selectedPair prop changes
  React.useEffect(() => {
    if (baseCode === 'SGD') {
      setTargetCode(selectedPair.code);
    }
  }, [selectedPair, baseCode]);

  // Find currencies
  const targetCurrency = useMemo(() => {
    return currencies.find((c) => c.code === targetCode) || currencies[0];
  }, [currencies, targetCode]);

  const baseCurrency = useMemo(() => {
    if (baseCode === 'SGD') {
      return {
        code: 'SGD',
        name: 'Singapore Dollar',
        country: 'Singapore',
        symbol: 'S$',
        flag: '🇸🇬',
      };
    }
    return currencies.find((c) => c.code === baseCode) || currencies[0];
  }, [currencies, baseCode]);

  const amount = parseFloat(amountStr) || 0;

  // Conversion rate calculation
  const { exchangeRate, convertedAmount, reverseRate } = useMemo(() => {
    let rate = 1;
    let rev = 1;

    if (baseCode === 'SGD' && targetCode !== 'SGD') {
      rate = targetCurrency.rateFromSgd;
      rev = targetCurrency.rateToSgd;
    } else if (baseCode !== 'SGD' && targetCode === 'SGD') {
      const baseCurr = currencies.find((c) => c.code === baseCode);
      rate = baseCurr ? baseCurr.rateToSgd : 1;
      rev = baseCurr ? baseCurr.rateFromSgd : 1;
    } else if (baseCode !== 'SGD' && targetCode !== 'SGD') {
      // Cross rate through SGD
      const baseCurr = currencies.find((c) => c.code === baseCode);
      if (baseCurr) {
        const sgdAmount = 1 * baseCurr.rateToSgd;
        rate = sgdAmount * targetCurrency.rateFromSgd;
        rev = 1 / rate;
      }
    }

    return {
      exchangeRate: rate,
      convertedAmount: amount * rate,
      reverseRate: rev,
    };
  }, [baseCode, targetCode, amount, targetCurrency, currencies]);

  // Presets for Singapore Dollar
  const quickPresets = [100, 500, 1000, 2500, 5000, 10000];

  // Swap currencies
  const handleSwap = () => {
    const oldBase = baseCode;
    const oldTarget = targetCode;
    setBaseCode(oldTarget);
    setTargetCode(oldBase);
    if (oldTarget !== 'SGD') {
      const newSelected = currencies.find((c) => c.code === oldTarget);
      if (newSelected) onSelectPair(newSelected);
    }
  };

  // Provider rate comparison when converting from SGD
  const comparisons = useMemo(() => {
    if (baseCode === 'SGD') {
      return calculateComparisons(amount, targetCurrency);
    }
    return null;
  }, [baseCode, amount, targetCurrency]);

  const handleCopy = () => {
    const text = `${amount.toLocaleString()} ${baseCode} = ${convertedAmount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ${targetCode} (SingaForex MAS Benchmark)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Main Converter Card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 sm:p-6 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                SGD Multi-Currency Precision Calculator
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span>Real-Time Wholesale Benchmark</span>
                <span aria-hidden="true">·</span>
                <span>Zero Markup Mid-Market Rate</span>
              </div>
            </div>

            <button
              onClick={() => onOpenChart(targetCurrency)}
              className="self-start sm:self-auto text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
              <span>Inspect {targetCurrency.code} Chart</span>
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          {/* Conversion Grid */}
          <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
            {/* From Box */}
            <div className="md:col-span-5 bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>You Send</span>
                <div className="relative inline-block">
                  <select
                    value={baseCode}
                    onChange={(e) => setBaseCode(e.target.value)}
                    className="text-xs font-bold text-slate-900 bg-white border border-slate-200 py-1 pl-2 pr-6 rounded-md appearance-none cursor-pointer focus:outline-none"
                  >
                    <option value="SGD">🇸🇬 SGD - Singapore Dollar</option>
                    {currencies.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-500 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-slate-400 font-mono">
                  {baseCode === 'SGD' ? 'S$' : baseCurrency.symbol || '$'}
                </span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                  placeholder="1,000"
                  className="w-full text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 bg-transparent focus:outline-none tabular-nums"
                />
              </div>

              <div className="text-[11px] text-slate-400 truncate">
                {baseCurrency.name}
              </div>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex justify-center">
              <button
                onClick={handleSwap}
                className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors shadow-xs"
                title="Swap currencies"
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </div>

            {/* To Box */}
            <div className="md:col-span-5 bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Recipient Gets (Estimated)</span>
                <div className="relative inline-block">
                  <select
                    value={targetCode}
                    onChange={(e) => {
                      setTargetCode(e.target.value);
                      const t = currencies.find((c) => c.code === e.target.value);
                      if (t) onSelectPair(t);
                    }}
                    className="text-xs font-bold text-slate-900 bg-white border border-slate-200 py-1 pl-2 pr-6 rounded-md appearance-none cursor-pointer focus:outline-none"
                  >
                    <option value="SGD">🇸🇬 SGD - Singapore Dollar</option>
                    {currencies.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-500 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-slate-400 font-mono">
                  {targetCode === 'SGD' ? 'S$' : targetCurrency.symbol || '$'}
                </span>
                <span className="w-full text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 tabular-nums truncate">
                  {convertedAmount.toLocaleString('en-US', {
                    minimumFractionDigits: convertedAmount > 100 ? 2 : 4,
                    maximumFractionDigits: convertedAmount > 100 ? 2 : 4,
                  })}
                </span>
              </div>

              <div className="text-[11px] text-slate-400 truncate">
                {targetCurrency.name}
              </div>
            </div>
          </div>

          {/* Quick Amount Presets */}
          {baseCode === 'SGD' && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-slate-500 mr-1">Quick SGD amounts:</span>
              {quickPresets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAmountStr(preset.toString())}
                  className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-colors border ${
                    amount === preset
                      ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  S${preset.toLocaleString()}
                </button>
              ))}
            </div>
          )}

          {/* Exchange Rate Quotation & Action Bar */}
          <div className="p-3.5 bg-slate-100/70 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
            <div className="space-y-0.5">
              <div className="font-semibold text-slate-900">
                1 {baseCode} ={' '}
                <span className="font-mono tabular-nums">
                  {exchangeRate > 100 ? exchangeRate.toFixed(2) : exchangeRate.toFixed(4)}
                </span>{' '}
                {targetCode}
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                Inverse: 1 {targetCode} = {reverseRate > 100 ? reverseRate.toFixed(2) : reverseRate.toFixed(4)} {baseCode}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 rounded-lg border border-slate-200 transition-colors font-medium flex items-center gap-1.5 shadow-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy Breakdown</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Singapore Market Spread & Bank Comparison Table */}
      {comparisons && comparisons.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Singapore Channel & Bank Spread Comparison (S${amount.toLocaleString()})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Comparison of actual received foreign amount vs. MAS Wholesale Interbank Benchmark.
              </p>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Estimated savings: S${(amount * 0.014).toFixed(2)} with fintech cards
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {comparisons.map((c, idx) => {
              const isBenchmark = c.category === 'mas_benchmark';
              const isFintech = c.category === 'fintech';

              return (
                <div
                  key={c.provider}
                  className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                    isBenchmark ? 'bg-slate-50/60' : 'hover:bg-slate-50/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                      {isBenchmark && <Sparkles className="w-4 h-4 text-amber-600" />}
                      {isFintech && <Wallet className="w-4 h-4 text-sky-600" />}
                      {c.category === 'money_changer' && <Store className="w-4 h-4 text-emerald-600" />}
                      {c.category === 'local_bank' && <Building2 className="w-4 h-4 text-slate-600" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-900">{c.provider}</span>
                        {isBenchmark && (
                          <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded font-mono">
                            MAS Official Benchmark
                          </span>
                        )}
                        {isFintech && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-mono">
                            Recommended for Travel
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{c.note}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 text-right">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-mono">Rate Applied</div>
                      <div className="font-mono text-xs font-semibold text-slate-900 tabular-nums">
                        {c.rate > 100 ? c.rate.toFixed(2) : c.rate.toFixed(4)}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-mono">You Receive</div>
                      <div className="font-mono text-sm font-bold text-slate-900 tabular-nums">
                        {c.receivedAmount.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{' '}
                        {targetCurrency.code}
                      </div>
                    </div>

                    <div className="w-24 text-right hidden sm:block">
                      <div className="text-[10px] text-slate-400 uppercase font-mono">Spread Fee</div>
                      <div className="font-mono text-xs text-slate-600 tabular-nums">
                        {c.differenceVsBenchmarkSgd === 0
                          ? 'S$0.00'
                          : `-S$${c.differenceVsBenchmarkSgd.toFixed(2)}`}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-slate-50 text-[11px] text-slate-500 border-t border-slate-200 flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              Bank spreads are based on average retail FX counter markups published by Singapore commercial banks.
            </span>
          </div>
        </div>
      )}

      {/* Travel Cheat Sheet: 100 SGD in Popular Currencies */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-1">
          Travel Reference: What S$100 Gets You in Popular Destinations
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Quick baseline for Singaporeans traveling abroad or cross-border Causeway commutes.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { code: 'MYR', flag: '🇲🇾', name: 'Malaysia' },
            { code: 'JPY', flag: '🇯🇵', name: 'Japan' },
            { code: 'THB', flag: '🇹🇭', name: 'Thailand' },
            { code: 'IDR', flag: '🇮🇩', name: 'Indonesia' },
            { code: 'USD', flag: '🇺🇸', name: 'United States' },
            { code: 'EUR', flag: '🇪🇺', name: 'Eurozone' },
          ].map((item) => {
            const p = currencies.find((c) => c.code === item.code);
            if (!p) return null;
            const converted = 100 * p.rateFromSgd;

            return (
              <div
                key={item.code}
                onClick={() => {
                  onSelectPair(p);
                  setTargetCode(p.code);
                  setAmountStr('100');
                }}
                className="p-3 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50/70 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="text-base">{item.flag}</span>
                  <span className="font-semibold text-slate-800">{item.name}</span>
                </div>
                <div className="mt-2 font-mono text-sm font-bold text-slate-900 tabular-nums">
                  {p.symbol}
                  {converted.toLocaleString('en-US', {
                    maximumFractionDigits: converted > 1000 ? 0 : 2,
                  })}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  1 SGD = {p.rateFromSgd > 100 ? p.rateFromSgd.toFixed(1) : p.rateFromSgd.toFixed(3)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
