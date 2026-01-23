"use client";

import React, { useState, use } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Info, Megaphone } from 'lucide-react'; 
import Link from 'next/link';

export default function CommunityAddAnnouncement({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const groupId = resolvedParams.slug;
  
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    setIsSubmitting(true);
    try {
      await axios.post(`/api/community/${groupId}/announcements/create/`, 
        {
          title: newTitle,
          content: newContent, 
        },
        { headers: { "Content-Type": "application/json" } }
      );

      router.push(`/communityinfo/${groupId}`); 
      router.refresh();
    } catch (error) {
      console.error("Announcement failed:", error);
      alert("Failed to post announcement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-black min-h-screen pb-10">
      {/* Header Section mimicking the CommunityCenter header style */}
      <div className="max-w-6xl mx-auto px-6 pt-10 border-b border-[#1A1A1B] pb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()} 
            className="p-2 hover:bg-[#1A1D23] rounded-full text-[#818384] hover:text-white transition"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-white text-2xl font-bold tracking-tighter uppercase">
              Create Announcement
            </h1>
            <p className="text-[#818384] text-sm">Post an official update.</p>
          </div>
        </div>
      </div>

      {/* Content Grid - Matching CommunityCenter layout */}
      <div className="max-w-6xl mx-auto px-6 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Form Area */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-[#0B0D10] border border-[#343536] rounded p-6 space-y-6">
            
            {/* Title Input */}
            <div>
              <label className="block text-xs font-bold text-[#818384] uppercase mb-2 tracking-wider">
                Title
              </label>
              <input 
                required
                autoFocus
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Announcement Title"
                className="w-full bg-[#1A1D23] border border-[#343536] rounded p-3 text-white focus:outline-none focus:border-blue-500 transition text-lg"
              />
            </div>

            {/* Content Input */}
            <div>
              <label className="block text-xs font-bold text-[#818384] uppercase mb-2 tracking-wider">
                Content
              </label>
              <textarea 
                required
                rows={12}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="What is the official news?"
                className="w-full bg-[#1A1D23] border border-[#343536] rounded p-3 text-white focus:outline-none focus:border-blue-500 resize-none transition"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-[#1A1A1B]">
              <button 
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 text-white font-bold hover:bg-[#1A1D23] rounded-xl transition text-sm"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="px-10 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-50 text-sm"
              >
                {isSubmitting ? "Publishing..." : "Post Announcement"}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Widgets - Reusing the style from CommunityCenter */}
        <div className="flex flex-col gap-4">
          <div className="bg-[#0B0D10] border border-[#343536] rounded p-4">
            <div className="flex items-center gap-2 mb-3">
              <Megaphone className="w-4 h-4 text-blue-500" />
              <h3 className="text-white font-bold text-sm">Official Post</h3>
            </div>
            <p className="text-[#818384] text-xs leading-relaxed">
              Announcements are pinned to the announcements tab and notify all community members. 
              Ensure your content follows community guidelines.
            </p>
          </div>

          <div className="bg-[#0B0D10] border border-[#343536] rounded p-4">
            <div className="flex items-center gap-2 mb-2 text-blue-500">
              <Info size={16} />
              <h3 className="font-bold text-xs uppercase">Admin Tip</h3>
            </div>
            <p className="text-[#D7DADC] text-xs leading-relaxed">
              Use clear titles so members know exactly what the update is about before opening it.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}