"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Plus, Search, Pin, Home, MessageCircle } from 'lucide-react'; // Added MessageCircle

type AnnouncementType = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  is_pinned?: boolean;
  is_owner: boolean; 
};

type UserType = {
  id: number;
  name: string;
};

export default function AnnouncementsListPage() {
  const [announcements, setAnnouncements] = useState<AnnouncementType[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchData() {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, you'd fetch the user from your auth session (e.g., NextAuth or an API)
      // Mocking user ID 1 for this example
     

      const response = await axios.get('/api/announcements');
      setAnnouncements(response.data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      setError("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleSave(postId: number) {
    if (!postId) return;
    try {
      const res = await axios.patch(`/api/announcements/${postId}/pin/`);
      const { pinned } = res.data;
      
      setAnnouncements((prev) =>
        prev.map((p) => p.id === postId ? { ...p, is_pinned: pinned } : p)
      );
    } catch (err) {
      console.error("Save toggle failed", err);
    }
  }

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

      

      {error && (
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6 text-red-400">
          {error}
        </div>
      )}

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
            </div>

            <div className="space-y-4">
              <h1 className="text-white text-2xl font-bold leading-tight">{post.title}</h1>
              <div className="text-[#E4E6EB] text-[15px] leading-relaxed whitespace-pre-wrap">{post.content}</div>
            </div>

            <div className="flex items-center gap-4 mt-6 pt-2 border-t border-[#2D2F34]">
              {/* PIN BUTTON */}
              <button
                onClick={() => handleSave(post.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition hover:bg-[#2D2F34] ${post?.is_pinned ? " text-blue-500" : " text-[#838891] hover:text-white"}`}
              >
                <Pin
                  className={`w-4 h-4 ${
                    post.is_pinned
                      ? "text-yellow-400 fill-yellow-400"
                      : ""
                  }`}
                />
                <span className="text-xs font-bold">
                  {post.is_pinned ? "Pinned" : "Pin"}
                </span>
              </button>


            </div>
          </article>
        ))}

        {loading && <div className="text-center py-10 text-[#838891]">Loading...</div>}
      </div>
    </div>
  );
}