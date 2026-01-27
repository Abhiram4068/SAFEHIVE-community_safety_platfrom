import { requireAuth } from "@/src/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth(["admin"]);
  return <>{children}</>;
}