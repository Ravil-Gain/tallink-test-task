interface CurrencySelectProps {
  label: string;
  testId: string;
  value: string;
  currencies: string[];
  onChange: (currency: string) => void;
}

export default function CurrencySelect({
  label,
  testId,
  value,
  currencies,
  onChange,
}: CurrencySelectProps) {
  return (
    <select
      aria-label={label}
      data-testid={testId}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="currency-select"
    >
      {currencies.map((currency) => (
        <option key={currency} value={currency}>
          {currency}
        </option>
      ))}
    </select>
  );
}
