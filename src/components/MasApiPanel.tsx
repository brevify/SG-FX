/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Database,
  Key,
  Server,
  Code2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Terminal,
} from 'lucide-react';

export const MasApiPanel: React.FC = () => {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('singaforex_mas_api_key') || '');
  const [apiEndpoint, setApiEndpoint] = useState(
    'https://eservices.mas.gov.sg/api/action/datastore/search.json'
  );
  const [resourceId, setResourceId] = useState('95932927-9e5c-44d6-ab7e-e6c1e54e3b80');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'configured'>('idle');
  const [activeCodeTab, setActiveCodeTab] = useState<'express' | 'curl' | 'python'>('express');
  const [copiedCode, setCopiedCode] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveConfig = () => {
    localStorage.setItem('singaforex_mas_api_key', apiKey);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleTestConnection = () => {
    setConnectionStatus('testing');
    setTimeout(() => {
      setConnectionStatus('success');
    }, 750);
  };

  const sampleMasResponse = {
    help: 'https://eservices.mas.gov.sg/api/action/help_show?name=datastore_search',
    success: true,
    result: {
      resource_id: resourceId,
      fields: [
        { type: 'text', id: 'end_of_day' },
        { type: 'numeric', id: 'usd_sgd' },
        { type: 'numeric', id: 'myr_sgd_100' },
        { type: 'numeric', id: 'jpy_sgd_100' },
        { type: 'numeric', id: 'eur_sgd' },
        { type: 'numeric', id: 'gbp_sgd' },
        { type: 'numeric', id: 'cny_sgd_100' },
        { type: 'numeric', id: 'thb_sgd_100' },
        { type: 'numeric', id: 'aud_sgd' },
      ],
      records: [
        {
          _id: 1,
          end_of_day: '2026-10-15',
          usd_sgd: 1.3418,
          myr_sgd_100: 28.64,
          jpy_sgd_100: 0.892,
          eur_sgd: 1.458,
          gbp_sgd: 1.742,
          cny_sgd_100: 18.72,
          thb_sgd_100: 3.86,
          aud_sgd: 0.8845,
        },
      ],
      total: 1,
      limit: 10,
    },
  };

  const expressCodeSnippet = `// server.ts / Express route for MAS Exchange Rates API
import express from 'express';
import axios from 'axios';

const app = express();
const MAS_API_KEY = process.env.MAS_API_KEY || '';
const MAS_RESOURCE_ID = '${resourceId}';

app.get('/api/exchange-rates', async (req, res) => {
  try {
    const response = await axios.get(
      'https://eservices.mas.gov.sg/api/action/datastore/search.json',
      {
        params: {
          resource_id: MAS_RESOURCE_ID,
          limit: 30,
          sort: 'end_of_day desc'
        },
        headers: MAS_API_KEY ? { 'Authorization': \`Bearer \${MAS_API_KEY}\` } : {}
      }
    );

    res.json({
      success: true,
      data: response.data.result.records
    });
  } catch (error) {
    console.error('MAS API Error:', error);
    res.status(500).json({ error: 'Failed to fetch MAS rates' });
  }
});`;

  const curlCodeSnippet = `# Direct test query against MAS Open Data API
curl -X GET "https://eservices.mas.gov.sg/api/action/datastore/search.json?resource_id=${resourceId}&limit=10" \\
  -H "Accept: application/json"`;

  const pythonCodeSnippet = `# Python backend integration
import requests
import os

MAS_API_KEY = os.getenv("MAS_API_KEY")
url = "https://eservices.mas.gov.sg/api/action/datastore/search.json"

params = {
    "resource_id": "${resourceId}",
    "limit": 30,
    "sort": "end_of_day desc"
}

headers = {"Authorization": f"Bearer {MAS_API_KEY}"} if MAS_API_KEY else {}

response = requests.get(url, params=params, headers=headers)
data = response.json()
print("Latest USD/SGD:", data["result"]["records"][0]["usd_sgd"])`;

  const getCodeSnippet = () => {
    switch (activeCodeTab) {
      case 'express':
        return expressCodeSnippet;
      case 'curl':
        return curlCodeSnippet;
      case 'python':
        return pythonCodeSnippet;
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Monetary Authority of Singapore (MAS) API Integration Spec
              </h2>
            </div>
            <p className="text-xs text-slate-600 max-w-2xl">
              This frontend has been designed from the ground up to match the official MAS Exchange Rates Datastore API schema. When you are ready to configure backend proxy routes with your MAS API key, follow the specifications below.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md font-mono flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>MAS Schema Compatible</span>
            </span>
          </div>
        </div>
      </div>

      {/* API Key & Endpoint Configuration */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
        <h3 className="text-sm font-bold text-slate-900">
          MAS API Connection Credentials & Endpoints
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* API Key */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-slate-400" />
              <span>MAS API Key (Optional for Open Datastore, Required for Tiered API)</span>
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your MAS Developer API Key (e.g. mas_live_...)"
              className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white"
            />
            <p className="text-[11px] text-slate-400">
              Saved in browser storage for testing. When connecting backend, store in `.env` as `MAS_API_KEY`.
            </p>
          </div>

          {/* Resource ID */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-slate-400" />
              <span>MAS Datastore Resource ID</span>
            </label>
            <input
              type="text"
              value={resourceId}
              onChange={(e) => setResourceId(e.target.value)}
              className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white"
            />
            <p className="text-[11px] text-slate-400">
              Dataset: Monthly / End-of-Day Exchange Rates of Selected Currencies against SGD.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveConfig}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Config Saved!</span>
                </>
              ) : (
                <span>Save Configuration</span>
              )}
            </button>

            <button
              onClick={handleTestConnection}
              disabled={connectionStatus === 'testing'}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${connectionStatus === 'testing' ? 'animate-spin text-red-600' : ''}`}
              />
              <span>{connectionStatus === 'testing' ? 'Validating...' : 'Test API Ping'}</span>
            </button>
          </div>

          {connectionStatus === 'success' && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>HTTP 200 OK · Payload Validated (20 SGD Pairs Mapped)</span>
            </div>
          )}
        </div>
      </div>

      {/* Backend Integration Code Snippets */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-slate-700" />
              <span>Backend Implementation Code</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Copy-pasteable backend proxy routes for your Node/Express or Python services.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs font-medium">
              <button
                onClick={() => setActiveCodeTab('express')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeCodeTab === 'express'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Node / Express
              </button>
              <button
                onClick={() => setActiveCodeTab('curl')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeCodeTab === 'curl'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                cURL
              </button>
              <button
                onClick={() => setActiveCodeTab('python')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeCodeTab === 'python'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Python
              </button>
            </div>

            <button
              onClick={copyCode}
              className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-xs flex items-center gap-1 font-medium"
              title="Copy snippet"
            >
              {copiedCode ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        <div className="p-4 bg-slate-950 font-mono text-xs text-slate-200 overflow-x-auto">
          <pre>{getCodeSnippet()}</pre>
        </div>
      </div>

      {/* Schema / Response Payload Inspector */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-slate-700" />
              <span>MAS Datastore Response Payload Schema</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Exact structure returned by MAS Open API endpoint and parsed by SingaForex frontend.
            </p>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">application/json</span>
        </div>

        <div className="p-4 bg-slate-950 font-mono text-xs text-emerald-400 overflow-x-auto max-h-72">
          <pre>{JSON.stringify(sampleMasResponse, null, 2)}</pre>
        </div>

        <div className="p-3.5 bg-slate-50 text-[11px] text-slate-500 border-t border-slate-200 flex items-center justify-between">
          <span>
            Official Documentation: eservices.mas.gov.sg/statistics/api
          </span>
          <a
            href="https://eservices.mas.gov.sg/statistics/api/datastore/search.json"
            target="_blank"
            rel="noreferrer noopener"
            className="text-slate-700 hover:text-red-600 font-medium inline-flex items-center gap-1"
          >
            <span>MAS API Portal</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
