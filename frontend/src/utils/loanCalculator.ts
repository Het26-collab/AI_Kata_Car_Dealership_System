export type CreditTier = "prime" | "preferred" | "standard" | "subprime";

export const APR_BY_CREDIT_TIER: Record<CreditTier, number> = {
  prime: 5.9,
  preferred: 7.9,
  standard: 10.9,
  subprime: 15.9,
};

export interface LoanCalculationResult {
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
  apr: number;
  principal: number;
}

export function calculateLoanPayment({
  vehiclePrice,
  downPayment = 0,
  termMonths = 60,
  creditTier = "prime",
  tradeInValue = 0,
}: {
  vehiclePrice: number;
  downPayment?: number;
  termMonths?: number;
  creditTier?: CreditTier;
  tradeInValue?: number;
}): LoanCalculationResult {
  const price = Number(vehiclePrice) || 0;
  const down = Number(downPayment) || 0;
  const tradeIn = Number(tradeInValue) || 0;
  const n = Number(termMonths) || 60;

  const principal = Math.max(0, price - down - tradeIn);
  const apr = APR_BY_CREDIT_TIER[creditTier] ?? APR_BY_CREDIT_TIER.prime;

  if (principal === 0 || n <= 0) {
    return {
      monthlyPayment: 0,
      totalPaid: 0,
      totalInterest: 0,
      apr,
      principal: 0,
    };
  }

  const r = (apr / 100) / 12;

  let monthlyPayment = 0;
  if (r === 0) {
    monthlyPayment = principal / n;
  } else {
    monthlyPayment = (principal * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
  }

  const roundedMonthly = Math.round(monthlyPayment * 100) / 100;
  const totalPaid = Math.round(roundedMonthly * n * 100) / 100;
  const totalInterest = Math.round(Math.max(0, totalPaid - principal) * 100) / 100;

  return {
    monthlyPayment: roundedMonthly,
    totalPaid,
    totalInterest,
    apr,
    principal: Math.round(principal * 100) / 100,
  };
}
