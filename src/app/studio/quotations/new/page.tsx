import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminLayout } from "@/components/admin/admin-layout";
import { QuotationBuilder } from "@/components/admin/quotation-builder";

export default async function NewQuotationPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/studio/login");

  const { type } = await searchParams;

  return (
    <AdminLayout>
      <div className="p-8">
        <QuotationBuilder userId={user.id} initialType={type === "invoice" ? "invoice" : "quotation"} />
      </div>
    </AdminLayout>
  );
}
