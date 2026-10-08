import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { HistoryRecord } from "../../history";
import { useAppState } from "../../app/AppStateProvider";
import { useQuote } from "../../app/useQuote";
import KeypadWidget from "./index";

const mocks = vi.hoisted(() => ({
  useLocation: vi.fn(),
  useNavigate: vi.fn(),
  useAppState: vi.fn(),
  useQuote: vi.fn(),
}));

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    useLocation: mocks.useLocation,
    useNavigate: mocks.useNavigate,
  };
});
vi.mock("../../app/AppStateProvider", () => ({ useAppState: mocks.useAppState }));
vi.mock("../../app/useQuote", () => ({ useQuote: mocks.useQuote }));

const records: HistoryRecord[] = [
  { from: "EUR", to: "USD", amount: "10", result: "11" },
  { from: "GBP", to: "PLN", amount: "20", result: "90" },
];

function createState(amount = "0", history = records, selected = 0) {
  return {
    amount,
    setAmount: vi.fn(),
    from: "EUR",
    setFrom: vi.fn(),
    to: "USD",
    setTo: vi.fn(),
    currencies: ["EUR", "USD", "GBP", "PLN"],
    ratesLoading: false,
    ratesError: null,
    quote: null,
    quoteRequest: null,
    quoteLoading: false,
    quoteError: null,
    refreshQuote: vi.fn(),
    history,
    setHistory: vi.fn(),
    selected,
    setSelected: vi.fn(),
  };
}

function renderKeypad(
  pathname: string,
  state = createState(),
  quoteState: ReturnType<typeof useQuote> = {
    quote: null,
    loading: false,
    error: null,
    refresh: vi.fn(),
  },
) {
  mocks.useLocation.mockReturnValue({ pathname });
  mocks.useNavigate.mockReturnValue(vi.fn());
  vi.mocked(useAppState).mockReturnValue(state as ReturnType<typeof useAppState>);
  vi.mocked(useQuote).mockReturnValue(quoteState);
  render(<KeypadWidget />);
  return state;
}

function applyLastUpdater<T>(mock: ReturnType<typeof vi.fn>, value: T): T {
  const updater = mock.mock.lastCall?.[0];
  if (typeof updater !== "function") throw new Error("Expected a state updater");
  return updater(value);
}

describe("KeypadWidget", () => {
  beforeEach(() => {
    mocks.useLocation.mockReturnValue({ pathname: "/exchange" });
  });

  it("handles number entry, decimal point, backspace, and clear on exchange", () => {
    const state = renderKeypad("/exchange");

    fireEvent.click(screen.getByTestId("key-7"));
    expect(applyLastUpdater(state.setAmount, "0")).toBe("7");

    fireEvent.click(screen.getByTestId("key-dot"));
    expect(applyLastUpdater(state.setAmount, "12")).toBe("12.");
    expect(applyLastUpdater(state.setAmount, "12.5")).toBe("12.5");

    fireEvent.click(screen.getByTestId("key-backspace"));
    expect(applyLastUpdater(state.setAmount, "1")).toBe("0");
    expect(applyLastUpdater(state.setAmount, "12")).toBe("1");

    fireEvent.click(screen.getByTestId("key-clear"));
    expect(state.setAmount).toHaveBeenLastCalledWith("0");
  });

  it("saves a valid amount with its matching quote", () => {
    const state = renderKeypad("/exchange", createState("100"), {
      quote: { amount: 100, rate: "1.25", createdAt: "2026-10-07T12:00:00Z" },
      loading: false,
      error: null,
      refresh: vi.fn(),
    });

    fireEvent.click(screen.getByTestId("key-save"));

    expect(applyLastUpdater(state.setHistory, [])).toEqual([
      { from: "EUR", to: "USD", amount: "100", result: "125" },
    ]);
  });

  it("does not save an invalid amount", () => {
    const state = renderKeypad("/exchange", createState("invalid"));
    fireEvent.click(screen.getByTestId("key-save"));
    expect(state.setHistory).not.toHaveBeenCalled();
  });

  it("does not save when there is no current quote", () => {
    const staleState = createState("100");
    renderKeypad("/exchange", staleState, {
      quote: null,
      loading: false,
      error: null,
      refresh: vi.fn(),
    });
    fireEvent.click(screen.getByTestId("key-save"));
    expect(staleState.setHistory).not.toHaveBeenCalled();
  });

  it("moves selection, deletes a record, and clears history", () => {
    const state = renderKeypad("/history", createState("0", records, 1));

    fireEvent.click(screen.getByTestId("key-up"));
    expect(applyLastUpdater(state.setSelected, 0)).toBe(0);
    fireEvent.click(screen.getByTestId("key-down"));
    expect(applyLastUpdater(state.setSelected, 1)).toBe(1);

    fireEvent.click(screen.getByTestId("key-backspace"));
    expect(state.setHistory).toHaveBeenLastCalledWith([records[0]]);
    expect(applyLastUpdater(state.setSelected, 1)).toBe(0);

    fireEvent.click(screen.getByTestId("key-clear"));
    expect(state.setHistory).toHaveBeenLastCalledWith([]);
    expect(state.setSelected).toHaveBeenLastCalledWith(0);
  });

  it("restores the selected record and navigates to exchange", () => {
    const state = createState("0", records, 1);
    const navigate = vi.fn();
    mocks.useLocation.mockReturnValue({ pathname: "/history" });
    mocks.useNavigate.mockReturnValue(navigate);
    vi.mocked(useAppState).mockReturnValue(state as ReturnType<typeof useAppState>);
    vi.mocked(useQuote).mockReturnValue({
      quote: null,
      loading: false,
      error: null,
      refresh: vi.fn(),
    });
    render(<KeypadWidget />);

    fireEvent.click(screen.getByTestId("key-ok"));

    expect(state.setFrom).toHaveBeenCalledWith("GBP");
    expect(state.setTo).toHaveBeenCalledWith("PLN");
    expect(state.setAmount).toHaveBeenCalledWith("20");
    expect(navigate).toHaveBeenCalledWith("/exchange");
  });

  it("does nothing when no history record is selected", () => {
    const navigate = vi.fn();
    renderKeypad("/history", createState("0", [], 0));

    fireEvent.click(screen.getByTestId("key-ok"));
    expect(navigate).not.toHaveBeenCalled();
  });
});
