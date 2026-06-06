import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminLayout } from "@/components/admin/admin-layout";
import { PortfolioManager } from "@/components/admin/portfolio-manager";

export default async function PortfolioAdminPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/studio/login");

  const [{ data: projects }, { data: categories }] = await Promise.all([
    supabase.from("projects").select("*, project_categories(name)").order("order_index"),
    supabase.from("project_categories").select("*"),
  ]);

  return (
    <AdminLayout>
      <div className="p-8">
        <PortfolioManager initialProjects={projects ?? []} categories={categories ?? []} />
      </div>
    </AdminLayout>
  );
}
