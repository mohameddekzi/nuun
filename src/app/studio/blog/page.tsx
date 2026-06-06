import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminLayout } from "@/components/admin/admin-layout";
import { BlogManager } from "@/components/admin/blog-manager";

export default async function BlogAdminPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/studio/login");

  const [{ data: posts }, { data: categories }] = await Promise.all([
    supabase.from("blog_posts").select("*, blog_categories(name)").order("created_at", { ascending: false }),
    supabase.from("blog_categories").select("*"),
  ]);

  return (
    <AdminLayout>
      <div className="p-8">
        <BlogManager initialPosts={posts ?? []} categories={categories ?? []} />
      </div>
    </AdminLayout>
  );
}
