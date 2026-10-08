import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAppState } from "../../app/AppStateProvider";
import History from "./index";

vi.mock("../../app/AppStateProvider", () => ({ useAppState: vi.fn() }));

function createState(
  history = [
    { from: "EUR", to: "USD", amount: "10", result: "11" },
    { from: "GBP", to: "PLN", amount: "20", result: "90" },
  ],
) {
  return {
    amount: "0",
    setAmount: vi.fn(),
    from: "EUR",
    setFrom: vi.fn(),
    to: "USD",
    setTo: vi.fn(),
    currencies: [],
    ratesLoading: false,
    ratesError: null,
    quote: null,
    quoteRequest: null,
    quoteLoading: false,
    quoteError: null,
    refreshQuote: vi.fn(),
    history,
    setHistory: vi.fn(),
    selected: 1,
    setSelected: vi.fn(),
  };
}

describe("History", () => {
  beforeEach(() => {
    vi.mocked(useAppState).mockReturnValue(createState());
  });

  it("shows records, selects the active row, and displays the count", () => {
    render(<History />);

    expect(screen.getAllByTestId("history-item")).toHaveLength(2);
    expect(screen.getByText("EUR 10 → USD 11")).toHaveAttribute("aria-selected", "false");
    expect(screen.getByText("GBP 20 → PLN 90")).toHaveAttribute("aria-selected", "true");
    expect(screen.getByTestId("history-count")).toHaveTextContent("2 records");
  });

  it("shows a zero count when there are no records", () => {
    vi.mocked(useAppState).mockReturnValue(createState([]));

    render(<History />);

    expect(screen.queryAllByTestId("history-item")).toHaveLength(0);
    expect(screen.getByTestId("history-count")).toHaveTextContent("0 records");
  });
});
