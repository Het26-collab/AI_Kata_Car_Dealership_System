import PDFDocument from "pdfkit";
import { calculateLoanPayment } from "../utils/loanCalculator.js";

/**
 * Generates a clean 1-page PDF financing quote buffer for a vehicle.
 *
 * @param {Object} vehicle
 * @param {Object} params
 * @param {number} [params.downPayment=0]
 * @param {number} [params.termMonths=60]
 * @param {string} [params.creditTier="prime"]
 * @param {number} [params.tradeInValue=0]
 * @returns {Promise<Buffer>}
 */
export function generatePdfQuote(
  vehicle,
  { downPayment = 0, termMonths = 60, creditTier = "prime", tradeInValue = 0 }
) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: "LETTER" });
      const buffers = [];

      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (err) => reject(err));

      const calc = calculateLoanPayment({
        vehiclePrice: vehicle.price,
        downPayment,
        termMonths,
        creditTier,
        tradeInValue,
      });

      // Header / Branding Placeholder
      doc.fillColor("#0F172A").fontSize(22).font("Helvetica-Bold").text("GLOBAL MOTORS PRO", 40, 40);
      doc.fillColor("#64748B").fontSize(10).font("Helvetica").text("Official Financing Estimate & Sales Quote", 40, 68);

      const timestamp = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      doc.fillColor("#64748B").fontSize(10).font("Helvetica").text(`Date: ${timestamp}`, 400, 40, { align: "right" });
      doc.fillColor("#64748B").fontSize(10).font("Helvetica").text("Quote Ref: Q-OFFICIAL", 400, 54, { align: "right" });

      doc.moveTo(40, 85).lineTo(572, 85).strokeColor("#CBD5E1").lineWidth(1).stroke();

      // Vehicle Information Section
      doc.fillColor("#0F172A").fontSize(14).font("Helvetica-Bold").text("Vehicle Specifications", 40, 105);

      const title = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim || ""}`.trim();
      doc.fillColor("#1E293B").fontSize(16).font("Helvetica-Bold").text(title, 40, 125);

      doc.fillColor("#475569").fontSize(10).font("Helvetica");
      doc.text(`Category: ${vehicle.category}`, 40, 148);
      doc.text(`VIN: ${vehicle.vin || "N/A"}`, 40, 162);
      doc.text(`MSRP / Price: $${Number(vehicle.price).toLocaleString("en-US")}`, 40, 176);

      doc.moveTo(40, 198).lineTo(572, 198).strokeColor("#E2E8F0").lineWidth(1).stroke();

      // Financing Breakdown Table
      doc.fillColor("#0F172A").fontSize(14).font("Helvetica-Bold").text("Payment Breakdown", 40, 218);

      const tableTop = 242;
      const rowHeight = 24;

      const rows = [
        ["Vehicle List Price", `$${Number(vehicle.price).toLocaleString("en-US")}`],
        ["Down Payment", `-$${Number(downPayment).toLocaleString("en-US")}`],
        ["Trade-in Allowance", `-$${Number(tradeInValue).toLocaleString("en-US")}`],
        ["Net Financed Principal", `$${calc.principal.toLocaleString("en-US")}`],
        ["Credit Tier", String(creditTier).toUpperCase()],
        ["Annual Percentage Rate (APR)", `${calc.apr}%`],
        ["Loan Term Length", `${termMonths} Months`],
        ["Est. Monthly Payment", `$${calc.monthlyPayment.toLocaleString("en-US")} / mo`],
        ["Total Interest Payable", `$${calc.totalInterest.toLocaleString("en-US")}`],
        ["Total Amount Paid Over Loan Term", `$${calc.totalPaid.toLocaleString("en-US")}`],
      ];

      rows.forEach(([label, val], idx) => {
        const y = tableTop + idx * rowHeight;
        if (idx % 2 === 0) {
          doc.rect(40, y, 532, rowHeight).fill("#F8FAFC");
        }

        const isHighlight = label.includes("Monthly Payment");
        doc
          .fillColor(isHighlight ? "#1E40AF" : "#334155")
          .fontSize(isHighlight ? 11 : 10)
          .font(isHighlight ? "Helvetica-Bold" : "Helvetica")
          .text(label, 50, y + 6);

        doc
          .fillColor(isHighlight ? "#1E40AF" : "#0F172A")
          .fontSize(isHighlight ? 11 : 10)
          .font(isHighlight ? "Helvetica-Bold" : "Helvetica")
          .text(val, 350, y + 6, { width: 210, align: "right" });
      });

      // Disclaimer Footer
      doc.moveTo(40, 510).lineTo(572, 510).strokeColor("#CBD5E1").lineWidth(1).stroke();
      doc
        .fillColor("#94A3B8")
        .fontSize(8)
        .font("Helvetica")
        .text(
          "Disclaimer: This estimate is for informational purposes only. Final credit terms are subject to approval.",
          40,
          525,
          { width: 532, align: "center" }
        );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
