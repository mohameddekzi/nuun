"use client";

import { useRef } from "react";
import { X, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PreviewProps {
  form: {
    type: string;
    status: string;
    client_name: string;
    client_email: string;
    client_phone: string;
    client_company: string;
    client_address: string;
    issue_date: string;
    due_date: string;
    currency: string;
    discount_type: string;
    discount_value: number;
    tax_rate: number;
    notes: string;
    terms: string;
    footer_text: string;
  };
  lineItems: { id: string; description: string; quantity: number; unit_price: number }[];
  quoteNumber: string;
  subtotal: number;
  discountAmt: number;
  taxAmt: number;
  total: number;
  onClose: () => void;
}

export function QuotationPreview({ form, lineItems, quoteNumber, subtotal, discountAmt, taxAmt, total, onClose }: PreviewProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const fmt = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const docTitle = form.type === "invoice" ? "INVOICE" : "QUOTATION";

  const handlePrint = () => {
    if (!printRef.current) return;
    const content = printRef.current.innerHTML;
    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${docTitle} ${quoteNumber}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1a1a1a; background: #fff; }
            @page { margin: 20mm; }
            @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
          </style>
        </head>
        <body>${content}</body>
        <script>window.onload = () => { window.print(); window.close(); }<\/script>
      </html>
    `);
    win.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0F0F0F] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
          <h2 className="text-white font-bold">{docTitle} Preview</h2>
          <div className="flex items-center gap-2">
            <Button size="sm" className="gap-2 text-xs" onClick={handlePrint}>
              <Printer size={13} /> Print / Save PDF
            </Button>
            <button onClick={onClose} className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="overflow-y-auto flex-1 p-6">
          <div ref={printRef} style={{
            background: "#ffffff",
            color: "#1a1a1a",
            padding: "48px",
            maxWidth: "800px",
            margin: "0 auto",
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            fontSize: "14px",
            lineHeight: "1.6",
          }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px" }}>
              <div>
                <div style={{ fontSize: "28px", fontWeight: "900", color: "#1a1a1a", letterSpacing: "-0.5px" }}>
                  NUUN <span style={{ color: "#C49A00" }}>MEDIA</span>
                </div>
                <div style={{ color: "#666", fontSize: "13px", marginTop: "4px" }}>KM5 Zoobe, Mogadishu, Somalia</div>
                <div style={{ color: "#666", fontSize: "13px" }}>info@nuun.so · +252 61 4272760</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "32px", fontWeight: "900", color: "#1a1a1a", letterSpacing: "2px" }}>{docTitle}</div>
                <div style={{ color: "#999", fontSize: "13px", marginTop: "4px" }}>#{quoteNumber}</div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ borderTop: "3px solid #C49A00", marginBottom: "32px" }} />

            {/* Dates + Client */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginBottom: "32px" }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "#999", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
                  Bill To
                </div>
                {form.client_name && <div style={{ fontWeight: "700", fontSize: "16px" }}>{form.client_name}</div>}
                {form.client_company && <div style={{ color: "#555" }}>{form.client_company}</div>}
                {form.client_address && <div style={{ color: "#777", fontSize: "13px", marginTop: "4px", whiteSpace: "pre-line" }}>{form.client_address}</div>}
                {form.client_email && <div style={{ color: "#777", fontSize: "13px" }}>{form.client_email}</div>}
                {form.client_phone && <div style={{ color: "#777", fontSize: "13px" }}>{form.client_phone}</div>}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "#999", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
                  Details
                </div>
                <table style={{ marginLeft: "auto", fontSize: "13px", borderSpacing: "0 4px" }}>
                  <tbody>
                    <tr><td style={{ color: "#999", paddingRight: "16px" }}>Issue Date</td><td style={{ fontWeight: "600" }}>{form.issue_date}</td></tr>
                    {form.due_date && <tr><td style={{ color: "#999", paddingRight: "16px" }}>Due Date</td><td style={{ fontWeight: "600" }}>{form.due_date}</td></tr>}
                    <tr><td style={{ color: "#999", paddingRight: "16px" }}>Currency</td><td style={{ fontWeight: "600" }}>{form.currency}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Items table */}
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "24px" }}>
              <thead>
                <tr style={{ background: "#f5f5f0" }}>
                  <th style={{ textAlign: "left", padding: "12px 16px", fontSize: "11px", fontWeight: "700", color: "#999", textTransform: "uppercase", letterSpacing: "1px" }}>Description</th>
                  <th style={{ textAlign: "center", padding: "12px 16px", fontSize: "11px", fontWeight: "700", color: "#999", textTransform: "uppercase", letterSpacing: "1px", width: "80px" }}>Qty</th>
                  <th style={{ textAlign: "right", padding: "12px 16px", fontSize: "11px", fontWeight: "700", color: "#999", textTransform: "uppercase", letterSpacing: "1px", width: "120px" }}>Unit Price</th>
                  <th style={{ textAlign: "right", padding: "12px 16px", fontSize: "11px", fontWeight: "700", color: "#999", textTransform: "uppercase", letterSpacing: "1px", width: "120px" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.filter(i => i.description).map((item, idx) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #eee", background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={{ padding: "12px 16px" }}>{item.description}</td>
                    <td style={{ padding: "12px 16px", textAlign: "center", color: "#555" }}>{item.quantity}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right", color: "#555" }}>{form.currency} {fmt(item.unit_price)}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: "600" }}>{form.currency} {fmt(item.quantity * item.unit_price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "32px" }}>
              <table style={{ fontSize: "13px", borderSpacing: "0 6px", minWidth: "280px" }}>
                <tbody>
                  <tr>
                    <td style={{ color: "#999", paddingRight: "24px" }}>Subtotal</td>
                    <td style={{ textAlign: "right", fontWeight: "600" }}>{form.currency} {fmt(subtotal)}</td>
                  </tr>
                  {discountAmt > 0 && (
                    <tr>
                      <td style={{ color: "#999" }}>Discount ({form.discount_type === "percentage" ? `${form.discount_value}%` : "fixed"})</td>
                      <td style={{ textAlign: "right", color: "#e53e3e" }}>-{form.currency} {fmt(discountAmt)}</td>
                    </tr>
                  )}
                  {taxAmt > 0 && (
                    <tr>
                      <td style={{ color: "#999" }}>Tax ({form.tax_rate}%)</td>
                      <td style={{ textAlign: "right" }}>+{form.currency} {fmt(taxAmt)}</td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan={2}><div style={{ borderTop: "2px solid #C49A00", marginTop: "6px", marginBottom: "6px" }} /></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "800", fontSize: "16px" }}>Total</td>
                    <td style={{ textAlign: "right", fontWeight: "900", fontSize: "20px", color: "#C49A00" }}>{form.currency} {fmt(total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Notes & Terms */}
            {(form.notes || form.terms) && (
              <div style={{ display: "grid", gridTemplateColumns: form.notes && form.terms ? "1fr 1fr" : "1fr", gap: "24px", marginBottom: "24px" }}>
                {form.notes && (
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: "700", color: "#999", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>Notes</div>
                    <div style={{ color: "#555", fontSize: "13px", whiteSpace: "pre-line" }}>{form.notes}</div>
                  </div>
                )}
                {form.terms && (
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: "700", color: "#999", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>Terms & Conditions</div>
                    <div style={{ color: "#555", fontSize: "13px", whiteSpace: "pre-line" }}>{form.terms}</div>
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            {form.footer_text && (
              <div style={{ borderTop: "1px solid #eee", paddingTop: "20px", textAlign: "center", color: "#aaa", fontSize: "13px" }}>
                {form.footer_text}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
