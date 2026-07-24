import { describe, expect, it } from "vitest";
import { calculateLoanPayment } from "../src/utils/loanCalculator.js";

describe("calculateLoanPayment Unit Tests", () => {
  it("calculates correct monthly payment for each of the 4 credit tiers at fixed price/term", () => {
    // vehiclePrice = 30000, downPayment = 5000, termMonths = 60
    // Principal = 25000

    // Prime (5.9%)
    const prime = calculateLoanPayment({
      vehiclePrice: 30000,
      downPayment: 5000,
      termMonths: 60,
      creditTier: "prime",
    });
    expect(prime.apr).toBe(5.9);
    expect(prime.principal).toBe(25000);
    expect(prime.monthlyPayment).toBe(482.16);
    expect(prime.totalPaid).toBe(28929.6);
    expect(prime.totalInterest).toBe(3929.6);

    // Preferred (7.9%)
    const preferred = calculateLoanPayment({
      vehiclePrice: 30000,
      downPayment: 5000,
      termMonths: 60,
      creditTier: "preferred",
    });
    expect(preferred.apr).toBe(7.9);
    expect(preferred.monthlyPayment).toBe(505.71);

    // Standard (10.9%)
    const standard = calculateLoanPayment({
      vehiclePrice: 30000,
      downPayment: 5000,
      termMonths: 60,
      creditTier: "standard",
    });
    expect(standard.apr).toBe(10.9);
    expect(standard.monthlyPayment).toBe(542.31);

    // Subprime (15.9%)
    const subprime = calculateLoanPayment({
      vehiclePrice: 30000,
      downPayment: 5000,
      termMonths: 60,
      creditTier: "subprime",
    });
    expect(subprime.apr).toBe(15.9);
    expect(subprime.monthlyPayment).toBe(606.62);
  });

  it("reduces principal when tradeInValue is provided", () => {
    const res = calculateLoanPayment({
      vehiclePrice: 30000,
      downPayment: 5000,
      tradeInValue: 5000,
      termMonths: 60,
      creditTier: "prime",
    });
    // Principal = 30000 - 5000 - 5000 = 20000
    expect(res.principal).toBe(20000);
    expect(res.monthlyPayment).toBe(385.73);
  });

  it("floors principal at 0 when down payment + trade-in exceeds vehicle price", () => {
    const res = calculateLoanPayment({
      vehiclePrice: 20000,
      downPayment: 15000,
      tradeInValue: 10000,
      termMonths: 36,
      creditTier: "prime",
    });
    expect(res.principal).toBe(0);
    expect(res.monthlyPayment).toBe(0);
    expect(res.totalPaid).toBe(0);
    expect(res.totalInterest).toBe(0);
  });

  it("produces different monthly payments for each of the 5 term lengths (24, 36, 48, 60, 72)", () => {
    const terms = [24, 36, 48, 60, 72];
    const results = terms.map((termMonths) =>
      calculateLoanPayment({
        vehiclePrice: 40000,
        downPayment: 5000,
        termMonths,
        creditTier: "preferred",
      })
    );

    // Ensure all 5 payments are unique and decreasing as term increases
    const payments = results.map((r) => r.monthlyPayment);
    expect(new Set(payments).size).toBe(5);
    expect(payments[0]).toBeGreaterThan(payments[1]); // 24m > 36m
    expect(payments[1]).toBeGreaterThan(payments[2]); // 36m > 48m
    expect(payments[2]).toBeGreaterThan(payments[3]); // 48m > 60m
    expect(payments[3]).toBeGreaterThan(payments[4]); // 60m > 72m
  });
});
