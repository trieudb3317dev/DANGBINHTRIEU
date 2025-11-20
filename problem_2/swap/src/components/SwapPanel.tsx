import React from 'react';
import AmountCard from './AmountCard';

interface Props {
  fromAmount: number;
  toAmount: number;
  fromCurrency: string;
  toCurrency: string;
  setFromCurrency: (c: string) => void;
  setToCurrency: (c: string) => void;
  swapCurrencies: () => void;
  onFromChange: (v: string) => void;
  formatNumber: (n: number) => string;
  togglePreview: () => void;
  showPreview: boolean;
  currencies: string[]; // <-- new
}

const SwapPanel: React.FC<Props> = ({
  fromAmount,
  toAmount,
  fromCurrency,
  toCurrency,
  setFromCurrency,
  setToCurrency,
  swapCurrencies,
  onFromChange,
  formatNumber,
  togglePreview,
  showPreview,
  currencies,
}) => {
  return (
    <div className="swap-panel preview-highlight">
      <div className="banner">From Swap</div>
      <div className="panel-row">
        <AmountCard
          label="From"
          amount={fromAmount}
          currency={fromCurrency}
          currencies={currencies}
          showInput
          onCurrencyChange={setFromCurrency}
          onAmountChange={onFromChange}
          formatNumber={formatNumber}
        />

        <div className="swap-center">
          <button className="swap-btn" onClick={swapCurrencies}>
            SWAP
          </button>
        </div>

        <AmountCard
          label="To"
          amount={toAmount}
          currency={toCurrency}
          currencies={currencies}
          onCurrencyChange={setToCurrency}
          formatNumber={formatNumber}
        />
      </div>

      <div className="panel-footer">
        <div className="rate">1 VND = 0.00003792 USD</div>
        <button onClick={togglePreview} className="outline-btn">
          {showPreview ? 'Hide Details' : 'Preview Swap'}
        </button>
      </div>
    </div>
  );
};

export default SwapPanel;
