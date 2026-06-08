import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminLayout } from "@/components/admin/admin-layout";
import { ClientsManager } from "@/components/admin/clients-manager";

export default async function ClientsAdminPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/studio/login");

  const { data } = await supabase.from("settings").select("*").eq("key", "clients").single();

  let clients: import("@/components/sections/clients-section").ClientCompany[] = [];
  if (data?.value && Array.isArray(data.value)) {
    clients = data.value as typeof clients;
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <ClientsManager initialClients={clients} settingId={data?.id ?? null} />
      </div>
    </AdminLayout>
  );
}
