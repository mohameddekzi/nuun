import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Receipt, Plus } from "lucide-react";
import { InvoiceManager } from "@/components/admin/invoice-manager";
import type { Quotation } from "@/lib/types/database";

export default async function InvoicesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/studio/login");

  const { data } = await supabase
    .from("quotations")
    .select("*")
    .eq("type", "invoice")
    .order("created_at", { ascending: false });

  const invoices: Quotation[] = data ?? [];

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">Invoices</h1>
            <p className="text-white/40 text-sm mt-1">{invoices.length} invoice{invoices.length !== 1 ? "s" : ""} total</p>
          </div>
          <Link
            href="/studio/quotations/new?type=invoice"
            className="flex items-center gap-2 px-4 py-2 bg-[#FFD400] text-[#0A0A0A] rounded-xl text-sm font-semibold hover:bg-[#FFD400]/90 transition-all"
          >
            <Plus size={14} /> New Invoice
          </Link>
        </div>

        <InvoiceManager initialInvoices={invoices} />
      </div>
    </AdminLayout>
  );
}
