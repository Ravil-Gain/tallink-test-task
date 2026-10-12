import { useAppState } from "./AppStateProvider";
import { parseStringAmount } from "../shared/lib/money";

export function useQuote() {
  const { amount, from, to, quote, quoteRequest, quoteLoading, quoteError, refreshQuote } =
    useAppState();
  const parsedAmount = parseStringAmount(amount);
  const isCurrentQuote =
    quoteRequest?.from === from && quoteRequest.to === to && quoteRequest.amount === parsedAmount;

  return {
    quote: isCurrentQuote ? quote : null,
    loading: quoteLoading,
    error: quoteError,
    refresh: refreshQuote,
  };
}
