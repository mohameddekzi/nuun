import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "MISSING";
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("media")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) return NextResponse.json({ error: error.message, supabaseUrl }, { status: 500 });
    return NextResponse.json({ data: data ?? [], count: (data ?? []).length, supabaseUrl });
  } catch (e) {
    return NextResponse.json({ error: String(e), supabaseUrl }, { status: 500 });
  }
}
