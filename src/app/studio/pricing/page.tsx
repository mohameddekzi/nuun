import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminLayout } from "@/components/admin/admin-layout";
import { PricingManager } from "@/components/admin/pricing-manager";

export default async function PricingAdminPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/studio/login");

  const { data: plans } = await supabase.from("pricing_plans").select("*").order("order_index");

  return (
    <AdminLayout>
      <div className="p-8">
        <PricingManager initialPlans={plans ?? []} />
      </div>
    </AdminLayout>
  );
}
