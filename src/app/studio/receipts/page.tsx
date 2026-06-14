import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/admin-layout";
import { BadgeCheck, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";
import type { Quotation } from "@/lib/types/database";

function fmt(n: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 2 }).format(n);
}

export default async function ReceiptsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/studio/login");

  const { data } = await supabase
    .from("quotations")
    .select("*")
    .eq("type", "invoice")
    .eq("status", "paid")
    .order("paid_at", { ascending: false });

  const receipts: Quotation[] = data ?? [];
  const totalRevenue = receipts.reduce((s, r) => s + (r.total_amount ?? 0), 0);

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">Receipts</h1>
            <p className="text-white/40 text-sm mt-1">Paid invoices — {receipts.length} receipt{receipts.length !== 1 ? "s" : ""}</p>
          </div>
          {receipts.length > 0 && (
            <div className="text-right">
              <p className="text-white/30 text-xs uppercase tracking-wider mb-0.5">Total Collected</p>
              <p className="text-[#FFD400] font-black text-xl">{fmt(totalRevenue)}</p>
            </div>
          )}
        </div>

        {receipts.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-white/[0.07] rounded-2xl">
            <BadgeCheck size={40} className="text-white/15 mx-auto mb-4" />
            <p className="text-white/30 text-sm mb-1">No receipts yet</p>
            <p className="text-white/20 text-xs">Receipts appear here when invoices are marked as paid.</p>
            <Link href="/studio/invoices" className="inline-flex items-center gap-1.5 mt-4 text-[#FFD400] text-xs hover:underline">
              View Invoices <ArrowUpRight size={11} />
            </Link>
          </div>
        ) : (
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left px-5 py-3.5 text-white/30 text-xs uppercase tracking-wider">Receipt #</th>
                  <th className="text-left px-5 py-3.5 text-white/30 text-xs uppercase tracking-wider">Client</th>
                  <th className="text-left px-5 py-3.5 text-white/30 text-xs uppercase tracking-wider hidden sm:table-cell">Paid On</th>
                  <th className="text-right px-5 py-3.5 text-white/30 text-xs uppercase tracking-wider">Amount</th>
                  <th className="text-right px-5 py-3.5 text-white/30 text-xs uppercase tracking-wider">View</th>
                </tr>
              </thead>
              <tbody>
                {receipts.map((r) => (
                  <tr key={r.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-emerald-400/10 flex items-center justify-center flex-shrink-0">
                          <BadgeCheck size={12} className="text-emerald-400" />
                        </div>
                        <span className="text-white font-mono text-sm">{r.quote_number}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-white text-sm font-medium">{r.client_name || "—"}</p>
                      {r.client_company && <p className="text-white/35 text-xs">{r.client_company}</p>}
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className="text-white/50 text-sm">
                        {r.paid_at
                          ? format(new Date(r.paid_at), "MMM d, yyyy")
                          : format(new Date(r.updated_at), "MMM d, yyyy")}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="text-emerald-400 font-bold text-sm">
                        {r.total_amount != null ? fmt(r.total_amount, r.currency) : "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/studio/quotations/${r.id}`}
                        className="text-[#FFD400] text-xs hover:underline opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1"
                      >
                        View <ArrowUpRight size={10} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Summary footer */}
            <div className="px-5 py-4 border-t border-white/[0.06] flex items-center justify-between bg-white/[0.02]">
              <span className="text-white/40 text-sm">{receipts.length} paid receipt{receipts.length !== 1 ? "s" : ""}</span>
              <span className="text-white font-bold text-sm">{fmt(totalRevenue)}</span>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
