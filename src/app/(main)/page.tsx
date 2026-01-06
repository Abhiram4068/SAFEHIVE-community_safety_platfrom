"use client";

import React, { useState, useEffect } from 'react';
import { PostCard } from '@/src/components/PostCard';
import axios from 'axios';
import { Loader2, Search } from 'lucide-react';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetching function
  const fetchAllPosts = async () => {
    try {
      setLoading(true);
      // Ensure this URL matches your Django server address
      const response = await axios.get('http://127.0.0.1:8000/api/post/all/');
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Load data on mount
  useEffect(() => {
    fetchAllPosts();
  }, []);

  return (
    <div className="flex-1 w-full lg:max-w-2xl mx-auto pb-10 px-4">
      {/* SEARCH BAR SECTION */}
      <div className="flex justify-center mb-8 mt-4">
        <div className="relative w-full max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#838891]" />
          </div>
          <input 
            type="text" 
            className="block w-full pl-10 pr-3 py-2 border border-[#1F2228] rounded-full leading-5 bg-[#1A1D23] text-gray-300 placeholder-[#838891] focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 sm:text-sm" 
            placeholder="Search SafeHive" 
          />
        </div>
      </div>

      {/* TABS SECTION */}
      <div className="flex gap-4 mb-6 border-b border-[#1F2228] pb-2 px-2">
        
        <button className="text-[#838891] hover:text-white font-medium text-sm transition pb-2">All Posts</button>
      </div>

      {/* POSTS LIST SECTION */}
      <div className="flex flex-col gap-4">
        {loading ? (
          // Loading State
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
            <p className="text-[#838891] text-sm italic">Loading latest reports...</p>
          </div>
        ) : posts.length > 0 ? (
          // Render Dynamic Posts
          posts.map((post: any) => (
            <PostCard 
              key={post.id}
              subreddit={post.category_name || "Community"} // Fallback if name is missing
              author={`User_${post.user_id}`}
              time={new Date(post.created_at).toLocaleDateString()}
              title={post.title}
              content={post.caption}
              imageUrl={post.image} 
              votes={post.vote_count || 0}
              commentsCount={post.comment_count || 0}
              accentColor={post.priority === 'high' ? 'bg-red-500' : 'bg-blue-500'}
            />
          ))
        ) : (
          // Empty State
          <div className="text-center py-20 border border-dashed border-[#1F2228] rounded-xl">
            <p className="text-[#838891]">No incidents reported yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}