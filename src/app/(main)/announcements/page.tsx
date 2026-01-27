"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { MoreHorizontal, Plus, Share2, Bookmark, Flag, Home } from 'lucide-react';

type AnnouncementType = {
  id: number;
  title: string;
  content: string;
  created_at: string;
};

export default function AnnouncementsListPage() {
  const [announcements, setAnnouncements] = useState<AnnouncementType[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    try {
      const response = await axios.get('http://127.0.0.1:8003/api/announcements/');
      setAnnouncements(response.data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex-1 w-full lg:max-w-4xl mx-auto pb-10 px-4">
      {/* SEARCH AND NAVIGATION HEADER */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-8 pt-4">
        <div className="relative flex-1 w-full">
          <div className="flex items-center gap-2 px-2">
          <span className="text-xl">📢</span>
          <h2 className="text-white text-lg font-bold">Recent Announcements</h2>
        </div>
        </div>

        <Link 
          href="/user/addannouncement"
          className="flex items-center gap-2 bg-white hover:bg-gray-200 text-black px-4 py-2 rounded-full font-bold text-sm transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Announcement
        </Link>
      </div>

     
      <div className="space-y-6">
        {announcements.map((post) => (
          <article key={post.id} className="bg-[#15191C] border border-[#2D2F34] rounded-xl p-6 shadow-sm hover:border-[#3d3f44] transition">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center">
                  <Home className="w-3 h-3 text-white" />
                </div>
                <span className="text-white font-bold hover:underline cursor-pointer">r/announcements</span>
                <span className="text-[#838891]">•</span>
                <span className="text-[#838891]">
                  {post.created_at ? new Date(post.created_at).toLocaleDateString() : "Just now"}
                </span>
              </div>
              <MoreHorizontal className="w-5 h-5 text-[#838891] cursor-pointer" />
            </div>

            <div className="space-y-4">
              <h1 className="text-white text-2xl font-bold leading-tight">{post.title}</h1>
              <div className="text-[#E4E6EB] text-[15px] leading-relaxed whitespace-pre-wrap">{post.content}</div>
            </div>

            
          </article>
        ))}

        {loading && <div className="text-center py-10 text-[#838891]">Loading...</div>}
      </div>
    </div>
  );
}