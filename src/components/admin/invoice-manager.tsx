"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { BadgeCheck, Clock, Edit2 } from "lucide-react";
import { format } from "date-fns";
import type { Quotation } from "@/lib/types/database";

const STATUS_STYLES: Record<string, string> = {
  draft:    "text-white/40 bg-white/[0.05] border-white/[0.07]",
  sent:     "text-blue-400 bg-blue-400/10 border-blue-400/20",
  accepted: "text-green-400 bg-green-400/10 border-green-400/20",
  declined: "text-red-400 bg-red-400/10 border-red-400/20",
  invoiced: "text-[#FFD400] bg-[#FFD400]/10 border-[#FFD400]/20",
  paid:     "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
};

function fmt(n: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 0 }).format(n);
}

export function InvoiceManager({ initialInvoices }: { initialInvoices: Quotation[] }) {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [marking, setMarking] = useState<string | null>(null);

  const markPaid = async (id: string) => {
    setMarking(id);
    const supabase = createClient();
    const now = new Date().toISOString();
    const { data } = await supabase
      .from("quotations")
      .update({ status: "paid", paid_at: now })
      .eq("id", id)
      .select()
      .single();
    if (data) setInvoices((prev) => prev.map((inv) => inv.id === id ? data as Quotation : inv));
    setMarking(null);
  };

  if (invoices.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed border-white/[0.07] rounded-2xl">
        <Clock size={36} className="text-white/15 mx-auto mb-3" />
        <p className="text-white/30 text-sm">No invoices yet</p>
        <p className="text-white/20 text-xs mt-1">Create your first invoice to get started.</p>
      </div>
    );
  }

  const byStatus = {
    pending: invoices.filter((i) => ["draft","sent","accepted","invoiced"].includes(i.status)),
    paid:    invoices.filter((i) => i.status === "paid"),
    other:   invoices.filter((i) => i.status === "declined"),
  };

  return (
    <div className="space-y-6">
      {[
        { key: "pending", label: "Pending", items: byStatus.pending },
        { key: "paid",    label: "Paid",    items: byStatus.paid    },
        { key: "other",   label: "Declined", items: byStatus.other  },
      ].map(({ key, label, items }) =>
        items.length > 0 ? (
          <div key={key}>
            <h2 className="text-white/40 text-[10px] font-bold tracking-widest uppercase mb-3">{label} ({items.length})</h2>
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left px-5 py-3 text-white/30 text-xs uppercase tracking-wider">Invoice</th>
                    <th className="text-left px-5 py-3 text-white/30 text-xs uppercase tracking-wider hidden sm:table-cell">Client</th>
                    <th className="text-left px-5 py-3 text-white/30 text-xs uppercase tracking-wider">Status</th>
                    <th className="text-right px-5 py-3 text-white/30 text-xs uppercase tracking-wider">Amount</th>
                    <th className="text-right px-5 py-3 text-white/30 text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((inv) => (
                    <tr key={inv.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] group">
                      <td className="px-5 py-3.5">
                        <p className="text-white font-mono text-sm">{inv.quote_number}</p>
                        <p className="text-white/30 text-xs">{inv.issue_date}</p>
                      </td>
                      <td className="px-5 py-3.5 hidden sm:table-cell">
                        <p className="text-white/70 text-sm truncate max-w-[160px]">{inv.client_name || "—"}</p>
                        {inv.client_company && <p className="text-white/30 text-xs truncate max-w-[160px]">{inv.client_company}</p>}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-1 rounded-lg text-[11px] font-medium capitalize border ${STATUS_STYLES[inv.status] ?? STATUS_STYLES.draft}`}>
                          {inv.status}
                        </span>
                        {inv.paid_at && (
                          <p className="text-white/25 text-[10px] mt-1">
                            {format(new Date(inv.paid_at), "MMM d, yyyy")}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <span className={`font-bold text-sm ${inv.status === "paid" ? "text-emerald-400" : "text-white/60"}`}>
                          {inv.total_amount != null ? fmt(inv.total_amount, inv.currency) : "—"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          {inv.status !== "paid" && inv.status !== "declined" && (
                            <button
                              onClick={() => markPaid(inv.id)}
                              disabled={marking === inv.id}
                              title="Mark as paid"
                              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-400/10 text-emerald-400 text-xs font-medium hover:bg-emerald-400/20 transition-all disabled:opacity-40 whitespace-nowrap"
                            >
                              <BadgeCheck size={12} />
                              {marking === inv.id ? "…" : "Mark Paid"}
                            </button>
                          )}
                          <Link
                            href={`/studio/quotations/${inv.id}`}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.04] text-white/40 text-xs hover:text-white hover:bg-white/[0.08] transition-all"
                            title="Edit invoice"
                          >
                            <Edit2 size={11} /> Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null
      )}
    </div>
  );
}
