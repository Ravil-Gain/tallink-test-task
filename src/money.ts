const currency = new RegExp(/[^\d.]/g); // pick everything ex numbers & dot
const moneyFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
});

export function parseStringAmount(value: string): number {
  const cleanedStrAmount = value.replace(currency, "");
  return parseFloat(cleanedStrAmount);
}

export function convert(amount: number, rate: string): number {
  const cleanedStrRate = rate.replace(currency, "");
  return amount * parseFloat(cleanedStrRate);
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
