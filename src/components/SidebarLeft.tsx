"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from 'axios';
import {
  Home,
  MapPin,
  AlertTriangle,
  Layers,
  Users,
  Megaphone,
  Landmark,
  ChevronRight // Added for the arrow mark
} from "lucide-react";

const ICONS = {
  home: Home,
  "map-pin": MapPin,
  "alert-triangle": AlertTriangle,
  layers: Layers,
  users: Users,
  megaphone: Megaphone,
  landmark: Landmark,
};

type communityType = {
  id: number;
  name: string;
};

type categoryType = {
  id: number;
  name: string;
  image: string;
};

const PUBLICFEED = [
  { icon: 'home', label: 'All Posts', path: '/' },
  { icon: 'map-pin', label: 'Posts near me', path: '/user/nearme' },
  { icon: 'alert-triangle', label: 'Report Incident', path: '/user/incidents' },
  { icon: 'layers', label: 'Category', path: '/categories' },
  { icon: 'users', label: 'Browse Communities', path: '/communities' },
  { icon: 'megaphone', label: 'Public Announcements', path: '/announcements' },
];

const USERFEED = [
  { icon: 'home', label: 'All Posts', path: '/user/' },
  { icon: 'map-pin', label: 'Posts near me', path: '/user/nearme' },
  { icon: 'alert-triangle', label: 'Report Incident', path: '/user/incidents' },
  { icon: 'layers', label: 'Category', path: '/user/categories' },
  { icon: 'users', label: 'Browse Communities', path: '/user/communities' },
  { icon: 'megaphone', label: 'Public Announcements', path: '/user/announcements' },
  { icon: 'landmark', label: 'Platform Announcements', path: '/user/admin-announcements' },
];

interface SidebarProps {
  user?: {
    id: number;
    username: string;
    role: string;
  } | null;
}

export const Sidebar = ({ user }: SidebarProps) => {
  const [communities, setCommunities] = useState<communityType[]>([]);
  const [categories, setCategories] = useState<categoryType[]>([]);

  async function fetchCommunities() {
    try {
      const res = await axios.get("/api/mycommunity/");
      setCommunities(res.data);
    } catch (err) {
      console.error("Failed to load communities", err);
    }
  }

  async function fetchCategories() {
    try {
      const res = await axios.get("/api/categories/");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  }

useEffect(() => {
  if (user) {
    fetchCommunities();
  }
  fetchCategories();
}, [user]);

  return (
    <aside className="hidden md:block w-64 pr-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto border-r border-[#1F2228] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      
      {/* FEED SECTION */}
      <div className="mt-8">
        <h3 className="px-3 text-xs font-semibold text-[#838891] uppercase tracking-wider mb-2">
          MAIN FEED
        </h3>
        <div className="space-y-1">
          {(user ? USERFEED : PUBLICFEED).map((feed) => {
            const Icon = ICONS[feed.icon as keyof typeof ICONS];
            return (
              <Link
                key={feed.label}
                href={feed.path}
                className="flex items-center px-3 py-2 text-[#838891] hover:bg-[#1A1D23] rounded-md text-sm border border-transparent hover:border-[#1F2228]"
              >
                <span className="mr-3">
                  {Icon && <Icon size={18} color="#ffffff"  />}
                </span>
                {feed.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-6 border-t border-[#1F2228]" />

      {/* COMMUNITIES SECTION */}
      <div className="mt-8">
        <h3 className="px-3 text-xs font-semibold text-[#838891] uppercase tracking-wider mb-2">
          your communities
        </h3>
        <div className="space-y-1">
          {communities && communities.length > 0 ? (
            <>
              {communities.slice(0, 3).map((community) => (
                <Link
                  key={community.id}
                  href={`/communityinfo/${community.id}`}
                  className="flex items-center px-3 py-2 text-[#838891] hover:bg-[#1A1D23] rounded-md text-sm border border-transparent hover:border-[#1F2228]"
                >
                  <span className="mr-3 text-xs bg-[#1F2228] w-5 h-5 flex items-center justify-center rounded-sm">
                    r/
                  </span>
                  {community.name}
                </Link>
              ))}
              {/* Explore Your Communities Link */}
              <Link
                href="/user/my-communities"
                className="flex items-center justify-between px-3 py-2 mt-2 text-[#838891] hover:text-white transition-colors text-xs font-bold uppercase tracking-tight group"
              >
                Explore your communities
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </>
          ) : (
            <p className="px-3 text-xs text-[#838891]">
              Login to join communities !
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 border-t border-[#1F2228]" />

      {/* CATEGORY SECTION */}
      <div className="mt-8">
        <h3 className="px-3 text-xs font-semibold text-[#838891] uppercase tracking-wider mb-2">
          Find by Category
        </h3>
        <div className="space-y-1">
          {categories.slice(0, 3).map((topic) => (
            <Link
              key={topic.id}
              href={`/categories/${topic.id}`}
              className="flex items-center px-3 py-2 text-[#838891] hover:bg-[#1A1D23] rounded-md text-sm border border-transparent hover:border-[#1F2228]"
            >
              <span className="mr-3"> <Layers size={18}  /></span> {topic.name}
            </Link>
          ))}
          
          {/* Explore Categories Link */}
          <Link
            href={user ? "/user/categories" : "/categories"}
            className="flex items-center justify-between px-3 py-2 mt-2 text-[#838891] hover:text-white transition-colors text-xs font-bold uppercase tracking-tight group"
          >
            Explore all categories
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
      <div>
        <div className="mt-8 border-t border-[#1F2228] pt-4 px-3 text-xs text-[#838891]">
        
      </div>
      </div>
    </aside>
  );
};