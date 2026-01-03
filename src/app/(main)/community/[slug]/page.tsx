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
  },
  {
    subreddit: "todayilearned",
    author: "Benjamin Clark",
    time: "a year ago",
    title: "TIL that Dan Spitz, lead guitarist for Anthrax, left the band to become a watchmaker",
    votes: "1.2k",
    commentsCount: "45",
    accentColor: "bg-orange-600"
  }
];

export default function CommunityPage() {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <div className="bg-[#0B0D10] text-[#D1D5DB] min-h-screen antialiased">
     
      {/* COMMUNITY HEADER SECTION */}
      
     
      
      {/* MAIN CONTENT AREA */}
      <main className="max-w-[1400px] mx-auto flex justify-center pt-6 px-12 gap-8">
        
        {/* Left Sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          
        </div>

        {/* Feed */}
        <div className="flex-1 max-w-[740px]">
          <div className="flex gap-6 mb-6 px-2 border-b border-[#1F2228] pb-3">
            <button className="text-white font-bold text-sm border-b-2 border-white pb-3 -mb-[13px]">Card</button>
            <button className="text-[#838891] hover:text-white font-bold text-sm transition">Compact</button>
          </div>

          <div className="flex flex-col w-full">
            {COMMUNITY_POSTS.map((post, index) => (
              <PostCard key={index} {...post} />
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden xl:block w-80 flex-shrink-0">
         
        </div>
        
      </main>
    </div>
  );
}