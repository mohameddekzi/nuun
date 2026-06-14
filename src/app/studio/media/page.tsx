import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminLayout } from "@/components/admin/admin-layout";
import { MediaLibrary } from "@/components/admin/media-library";

export default async function MediaAdminPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/studio/login");

  return (
    <AdminLayout>
      <div className="p-8">
        <MediaLibrary userId={user.id} />
      </div>
    </AdminLayout>
  );
}
