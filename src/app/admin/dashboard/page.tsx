
import { requireAdmin } from "@/lib/auth/admin";
import { logout } from "@/lib/auth/actions";

import DashboardShell from "@/components/admin/dashboard-shell";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  await requireAdmin();

  return <DashboardShell logoutAction={logout} />;
}