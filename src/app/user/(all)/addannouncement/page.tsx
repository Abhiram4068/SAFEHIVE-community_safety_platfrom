"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { X, ArrowLeft, Info } from 'lucide-react'; // Added Info icon
import Link from 'next/link';

export default function AddAnnouncementPage() {
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    setIsSubmitting(true);
    try {
      await axios.post('/api/announcements/add/', 
        {
          title: newTitle,
          content: newContent,
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      router.push('/user/announcements'); 
      router.refresh();
    } catch (error) {
      console.error("Post failed:", error);
      alert("Failed to post announcement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-start justify-center pt-10 px-4">
      <div className="bg-[#15191C] border border-[#2D2F34] w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#2D2F34]">
          <div className="flex items-center gap-4">
            <Link href="/announcements" className="text-[#838891] hover:text-white transition">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h3 className="text-white font-bold text-lg">Create an Announcement</h3>
          </div>
          <Link href="/announcements" className="text-[#838891] hover:text-white transition">
            <X className="w-6 h-6" />
          </Link>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* IMPORTANT NOTICE BOX */}
          <div className="bg-[#1A1D23] border-l-4 border-blue-500 p-4 rounded-r-md">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold text-white uppercase tracking-widest">Important Notice</span>
            </div>
            <ul className="text-[13px] text-[#838891] space-y-1.5 leading-relaxed list-disc ml-4">
              <li> •  This announcement will be visible to all members on this platform.</li>
              <li>•  Ensure the information is accurate and verified.</li>
              <li>•  Announcements must follow community and platform rules.</li>
              <li>•  Do not include personal, confidential, or sensitive data.</li>
              <li>•  You are responsible for the content you publish.</li>
            </ul>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#838891] uppercase mb-2 tracking-wider">
              Announcement Title
            </label>
            <input 
              required
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Title"
              className="w-full bg-[#15191C] border border-[#2D2F34] rounded p-3 text-white focus:outline-none focus:border-gray-500 transition text-lg"
            />
          </div>


          <div>
            <label className="block text-xs font-bold text-[#838891] uppercase mb-2 tracking-wider">
              Content
            </label>
            <textarea 
              required
              rows={8}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Type your official announcement here..."
              className="w-full bg-[#15191C] border border-[#2D2F34] rounded p-3 text-white focus:outline-none focus:border-gray-500 resize-none transition"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#2D2F34]">
            <Link 
              href="/announcements"
              className="px-6 py-2 text-white font-bold hover:bg-[#2D2F34] rounded-full transition"
            >
              Cancel
            </Link>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-10 py-2 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Posting..." : "Post Announcement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}