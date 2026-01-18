import { requireAuth } from "@/src/lib/auth";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth(["user"]);
  return <>{children}</>;
}