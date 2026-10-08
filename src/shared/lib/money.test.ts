import { describe, expect, it } from "vitest";
import { convert, formatMoney, parseStringAmount } from "./money";

describe("money", () => {
  describe("parseStringAmount", () => {
    it("parses a plain numeric string", () => {
      expect(parseStringAmount("1,000 eur")).toBe(1000);
      expect(parseStringAmount("1,000")).toBe(1000);
      expect(parseStringAmount("1,000.60")).toBe(1000.6);
      expect(parseStringAmount("42")).toBe(42);
    });

    it("handles various currency symbols and formats", () => {
      expect(parseStringAmount("$1,000.50")).toBe(1000.5);
      // Note: Our regex removes everything except digits and dots
      // So "€1.000,50" becomes "1.00050" (removing € and comma)
      expect(parseStringAmount("€1.000,50")).toBe(1.0005);
      expect(parseStringAmount("£1,000")).toBe(1000);
      expect(parseStringAmount("¥1000")).toBe(1000);
      expect(parseStringAmount("1000 USD")).toBe(1000);
    });

    it("handles edge cases", () => {
      expect(parseStringAmount("0")).toBe(0);
      expect(parseStringAmount("0.0")).toBe(0);
      expect(parseStringAmount(".5")).toBe(0.5);
      expect(parseStringAmount("1.")).toBe(1);
      expect(parseStringAmount("1,000,000")).toBe(1000000);
      expect(parseStringAmount("1,000,000.50")).toBe(1000000.5);
      // Negative numbers: the minus sign is removed by regex, so becomes positive
      expect(parseStringAmount("-1,000")).toBe(1000);
      expect(parseStringAmount("-1,000.50")).toBe(1000.5);
    });
  });

  describe("convert", () => {
    it("converts amount using rate", () => {
      expect(convert(250, "1.084300")).toBeCloseTo(271.075); // 250 * 1.0843 = 271.075
      expect(convert(100, "1.084300")).toBeCloseTo(108.43);
      expect(convert(0, "1.084300")).toBe(0);
      expect(convert(1, "0")).toBe(0);
      expect(convert(1, "1")).toBe(1);
    });

    it("handles rate with thousands separators", () => {
      expect(convert(100, "1,000")).toBe(100000); // 100 * 1000
      expect(convert(50, "2,000.50")).toBeCloseTo(100025); // 50 * 2000.5 = 100025
    });

    it("handles edge cases in rate", () => {
      expect(convert(100, ".5")).toBe(50); // 100 * 0.5
      expect(convert(100, "5.")).toBe(500); // 100 * 5
      // Multiple dots: parseFloat takes first dot, so "1.2.3" becomes 1.2
      expect(convert(100, "1.2.3")).toBeCloseTo(120); // 100 * 1.2
      // Negative rate: the minus is removed, so becomes positive
      expect(convert(100, "-1.5")).toBe(150); // 100 * 1.5
    });
  });

  describe("formatMoney", () => {
    it("formats a round amount without decimals", () => {
      expect(formatMoney(1000)).toBe("1,000");
      expect(formatMoney(0)).toBe("0");
      expect(formatMoney(1)).toBe("1");
      expect(formatMoney(1000000)).toBe("1,000,000");
    });

    it("formats amounts with decimal places", () => {
      expect(formatMoney(1000.0)).toBe("1,000");
      expect(formatMoney(1000.5)).toBe("1,000.5");
      expect(formatMoney(1000.5)).toBe("1,000.5");
      expect(formatMoney(1000.55)).toBe("1,000.55");
      expect(formatMoney(1000.555)).toBe("1,000.56"); // rounded to two decimal places
      expect(formatMoney(1000.556)).toBe("1,000.56");
      expect(formatMoney(1000.5555)).toBe("1,000.56");
    });

    it("formats negative amounts", () => {
      expect(formatMoney(-1000)).toBe("-1,000");
      expect(formatMoney(-1000.5)).toBe("-1,000.5");
      expect(formatMoney(-1000.55)).toBe("-1,000.55");
      expect(formatMoney(-0)).toBe("0"); // Note: -0 becomes 0
    });

    it("handles small decimal amounts", () => {
      expect(formatMoney(0.5)).toBe("0.5");
      expect(formatMoney(0.05)).toBe("0.05");
      expect(formatMoney(0.005)).toBe("0.01"); // rounded
      // Note: When we have .00 after trimming, we return just the integer part
      expect(formatMoney(0.004)).toBe("0"); // becomes 0 after toFixed(2) and trimming
      expect(formatMoney(0.006)).toBe("0.01"); // rounds to 0.01
    });
  });
});
