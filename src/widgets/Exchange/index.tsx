import { useAppState } from "../../app/AppStateProvider";
import { useQuote } from "../../app/useQuote";
import { convert, formatMoney } from "../../shared/lib/money";
import CurrencySelect from "./ui/CurrencySelect";
import QuoteStatus from "./ui/QuoteStatus";

export default function Exchange() {
  const { amount, setAmount, from, setFrom, to, setTo, currencies, ratesLoading, ratesError } =
    useAppState();
  const { quote, loading, error, refresh } = useQuote();
  const result = quote ? formatMoney(convert(quote.amount, quote.rate)) : "0";

  return (
    <section>
      <h1>Exchange Rate</h1>
      <div>
        <CurrencySelect
          label="From currency"
          testId="from-currency"
          value={from}
          currencies={currencies}
          onChange={setFrom}
        />
        <span data-testid="amount">{amount}</span>
      </div>
      <div>
        <CurrencySelect
          label="To currency"
          testId="to-currency"
          value={to}
          currencies={currencies}
          onChange={setTo}
        />
        <span data-testid="result">{result}</span>
      </div>
      <QuoteStatus
        ratesLoading={ratesLoading}
        ratesError={ratesError}
        loading={loading}
        error={error}
        quote={quote}
        onRefresh={refresh}
      />
      <label>
        Amount
        <input
          inputMode="decimal"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
      </label>
    </section>
  );
}
