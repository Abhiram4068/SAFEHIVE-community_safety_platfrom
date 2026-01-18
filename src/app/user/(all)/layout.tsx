import { Navbar } from '@/src/components/Navbar';
import { Sidebar } from '@/src/components/SidebarLeft';
import { RightSidebar } from '@/src/components/SidebarRight';
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
        
        {/* Left Sidebar */}
        <div className="hidden lg:block w-[280px] shrink-0">
          <Sidebar user={user} />
        </div>

        {/* Middle */}
        <section className="flex-1 max-w-[740px] min-w-0 pb-10">
          {children}
        </section>

        {/* Right Sidebar */}
        <div className="hidden xl:block w-[320px] shrink-0">
          <RightSidebar />
        </div>

      </main>
    </div>
  );
}
