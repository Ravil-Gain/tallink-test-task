import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { Quote, QuoteRequest } from "../entities/exchange/model/types";
import { initialHistory, type HistoryRecord } from "../history";
import { parseStringAmount } from "../shared/lib/money";

interface RatesResponse {
  currencies: string[];
}

function isQuote(value: unknown): value is Quote {
  if (typeof value !== "object" || value === null) return false;

  const quote = value as Record<string, unknown>;
  return (
    typeof quote.rate === "string" &&
    Number.isFinite(parseStringAmount(quote.rate)) &&
    typeof quote.amount === "number" &&
    Number.isFinite(quote.amount) &&
    typeof quote.createdAt === "string" &&
    Number.isFinite(Date.parse(quote.createdAt))
  );
}

interface AppState {
  amount: string;
  setAmount: Dispatch<SetStateAction<string>>;
  from: string;
  setFrom: Dispatch<SetStateAction<string>>;
  to: string;
  setTo: Dispatch<SetStateAction<string>>;
  currencies: string[];
  ratesLoading: boolean;
  ratesError: string | null;
  quote: Quote | null;
  quoteRequest: QuoteRequest | null;
  quoteLoading: boolean;
  quoteError: string | null;
  refreshQuote: () => void;
  history: HistoryRecord[];
  setHistory: Dispatch<SetStateAction<HistoryRecord[]>>;
  selected: number;
  setSelected: Dispatch<SetStateAction<number>>;
}

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [amount, setAmount] = useState("0");
  const [from, setFrom] = useState("EUR");
  const [to, setTo] = useState("USD");
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [ratesLoading, setRatesLoading] = useState(true);
  const [ratesError, setRatesError] = useState<string | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteRequest, setQuoteRequest] = useState<QuoteRequest | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [quoteRefresh, setQuoteRefresh] = useState(0);
  const [history, setHistory] = useState(initialHistory);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/rates", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load rates: ${res.status}`);
        return res.json();
      })
      .then((data: RatesResponse) => {
        if (
          !Array.isArray(data.currencies) ||
          data.currencies.length < 2 ||
          !data.currencies.every((currency) => typeof currency === "string")
        ) {
          throw new Error("Rates response must include at least two currencies");
        }

        setCurrencies(data.currencies);
        setFrom(data.currencies[0]);
        setTo(data.currencies[1]);
        setRatesError(null);
        setRatesLoading(false);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setRatesError(err instanceof Error ? err.message : "Failed to load rates");
        setRatesLoading(false);
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (ratesLoading || ratesError || currencies.length < 2 || !from || !to) {
      setQuoteLoading(false);
      return;
    }

    const parsedAmount = parseStringAmount(amount);
    if (!Number.isFinite(parsedAmount)) {
      setQuote(null);
      setQuoteRequest(null);
      setQuoteError("Enter a valid amount.");
      setQuoteLoading(false);
      return;
    }

    const controller = new AbortController();
    const request = { from, to, amount: parsedAmount };
    const timeoutId = window.setTimeout(() => {
      fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
        signal: controller.signal,
      })
        .then((res) => {
          if (!res.ok) throw new Error(`Quote request failed: ${res.status}`);
          return res.json();
        })
        .then((data: unknown) => {
          if (controller.signal.aborted) return;
          if (!isQuote(data)) throw new Error("Quote response is invalid");
          setQuote(data);
          setQuoteRequest(request);
          setQuoteError(null);
          setQuoteLoading(false);
        })
        .catch((err: unknown) => {
          if (controller.signal.aborted) return;
          setQuoteError(err instanceof Error ? err.message : "Failed to load quote");
          setQuoteLoading(false);
        });
    }, 500);

    setQuote(null);
    setQuoteRequest(null);
    setQuoteError(null);
    setQuoteLoading(true);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [amount, from, to, quoteRefresh, currencies.length, ratesLoading, ratesError]);

  return (
    <AppStateContext.Provider
      value={{
        amount,
        setAmount,
        from,
        setFrom,
        to,
        setTo,
        currencies,
        ratesLoading,
        ratesError,
        quote,
        quoteRequest,
        quoteLoading,
        quoteError,
        refreshQuote: () => setQuoteRefresh((value) => value + 1),
        history,
        setHistory,
        selected,
        setSelected,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) throw new Error("useAppState must be used within AppStateProvider");
  return context;
}
