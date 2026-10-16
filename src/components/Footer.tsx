/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white text-xs text-slate-500 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">SingaForex</span>
            <span aria-hidden="true">·</span>
            <span>Singapore Dollar (SGD) Currency Exchange & Analytical Suite</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>MAS Benchmark Compliant</span>
            <span aria-hidden="true">·</span>
            <span>SGT (UTC+8)</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 leading-relaxed max-w-4xl border-t border-slate-100 pt-3">
          Disclaimer: Rates provided herein reflect reference midpoint exchange rates derived from Monetary Authority of Singapore (MAS) wholesale records and interbank data feeds. Indicative rates are intended for informational, budgeting, and analytical purposes. Commercial retail transactions, cash banknote exchanges, and bank remittance spreads will vary by financial provider.
        </div>
      </div>
    </footer>
  );
};
