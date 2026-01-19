"use client";

import React, { useState, useEffect } from "react";
import { PostCard } from "@/src/components/PostCard";
import axios from "axios";
import { 
  Loader2, Search, Bookmark, ExternalLink, 
  X, MessageSquare, ArrowBigUp, CheckCircle 
} from "lucide-react";
import { Montserrat } from 'next/font/google';
const POST_SERVICE_URL = "http://127.0.0.1:8000";
const MEDIA_SERVICE_URL = "http://127.0.0.1:8006";
const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-montserrat',
});
export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  // 1. Fetch All Posts and then their respective Media
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const postRes = await axios.get(`${POST_SERVICE_URL}/api/post/all/`);
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
          } catch {
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

  // 2. Fetch Comments when a post is clicked (Inspect mode)
  useEffect(() => {
    if (selectedPost?.id) {
      const fetchComments = async () => {
        setLoadingComments(true);
        try {
          const res = await axios.get(`${POST_SERVICE_URL}/api/post/${selectedPost.id}/comments/`);
          setComments(res.data);
        } catch (err) {
          console.error("Failed to fetch comments", err);
        } finally {
          setLoadingComments(false);
        }
      };
      fetchComments();
    }
  }, [selectedPost?.id]);

  useEffect(() => { fetchAllData(); }, []);

  // 3. Action Handlers (Fixed ID passing)
  const handleSave = async (postId: number) => {
    if (!postId) return;
    try {
      const res = await axios.patch(`/api/post/${postId}/save`);
      const { saved } = res.data;

      setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, is_saved: saved } : p));
      if (selectedPost?.id === postId) {
        setSelectedPost((prev: any) => ({ ...prev, is_saved: saved }));
      }
    } catch (err) {
      console.error("Save toggle failed", err);
    }
  };

  const handleHelpful = async (postId: number) => {
    if (!postId) return;
    try {
      const res = await axios.patch(`${POST_SERVICE_URL}/api/post/${postId}/helpful/`);
      const { helpful } = res.data;

      const updater = (list: any[]) => list.map((p) => p.id === postId ? {
        ...p,
        is_helpful: helpful,
        helpful_count: helpful ? (p.helpful_count || 0) + 1 : Math.max((p.helpful_count || 1) - 1, 0),
      } : p);

      setPosts((prev) => updater(prev));
      if (selectedPost?.id === postId) {
        setSelectedPost((prev: any) => ({
          ...prev,
          is_helpful: helpful,
          helpful_count: helpful ? (prev.helpful_count || 0) + 1 : Math.max((prev.helpful_count || 1) - 1, 0),
        }));
      }
    } catch (err) {
      console.error("Helpful toggle failed", err);
    }
  };

  return (
    <div className="flex-1 w-full lg:max-w-2xl mx-auto pb-10 px-4 bg-[#0D0F12] min-h-screen text-white">
      {/* Search Header */}
      <div className="flex justify-center mb-8 mt-4">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-[#838891]" />
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-[#1F2228] rounded-full bg-[#1A1D23] text-gray-300 placeholder-[#838891] focus:outline-none sm:text-sm"
            placeholder="Search SafeHive"
          />
        </div>
      </div>
 <div className={`max-w-xl mx-auto mb-8 px-2 text-center ${montserrat.className}`}>
        <p className="text-[#838891] text-sm tracking-wide">
          You are seeing all reported issues.{" "}
          <a href="/login/">
            <button className="text-blue-500 hover:underline font-bold">
              LOGIN
            </button>
          </a>
          {" "}to see nearby issues.
        </p>
      </div>
      {/* Feed List */}
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="relative border border-[#1F2228] rounded-xl overflow-hidden bg-[#16181D]">
              <div className="absolute top-4 right-4 z-10">
                <button onClick={() => setSelectedPost(post)} className="flex items-center gap-1 text-[11px] font-bold uppercase text-[#838891] hover:text-white transition bg-black/40 px-2 py-1 rounded-md">
                  inspect <ExternalLink size={12} />
                </button>
              </div>
              <PostCard
                id={post.id}
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
                <div className="flex items-center gap-4">
                  <button onClick={() => handleHelpful(post.id)} className={`flex items-center gap-1 text-sm transition ${post.is_helpful ? "text-green-500" : "text-[#838891] hover:text-green-400"}`}>
                    <CheckCircle size={16} fill={post.is_helpful ? "currentColor" : "none"} fillOpacity={0.2} />
                    <span>Helpful</span>
                  </button>
                  <button onClick={() => handleSave(post.id)} className={`flex items-center gap-1 text-sm transition ${post.is_saved ? "text-yellow-500" : "text-[#838891] hover:text-yellow-400"}`}>
                    <Bookmark size={16} fill={post.is_saved ? "currentColor" : "none"} />
                    <span>{post.is_saved ? "Saved" : "Save"}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL SECTION */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-[#1A1D23] w-full max-w-6xl h-[85vh] flex flex-col md:flex-row overflow-hidden rounded-2xl border border-[#2F333A] relative">
            
            {/* LEFT: Media Gallery */}
            <div className="flex-[1.2] bg-black flex flex-col overflow-y-auto border-r border-[#2F333A] [scrollbar-width:none]">
              {selectedPost.media?.length > 0 ? (
                selectedPost.media.map((item: any, idx: number) => (
                  <img key={idx} src={item.displayUrl} alt="media" className="w-full object-contain mb-1" />
                ))
              ) : (
                <div className="h-full flex items-center justify-center text-[#5c6066]">No Media</div>
              )}
            </div>
      
            {/* RIGHT: Scrollable Details + Comments */}
            <div className="flex-1 flex flex-col h-full bg-[#1A1D23]">
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <h1 className="text-3xl font-extrabold mb-6">{selectedPost.title}</h1>
                <p className="text-gray-300 text-lg mb-12">{selectedPost.caption}</p>

                {/* Comments Section */}
                <div className="border-t border-[#2F333A] pt-8">
                  <h3 className="text-xs font-bold uppercase text-[#838891] mb-6 flex items-center gap-2">
                    <MessageSquare size={14} /> Discussion
                  </h3>
                  <div className="space-y-6">
                    {loadingComments ? <Loader2 className="animate-spin" /> : 
                      comments.map((c: any) => (
                        <div key={c.id} className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-900 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-bold">User_{c.user_id}</p>
                            <p className="text-sm text-gray-400">{c.comment_text}</p>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
      
              {/* Footer Actions */}
              <div className="p-6 bg-[#16181D] border-t border-[#2F333A]">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 bg-[#1A1D23] px-4 py-2 rounded-xl border border-[#2F333A]">
                    <ArrowBigUp className="text-orange-500" />
                    <span className="font-bold">{selectedPost.vote_count || 0}</span>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => handleSave(selectedPost.id)} className="px-4 py-2 rounded-xl border border-[#2F333A]">
                      {selectedPost.is_saved ? "Saved" : "Save"}
                    </button>
                    <button onClick={() => handleHelpful(selectedPost.id)} className="bg-white text-black px-6 py-2 rounded-xl font-bold">
                      {selectedPost.is_helpful ? "Helpful" : "Mark Helpful"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button onClick={() => setSelectedPost(null)} className="absolute top-4 right-4 p-2 bg-black/40 rounded-full">
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}