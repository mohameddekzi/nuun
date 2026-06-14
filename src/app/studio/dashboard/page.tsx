import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminLayout } from "@/components/admin/admin-layout";
import { DashboardContent } from "@/components/admin/dashboard-content";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/studio/login");

  const [
    { count: services },
    { count: projects },
    { count: messages },
    { count: blog },
    { count: subscribers },
    { count: quotations },
    { count: teamMembers },
    { data: recentMessages },
    { data: recentQuotations },
  ] = await Promise.all([
    supabase.from("services").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("projects").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("is_read", false),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("subscribers").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("quotations").select("*", { count: "exact", head: true }),
    supabase.from("team_members").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(5),
    supabase.from("quotations").select("id, quote_number, client_name, status, type, created_at").order("created_at", { ascending: false }).limit(4),
  ]);

  const stats = {
    services: services ?? 0,
    projects: projects ?? 0,
    unreadMessages: messages ?? 0,
    publishedPosts: blog ?? 0,
    subscribers: subscribers ?? 0,
    quotations: quotations ?? 0,
    teamMembers: teamMembers ?? 0,
  };

  return (
    <AdminLayout>
      <DashboardContent
        stats={stats}
        recentMessages={recentMessages ?? []}
        recentQuotations={recentQuotations ?? []}
        user={user}
      />
    </AdminLayout>
  );
}
