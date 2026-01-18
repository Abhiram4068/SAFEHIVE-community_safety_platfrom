"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AddAnnouncementPage() {
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    // const token = localStorage.getItem("access");
    // if (!token) {
    //   alert("Login to create an announcement!");
    //   return;
    // }

    setIsSubmitting(true);
    try {
      await axios.post('http://127.0.0.1:8003/api/announcements/add', 
        {
          title: newTitle,
          content: newContent,
        },
        {
          headers: {
            // Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      // Redirect back to the announcements list
      router.push('/announcements'); 
      router.refresh();
    } catch (error) {
      console.error("Post failed:", error);
      alert("Failed to post announcement. Make sure your backend is running!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-blackflex items-start justify-center pt-10 px-4">
      <div className="bg-[#15191C] border border-[#2D2F34] w-full max-w-2xl rounded-l shadow-2xl overflow-hidden">
        
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
              className="w-full bg-[#15191C] border border-[#2D2F34] rounded-l p-3 text-white focus:outline-none focus:border-gray-500 transition text-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#838891] uppercase mb-2 tracking-wider">
              Content
            </label>
            <textarea 
              required
              rows={10}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Text (optional)"
              className="w-full bg-[#15191C] border border-[#2D2F34] rounded-l p-3 text-white focus:outline-none focus:border-gray-500 resize-none transition"
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
              {isSubmitting ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}