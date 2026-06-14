import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Plus, FileText, Receipt } from "lucide-react";
import type { Quotation } from "@/lib/types/database";

const STATUS_STYLES: Record<string, string> = {
  draft:    "text-white/40 bg-white/5",
  sent:     "text-blue-400 bg-blue-400/10",
  accepted: "text-green-400 bg-green-400/10",
  declined: "text-red-400 bg-red-400/10",
  invoiced: "text-[#FFD400] bg-[#FFD400]/10",
  paid:     "text-emerald-400 bg-emerald-400/10",
};

export default async function QuotationsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/studio/login");

  const { data: quotations } = await supabase
    .from("quotations")
    .select("*")
    .order("created_at", { ascending: false });

  const list: Quotation[] = quotations ?? [];
  const invoices = list.filter((q) => q.type === "invoice");
  const quotes = list.filter((q) => q.type === "quotation");

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-white">Quotations &amp; Invoices</h1>
            <p className="text-white/40 text-sm mt-1">{list.length} document{list.length !== 1 ? "s" : ""} total</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/studio/quotations/new?type=quotation"
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white/70 text-sm hover:text-white hover:bg-white/10 transition-all"
            >
              <FileText size={14} /> New Quotation
            </Link>
            <Link
              href="/studio/quotations/new?type=invoice"
              className="flex items-center gap-2 px-4 py-2 bg-[#FFD400] text-[#0A0A0A] rounded-xl text-sm font-semibold hover:bg-[#FFD400]/90 transition-all"
            >
              <Receipt size={14} /> New Invoice
            </Link>
          </div>
        </div>

        {list.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-2xl">
            <FileText size={40} className="text-white/20 mx-auto mb-4" />
            <p className="text-white/40 text-sm mb-2">No quotations or invoices yet</p>
            <p className="text-white/20 text-xs">Create your first document to get started</p>
          </div>
        ) : (
          <div className="space-y-8">
            {[
              { label: "Quotations", items: quotes, icon: FileText },
              { label: "Invoices", items: invoices, icon: Receipt },
            ].map(({ label, items, icon: Icon }) =>
              items.length > 0 ? (
                <div key={label}>
                  <h2 className="text-[#FFD400] text-xs font-bold tracking-widest uppercase mb-3 flex items-center gap-2">
                    <Icon size={12} /> {label}
                  </h2>
                  <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/[0.06]">
                          <th className="text-left px-5 py-3 text-white/40 text-xs font-medium uppercase tracking-wider">Number</th>
                          <th className="text-left px-5 py-3 text-white/40 text-xs font-medium uppercase tracking-wider">Client</th>
                          <th className="text-left px-5 py-3 text-white/40 text-xs font-medium uppercase tracking-wider">Date</th>
                          <th className="text-left px-5 py-3 text-white/40 text-xs font-medium uppercase tracking-wider">Status</th>
                          <th className="text-right px-5 py-3 text-white/40 text-xs font-medium uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((q) => (
                          <tr key={q.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] group">
                            <td className="px-5 py-3 text-white text-sm font-mono font-medium">{q.quote_number}</td>
                            <td className="px-5 py-3">
                              <div className="text-white text-sm font-medium">{q.client_name || "—"}</div>
                              {q.client_company && <div className="text-white/40 text-xs">{q.client_company}</div>}
                            </td>
                            <td className="px-5 py-3 text-white/50 text-xs">{q.issue_date}</td>
                            <td className="px-5 py-3">
                              <span className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${STATUS_STYLES[q.status] ?? "text-white/40 bg-white/5"}`}>
                                {q.status}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-right">
                              <Link
                                href={`/studio/quotations/${q.id}`}
                                className="text-[#FFD400] text-xs hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                Edit →
                              </Link>
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
        )}
      </div>
    </AdminLayout>
  );
}
