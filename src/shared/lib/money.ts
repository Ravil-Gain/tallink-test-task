const nonNumericCharacters = /[^\d.,-]/g;
const amountPattern = /^-?(?:(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d*)?|\.\d+)$/;
const moneyFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function parseStringAmount(value: string): number {
  const cleanedAmount = value.replace(nonNumericCharacters, "");
  if (!amountPattern.test(cleanedAmount)) return Number.NaN;
  return Number(cleanedAmount.replace(/,/g, ""));
}

export function convert(amount: number, rate: string): number {
  return amount * parseStringAmount(rate);
}

export function formatMoney(value: number): string {
  // Use proper rounding (away from zero) instead of toFixed
  let roundedValue = Math.round(value * 100) / 100;
  // Handle negative zero
  if (Object.is(roundedValue, -0)) {
    roundedValue = 0;
  }
  return moneyFormatter.format(roundedValue);
}
