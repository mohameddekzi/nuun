import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminLayout } from "@/components/admin/admin-layout";
import { FAQManager } from "@/components/admin/faq-manager";

export default async function FAQAdminPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/studio/login");

  const { data: faqs } = await supabase.from("faq").select("*").order("order_index");

  return (
    <AdminLayout>
      <div className="p-8">
        <FAQManager initialFaqs={faqs ?? []} />
      </div>
    </AdminLayout>
  );
}
