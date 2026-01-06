"use client";
import React from 'react';
import { 
  Bell, Share2, MoreHorizontal, ArrowUp, 
  MessageSquare, Shield, Info, ExternalLink 
} from 'lucide-react';
import { useParams } from 'next/navigation';

const CommunityPage = () => {
    const params = useParams()
    const slug = params.slug as string
  return (
    <div className="min-h-screen bg-[#030303] text-[#D7DADC] flex">
      
      {/* 1. Left Sidebar - Navigation */}
      <aside className="w-64 border-r border-white/10 p-4 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-[#FF4500] rounded-full flex items-center justify-center">
             <div className="w-4 h-4 bg-white rounded-full opacity-20"></div>
          </div>
          <span className="text-xl font-bold tracking-tight">reddify</span>
        </div>
        
        <nav className="space-y-6">
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Communities</p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-3 text-white bg-white/5 p-2 rounded-lg cursor-pointer">
                <div className="w-5 h-5 bg-orange-600 rounded-full"></div>
                <span>r/announcements</span>
              </li>
              {['todayilearned', 'AskReddit', 'techsupport'].map((sub) => (
                <li key={sub} className="flex items-center space-x-3 text-gray-400 hover:text-white p-2 cursor-pointer transition-colors">
                  <div className="w-5 h-5 bg-gray-700 rounded-full"></div>
                  <span>r/{sub}</span>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-black">
        {/* Top Search Bar */}
        <header className="h-14 border-b border-white/10 flex items-center px-6 justify-between bg-[#030303] sticky top-0 z-10">
          <div className="flex-1 max-w-2xl">
            <input 
              type="text" 
              placeholder="Search or ask a question (Ctrl /)" 
              className="w-full bg-[#1A1A1B] border border-[#343536] rounded-full px-4 py-1.5 text-sm focus:outline-none focus:border-white/40"
            />
          </div>
          <button className="ml-4 px-4 py-1.5 border border-white/20 rounded-full text-xs font-bold hover:bg-white/5">Log in</button>
        </header>

        <div className="flex flex-1 overflow-y-auto">
          {/* Feed Content */}
          <div className="flex-1 p-6 space-y-6">
            
            {/* Community Banner & Header */}
            <div className="rounded-[20px] overflow-hidden border border-white/10 bg-[#1A1A1B]">
              <div className="h-32 bg-[#D9BBA9] relative">
                 {/* Decorative circles from image */}
                 <div className="absolute right-10 bottom-2 flex space-x-2 opacity-30">
                    <div className="w-16 h-16 bg-white rounded-full"></div>
                    <div className="w-12 h-12 bg-white rounded-full mt-4"></div>
                 </div>
              </div>
              <div className="p-4 flex justify-between items-end">
                <div className="flex items-end space-x-4 -mt-12">
                  <div className="w-20 h-20 bg-[#FF4500] rounded-full border-4 border-[#1A1A1B] flex items-center justify-center">
                    <div className="w-10 h-10 bg-white/20 rounded-full"></div>
                  </div>
                  <h1 className="text-2xl font-bold pb-2">r/{slug}</h1>
                </div>
                <div className="flex space-x-2 pb-2">
                  <button className="flex items-center space-x-1 px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-xs font-bold transition-colors">
                    <Bell size={14} /> <span>Join</span>
                  </button>
                  <button className="p-1.5 bg-white/10 rounded-full"><MoreHorizontal size={14}/></button>
                </div>
              </div>
            </div>

            {/* Tab Switches */}
            <div className="flex space-x-4 text-sm font-bold border-b border-white/10 pb-2">
              <button className="text-white border-b-2 border-white pb-2">Card</button>
              <button className="text-gray-500 pb-2">Compact</button>
            </div>

            {/* Post Card Component */}
            <PostCard 
              author="John Carter" 
              title="What We're Working on in 2024"
              content="Here's what we're getting up to this year: Making moderating easier, improving user experience, and enabling developers."
            />
            <PostCard 
              author="Emily Smith" 
              title="Easier, faster comments"
              content="Hi! I lead a number of product teams at Reddify, including one dedicated to building our comment experience..."
            />
          </div>

          {/* 3. Right Sidebar - About & Info */}
          <aside className="w-80 p-6 hidden xl:block space-y-4">
            {/* About Card */}
            <div className="bg-[#1A1A1B] border border-white/10 rounded-[16px] p-4">
              <h3 className="font-bold text-sm mb-3">About</h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                Official announcements from Reddify, Inc.
              </p>
              <div className="space-y-2 text-xs text-gray-300">
                <div className="flex items-center space-x-2"><Shield size={14}/> <span>3 members</span></div>
                <div className="flex items-center space-x-2"><MessageSquare size={14}/> <span>4 posts</span></div>
                <div className="flex items-center space-x-2 text-gray-500"><span>Created a year ago</span></div>
              </div>
            </div>

            {/* Moderators Card */}
            <div className="bg-[#1A1A1B] border border-white/10 rounded-[16px] p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-sm">Moderators</h3>
                <Info size={14} className="text-gray-500" />
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Bakoro', score: 50 },
                  { name: 'Liam Wilson', score: 28 },
                  { name: 'Charlotte Scott', score: 16 }
                ].map((mod, i) => (
                  <div key={mod.name} className="flex justify-between items-center text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500 w-3">{i+1}</span>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-orange-400 to-red-600"></div>
                      <span className="hover:underline cursor-pointer">{mod.name}</span>
                    </div>
                    <span className="text-gray-500">{mod.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

// Helper Component for Posts
const PostCard = ({ author, title, content }) => (
  <div className="bg-[#1A1A1B] border border-white/10 rounded-[16px] p-4 hover:border-white/20 transition-all cursor-pointer">
    <div className="flex items-center space-x-2 mb-2">
      <div className="w-6 h-6 rounded-full bg-emerald-500"></div>
      <span className="text-xs font-bold text-white">{author}</span>
      <span className="text-xs text-gray-500">• a year ago • Posted in r/announcements</span>
    </div>
    <h2 className="text-lg font-bold mb-2">{title}</h2>
    <p className="text-sm text-gray-400 line-clamp-3 mb-4">{content}</p>
    <div className="flex space-x-2">
      <div className="flex items-center bg-white/5 rounded-full px-3 py-1 space-x-2 text-xs font-bold">
        <ArrowUp size={14} /> <span>Upvote</span>
      </div>
      <div className="flex items-center bg-white/5 rounded-full px-3 py-1 space-x-2 text-xs font-bold">
        <Share2 size={14} /> <span>Share</span>
      </div>
    </div>
  </div>
);

export default CommunityPage;