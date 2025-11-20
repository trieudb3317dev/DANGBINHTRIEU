import React from 'react';

interface Props {
  label: string;
  amount: number;
  currency: string;
  currencies: string[]; // <-- new
  showInput?: boolean;
  onCurrencyChange: (c: string) => void;
  onAmountChange?: (v: string) => void;
  formatNumber: (n: number) => string;
}

const formatLabel = (c: string) => {
  if (c === 'VND') return '₫ VND';
  if (c === 'USD') return '$ USD';
  return c;
};

const AmountCard: React.FC<Props> = ({
  label,
  amount,
  currency,
  currencies,
  showInput = false,
  onCurrencyChange,
  onAmountChange,
  formatNumber,
}) => {
  return (
    <div className="card">
      <div className="card-label">
        <label>{label}</label>
        <select
          className="currency-select"
          value={currency}
          onChange={(e) => onCurrencyChange(e.target.value)}
        >
          {/* render options from currencies prop */}
          {currencies && currencies.length
            ? currencies.map((c) => (
                <option key={c} value={c}>
                  {formatLabel(c)}
                </option>
              ))
            : null}
        </select>
      </div>
      <div className="card-top">
        <div className="amount">
          {showInput ? (
            <input
              className="amount-input"
              type="text"
              value={formatNumber(amount)}
              onChange={(e) => onAmountChange && onAmountChange(e.target.value)}
            />
          ) : (
            formatNumber(amount)
          )}
        </div>
      </div>
    </div>
  );
};

export default AmountCard;
