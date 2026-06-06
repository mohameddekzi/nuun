import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminLayout } from "@/components/admin/admin-layout";
import { ServicesManager } from "@/components/admin/services-manager";

export default async function ServicesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/studio/login");

  const { data: services } = await supabase.from("services").select("*").order("order_index");

  return (
    <AdminLayout>
      <div className="p-8">
        <ServicesManager initialServices={services ?? []} />
      </div>
    </AdminLayout>
  );
}
