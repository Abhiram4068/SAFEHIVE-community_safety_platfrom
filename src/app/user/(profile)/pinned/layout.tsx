import { Navbar } from '@/src/components/Navbar';
import { Sidebar } from '@/src/components/SidebarLeft';
import { requireAuth } from "@/src/lib/auth";

export default async function AllLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth(["user"]);

  return (
    <div className="bg-[#0B0D10] text-[#D1D5DB] min-h-screen antialiased">
      <Navbar user={user} />

      <main className="max-w-[1600px] w-full mx-auto flex justify-center pt-4 px-4 sm:px-6 lg:px-18 gap-6">
        
        {/* Left Sidebar (unchanged) */}
        <div className="hidden lg:block w-[280px] shrink-0">
          <Sidebar user={user} />
        </div>

        {/* Center column expands to take right sidebar space */}
        <section className="flex-1 min-w-0 pb-10">
          {children}
        </section>

      </main>
    </div>
  );
}
