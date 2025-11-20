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
  onBack: () => void;
  formatNumber: (n: number) => string;
  currencies: string[]; // <-- new
}

const ConfirmPanel: React.FC<Props> = ({
  fromAmount,
  toAmount,
  fromCurrency,
  toCurrency,
  setFromCurrency,
  setToCurrency,
  swapCurrencies,
  onBack,
  formatNumber,
  currencies,
}) => {
  return (
    <div className="swap-panel confirm-panel">
      <div className="banner">From Swap</div>
      <div className="panel-row">
        <AmountCard
          label="From"
          amount={fromAmount}
          currency={fromCurrency}
          currencies={currencies}
          onCurrencyChange={setFromCurrency}
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

      <div className="panel-details">
        <div className="detail-row">
          <div className="detail-left">Price</div>
          <div className="detail-right">1 VND = 0.00003792 USD</div>
        </div>
        <div className="detail-row">
          <div className="detail-left">Network fee</div>
          <div className="detail-right">≈ $5.48</div>
        </div>

        <div className="note">
          You will receive at least 100 USD on the transaction will refunded
        </div>

        <div className="actions">
          <button onClick={onBack} className="outline-btn">
            Back
          </button>
          <button className="outline-btn">Confirm Swap</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPanel;
