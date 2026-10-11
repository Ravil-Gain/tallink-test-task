import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Keypad from "./Keypad";

describe("Keypad UI", () => {
  it("shows exchange keys and reports key actions", () => {
    const onAction = vi.fn();
    render(<Keypad mode="exchange" onAction={onAction} />);

    expect(screen.getByRole("group", { name: "Exchange keypad" })).toBeInTheDocument();
    expect(screen.getByTestId("key-7")).toBeInTheDocument();
    expect(screen.getByTestId("key-up")).toBeDisabled();
    expect(screen.getByTestId("key-down")).toBeDisabled();
    expect(screen.getByTestId("key-ok")).toBeDisabled();
    fireEvent.click(screen.getByTestId("key-7"));

    expect(onAction).toHaveBeenCalledWith("7");
  });

  it("shows history navigation and disables amount keys", () => {
    const onAction = vi.fn();
    render(<Keypad mode="history" onAction={onAction} />);

    expect(screen.getByRole("group", { name: "History keypad" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous item" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Next item" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Confirm selection" })).toBeEnabled();
    expect(screen.getByTestId("key-up")).toBeEnabled();
    expect(screen.getByTestId("key-down")).toBeEnabled();
    expect(screen.getByTestId("key-ok")).toBeEnabled();
    expect(screen.getByTestId("key-7")).toBeDisabled();
    expect(screen.getByTestId("key-save")).toBeDisabled();

    fireEvent.click(screen.getByTestId("key-ok"));
    expect(onAction).toHaveBeenCalledWith("OK");
  });

  it("disables saving while the quote is unavailable", () => {
    render(<Keypad mode="exchange" onAction={vi.fn()} saveDisabled />);

    expect(screen.getByTestId("key-save")).toBeDisabled();
  });
});
