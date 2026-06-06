import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminLayout } from "@/components/admin/admin-layout";
import { TeamManager } from "@/components/admin/team-manager";

export default async function TeamAdminPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/studio/login");

  const { data: team } = await supabase.from("team_members").select("*").order("order_index");

  return (
    <AdminLayout>
      <div className="p-8">
        <TeamManager initialTeam={team ?? []} />
      </div>
    </AdminLayout>
  );
}
