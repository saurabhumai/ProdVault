export function formatINRFromCents(amountCents: number): string {
  const value = amountCents / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}
