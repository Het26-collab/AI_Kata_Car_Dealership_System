import { useState } from "react";
import type { Vehicle } from "../types/vehicle";
import { calculateLoanPayment, type CreditTier } from "../utils/loanCalculator";
import { vehicleService } from "../services/vehicleService";
import { formatCurrency } from "../utils/format";
import { Button } from "./Button";
import { Input } from "./Input";
import { Select } from "./Select";
import { useToast } from "../hooks/useToast";

interface FinancingQuotePanelProps {
  vehicle: Vehicle;
}

export function FinancingQuotePanel({ vehicle }: FinancingQuotePanelProps) {
  const [downPayment, setDownPayment] = useState<number>(Math.round(vehicle.price * 0.1));
  const [termMonths, setTermMonths] = useState<number>(60);
  const [creditTier, setCreditTier] = useState<CreditTier>("prime");
  const [tradeInValue, setTradeInValue] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const { showToast } = useToast();

  const calc = calculateLoanPayment({
    vehiclePrice: vehicle.price,
    downPayment,
    termMonths,
    creditTier,
    tradeInValue,
  });

  async function handleDownloadPdf() {
    setIsDownloading(true);
    try {
      await vehicleService.downloadQuote(vehicle.id, {
        downPayment,
        termMonths,
        creditTier,
        tradeInValue,
      });
      showToast({
        variant: "success",
        title: "PDF Quote Generated",
        description: "Your official financing quote has been downloaded.",
      });
    } catch (err) {
      showToast({
        variant: "error",
        title: "Download Failed",
        description: "Could not generate PDF quote at this time.",
      });
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="rounded-lg border border-outline-variant bg-surface-container-low p-md flex flex-col gap-md">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-title-md font-bold text-on-surface">Loan & Lease Estimator</h4>
          <p className="text-body-sm text-on-surface-variant">Customize your down payment, trade-in, and tier</p>
        </div>
        <div className="text-right">
          <p className="text-headline-sm font-bold text-primary" data-testid="monthly-payment-display">
            {formatCurrency(calc.monthlyPayment)}
            <span className="text-label-md font-normal text-on-surface-variant">/mo</span>
          </p>
          <p className="text-label-sm text-on-surface-variant">APR: {calc.apr}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
        <Input
          label="Down Payment ($)"
          type="number"
          min={0}
          value={downPayment}
          onChange={(e) => setDownPayment(Number(e.target.value) || 0)}
          data-testid="down-payment-input"
        />

        <Input
          label="Trade-in Value ($)"
          type="number"
          min={0}
          value={tradeInValue}
          onChange={(e) => setTradeInValue(Number(e.target.value) || 0)}
          data-testid="trade-in-input"
        />

        <Select
          label="Term Length"
          value={String(termMonths)}
          onChange={(e) => setTermMonths(Number(e.target.value))}
          data-testid="term-months-select"
        >
          <option value="24">24 Months</option>
          <option value="36">36 Months</option>
          <option value="48">48 Months</option>
          <option value="60">60 Months</option>
          <option value="72">72 Months</option>
        </Select>

        <Select
          label="Credit Tier"
          value={creditTier}
          onChange={(e) => setCreditTier(e.target.value as CreditTier)}
          data-testid="credit-tier-select"
        >
          <option value="prime">Prime (5.9% APR)</option>
          <option value="preferred">Preferred (7.9% APR)</option>
          <option value="standard">Standard (10.9% APR)</option>
          <option value="subprime">Subprime (15.9% APR)</option>
        </Select>
      </div>

      <div className="flex items-center justify-between pt-xs border-t border-outline-variant/60">
        <div className="text-body-xs text-on-surface-variant">
          Principal: {formatCurrency(calc.principal)} | Total Paid: {formatCurrency(calc.totalPaid)}
        </div>

        <Button
          onClick={handleDownloadPdf}
          disabled={isDownloading}
          data-testid="download-pdf-btn"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          {isDownloading ? "Generating PDF..." : "Download PDF Quote"}
        </Button>
      </div>
    </div>
  );
}
