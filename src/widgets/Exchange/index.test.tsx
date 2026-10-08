import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAppState } from "../../app/AppStateProvider";
import { useQuote } from "../../app/useQuote";
import Exchange from "./index";

vi.mock("../../app/AppStateProvider", () => ({ useAppState: vi.fn() }));
vi.mock("../../app/useQuote", () => ({ useQuote: vi.fn() }));

describe("Exchange", () => {
  const setAmount = vi.fn();
  const setFrom = vi.fn();
  const setTo = vi.fn();

  beforeEach(() => {
    vi.mocked(useAppState).mockReturnValue({
      amount: "100",
      setAmount,
      from: "EUR",
      setFrom,
      to: "USD",
      setTo,
      currencies: ["EUR", "USD", "GBP"],
      ratesLoading: false,
      ratesError: null,
      quote: null,
      quoteRequest: null,
      quoteLoading: false,
      quoteError: null,
      refreshQuote: vi.fn(),
      history: [],
      setHistory: vi.fn(),
      selected: 0,
      setSelected: vi.fn(),
    });
    vi.mocked(useQuote).mockReturnValue({
      quote: { amount: 100, rate: "1.25", createdAt: "2026-10-07T12:34:56.000Z" },
      loading: false,
      error: null,
      refresh: vi.fn(),
    });
  });

  it("shows a matching quote and changes currencies and amount", () => {
    render(<Exchange />);

    expect(screen.getByTestId("result")).toHaveTextContent("125");
    expect(screen.getByTestId("updated-at")).toHaveTextContent("12:34:56");

    fireEvent.change(screen.getByRole("combobox", { name: "From currency" }), {
      target: { value: "GBP" },
    });
    fireEvent.change(screen.getByRole("combobox", { name: "To currency" }), {
      target: { value: "EUR" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Amount" }), {
      target: { value: "250" },
    });

    expect(setFrom).toHaveBeenCalledWith("GBP");
    expect(setTo).toHaveBeenCalledWith("EUR");
    expect(setAmount).toHaveBeenCalledWith("250");
  });

  it("does not show a result when there is no current quote", () => {
    vi.mocked(useQuote).mockReturnValue({
      quote: null,
      loading: false,
      error: null,
      refresh: vi.fn(),
    });

    render(<Exchange />);

    expect(screen.getByTestId("result")).toHaveTextContent("0");
    expect(screen.queryByTestId("updated-at")).not.toBeInTheDocument();
  });
});
