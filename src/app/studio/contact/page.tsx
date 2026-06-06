import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminLayout } from "@/components/admin/admin-layout";
import { ContactManager } from "@/components/admin/contact-manager";

export default async function ContactAdminPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/studio/login");

  const { data: messages } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });

  return (
    <AdminLayout>
      <div className="p-8">
        <ContactManager initialMessages={messages ?? []} />
      </div>
    </AdminLayout>
  );
}
