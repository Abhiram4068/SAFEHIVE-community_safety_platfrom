"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MoreHorizontal, Plus, Search, Share2, Bookmark, Flag, Home, X } from 'lucide-react';

type AnnouncementType = {
  id: number;
  title: string;
  content: string;
  created_at: string;
};

export default function PostDetailCard() {
  const [announcements, setAnnouncements] = useState<AnnouncementType[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- Modal & Form States ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. GET: Fetch existing announcements
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

  // 2. POST: Send new announcement to backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return; // Basic validation

    setIsSubmitting(true);
    try {
      const response = await axios.post('http://127.0.0.1:8003/api/announcements/', {
        user: 1,
        title: newTitle,
        content: newContent,
      });

      // Update UI immediately by adding response to the top of the list
      setAnnouncements([response.data, ...announcements]);
      
      // Reset form and close modal
      setNewTitle("");
      setNewContent("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Post failed:", error);
      alert("Failed to post announcement. Make sure your backend is running!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 w-full lg:max-w-4xl mx-auto pb-10 px-4 relative">
      
      {/* SEARCH AND CREATE HEADER */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-8 pt-4">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#838891]" />
          </div>
          <input 
            type="text" 
            className="block w-full pl-10 pr-3 py-2 border border-[#1F2228] rounded-full leading-5 bg-[#1A1D23] text-gray-300 placeholder-[#838891] focus:outline-none focus:border-gray-500 sm:text-sm" 
            placeholder="Search Reddify" 
          />
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-white hover:bg-gray-200 text-black px-4 py-2 rounded-full font-bold text-sm transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Announcement
        </button>
      </div>

      {/* --- CREATE MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#1A1D23] border border-[#2D2F34] w-full max-w-lg rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-[#2D2F34]">
              <h3 className="text-white font-bold text-lg">New Announcement</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#838891] hover:text-white transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#838891] uppercase mb-1">Title</label>
                <input 
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="What's happening?"
                  className="w-full bg-[#15191C] border border-[#2D2F34] rounded-lg p-3 text-white focus:outline-none focus:border-gray-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#838891] uppercase mb-1">Content</label>
                <textarea 
                  required
                  rows={6}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Enter details here..."
                  className="w-full bg-[#15191C] border border-[#2D2F34] rounded-lg p-3 text-white focus:outline-none focus:border-gray-500 resize-none transition"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 text-white font-bold hover:bg-[#2D2F34] rounded-full transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-2 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Posting..." : "Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LIST SECTION */}
      <section className="mb-6">
        <div className="flex items-center gap-2 px-2">
          <span className="text-xl">📢</span>
          <h2 className="text-white text-lg font-bold">Recent Announcements</h2>
        </div>
      </section>

      <div className="space-y-6">
        {announcements.map((post) => (
          <article key={post.id} className="bg-[#15191C] border border-[#2D2F34] rounded-xl p-6 shadow-sm hover:border-[#3d3f44] transition">
            {/* Header */}
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

            {/* Content */}
            <div className="space-y-4">
              <h1 className="text-white text-2xl font-bold leading-tight">{post.title}</h1>
              <div className="text-[#E4E6EB] text-[15px] leading-relaxed whitespace-pre-wrap">{post.content}</div>
            </div>

            {/* Interaction Buttons */}
            <div className="flex items-center gap-1 mt-6 pt-2 border-t border-[#2D2F34]">
              <button className="flex items-center gap-2 px-3 py-2 hover:bg-[#2D2F34] rounded-md text-[#838891] transition group">
                <Share2 className="w-4 h-4 group-hover:text-white" />
                <span className="text-xs font-bold group-hover:text-white">Share</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-2 hover:bg-[#2D2F34] rounded-md text-[#838891] transition group">
                <Bookmark className="w-4 h-4 group-hover:text-white" />
                <span className="text-xs font-bold group-hover:text-white">Save</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-2 hover:bg-[#2D2F34] rounded-md text-[#838891] transition group">
                <Flag className="w-4 h-4 group-hover:text-red-400" />
                <span className="text-xs font-bold group-hover:text-red-400">Flag</span>
              </button>
            </div>
          </article>
        ))}

        {loading && <div className="text-center py-10 text-[#838891]">Loading...</div>}
      </div>
    </div>
  );
}