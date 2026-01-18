"use client";

import React, { useState, useEffect, use } from 'react';
import axios from 'axios';
import { PostCard } from '@/src/components/PostCard';
import { 
  Loader2, Search, ExternalLink, X, MessageSquare, 
  ArrowBigUp, CheckCircle
} from "lucide-react";

const POST_SERVICE_URL = "http://127.0.0.1:8000";
const MEDIA_SERVICE_URL = "http://127.0.0.1:8001";
const CATEGORY_SERVICE_URL = "http://127.0.0.1:8002";

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const categoryId = resolvedParams.slug;

  const [categoryName, setCategoryName] = useState<string>("");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

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

  useEffect(() => {
    if (!categoryId || categoryId === "undefined") return;

    async function fetchCategoryData() {
      try {
        setLoading(true);
        
        // 1. Fetch Category Name
        const categoryRes = await axios.get(`${CATEGORY_SERVICE_URL}/api/category/${categoryId}/`);
        setCategoryName(categoryRes.data.name);

        // 2. Fetch Posts for Category
        const response = await axios.get(`${POST_SERVICE_URL}/api/category/post/${categoryId}/`);
        const postsData = response.data;

        // 3. Fetch Media for each post (Same as your Home logic)
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
        console.error("Error loading category feed:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryData();
  }, [categoryId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-[#0D0F12] min-h-screen">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
        <span className="text-gray-400">Loading category feed...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full lg:max-w-2xl mx-auto pb-10 px-4 bg-[#0D0F12] min-h-screen text-white">
      
      {/* HEADING AREA */}
      <div className="mb-8 mt-10">
        <h1 className="text-2xl font-bold uppercase tracking-tight">
          <span className="text-[#838891] lowercase font-normal">seeing feeds related to  </span>
          {categoryName}
        </h1>
      </div>

      {/* FEED LIST */}
      <div className="flex flex-col gap-4">
        {posts.length > 0 ? (
          posts.map((post) => (
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
              <div className="flex items-center justify-between px-4 pb-4 -mt-2">
                <button 
                  onClick={() => handleHelpful(post.id)}
                  className={`flex items-center gap-1 text-sm transition ${post.is_helpful ? "text-green-500" : "text-[#838891] hover:text-green-400"}`}
                >
                  <CheckCircle size={16} fill={post.is_helpful ? "currentColor" : "none"} fillOpacity={0.2} />
                  <span>Helpful</span>
                </button>
                <div className="text-[11px] text-[#5c6066] italic">{post.helpful_count || 0} found this helpful</div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-[#838891] bg-[#1A1D23] p-10 rounded-xl border border-[#2D2F34] text-center">
            No posts found in this category yet.
          </div>
        )}
      </div>

      {/* ENHANCED POST DETAIL MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-[#1A1D23] w-full max-w-6xl h-[85vh] flex flex-col md:flex-row overflow-hidden rounded-2xl border border-[#2F333A] shadow-2xl relative">
            
            {/* 1. LEFT SIDE: Media Gallery */}
            <div className="flex-[1.2] bg-black flex flex-col overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden border-r border-[#2F333A]">
              {selectedPost?.media && selectedPost.media.length > 0 ? (
                <div className="flex flex-col h-full">
                  {selectedPost.media.map((item: any, idx: number) => (
                    <div key={idx} className="w-full h-full flex justify-center items-center bg-black">
                      <img 
                        src={item.displayUrl} 
                        alt="Post content" 
                        className="max-h-full max-w-full object-contain" 
                      />
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

            {/* 2. RIGHT SIDE: Details */}
            <div className="flex-1 flex flex-col h-full bg-[#1A1D23] overflow-hidden">
              <div className="flex-1 overflow-y-auto p-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex items-center gap-3 mb-6">
                  <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest ${selectedPost?.priority === "high" ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"}`}>
                    {selectedPost?.priority || "Normal"} Priority
                  </span>
                  <span className="text-sm font-bold text-[#838891]">in <span className="text-white">/{selectedPost?.category_name || "Community"}</span></span>
                </div>

                <h1 className="text-3xl font-extrabold mb-6 leading-tight tracking-tight text-white">
                  {selectedPost?.title}
                </h1>
                
                <div className="flex flex-col gap-3 mb-8 p-4 rounded-xl bg-[#16181D] border border-[#2F333A]">
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center text-white font-bold text-xs">
                      {selectedPost?.user_id ? selectedPost.user_id.toString().substring(0, 1) : "U"}
                    </div>
                    <div>
                      <p className="text-white font-semibold">User_{selectedPost?.user_id || "Anonymous"}</p>
                      <p className="text-[11px] opacity-70">
                        {selectedPost?.created_at ? new Date(selectedPost.created_at).toLocaleString() : ""}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                  {selectedPost?.caption}
                </div>
              </div>

              <div className="p-6 bg-[#16181D]/50 border-t border-[#2F333A] backdrop-blur-md">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-[#1A1D23] px-4 py-2 rounded-xl border border-[#2F333A]">
                      <ArrowBigUp size={20} className="text-orange-500" />
                      <span className="font-bold text-sm text-white">{selectedPost?.vote_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#838891] px-2">
                      <MessageSquare size={18} />
                      <span className="text-sm font-medium">{selectedPost?.comment_count || 0}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleHelpful(selectedPost?.id)}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition font-bold border text-sm shadow-lg ${
                      selectedPost?.is_helpful 
                      ? "bg-green-600 border-green-500 text-white" 
                      : "bg-white text-black border-white hover:bg-gray-200"
                    }`}
                  >
                    <CheckCircle size={18} fill={selectedPost?.is_helpful ? "white" : "none"} />
                    {selectedPost?.is_helpful ? "Helpful" : "Mark as Helpful"}
                  </button>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setSelectedPost(null)} 
              className="absolute top-4 right-4 z-50 p-2.5 bg-black/40 hover:bg-black/60 text-white rounded-full transition border border-white/10"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}