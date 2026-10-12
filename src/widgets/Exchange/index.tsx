import { useAppState } from "../../app/AppStateProvider";
import { useQuote } from "../../app/useQuote";
import { convert, formatMoney } from "../../shared/lib/money";
import CurrencySelect from "./ui/CurrencySelect";
import QuoteStatus from "./ui/QuoteStatus";

export default function Exchange() {
  const { amount, from, setFrom, to, setTo, currencies, ratesLoading, ratesError } =
    useAppState();
  const { quote, loading, error, refresh } = useQuote();
  const result = quote ? formatMoney(convert(quote.amount, quote.rate)) : "0";

  const classGridName = "grid grid-cols-[minmax(0,1fr)_20px_minmax(0,1.2fr)] items-center gap-2";
  return (
    <section className="flex min-h-0 flex-1 flex-col px-4 pb-0 pt-5 sm:px-5">
      <h1 className="sr-only">Exchange Rate</h1>
      <div className="flex flex-1 flex-col justify-center gap-8 pb-4">
        <div className={classGridName}>
          <CurrencySelect
            label="From currency"
            testId="from-currency"
            value={from}
            currencies={currencies}
            onChange={setFrom}
          />
          <span aria-hidden="true" className="justify-self-center text-center text-[22px] font-light">
            ›
          </span>
          <label className="min-w-0">
            <span className="sr-only">Amount</span>
            <input
              data-testid="amount"
              readOnly
              value={amount}
              className="exchange-amount"
            />
          </label>
        </div>
        <div className={classGridName}>
          <CurrencySelect
            label="To currency"
            testId="to-currency"
            value={to}
            currencies={currencies}
            onChange={setTo}
          />
          <span aria-hidden="true" className="justify-self-center text-center text-[22px] font-light">
            ›
          </span>
          <span data-testid="result" className="min-w-0 text-right text-[31px] leading-none">
            {result}
          </span>
        </div>
      </div>
      <QuoteStatus
        ratesLoading={ratesLoading}
        ratesError={ratesError}
        loading={loading}
        error={error}
        quote={quote}
        onRefresh={refresh}
      />
    </section>
  );
}
