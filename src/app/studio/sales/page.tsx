import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/admin-layout";
import { TrendingUp, FileText, Receipt, BadgeCheck, DollarSign, Clock, XCircle, ArrowUpRight } from "lucide-react";
import type { Quotation } from "@/lib/types/database";

function fmt(n: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 0 }).format(n);
}

const STATUS_BADGE: Record<string, string> = {
  draft:    "text-white/40 bg-white/[0.05]",
  sent:     "text-blue-400 bg-blue-400/10",
  accepted: "text-green-400 bg-green-400/10",
  declined: "text-red-400 bg-red-400/10",
  invoiced: "text-[#FFD400] bg-[#FFD400]/10",
  paid:     "text-emerald-400 bg-emerald-400/10",
};

export default async function SalesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/studio/login");

  const { data: all } = await supabase
    .from("quotations")
    .select("*")
    .order("created_at", { ascending: false });

  const docs: Quotation[] = all ?? [];

  const invoices  = docs.filter((d) => d.type === "invoice");
  const quotes    = docs.filter((d) => d.type === "quotation");
  const paid      = invoices.filter((d) => d.status === "paid");
  const pending   = invoices.filter((d) => ["sent", "accepted", "invoiced"].includes(d.status));
  const declined  = invoices.filter((d) => d.status === "declined");

  const totalRevenue  = paid.reduce((s, d) => s + (d.total_amount ?? 0), 0);
  const pendingValue  = pending.reduce((s, d) => s + (d.total_amount ?? 0), 0);
  const acceptedQuotes = quotes.filter((q) => q.status === "accepted").length;
  const convRate = quotes.length > 0 ? Math.round((acceptedQuotes / quotes.length) * 100) : 0;

  const statsCards = [
    { label: "Total Revenue",    value: fmt(totalRevenue),       sub: `${paid.length} paid invoice${paid.length !== 1 ? "s" : ""}`,  icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Pending Amount",   value: fmt(pendingValue),       sub: `${pending.length} awaiting payment`,                           icon: Clock,      color: "text-[#FFD400]",  bg: "bg-[#FFD400]/10"  },
    { label: "Total Invoices",   value: String(invoices.length), sub: `${declined.length} declined`,                                  icon: Receipt,    color: "text-blue-400",   bg: "bg-blue-400/10"   },
    { label: "Quote Conversion", value: `${convRate}%`,          sub: `${acceptedQuotes} of ${quotes.length} quotes accepted`,        icon: TrendingUp, color: "text-purple-400", bg: "bg-purple-400/10" },
  ];

  // Monthly breakdown of paid invoices
  const byMonth: Record<string, number> = {};
  for (const d of paid) {
    const month = (d.paid_at ?? d.issue_date).slice(0, 7); // YYYY-MM
    byMonth[month] = (byMonth[month] ?? 0) + (d.total_amount ?? 0);
  }
  const months = Object.entries(byMonth).sort(([a], [b]) => b.localeCompare(a)).slice(0, 6);

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">Sales Overview</h1>
            <p className="text-white/40 text-sm mt-1">Revenue and pipeline summary</p>
          </div>
          <div className="flex gap-2">
            <Link href="/studio/quotations/new?type=quotation" className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white/60 text-sm hover:text-white hover:bg-white/10 transition-all">
              <FileText size={13} /> New Quote
            </Link>
            <Link href="/studio/quotations/new?type=invoice" className="flex items-center gap-1.5 px-3 py-2 bg-[#FFD400] text-[#0A0A0A] rounded-xl text-sm font-semibold hover:bg-[#FFD400]/90 transition-all">
              <Receipt size={13} /> New Invoice
            </Link>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map(({ label, value, sub, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon size={16} className={color} />
              </div>
              <p className="text-white font-black text-xl mb-0.5">{value}</p>
              <p className="text-white/40 text-xs font-semibold">{label}</p>
              <p className="text-white/25 text-xs mt-1">{sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly revenue */}
          <div className="lg:col-span-1 bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
            <h2 className="text-white font-bold text-sm mb-4">Revenue by Month</h2>
            {months.length === 0 ? (
              <p className="text-white/25 text-sm text-center py-8">No paid invoices yet</p>
            ) : (
              <div className="space-y-3">
                {months.map(([month, amount]) => {
                  const pct = totalRevenue > 0 ? (amount / totalRevenue) * 100 : 0;
                  const [yr, mo] = month.split("-");
                  const label = new Date(Number(yr), Number(mo) - 1, 1).toLocaleString("default", { month: "short", year: "numeric" });
                  return (
                    <div key={month}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white/50 text-xs">{label}</span>
                        <span className="text-white text-xs font-semibold">{fmt(amount)}</span>
                      </div>
                      <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                        <div className="h-full bg-[#FFD400] rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent documents */}
          <div className="lg:col-span-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
              <h2 className="text-white font-bold text-sm">Recent Documents</h2>
              <Link href="/studio/invoices" className="text-[#FFD400] text-xs hover:underline flex items-center gap-1">
                All invoices <ArrowUpRight size={11} />
              </Link>
            </div>
            {docs.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-white/25 text-sm">No documents yet</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.04]">
                    <th className="text-left px-5 py-3 text-white/30 text-xs uppercase tracking-wider">Doc</th>
                    <th className="text-left px-5 py-3 text-white/30 text-xs uppercase tracking-wider hidden sm:table-cell">Client</th>
                    <th className="text-left px-5 py-3 text-white/30 text-xs uppercase tracking-wider">Status</th>
                    <th className="text-right px-5 py-3 text-white/30 text-xs uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {docs.slice(0, 8).map((d) => (
                    <tr key={d.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] group">
                      <td className="px-5 py-3">
                        <div className="font-mono text-white text-xs">{d.quote_number}</div>
                        <div className="text-white/30 text-[10px] capitalize">{d.type}</div>
                      </td>
                      <td className="px-5 py-3 hidden sm:table-cell">
                        <div className="text-white/70 text-sm truncate max-w-[140px]">{d.client_name || "—"}</div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium capitalize ${STATUS_BADGE[d.status] ?? "text-white/40 bg-white/5"}`}>
                          {d.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className="text-white/60 text-sm font-mono">
                          {d.total_amount != null ? fmt(d.total_amount, d.currency) : "—"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Pipeline */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Quotes Sent",   items: quotes.filter((q) => q.status === "sent"),     icon: FileText,  color: "text-blue-400"   },
            { label: "Invoices Due",  items: pending,                                         icon: Clock,     color: "text-[#FFD400]"  },
            { label: "Declined",      items: [...quotes, ...invoices].filter((d) => d.status === "declined"), icon: XCircle, color: "text-red-400" },
          ].map(({ label, items, icon: Icon, color }) => (
            <div key={label} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Icon size={14} className={color} />
                <span className="text-white/60 text-xs font-semibold uppercase tracking-wider">{label}</span>
                <span className="ml-auto text-white font-bold text-sm">{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.slice(0, 3).map((d) => (
                  <Link key={d.id} href={`/studio/quotations/${d.id}`} className="flex items-center justify-between hover:bg-white/5 px-2 py-1.5 rounded-lg transition-colors">
                    <div>
                      <p className="text-white/70 text-xs font-mono">{d.quote_number}</p>
                      <p className="text-white/35 text-[10px] truncate max-w-[120px]">{d.client_name}</p>
                    </div>
                    <ArrowUpRight size={11} className="text-white/20 group-hover:text-[#FFD400]" />
                  </Link>
                ))}
                {items.length === 0 && <p className="text-white/20 text-xs text-center py-2">None</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
