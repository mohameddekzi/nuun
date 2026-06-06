import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminLayout } from "@/components/admin/admin-layout";
import { SettingsManager } from "@/components/admin/settings-manager";

export default async function SettingsAdminPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/studio/login");

  const { data: settings } = await supabase.from("settings").select("*").order("category");

  return (
    <AdminLayout>
      <div className="p-8">
        <SettingsManager initialSettings={settings ?? []} />
      </div>
    </AdminLayout>
  );
}
