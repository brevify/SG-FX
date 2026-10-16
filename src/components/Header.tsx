/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeftRight, Clock, RefreshCw, Database } from 'lucide-react';

interface HeaderProps {
  activeTab: 'rates' | 'chart' | 'calculator' | 'mas_api';
  setActiveTab: (tab: 'rates' | 'chart' | 'calculator' | 'mas_api') => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  lastUpdatedTime: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onRefresh,
  isRefreshing,
  lastUpdatedTime,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      {/* Top Bar strictly following 3-Zone Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element Brand wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('rates')}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-base shadow-xs group-hover:bg-red-700 transition-colors">
                S$
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
                  SingaForex
                </span>
                <span className="hidden sm:inline-block text-xs text-slate-400 font-mono ml-2">
                  SGD FX HUB
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: 4-5 single-line clean navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('rates')}
              className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${
                activeTab === 'rates'
                  ? 'border-red-600 text-slate-900 font-semibold'
                  : 'border-transparent hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              Rates & Pairs
            </button>
            <button
              onClick={() => setActiveTab('chart')}
              className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${
                activeTab === 'chart'
                  ? 'border-red-600 text-slate-900 font-semibold'
                  : 'border-transparent hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              Historical Trends
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${
                activeTab === 'calculator'
                  ? 'border-red-600 text-slate-900 font-semibold'
                  : 'border-transparent hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              SGD Calculator
            </button>
            <button
              onClick={() => setActiveTab('mas_api')}
              className={`whitespace-nowrap transition-colors pb-1 border-b-2 flex items-center gap-1.5 ${
                activeTab === 'mas_api'
                  ? 'border-red-600 text-slate-900 font-semibold'
                  : 'border-transparent hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-slate-500" />
              MAS API Spec
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab(activeTab === 'calculator' ? 'rates' : 'calculator')}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shadow-xs"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>{activeTab === 'calculator' ? 'View Rates' : 'Convert SGD'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-bar: Clean unboxed metadata & quick market status */}
      <div className="border-t border-slate-100 bg-slate-50/70 text-xs text-slate-500 py-1.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="font-semibold text-slate-700">Monetary Authority of Singapore (MAS)</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Interbank Benchmark Feed</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="flex items-center gap-1 text-slate-600">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>SGT (UTC+8)</span>
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono tabular-nums">
            <span>Last quote: {lastUpdatedTime}</span>
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh quotes"
              className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-red-600' : ''}`} />
              <span className="text-[11px] font-sans">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="flex md:hidden border-t border-slate-200 overflow-x-auto px-4 py-2 gap-4 text-xs font-medium bg-white">
        <button
          onClick={() => setActiveTab('rates')}
          className={`whitespace-nowrap px-2 py-1 rounded ${
            activeTab === 'rates' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600'
          }`}
        >
          Rates & Pairs
        </button>
        <button
          onClick={() => setActiveTab('chart')}
          className={`whitespace-nowrap px-2 py-1 rounded ${
            activeTab === 'chart' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600'
          }`}
        >
          Historical Trends
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`whitespace-nowrap px-2 py-1 rounded ${
            activeTab === 'calculator' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600'
          }`}
        >
          SGD Calculator
        </button>
        <button
          onClick={() => setActiveTab('mas_api')}
          className={`whitespace-nowrap px-2 py-1 rounded ${
            activeTab === 'mas_api' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600'
          }`}
        >
          MAS API Spec
        </button>
      </div>
    </header>
  );
};
