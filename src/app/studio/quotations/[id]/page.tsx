import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { AdminLayout } from "@/components/admin/admin-layout";
import { QuotationBuilder } from "@/components/admin/quotation-builder";

export default async function EditQuotationPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/studio/login");

  const { id } = await params;

  const [{ data: quotation }, { data: items }] = await Promise.all([
    supabase.from("quotations").select("*").eq("id", id).single(),
    supabase.from("quotation_items").select("*").eq("quotation_id", id).order("order_index"),
  ]);

  if (!quotation) notFound();

  return (
    <AdminLayout>
      <div className="p-8">
        <QuotationBuilder quotation={quotation} items={items ?? []} userId={user.id} />
      </div>
    </AdminLayout>
  );
}
