import { Navbar } from '@/src/components/Navbar';
import { Sidebar } from '@/src/components/SidebarLeft';

import { RightSidebar } from '@/src/components/SidebarRight';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
       <div className="bg-[#0B0D10] text-[#D1D5DB] min-h-screen antialiased">
         <Navbar />
         
         {/* CHANGE: Added 'px-6' (or 'px-10' for more space) to the main tag.
             This pushes both sidebars away from the very edges of the screen/container.
         */}
         <main className="max-w-[1600px] w-full mx-auto flex pt-4 px-18 border-x border-[#1F2228]">
           
           {/* Left Sidebar */}
           <Sidebar />

           {children}
           {/* Right Sidebar */}
           <RightSidebar />
           
         </main>
       </div>


  );
}
