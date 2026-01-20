"use client";
import Link from 'next/link';
import React, { useState } from 'react';
import { Plus, Hash, TrendingUp, ChevronRight } from 'lucide-react';
import { CreateCommunityModal } from './CreateCommunityModal';
import { useEffect } from 'react';
import axios from 'axios';


export const RightSidebar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [frequentCategories, setFrequentCategories] = useState([]);


  const popularCategories = [
    { name: "Traffic", color: "text-orange-500" },
    { name: "Safety", color: "text-blue-500" },
    { name: "Infrastructure", color: "text-green-500" },
  ];

  /* 🔹 FETCH FREQUENT CATEGORIES */
  useEffect(() => {
    const fetchFrequentCategories = async () => {
      try {
        const res = await axios.get("/api/frequentcat/");
        setFrequentCategories(res.data);
      } catch (error) {
        console.error("Failed to fetch frequent categories", error);
      }
    };

    fetchFrequentCategories();
  }, []);

  return (
    <aside className="hidden xl:block w-80 pl-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto border-l border-[#1F2228] [scrollbar-width:none]">
      
      {/* HOME WIDGET */}
      <div className="bg-[#0B0D10] rounded-lg mb-4 border border-[#1F2228] p-4">
        <h3 className="text-white font-bold mb-2 italic">Home</h3>
        <p className="text-[#838891] text-xs mb-4">
          Your personal SafeHive frontpage. Come here to check in with your favorite communities.
        </p>
        <div className="flex flex-col gap-2">
          <Link href="/allfeeds/incidents/">
            <button className="w-full bg-[#D7DADC] hover:bg-white text-black py-2 rounded-full font-bold text-sm transition">
              Create Post
            </button>
          </Link>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full border border-[#343536] hover:bg-[#1A1D23] text-white py-2 rounded-full font-bold text-sm transition flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Community
          </button>
        </div>
      </div>

      {/* POPULAR & FREQUENT CATEGORIES SECTION */}
      <div className="bg-[#0B0D10] rounded-lg mb-4 border border-[#1F2228] overflow-hidden">
        <div className="p-4 flex items-center gap-2">
          <TrendingUp size={16} className="text-blue-500" />
          <h3 className="text-white font-bold text-sm uppercase tracking-wider">Popular Communities</h3>
        </div>

        {/* Floating Separator Line (Doesn't touch borders) */}
        <div className="px-4">
          <div className="h-[1px] w-full bg-[#1F2228]" />
        </div>
        
        <div className="flex flex-col py-2">
          {popularCategories.map((cat, idx) => (
            <Link 
              key={idx} 
              href={`/category/${cat.name.toLowerCase()}`}
              className="px-4 py-2.5 hover:bg-[#1A1D23] transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-1 h-3.5 rounded-full ${cat.color} bg-current opacity-60 group-hover:opacity-100 transition`} />
                <span className="text-gray-300 text-sm font-medium group-hover:text-white">c/{cat.name}</span>
              </div>
              <ChevronRight size={14} className="text-[#5c6066] group-hover:text-white transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>

        {/* Another Separator before the frequent section */}
        <div className="px-4 py-2">
          <div className="h-[1px] w-full bg-[#1F2228]" />
        </div>

        <div className="p-4 pt-2">
          <p className="text-[10px] font-bold text-[#5c6066] uppercase tracking-widest mb-3">Frequently Browsed Categories</p>
          <div className="flex flex-wrap gap-2">
            {frequentCategories.map((cat, idx) => (
              <Link 
                key={idx} 
                href={`/category/${cat.name.toLowerCase()}`}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1D23] border border-[#2F333A] rounded-md text-xs text-gray-400 hover:text-white hover:border-gray-500 transition"
              >
                {cat.icon}
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <CreateCommunityModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </aside>
  );
};