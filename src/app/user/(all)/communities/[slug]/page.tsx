"use client";

import React, { useState, useEffect, use } from 'react';
import axios from 'axios';
import { PostCard } from '@/src/components/PostCard';
import { 
  Bell, 
  MoreHorizontal, 
  ShieldCheck, 
  Clock, 
  Users, 
  FileText, 
  X, 
  CheckCircle2 
} from 'lucide-react';

export default function CommunityPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const categoryId = resolvedParams.slug;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [joining, setJoining] = useState(false);
  const [isMember, setIsMember] = useState(false);

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

  const communityName = posts.length > 0 ? (posts[0] as any).category_name : "community";

  // Function to handle the join logic
  const handleJoin = async () => {
    setJoining(true);
    try {
      // Simulate API call to join
      // await axios.post(`http://127.0.0.1:8000/api/category/${categoryId}/join/`);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // fake delay
      
      setIsMember(true);
      setTimeout(() => setShowModal(false), 1500); // Close modal after success message
    } catch (error) {
      console.error("Join failed", error);
    } finally {
      setJoining(false);
    }
  };

  if (loading) return <div className="p-10 text-white bg-black min-h-screen">Loading...</div>;

  return (
    <div className="flex-1 bg-black min-h-screen pb-10 relative">
      
      {/* --- JOIN MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1A1A1B] border border-[#343536] w-full max-w-md rounded-xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-xl font-bold">Join r/{communityName}?</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {!isMember ? (
              <>
                <p className="text-[#D7DADC] text-sm mb-8">
                  By joining this community, you will see its posts in your home feed and be able to participate in discussions.
                </p>
                <div className="flex gap-3 justify-end">
                  <button 
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 rounded-full text-white border border-[#343536] hover:bg-[#272729] font-bold text-sm transition"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleJoin}
                    disabled={joining}
                    className="px-6 py-2 rounded-full bg-[#D7DADC] hover:bg-white text-black font-bold text-sm transition flex items-center gap-2"
                  >
                    {joining ? "Joining..." : "Confirm Join"}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center py-4 text-center">
                <CheckCircle2 className="w-12 h-12 text-green-500 mb-2 animate-bounce" />
                <p className="text-white font-bold">Successfully joined!</p>
              </div>
            )}
          </div>
        </div>
      )}

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
          <button 
            onClick={() => setShowModal(true)}
            className="bg-[#D7DADC] hover:bg-white text-black px-6 py-1.5 rounded-full font-bold flex items-center gap-2 transition"
          >
            <ShieldCheck className="w-4 h-4" /> {isMember ? "Joined" : "Join"}
          </button>
          
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
        
      </div>
    </div>
  );
}