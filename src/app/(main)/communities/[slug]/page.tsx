"use client";

import React, { useState, useEffect, use } from 'react';
import axios from 'axios';
import { PostCard } from '@/src/components/PostCard';
import { Bell, Settings, MoreHorizontal, ShieldCheck, Clock, Users, FileText } from 'lucide-react';

export default function CommunityPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const categoryId = resolvedParams.slug;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId || categoryId === "undefined") return;
    async function fetchCommunityData() {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/category/post/${categoryId}/`);
        setPosts(response.data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCommunityData();
  }, [categoryId]);

  const communityName = posts.length > 0 ? posts[0].category_name : "announcements";

  if (loading) return <div className="p-10 text-white bg-black min-h-screen">Loading...</div>;

  return (
    <div className="flex-1 bg-black min-h-screen pb-10">
      {/* --- HERO BANNER --- */}
      <div className="relative w-full h-48 bg-[#D9C4B1] rounded-b-md overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute -bottom-6 left-10">
          <div className="w-24 h-24 rounded-full bg-[#FF4500] border-[6px] border-black flex items-center justify-center text-4xl shadow-lg">
            🧡
          </div>
        </div>
      </div>

      {/* --- TITLE & ACTIONS BAR --- */}
      <div className="max-w-6xl mx-auto px-6 pt-10 flex justify-between items-center">
        <h1 className="text-white text-3xl font-bold tracking-tight">r/{communityName}</h1>
        <div className="flex items-center gap-2">
          <button className="bg-[#D7DADC] hover:bg-white text-black px-6 py-1.5 rounded-full font-bold flex items-center gap-2 transition">
            <ShieldCheck className="w-4 h-4" /> Join
          </button>
          <button className="p-2 border border-[#343536] rounded-full text-white hover:bg-[#1A1A1B] transition"><Bell className="w-5 h-5" /></button>
          <button className="p-2 border border-[#343536] rounded-full text-white hover:bg-[#1A1A1B] transition"><MoreHorizontal className="w-5 h-5" /></button>
        </div>
      </div>

      {/* --- VIEW TOGGLE --- */}
      <div className="max-w-6xl mx-auto px-6 mt-6 flex gap-6 border-b border-[#1A1A1B] pb-2">
        <button className="text-white text-sm font-bold bg-[#1A1A1B] px-4 py-1.5 rounded-full">Card</button>
        <button className="text-[#818384] text-sm font-bold hover:bg-[#1A1A1B] px-4 py-1.5 rounded-full transition">Compact</button>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="max-w-6xl mx-auto px-6 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: POSTS */}
        <div className="lg:col-span-2 space-y-4">
          {posts.map((post: any) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>

        {/* RIGHT COLUMN: SIDEBAR WIDGETS */}
        <div className="hidden lg:flex flex-col gap-4">
          
          {/* ABOUT WIDGET */}
          <div className="bg-[#1A1A1B] rounded-lg p-4 border border-[#343536]">
            <h3 className="text-[#818384] text-xs font-bold uppercase mb-4">About</h3>
            <p className="text-[#D7DADC] text-sm mb-4 leading-relaxed">
              Official announcements from Reddify, Inc.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white text-sm"><Users className="w-4 h-4" /> 3 members</div>
              <div className="flex items-center gap-2 text-white text-sm"><FileText className="w-4 h-4" /> 4 posts</div>
              <div className="flex items-center gap-2 text-white text-sm"><Clock className="w-4 h-4" /> Created a year ago</div>
            </div>
          </div>

          {/* GOOD EVENING WIDGET */}
          <div className="bg-[#1A1A1B] rounded-lg p-4 border border-[#343536]">
            <h3 className="text-white text-md font-bold mb-2">Good evening 👋</h3>
            <p className="text-[#818384] text-sm mb-4">Welcome to reddify</p>
            <p className="text-[#D7DADC] text-sm mb-4">Connect, share, and engage with community and build relationships.</p>
            <div className="bg-[#0B0D10] p-3 rounded-md border border-[#343536]">
              <p className="text-[#818384] text-xs italic">This is an invitation-only community.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}