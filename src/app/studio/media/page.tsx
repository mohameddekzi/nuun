import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminLayout } from "@/components/admin/admin-layout";
import { MediaLibrary } from "@/components/admin/media-library";

export default async function MediaAdminPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/studio/login");

  const { data: media } = await supabase.from("media").select("*").order("created_at", { ascending: false });

  return (
    <AdminLayout>
      <div className="p-8">
        <MediaLibrary initialMedia={media ?? []} userId={user.id} />
      </div>
    </AdminLayout>
  );
}
