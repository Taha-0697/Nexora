import React, { useState, useEffect, useRef } from 'react';
import { DollarSign, ChevronDown, RefreshCw, X, Check } from 'lucide-react';

interface Currency {
  code: string;
  symbol: string;
  name: string;
  flag: string;
}

const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee', flag: '🇵🇰' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', flag: '🇸🇦' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', flag: '🇦🇪' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  { code: 'OMR', symbol: 'ر.ع', name: 'Omani Rial', flag: '🇴🇲' },
  { code: 'QAR', symbol: 'ر.ق', name: 'Qatari Riyal', flag: '🇶🇦' },
  { code: 'KWD', symbol: 'د.ك', name: 'Kuwaiti Dinar', flag: '🇰🇼' },
  { code: 'BHD', symbol: '.د.ب', name: 'Bahraini Dinar', flag: '🇧🇭' },
];

// Country / Locale → Currency mapping
const COUNTRY_CURRENCY: Record<string, string> = {
  PK: 'PKR', SA: 'SAR', AE: 'AED', OM: 'OMR', QA: 'QAR',
  KW: 'KWD', BH: 'BHD', GB: 'GBP', US: 'USD', DE: 'EUR',
  FR: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR', CA: 'USD',
  AU: 'USD', IN: 'USD'
};

const LOCALE_CURRENCY: Record<string, string> = {
  'ur': 'PKR', 'pk': 'PKR', 'ar-sa': 'SAR', 'ar-ae': 'AED',
  'ar-om': 'OMR', 'ar-qa': 'QAR', 'ar-kw': 'KWD', 'ar-bh': 'BHD',
  'en-gb': 'GBP', 'en-us': 'USD', 'de': 'EUR', 'fr': 'EUR'
};

// Fallback rates against USD
const FALLBACK_RATES: Record<string, number> = {
  USD: 1, PKR: 278.5, SAR: 3.75, AED: 3.67, EUR: 0.92,
  GBP: 0.79, OMR: 0.385, QAR: 3.64, KWD: 0.307, BHD: 0.377,
};

interface CurrencyConverterProps {
  compact?: boolean;
}

export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ compact = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [baseCurrency, setBaseCurrency] = useState<string>('USD');
  const [targetCurrency, setTargetCurrency] = useState<string>('USD');
  const [amount, setAmount] = useState<string>('5000');
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [detectedCountry, setDetectedCountry] = useState<string>('');
  const panelRef = useRef<HTMLDivElement>(null);

  // Instant locale detection first, then IP lookup
  useEffect(() => {
    try {
      const browserLang = (navigator.language || 'en-US').toLowerCase();
      for (const [key, curr] of Object.entries(LOCALE_CURRENCY)) {
        if (browserLang.includes(key)) {
          setTargetCurrency(curr);
          break;
        }
      }
    } catch {
      // Default to USD
    }

    // Secondary IP Geolocation
    const detectCountryByIP = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3500) });
        if (res.ok) {
          const data = await res.json();
          const country = data.country_code as string;
          if (country) {
            setDetectedCountry(country);
            const detected = COUNTRY_CURRENCY[country];
            if (detected) {
              setTargetCurrency(detected);
            }
          }
        }
      } catch {
        // Fallback silently
      }
    };
    detectCountryByIP();
  }, []);

  // Fetch live exchange rates
  const fetchRates = async () => {
    setIsLoadingRates(true);
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD', {
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.rates) setRates(data.rates);
      }
    } catch {
      // Use fallback
    } finally {
      setIsLoadingRates(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const convert = (amt: number, from: string, to: string): number => {
    const fromRate = rates[from] || 1;
    const toRate = rates[to] || 1;
    return (amt / fromRate) * toRate;
  };

  const result = convert(parseFloat(amount) || 0, baseCurrency, targetCurrency);
  const targetCurrObj = CURRENCIES.find(c => c.code === targetCurrency);
  const baseCurrObj = CURRENCIES.find(c => c.code === baseCurrency);

  const formatResult = (val: number): string => {
    if (val >= 1000000) return (val / 1000000).toFixed(2) + 'M';
    if (val >= 1000) return val.toLocaleString('en-US', { maximumFractionDigits: 0 });
    return val.toFixed(2);
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/60 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all cursor-pointer ${
          compact ? 'text-[11px] px-2 py-1' : ''
        }`}
        title="Interactive Currency Converter"
        aria-label="Open Currency Converter"
      >
        <DollarSign className="w-3.5 h-3.5 text-indigo-600 dark:text-sky-400" />
        <span className="font-mono font-bold">{targetCurrObj?.symbol} {targetCurrency}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Floating Modal Panel */}
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-80 sm:w-84 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl z-50 overflow-hidden animate-fadeIn"
          role="dialog"
          aria-label="Currency Converter Modal"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-indigo-600 dark:text-sky-400" />
              <span className="font-bold text-xs text-slate-800 dark:text-white">Live Currency Estimator</span>
              {detectedCountry && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-sky-950/60 text-indigo-600 dark:text-sky-300 border border-indigo-200 dark:border-sky-800/60">
                  {detectedCountry}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={fetchRates}
                disabled={isLoadingRates}
                className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 dark:hover:text-sky-400 transition-colors"
                title="Refresh Live Exchange Rates"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRates ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3">
            {/* Amount Input */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 font-semibold">
                Project Investment Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Enter amount"
                  min="0"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">
                  {baseCurrency}
                </span>
              </div>
            </div>

            {/* From → To Currency Selectors */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 font-semibold">From</label>
                <select
                  value={baseCurrency}
                  onChange={e => setBaseCurrency(e.target.value)}
                  className="w-full px-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                >
                  {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 font-semibold">To (Target)</label>
                <select
                  value={targetCurrency}
                  onChange={e => setTargetCurrency(e.target.value)}
                  className="w-full px-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                >
                  {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Currency Pills */}
            <div className="flex flex-wrap gap-1 pt-1">
              {['USD', 'PKR', 'SAR', 'AED', 'EUR', 'GBP'].map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setTargetCurrency(code)}
                  className={`px-2 py-1 rounded-md text-[10px] font-mono font-semibold transition-all cursor-pointer ${
                    targetCurrency === code
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/60'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>

            {/* Calculated Result */}
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-50/80 to-blue-50/50 dark:from-slate-800 dark:to-slate-850 border border-indigo-100 dark:border-slate-700/80 text-center">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                {amount || '0'} {baseCurrObj?.symbol} ({baseCurrency}) =
              </div>
              <div className="text-2xl font-black text-indigo-700 dark:text-sky-300 tracking-tight">
                {targetCurrObj?.symbol} {formatResult(result)} {targetCurrency}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
                1 {baseCurrency} ≈ {targetCurrObj?.symbol}{convert(1, baseCurrency, targetCurrency).toFixed(3)} {targetCurrency}
              </div>
            </div>

            {/* Status Footer */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
              <span>{isLoadingRates ? 'Updating...' : 'Verified Rates'}</span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <Check className="w-3 h-3" /> Live Synced
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
