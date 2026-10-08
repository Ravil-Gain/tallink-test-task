import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AppStateProvider, useAppState } from "./AppStateProvider";
import { useQuote } from "./useQuote";

const rates = { currencies: ["EUR", "USD"] };
const quote = {
  amount: 100,
  rate: "1.25",
  createdAt: "2026-10-07T12:34:56.000Z",
};

function jsonResponse(data: unknown, ok = true, status = 200) {
  return { ok, status, json: vi.fn().mockResolvedValue(data) };
}

function StateProbe() {
  const state = useAppState();
  const currentQuote = useQuote();

  return (
    <div>
      <span data-testid="rates-error">{state.ratesError}</span>
      <span data-testid="quote-error">{currentQuote.error}</span>
      <span data-testid="quote-loading">{String(currentQuote.loading)}</span>
      <span data-testid="quote-rate">{currentQuote.quote?.rate ?? "none"}</span>
      <button type="button" onClick={() => state.setAmount("200")}>
        Change amount
      </button>
      <button type="button" onClick={() => state.setAmount("invalid")}>
        Set invalid amount
      </button>
    </div>
  );
}

async function flushPromises() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
  });
}

function renderProvider() {
  return render(
    <AppStateProvider>
      <StateProbe />
    </AppStateProvider>,
  );
}

afterEach(() => {
  vi.useRealTimers();
});

describe("AppStateProvider", () => {
  it("loads currencies and exposes a quote only while its request matches current state", async () => {
    vi.useFakeTimers();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(rates))
      .mockResolvedValueOnce(jsonResponse(quote));
    vi.stubGlobal("fetch", fetchMock);

    renderProvider();
    await flushPromises();
    expect(screen.getByTestId("quote-loading")).toHaveTextContent("true");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(screen.getByTestId("quote-rate")).toHaveTextContent("1.25");

    fireEvent.click(screen.getByRole("button", { name: "Change amount" }));
    expect(screen.getByTestId("quote-rate")).toHaveTextContent("none");
  });

  it("reports an HTTP error while loading currencies", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({}, false, 503)));

    renderProvider();
    await flushPromises();

    expect(screen.getByTestId("rates-error")).toHaveTextContent("Failed to load rates: 503");
  });

  it("rejects a rates response without enough currencies", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ currencies: ["EUR"] })));

    renderProvider();
    await flushPromises();

    expect(screen.getByTestId("rates-error")).toHaveTextContent(
      "Rates response must include at least two currencies",
    );
  });

  it("does not request a quote for an invalid amount", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(rates)));

    renderProvider();
    await flushPromises();
    fireEvent.click(screen.getByRole("button", { name: "Set invalid amount" }));

    expect(screen.getByTestId("quote-error")).toHaveTextContent("Enter a valid amount.");
  });

  it("rejects a malformed quote response", async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(jsonResponse(rates))
        .mockResolvedValueOnce(jsonResponse({ ...quote, rate: "not-a-rate" })),
    );

    renderProvider();
    await flushPromises();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    expect(screen.getByTestId("quote-error")).toHaveTextContent("Quote response is invalid");
    expect(screen.getByTestId("quote-rate")).toHaveTextContent("none");
  });

  it("does not send an obsolete quote request after the amount changes during debounce", async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(rates));
    vi.stubGlobal("fetch", fetchMock);

    renderProvider();
    await flushPromises();
    fireEvent.click(screen.getByRole("button", { name: "Change amount" }));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][1]).toMatchObject({
      body: JSON.stringify({ from: "EUR", to: "USD", amount: 200 }),
    });
  });
});
