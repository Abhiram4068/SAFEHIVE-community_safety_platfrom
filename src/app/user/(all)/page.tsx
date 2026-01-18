"use client";

import React, { useState, useEffect } from "react";
import { PostCard } from "@/src/components/PostCard";
import axios from "axios";
import { 
  Loader2, Search, Flag, Bookmark, ExternalLink, 
  X, MessageSquare, ArrowBigUp, CheckCircle, Clock, User 
} from "lucide-react";
import { Montserrat } from 'next/font/google';

const POST_SERVICE_URL = "http://127.0.0.1:8000";
const MEDIA_SERVICE_URL = "http://127.0.0.1:8006";
const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-montserrat',
});

// PRESET EMOJIS
const PRESET_REACTIONS = [
  { label: "Helpful", emoji: "👍", key: "helpful" },
  { label: "Urgent", emoji: "🚨", key: "urgent" },
  { label: "Angry", emoji: "😡", key: "angry" },
  { label: "Support", emoji: "🙏", key: "support" },
];

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  // YOUR REACTION LOGIC (New addition, doesn't touch your other handlers)
  const handleReaction = async (postId: number, reactionKey: string) => {
    try {
      const res = await axios.post(`${POST_SERVICE_URL}/api/post/${postId}/react/`, { 
        reaction: reactionKey 
      });
      
      const updateList = (list: any[]) => list.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            user_reaction: res.data.current_reaction,
            reaction_counts: res.data.all_counts 
          };
        }
        return p;
      });

      setPosts(prev => updateList(prev));
      if (selectedPost?.id === postId) {
        setSelectedPost((prev: any) => ({
          ...prev,
          user_reaction: res.data.current_reaction,
          reaction_counts: res.data.all_counts
        }));
      }
    } catch (err) {
      console.error("Reaction failed", err);
    }
  };

  // YOUR SAVED LOGIC (UNTOUCHED)
  const handleHelpful = async (postId: number) => {
    try {
      const res = await axios.patch(`${POST_SERVICE_URL}/api/post/${postId}/helpful/`);
      const { helpful } = res.data;
      const updatePosts = (list: any[]) =>
        list.map((p) =>
          p.id === postId
            ? {
                ...p,
                is_helpful: helpful,
                helpful_count: helpful
                  ? (p.helpful_count || 0) + 1
                  : Math.max((p.helpful_count || 1) - 1, 0),
              }
            : p
        );
      setPosts((prev) => updatePosts(prev));
      if (selectedPost?.id === postId) {
        setSelectedPost((prev: any) => ({
          ...prev,
          is_helpful: helpful,
          helpful_count: helpful
            ? (prev.helpful_count || 0) + 1
            : Math.max((prev.helpful_count || 1) - 1, 0),
        }));
      }
    } catch (err) {
      console.error("Helpful toggle failed", err);
    }
  };

  // YOUR SAVE LOGIC (UNTOUCHED)
  const handleSave = async (postId: number) => {
    if (!postId) return;
    try {
      const res = await axios.patch(`/api/post/${postId}/save/`);
      const { saved } = res.data;
      const updatePosts = (list: any[]) =>
        list.map((p) => p.id === postId ? { ...p, is_saved: saved } : p);
      setPosts((prev) => updatePosts(prev));
      if (selectedPost?.id === postId) {
        setSelectedPost((prev: any) => ({ ...prev, is_saved: saved }));
      }
    } catch (err) {
      console.error("Save toggle failed", err);
    }
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const postRes = await axios.get("/api/getpost");
      const postsData = postRes.data;
      const postsWithMedia = await Promise.all(
        postsData.map(async (post: any) => {
          try {
            const mediaRes = await axios.get(`${MEDIA_SERVICE_URL}/api/media/by-post/${post.id}/`);
            const mediaWithFullUrls = mediaRes.data.map((m: any) => {
              const filePath = m.file || m.image || ""; 
              return {
                ...m,
                displayUrl: filePath.startsWith("http") ? filePath : `${MEDIA_SERVICE_URL}${filePath}`,
              };
            });
            return { ...post, media: mediaWithFullUrls };
          } catch (error) {
            return { ...post, media: [] };
          }
        })
      );
      setPosts(postsWithMedia);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAllData(); }, []);

  return (
    <div className="flex-1 w-full lg:max-w-2xl mx-auto pb-10 px-4 bg-[#0D0F12] min-h-screen text-white">
      <br />
      <div className="flex justify-center mb-8 mt-4">
        <div className="relative w-full max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#838891]" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-[#1F2228] rounded-full bg-[#1A1D23] text-gray-300 placeholder-[#838891] focus:outline-none focus:ring-1 focus:ring-gray-500 sm:text-sm"
            placeholder="Search SafeHive"
          />
        </div>
      </div>

      <div className={`max-w-xl mx-auto mb-8 px-2 text-center ${montserrat.className}`}>
        <p className="text-[#838891] text-sm tracking-wide">
          You are seeing all reported issues.{" "}
          <a href="/user/nearme/">
            <button className="text-blue-500 hover:underline font-bold">
              Share your location
            </button>
          </a>
          {" "}to see nearby issues.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
          </div>
        ) : posts.map((post) => (
          <div key={post.id} className="relative border border-[#1F2228] rounded-xl overflow-hidden bg-[#16181D]">
            <div className="absolute top-4 right-4 z-10">
              <button 
                onClick={() => setSelectedPost(post)}
                className="flex items-center gap-1 text-[11px] font-bold uppercase text-[#838891] hover:text-white transition bg-black/40 px-2 py-1 rounded-md"
              >
                inspect <ExternalLink size={12} />
              </button>
            </div>
            <PostCard
              subreddit={post.category_name || "Community"}
              author={`User_${post.user_id}`}
              time={new Date(post.created_at).toLocaleDateString()}
              title={post.title}
              content={post.caption}
              imageUrl={post.media?.[0]?.displayUrl || null}
              votes={post.vote_count || 0}
              commentsCount={post.comment_count || 0}
              accentColor={post.priority === "high" ? "bg-red-500" : "bg-blue-500"}
            />
            
            {/* YOUR ORIGINAL ACTIONS (UNTOUCHED) */}
            <div className="flex items-center justify-between px-4 pb-2 -mt-2">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handleHelpful(post.id)}
                  className={`flex items-center gap-1 text-sm transition ${post.is_helpful ? "text-green-500" : "text-[#838891] hover:text-green-400"}`}
                >
                  <CheckCircle size={16} fill={post.is_helpful ? "currentColor" : "none"} fillOpacity={0.2} />
                  <span>Helpful</span>
                </button>
                <button 
                  onClick={() => handleSave(post.id)}
                  className={`flex items-center gap-1 text-sm transition ${post.is_saved ? "text-blue-500" : "text-[#838891] hover:text-blue-400"}`}
                >
                  <Bookmark size={16} fill={post.is_saved ? "currentColor" : "none"} fillOpacity={0.2} />
                  <span>{post.is_saved ? "Saved" : "Save"}</span>
                </button>
              </div>
              <div className="text-[11px] text-[#5c6066] italic">{post.helpful_count || 0} found this helpful</div>
            </div>

            {/* REACTION ROW ADDED BELOW */}
            <div className="flex items-center gap-2 px-4 pb-4">
              {PRESET_REACTIONS.map((reac) => (
                <button
                  key={reac.key}
                  onClick={() => handleReaction(post.id, reac.key)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-all text-[11px] font-bold ${
                    post.user_reaction === reac.key 
                    ? "bg-blue-500/20 border-blue-500 text-blue-400" 
                    : "bg-[#1A1D23] border-[#2F333A] text-[#838891] hover:border-[#40444b]"
                  }`}
                >
                  <span>{reac.emoji}</span>
                  <span>{post.reaction_counts?.[reac.key] || 0}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-[#1A1D23] w-full max-w-6xl h-[85vh] flex flex-col md:flex-row overflow-hidden rounded-2xl border border-[#2F333A] shadow-2xl relative">
            
            <div className="flex-[1.2] bg-black flex flex-col overflow-y-auto [scrollbar-width:none] border-r border-[#2F333A]">
              {selectedPost?.media && selectedPost.media.length > 0 ? (
                <div className="flex flex-col h-full">
                  {selectedPost.media.map((item: any, idx: number) => (
                    <div key={idx} className="w-full h-full flex justify-center items-center bg-black">
                      <img src={item.displayUrl} alt="Post content" className="max-h-full max-w-full object-contain" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-[#5c6066] gap-2">
                  <ExternalLink size={24} className="opacity-20" />
                  <p className="text-sm font-medium">No media attached</p>
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col h-full bg-[#1A1D23] overflow-hidden">
              <div className="flex-1 overflow-y-auto p-8 [scrollbar-width:none]">
                <div className="flex items-center gap-3 mb-6">
                  <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest ${selectedPost?.priority === "high" ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"}`}>
                    {selectedPost?.priority || "Normal"} Priority
                  </span>
                </div>

                <h1 className="text-3xl font-extrabold mb-4 text-white">{selectedPost?.title}</h1>
                <p className="text-gray-300 mb-8">{selectedPost?.caption}</p>

                {/* MODAL REACTION SELECTOR */}
                <div className="mb-8">
                  <p className="text-[10px] font-bold uppercase text-[#5c6066] mb-3 tracking-widest">How do you feel about this?</p>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_REACTIONS.map((reac) => (
                      <button
                        key={reac.key}
                        onClick={() => handleReaction(selectedPost.id, reac.key)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
                          selectedPost.user_reaction === reac.key 
                          ? "bg-blue-600 border-blue-400 text-white" 
                          : "bg-[#16181D] border-[#2F333A] text-gray-400 hover:border-gray-500"
                        }`}
                      >
                        <span>{reac.emoji}</span>
                        <span className="font-bold text-xs">{reac.label}</span>
                        <span className="opacity-50 text-[10px]">{selectedPost.reaction_counts?.[reac.key] || 0}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-[#16181D]/50 border-t border-[#2F333A] backdrop-blur-md">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 bg-[#1A1D23] px-4 py-2 rounded-xl border border-[#2F333A]">
                      <ArrowBigUp size={20} className="text-orange-500" />
                      <span className="font-bold text-sm text-white">{selectedPost?.vote_count || 0}</span>
                    </button>
                    
                    <button 
                      onClick={() => handleSave(selectedPost.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl transition border ${selectedPost?.is_saved ? "bg-blue-500/10 border-blue-500 text-blue-500" : "bg-[#1A1D23] border-[#2F333A] text-[#838891] hover:text-white"}`}
                    >
                      <Bookmark size={18} fill={selectedPost?.is_saved ? "currentColor" : "none"} />
                      <span className="text-sm font-bold">{selectedPost?.is_saved ? "Saved" : "Save"}</span>
                    </button>
                  </div>

                  <button 
                    onClick={() => handleHelpful(selectedPost?.id)}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition font-bold border text-sm ${
                      selectedPost?.is_helpful ? "bg-green-600 border-green-500 text-white" : "bg-white text-black"
                    }`}
                  >
                    <CheckCircle size={18} fill={selectedPost?.is_helpful ? "white" : "none"} />
                    {selectedPost?.is_helpful ? "Helpful" : "Mark as Helpful"}
                  </button>
                </div>
              </div>
            </div>

            <button onClick={() => setSelectedPost(null)} className="absolute top-4 right-4 z-50 p-2.5 bg-black/40 text-white rounded-full transition border border-white/10">
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}