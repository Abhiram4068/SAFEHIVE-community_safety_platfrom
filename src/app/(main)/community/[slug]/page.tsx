"use client";

import { useParams } from 'next/navigation';
import { PostCard } from '@/src/components/PostCard';

const COMMUNITY_POSTS = [
  {
    subreddit: "todayilearned",
    author: "Liam Wilson",
    time: "a year ago",
    title: "TIL Ghost moons — if they really exist — are swirling clouds of dust that share Earth's orbit",
    content: "They may not be real moons, but they're worth exploring and studying.",
    votes: "3.1k",
    commentsCount: "89",
    accentColor: "bg-orange-600"
  }
];

export default function CommunityPage() {
  const params = useParams();
  const slug = params.slug as string;


  return (
    <div className="flex-1 max-w-[740px] mx-auto">
      {/* 1. COMMUNITY HEADER SECTION */}
      <div className="mb-6 rounded-xl overflow-hidden border border-[#1F2228] bg-[#0B0D10]">
        <div className="h-32 w-full bg-gradient-to-r from-orange-500 to-red-600 opacity-80" />
        <div className="px-4 pb-4 flex items-end gap-4 -mt-8">
          <div className="w-20 h-20 rounded-2xl bg-orange-600 border-4 border-[#0B0D10] flex items-center justify-center text-3xl shadow-xl">
            <span className="text-white font-bold">r/</span>
          </div>
          <div className="flex-1 mb-1">
            <h1 className="text-2xl font-bold text-white leading-tight">r/{slug}</h1>
            <p className="text-sm text-[#838891]">Everything about {slug}</p>
          </div>
          <button className="bg-white text-black px-6 py-1.5 rounded-full text-sm font-bold hover:bg-gray-200 transition mb-1">
            Info
          </button>
          <button className="bg-white text-black px-6 py-1.5 rounded-full text-sm font-bold hover:bg-gray-200 transition mb-1">
            Leave 
          </button>
        </div>
      </div>

      {/* 2. FEED SECTION */}
      <div className="flex gap-6 mb-6 px-2 border-b border-[#1F2228] pb-3">
        <button className="text-white font-bold text-sm border-b-2 border-white pb-3 -mb-[13px]">All</button>        
        <button className="text-[#838891] hover:text-white font-bold text-sm transition">Posts</button>
        <button className="text-[#838891] hover:text-white font-bold text-sm transition">Announcements</button>
      </div>

      <div className="flex flex-col w-full">
        {COMMUNITY_POSTS.map((post, index) => (
          <PostCard key={index} {...post} />
        ))}
      </div>
    </div>
  );
}