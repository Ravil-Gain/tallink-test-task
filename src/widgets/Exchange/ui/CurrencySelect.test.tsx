import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CurrencySelect from "./CurrencySelect";

describe("CurrencySelect", () => {
  it("shows available currencies and reports the selected value", () => {
    const onChange = vi.fn();

    render(
      <CurrencySelect
        label="From currency"
        testId="from-currency"
        value="EUR"
        currencies={["EUR", "USD"]}
        onChange={onChange}
      />,
    );

    const select = screen.getByRole("combobox", { name: "From currency" });
    expect(select).toHaveValue("EUR");
    expect(screen.getAllByRole("option")).toHaveLength(2);

    fireEvent.change(select, { target: { value: "USD" } });

    expect(onChange).toHaveBeenCalledWith("USD");
  });
});
