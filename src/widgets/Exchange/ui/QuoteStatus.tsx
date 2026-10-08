import type { Quote } from "../../../entities/exchange/model/types";

interface QuoteStatusProps {
  ratesLoading: boolean;
  ratesError: string | null;
  loading: boolean;
  error: string | null;
  quote: Quote | null;
  onRefresh: () => void;
}

export default function QuoteStatus({
  ratesLoading,
  ratesError,
  loading,
  error,
  quote,
  onRefresh,
}: QuoteStatusProps) {
  return (
    <div>
      {ratesLoading ? (
        <span>Loading currencies…</span>
      ) : ratesError ? (
        <span role="alert">{ratesError}</span>
      ) : loading ? (
        <span>Loading…</span>
      ) : error ? (
        <span role="alert">{error}</span>
      ) : (
        quote && (
          <span data-testid="updated-at">
            Last updated {quote.createdAt.split("T")[1].slice(0, 8)}
          </span>
        )
      )}
      <button type="button" data-testid="refresh" onClick={onRefresh}>
        ⟳
      </button>
    </div>
  );
}
