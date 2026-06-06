import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminLayout } from "@/components/admin/admin-layout";
import { TestimonialsManager } from "@/components/admin/testimonials-manager";

export default async function TestimonialsAdminPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/studio/login");

  const { data: testimonials } = await supabase.from("testimonials").select("*").order("order_index");

  return (
    <AdminLayout>
      <div className="p-8">
        <TestimonialsManager initialTestimonials={testimonials ?? []} />
      </div>
    </AdminLayout>
  );
}
