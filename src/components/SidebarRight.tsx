"use client";
import Link from 'next/link';
import React, { useState, useEffect  } from 'react';
import { Plus, Megaphone, Bell, ChevronRight } from 'lucide-react'; // Changed icons
import { CreateCommunityModal } from './CreateCommunityModal';

export const RightSidebar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Updated data for Admin Announcements
const [adminAnnouncements, setAdminAnnouncements] = useState<any[]>([]);

  const frequentCategories = [
    { name: "Neighborhood Watch" },
    { name: "Lost & Found" },
  ];
useEffect(() => {
  async function fetchAnnouncements() {
    try {
      const res = await fetch("/api/admin/announcements/");
      const data = await res.json();

      // take only top 3
      setAdminAnnouncements(data.slice(0, 3));
    } catch (error) {
      console.error("Failed to fetch admin announcements", error);
    }
  }

  fetchAnnouncements();
}, []);
  return (
    <aside className="hidden xl:block w-80 pl-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto border-l border-[#1F2228] [scrollbar-width:none]">
      
      {/* HOME WIDGET */}
      <div className="bg-[#0B0D10] rounded-lg mb-4 border border-[#1F2228] p-4">
        <h3 className="text-white font-bold mb-2 ">Home</h3>
        <p className="text-[#838891] text-xs mb-4">
          Your personal SafeHive frontpage. Come here to check in with your favorite communities.
        </p>
        <div className="flex flex-col gap-2">
          <Link href="/user/incidents/">
            <button className="w-full bg-[#D7DADC] hover:bg-white text-black py-2 rounded-full font-bold text-sm transition">
              Create Post
            </button>
          </Link>
          <Link href="/user/createcommunity/">
          <button 
            
            className="w-full border border-[#343536] hover:bg-[#1A1D23] text-white py-2 rounded-full font-bold text-sm transition flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Community
          </button>
          </Link>
        </div>
      </div>

      {/* ADMIN ANNOUNCEMENTS SECTION */}
      <div className="bg-[#0B0D10] rounded-lg mb-4 border border-[#1F2228] overflow-hidden">
        <div className="p-4 flex items-center gap-2">
          <Megaphone size={16} className="text-red-500" />
          <h3 className="text-white font-bold text-sm uppercase tracking-wider">Admin Announcements</h3>
        </div>

        <div className="px-4">
          <div className="h-[1px] w-full bg-[#1F2228]" />
        </div>
        
        <div className="flex flex-col py-2">
          {adminAnnouncements.map((item, idx) => (
            <Link 
              key={idx} 
              href={`user/admin-announcements/`}
              className="px-4 py-2.5 hover:bg-[#1A1D23] transition flex items-center justify-between group"
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <div className={`w-1 h-3 rounded-full ${item.color} bg-current`} />
                  <span className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors">
  {item.title}
</span>

<span className="text-[10px] text-[#5c6066] ml-3">
  {item.created_at ? new Date(item.created_at).toLocaleDateString() : ""}
</span>
                </div>
                <span className="text-[10px] text-[#5c6066] ml-3">{item.date}</span>
              </div>
              <ChevronRight size={14} className="text-[#5c6066] group-hover:text-white transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>


        
      </div>

      <CreateCommunityModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </aside>
  );
};