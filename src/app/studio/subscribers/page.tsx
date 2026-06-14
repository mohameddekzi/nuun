import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminLayout } from "@/components/admin/admin-layout";
import { SubscribersManager } from "@/components/admin/subscribers-manager";

export default async function SubscribersPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/studio/login");

  const { data: subscribers } = await supabase
    .from("subscribers")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <AdminLayout>
      <SubscribersManager initialSubscribers={subscribers ?? []} />
    </AdminLayout>
  );
}
