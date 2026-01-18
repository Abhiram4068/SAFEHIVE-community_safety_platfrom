import { Navbar } from '@/src/components/Navbar';
import { Sidebar } from '@/src/components/SidebarLeft';
import { RightSidebar } from '@/src/components/SidebarRight';
import { requireAuth } from "@/src/lib/auth";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth(["user"]);

  return (
    <div className="bg-[#0B0D10] text-[#D1D5DB] min-h-screen antialiased">
      <Navbar user={user} />

      <main className="max-w-[1600px] w-full mx-auto flex pt-4 px-18 border-x border-[#1F2228]">

        {/* Left Sidebar */}
        <Sidebar user={user} />

        {/* Main Content */}
        <section className="flex-1 min-w-0 pb-10">
          {children}
        </section>

        {/* Right Sidebar */}
       

      </main>
    </div>
  );
}
