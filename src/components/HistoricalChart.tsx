/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef } from 'react';
import { CurrencyPair, Timeframe, HistoricalDataPoint } from '../types/currency';
import { generateHistoricalData } from '../data/currencies';
import {
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Maximize2,
  Share2,
  FileSpreadsheet,
  Check,
  ChevronDown,
} from 'lucide-react';

interface HistoricalChartProps {
  selectedPair: CurrencyPair;
  allCurrencies: CurrencyPair[];
  onSelectPair: (pair: CurrencyPair) => void;
  onOpenCalculator: (pair: CurrencyPair) => void;
}

export const HistoricalChart: React.FC<HistoricalChartProps> = ({
  selectedPair,
  allCurrencies,
  onSelectPair,
  onOpenCalculator,
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');
  const [rateDirection, setRateDirection] = useState<'from_sgd' | 'to_sgd'>('from_sgd');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [compareCode, setCompareCode] = useState<string>('');
  const [copiedNotification, setCopiedNotification] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Generate historical data for primary pair
  const data: HistoricalDataPoint[] = useMemo(() => {
    return generateHistoricalData(selectedPair, timeframe);
  }, [selectedPair, timeframe]);

  // Comparison data if secondary currency is selected
  const comparePair = useMemo(() => {
    return allCurrencies.find((c) => c.code === compareCode);
  }, [allCurrencies, compareCode]);

  const compareData = useMemo(() => {
    if (!comparePair) return null;
    return generateHistoricalData(comparePair, timeframe);
  }, [comparePair, timeframe]);

  // Extract values based on direction
  const values = useMemo(() => {
    return data.map((d) => (rateDirection === 'from_sgd' ? d.rateFromSgd : d.rateToSgd));
  }, [data, rateDirection]);

  // Stats
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const avgVal = values.reduce((a, b) => a + b, 0) / values.length;
  const firstVal = values[0];
  const lastVal = values[values.length - 1];
  const totalChange = lastVal - firstVal;
  const totalChangePercent = firstVal ? (totalChange / firstVal) * 100 : 0;
  const isPositive = totalChangePercent >= 0;

  // SVG Chart dimensions
  const width = 800;
  const height = 320;
  const padding = { top: 30, right: 30, bottom: 40, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Coordinate scales
  const valRange = maxVal - minVal || 1;
  const getX = (index: number) => padding.left + (index / (values.length - 1)) * chartWidth;
  const getY = (val: number) => padding.top + chartHeight - ((val - minVal) / valRange) * chartHeight;

  // Path generators
  const linePath = useMemo(() => {
    return values
      .map((val, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(val).toFixed(1)}`)
      .join(' ');
  }, [values, minVal, maxVal]);

  const areaPath = useMemo(() => {
    if (values.length === 0) return '';
    const firstX = getX(0).toFixed(1);
    const lastX = getX(values.length - 1).toFixed(1);
    const bottomY = (padding.top + chartHeight).toFixed(1);
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }, [linePath, values.length, chartHeight]);

  // Normalized secondary comparison path (% change line)
  const compareLinePath = useMemo(() => {
    if (!compareData) return null;
    const compValues = compareData.map((d) =>
      rateDirection === 'from_sgd' ? d.rateFromSgd : d.rateToSgd
    );
    const compMin = Math.min(...compValues);
    const compMax = Math.max(...compValues);
    const compRange = compMax - compMin || 1;

    return compValues
      .map((val, i) => {
        const x = getX(i);
        const y = padding.top + chartHeight - ((val - compMin) / compRange) * chartHeight;
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  }, [compareData, rateDirection]);

  // Mouse move handler for interactive crosshair
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const svgX = (x / rect.width) * width;

    // Check if within bounds
    if (svgX < padding.left || svgX > width - padding.right) {
      setHoverIndex(null);
      return;
    }

    const ratio = (svgX - padding.left) / chartWidth;
    const index = Math.round(ratio * (values.length - 1));
    const clampedIndex = Math.max(0, Math.min(values.length - 1, index));
    setHoverIndex(clampedIndex);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  // Export data handler
  const handleExportCSV = () => {
    const headers = ['Date', `Rate (${rateDirection === 'from_sgd' ? '1 SGD in Foreign' : '1 Foreign in SGD'})`, 'High', 'Low'];
    const rows = data.map((d) => [
      d.date,
      rateDirection === 'from_sgd' ? d.rateFromSgd : d.rateToSgd,
      d.high,
      d.low,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MAS_SGD_${selectedPair.code}_${timeframe}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  const hoveredDataPoint = hoverIndex !== null ? data[hoverIndex] : null;
  const hoveredValue = hoverIndex !== null ? values[hoverIndex] : null;
  const hoveredDiffVsStart =
    hoveredValue !== null ? hoveredValue - firstVal : null;
  const hoveredDiffPercent =
    hoveredDiffVsStart !== null && firstVal ? (hoveredDiffVsStart / firstVal) * 100 : null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs space-y-4">
      {/* Chart Top Control Strip */}
      <div className="p-4 sm:p-5 border-b border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Pair Identity and Selector */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl" role="img" aria-label={selectedPair.country}>
                {selectedPair.flag}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                    SGD / {selectedPair.code}
                  </h2>
                  <div className="relative inline-block">
                    <select
                      value={selectedPair.code}
                      onChange={(e) => {
                        const target = allCurrencies.find((c) => c.code === e.target.value);
                        if (target) onSelectPair(target);
                      }}
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-1 pl-2 pr-6 rounded-md appearance-none cursor-pointer focus:outline-none"
                    >
                      {allCurrencies.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code} - {c.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3 h-3 text-slate-500 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
                <div className="text-xs text-slate-500">
                  {selectedPair.name} · {selectedPair.country}
                </div>
              </div>
            </div>

            {/* Direction Selector */}
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs font-medium ml-0 sm:ml-4">
              <button
                onClick={() => setRateDirection('from_sgd')}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                  rateDirection === 'from_sgd'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1 SGD = {selectedPair.code}
              </button>
              <button
                onClick={() => setRateDirection('to_sgd')}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                  rateDirection === 'to_sgd'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1 {selectedPair.code} = SGD
              </button>
            </div>
          </div>

          {/* Timeframe buttons & Export */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Timeframes */}
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs font-medium">
              {(['7D', '1M', '3M', '6M', '1Y', '5Y'] as Timeframe[]).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap ${
                    timeframe === tf
                      ? 'bg-slate-900 text-white font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            {/* Export and Tools */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleExportCSV}
                className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-xs flex items-center gap-1 font-medium"
                title="Download historical data as CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">CSV</span>
              </button>
              <button
                onClick={handleCopyLink}
                className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-xs flex items-center gap-1 font-medium"
                title="Copy link"
              >
                {copiedNotification ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Share2 className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Current rate summary & Hover readout */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-baseline justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-3xl font-extrabold text-slate-900 tabular-nums tracking-tight">
              {hoveredValue !== null
                ? hoveredValue.toLocaleString('en-US', {
                    minimumFractionDigits: hoveredValue > 100 ? 2 : 4,
                    maximumFractionDigits: hoveredValue > 100 ? 2 : 4,
                  })
                : lastVal.toLocaleString('en-US', {
                    minimumFractionDigits: lastVal > 100 ? 2 : 4,
                    maximumFractionDigits: lastVal > 100 ? 2 : 4,
                  })}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {rateDirection === 'from_sgd'
                ? `${selectedPair.code} per 1 SGD`
                : `SGD per 1 ${selectedPair.code}`}
            </span>

            {/* Change indicator */}
            <div
              className={`inline-flex items-center gap-1 text-xs font-mono font-semibold tabular-nums ml-2 ${
                (hoveredDiffPercent !== null ? hoveredDiffPercent >= 0 : isPositive)
                  ? 'text-emerald-600'
                  : 'text-rose-600'
              }`}
            >
              {(hoveredDiffPercent !== null ? hoveredDiffPercent >= 0 : isPositive) ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              <span>
                {hoveredDiffPercent !== null
                  ? `${hoveredDiffPercent >= 0 ? '+' : ''}${hoveredDiffPercent.toFixed(2)}%`
                  : `${isPositive ? '+' : ''}${totalChangePercent.toFixed(2)}%`}
              </span>
              <span className="text-slate-400 font-normal">
                ({timeframe} {hoveredDataPoint ? `to ${hoveredDataPoint.date}` : 'trend'})
              </span>
            </div>
          </div>

          {/* Secondary comparison selector */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Overlay pair:</span>
            <select
              value={compareCode}
              onChange={(e) => setCompareCode(e.target.value)}
              className="py-1 px-2 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:outline-none"
            >
              <option value="">None (Single currency)</option>
              {allCurrencies
                .filter((c) => c.code !== selectedPair.code)
                .map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code} - {c.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Interactive SVG Chart Canvas */}
      <div className="px-4 sm:px-6 relative select-none">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-72 sm:h-80 overflow-visible cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            <linearGradient id="sgdAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#dc2626" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="compAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal gridlines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = padding.top + chartHeight * ratio;
            const val = maxVal - ratio * valRange;
            return (
              <g key={ratio}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 font-mono tabular-nums"
                >
                  {val > 100 ? val.toFixed(1) : val.toFixed(4)}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path d={areaPath} fill="url(#sgdAreaGradient)" />

          {/* Comparison line if enabled */}
          {compareLinePath && (
            <path
              d={compareLinePath}
              fill="none"
              stroke="#0284c7"
              strokeWidth="2"
              strokeDasharray="4 4"
              strokeLinecap="round"
            />
          )}

          {/* Primary Trend line */}
          <path
            d={linePath}
            fill="none"
            stroke="#dc2626"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Min & Max reference marks */}
          <g>
            <circle
              cx={getX(values.indexOf(maxVal))}
              cy={getY(maxVal)}
              r="3.5"
              fill="#dc2626"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
            <circle
              cx={getX(values.indexOf(minVal))}
              cy={getY(minVal)}
              r="3.5"
              fill="#64748b"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
          </g>

          {/* Crosshair & Tooltip when hovered */}
          {hoverIndex !== null && (
            <g>
              {/* Vertical line */}
              <line
                x1={getX(hoverIndex)}
                y1={padding.top}
                x2={getX(hoverIndex)}
                y2={padding.top + chartHeight}
                stroke="#475569"
                strokeWidth="1"
                strokeDasharray="2 2"
              />

              {/* Focus dot on primary line */}
              <circle
                cx={getX(hoverIndex)}
                cy={getY(values[hoverIndex])}
                r="5"
                fill="#dc2626"
                stroke="#ffffff"
                strokeWidth="2"
              />

              {/* Hover badge */}
              <g
                transform={`translate(${Math.min(
                  width - padding.right - 130,
                  Math.max(padding.left + 10, getX(hoverIndex) - 65)
                )}, 12)`}
              >
                <rect
                  width="130"
                  height="42"
                  rx="6"
                  fill="#0f172a"
                  className="shadow-md"
                />
                <text
                  x="65"
                  y="16"
                  textAnchor="middle"
                  fill="#94a3b8"
                  className="text-[10px] font-mono"
                >
                  {data[hoverIndex].date}
                </text>
                <text
                  x="65"
                  y="32"
                  textAnchor="middle"
                  fill="#ffffff"
                  className="text-[12px] font-mono font-bold tabular-nums"
                >
                  {values[hoverIndex] > 100
                    ? values[hoverIndex].toFixed(2)
                    : values[hoverIndex].toFixed(4)}
                </text>
              </g>
            </g>
          )}

          {/* Date Axis labels (evenly spaced 5-6 points) */}
          {data.length > 0 &&
            [0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
              const idx = Math.min(data.length - 1, Math.round(pct * (data.length - 1)));
              const point = data[idx];
              if (!point) return null;
              return (
                <text
                  key={i}
                  x={getX(idx)}
                  y={height - 12}
                  textAnchor={i === 0 ? 'start' : i === 4 ? 'end' : 'middle'}
                  className="text-[10px] fill-slate-400 font-mono"
                >
                  {point.date}
                </text>
              );
            })}
        </svg>
      </div>

      {/* Legend & Stats cards */}
      <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">
              Period High
            </span>
            <span className="font-mono text-sm font-bold text-slate-900 tabular-nums">
              {maxVal > 100 ? maxVal.toFixed(2) : maxVal.toFixed(4)}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Peak in {timeframe} window
            </span>
          </div>

          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">
              Period Low
            </span>
            <span className="font-mono text-sm font-bold text-slate-900 tabular-nums">
              {minVal > 100 ? minVal.toFixed(2) : minVal.toFixed(4)}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Trough in {timeframe} window
            </span>
          </div>

          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">
              Period Average
            </span>
            <span className="font-mono text-sm font-bold text-slate-900 tabular-nums">
              {avgVal > 100 ? avgVal.toFixed(2) : avgVal.toFixed(4)}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Mean exchange rate
            </span>
          </div>

          <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">
                Direct Calculator
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Convert using current spot
              </span>
            </div>
            <button
              onClick={() => onOpenCalculator(selectedPair)}
              className="mt-2 w-full py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors text-center"
            >
              Open in Calculator
            </button>
          </div>
        </div>

        {comparePair && (
          <div className="mt-3 text-xs text-sky-700 bg-sky-50 border border-sky-100 rounded-lg p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
              <span>
                Comparing <strong>SGD/{selectedPair.code}</strong> (Red solid) vs{' '}
                <strong>SGD/{comparePair.code}</strong> (Blue dashed)
              </span>
            </div>
            <button
              onClick={() => setCompareCode('')}
              className="text-xs text-sky-700 underline hover:text-sky-900 cursor-pointer"
            >
              Remove overlay
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
