import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import QuoteStatus from "./QuoteStatus";

const quote = {
  amount: 100,
  rate: "1.25",
  createdAt: "2026-10-07T12:34:56.000Z",
};

function renderStatus(overrides: Partial<React.ComponentProps<typeof QuoteStatus>> = {}) {
  return render(
    <QuoteStatus
      ratesLoading={false}
      ratesError={null}
      loading={false}
      error={null}
      quote={null}
      onRefresh={vi.fn()}
      {...overrides}
    />,
  );
}

describe("QuoteStatus", () => {
  it.each([
    [{ ratesLoading: true }, "Loading currencies…"],
    [{ ratesError: "Rates unavailable" }, "Rates unavailable"],
    [{ loading: true }, "Loading…"],
    [{ error: "Quote unavailable" }, "Quote unavailable"],
  ])("shows the appropriate status", (overrides, message) => {
    renderStatus(overrides);
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it("shows quote time and refreshes on request", () => {
    const onRefresh = vi.fn();
    renderStatus({ quote, onRefresh });

    expect(screen.getByTestId("updated-at")).toHaveTextContent("12:34:56");
    fireEvent.click(screen.getByTestId("refresh"));
    expect(onRefresh).toHaveBeenCalledOnce();
  });

  it("does not show a time when there is no quote", () => {
    renderStatus();

    expect(screen.queryByTestId("updated-at")).not.toBeInTheDocument();
  });
});
