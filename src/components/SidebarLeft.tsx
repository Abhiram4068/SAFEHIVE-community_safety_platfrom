"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from 'axios'

type communityType = {
  id: number;
  name: string;
  // If your API returns nested group details, add them here
};

type categoryType = {
  id: number;
  name: string;
  image: string; // Used for emoji or icon
};

const FEED = [
  { emoji: '🏠', label: 'All Posts', path: '/' }, 
  { emoji: '📍', label: 'Posts near me', path: '/allfeeds/nearme' },
  { emoji: '⚠️', label: 'Report Incident', path: '/allfeeds/incidents' },
  { emoji: '🚨', label: 'Category', path: '/allfeeds/categories' },
  { emoji: '💬', label: 'Browse Communities', path: '/allfeeds/communities' },
  { emoji: '🆘', label: 'Announcements', path: '/allfeeds/announcements' },
  { emoji: '#️⃣', label: 'Hashtags', path: '/allfeeds/hashtags' },
  { emoji: '📊', label: 'Reports & Stats', path: '/allfeeds/stats' },
  { emoji: '⚙️', label: 'Settings', path: '/allfeeds/settings' },
];

export const Sidebar = () => {
  const [communities, setCommunities] = useState<communityType[]>([]);
  const [categories, setCategories] = useState<categoryType[]>([]);

async function fetchCommunities() {
  try {
    const res = await axios.get("http://127.0.0.1:8000/api/groups/mygroup/");
    console.log("Communities:", res.data);
    setCommunities(res.data);
  } catch (err) {
    console.error("Failed to load communities", err);
  }
}

async function fetchCategories() {
  try {
    const res = await axios.get("http://127.0.0.1:8000/api/categories/");
    setCategories(res.data);
  } catch (err) {
    console.error("Failed to load categories", err);
  }
}

useEffect(() => {
  fetchCommunities();
  fetchCategories();
}, []);


  return (
    <aside className="hidden md:block w-64 pr-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto border-r border-[#1F2228] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      
      {/* FEED SECTION */}
      <div className="mt-8">
        <h3 className="px-3 text-xs font-semibold text-[#838891] uppercase tracking-wider mb-2">FEED</h3>
        <div className="space-y-1">
          {FEED.map((feed) => (
            <Link key={feed.label} href={feed.path} className="flex items-center px-3 py-2 text-[#838891] hover:bg-[#1A1D23] rounded-md text-sm border border-transparent hover:border-[#1F2228]">
              <span className="mr-3">{feed.emoji}</span> {feed.label}
            </Link>
          ))}
        </div>
      </div>
      
      {/* COMMUNITIES SECTION - FIXED RENDERING */}
      <div className="mt-8">
        <h3 className="px-3 text-xs font-semibold text-[#838891] uppercase tracking-wider mb-2">
          your communities
        </h3>
        <div className="space-y-1">
          {communities && communities.length > 0 ? (
            communities.map((community) => (
              <Link
                key={community.id}
                href={`/community/${community.name}`}
                className="flex items-center px-3 py-2 text-[#838891] hover:bg-[#1A1D23] rounded-md text-sm border border-transparent hover:border-[#1F2228]"
              >
                {/* Check if you need to use community.group_details.name instead */}
                <span className="mr-3 text-xs bg-[#1F2228] w-5 h-5 flex items-center justify-center rounded-sm">r/</span>
                {community.name}
              </Link>
            ))
          ) : (
            <p className="px-3 text-xs text-[#838891]">
              You haven’t joined any communities yet
            </p>
          )}
        </div>
      </div>

      {/* CATEGORY SECTION */}
      <div className="mt-8">
        <h3 className="px-3 text-xs font-semibold text-[#838891] uppercase tracking-wider mb-2">Category</h3>
        <div className="space-y-1">
          {categories.map((topic) => (
            <Link key={topic.id} href={`/category/${topic.id}`} className="flex items-center px-3 py-2 text-[#838891] hover:bg-[#1A1D23] rounded-md text-sm border border-transparent hover:border-[#1F2228]">
               {/* Replace with your specific logic for category images/emojis */}
              <span className="mr-3">📁</span> {topic.name}
            </Link>
          ))}
        </div>
      </div>
      
      <div className="mt-8 border-t border-[#1F2228] pt-4 px-3 text-xs text-[#838891]">
        <p>Reddify © 2026. All rights reserved.</p>
      </div>
    </aside>
  );
};