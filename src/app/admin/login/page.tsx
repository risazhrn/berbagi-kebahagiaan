import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminLoginForm from "./admin-login-form";

export default async function AdminLoginPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: admin } = await supabase
      .from("admins")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (admin) {
      redirect("/admin/dashboard");
    }
  }

  return <AdminLoginForm />;
}