import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import SwapPanel from './components/SwapPanel';
import ConfirmPanel from './components/ConfirmPanel';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('theme', theme);
    } catch {}
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  // Swap-specific state
  const [fromAmount, setFromAmount] = useState<number>(10000000);
  const [toAmount, setToAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState<string>('VND');
  const [toCurrency, setToCurrency] = useState<string>('USD');
  const [showPreview, setShowPreview] = useState<boolean>(false);

  // <-- new: prices and currencies from API -->
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [currencies, setCurrencies] = useState<string[]>([]);

  const VND_USD_FALLBACK = 0.00003792;

  useEffect(() => {
    const url = 'https://interview.switcheo.com/prices.json';
    const ac = new AbortController();

    (async () => {
      try {
        const res = await fetch(url, { signal: ac.signal });
        if (!res.ok) throw new Error('fetch failed');
        const data: Array<{ currency: string; date?: string; price: number }> = await res.json();
        const map: Record<string, { price: number; ts: number }> = {};
        for (const item of data) {
          const key = String(item.currency).toUpperCase();
          const ts = item.date ? new Date(item.date).getTime() : 0;
          if (!map[key] || ts >= map[key].ts) map[key] = { price: Number(item.price), ts };
        }
        const final: Record<string, number> = {};
        Object.keys(map).forEach((k) => (final[k] = map[k].price));
        // ensure USD present, ensure VND fallback
        if (!final['USD']) final['USD'] = 1;
        if (!final['VND']) final['VND'] = VND_USD_FALLBACK;
        setPrices(final);
        // build currency list sorted (keep VND and USD near top)
        const list = Object.keys(final).sort((a, b) => {
          if (a === 'USD') return -1;
          if (b === 'USD') return 1;
          if (a === 'VND') return -1;
          if (b === 'VND') return 1;
          return a.localeCompare(b);
        });
        setCurrencies(list);
      } catch (err) {
        console.error('Prices fetch error', err);
        // fallback minimal set
        setPrices((p) => ({ USD: p['USD'] ?? 1, VND: p['VND'] ?? VND_USD_FALLBACK, ...p }));
        setCurrencies((c) => c.length ? c : ['VND', 'USD']);
      }
    })();

    return () => ac.abort();
  }, []);

  // sync toAmount when fromAmount or prices or currencies change
  useEffect(() => {
    const priceFrom = prices[fromCurrency] ?? (fromCurrency === 'VND' ? VND_USD_FALLBACK : undefined);
    const priceTo = prices[toCurrency] ?? (toCurrency === 'VND' ? VND_USD_FALLBACK : undefined);

    let rate = 1;
    if (priceFrom != null && priceTo != null) {
      // 1 fromCurrency = priceFrom USD, divide by priceTo to get toCurrency
      rate = priceFrom / priceTo;
    } else {
      // fallback for common pair
      if (fromCurrency === 'VND' && toCurrency === 'USD') rate = VND_USD_FALLBACK;
      else if (fromCurrency === 'USD' && toCurrency === 'VND') rate = 1 / VND_USD_FALLBACK;
      else rate = 1;
    }

    setToAmount(parseFloat((fromAmount * rate).toFixed(6)));
  }, [fromAmount, fromCurrency, toCurrency, prices]);

  const swapCurrencies = () => {
    setFromCurrency((prev) => {
      const nextFrom = toCurrency;
      setToCurrency(prev);
      return nextFrom;
    });
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const togglePreview = () => {
    setShowPreview((prev) => !prev);
  };

  const onFromChange = (val: string) => {
    const n = Number(val.replace(/,/g, '')) || 0;
    setFromAmount(n);
  };

  const formatNumber = (n: number) =>
    n >= 1000 ? n.toLocaleString(undefined) : String(n);

  return (
    <div className="app flex items-center justify-center min-h-screen">
      <div className="page-wrap">
        {!showPreview ? (
          <SwapPanel
            fromAmount={fromAmount}
            toAmount={toAmount}
            fromCurrency={fromCurrency}
            toCurrency={toCurrency}
            setFromCurrency={setFromCurrency}
            setToCurrency={setToCurrency}
            swapCurrencies={swapCurrencies}
            onFromChange={onFromChange}
            formatNumber={formatNumber}
            togglePreview={togglePreview}
            showPreview={showPreview}
            currencies={currencies}
          />
        ) : null}
        {showPreview && (
          <ConfirmPanel
            fromAmount={fromAmount}
            toAmount={toAmount}
            fromCurrency={fromCurrency}
            toCurrency={toCurrency}
            setFromCurrency={setFromCurrency}
            setToCurrency={setToCurrency}
            swapCurrencies={swapCurrencies}
            onBack={togglePreview}
            formatNumber={formatNumber}
            currencies={currencies}
          />
        )}

        <div className="theme-row">
          <p className="muted">Current theme: {theme}</p>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
