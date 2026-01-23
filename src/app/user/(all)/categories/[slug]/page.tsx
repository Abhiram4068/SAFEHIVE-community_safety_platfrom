"use client";

import React, { useState, useEffect, use } from 'react';
import axios from 'axios';
import { 
  Loader2, Search, ExternalLink, X, MessageSquare, 
  ArrowBigUp, CheckCircle, Bookmark, MapPin, Trash2, AlertTriangle
} from "lucide-react";
import { Montserrat } from 'next/font/google';

const POST_SERVICE_URL = "http://127.0.0.1:8000";
const MEDIA_SERVICE_URL = "http://127.0.0.1:8006";
const CATEGORY_SERVICE_URL = "http://127.0.0.1:8002";
const COMMENT_SERVICE_URL = "http://localhost:8015"; // From your second snippet

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-montserrat',
});

const PRESET_REACTIONS = [
  { label: "Helpful", emoji: "👍", key: "helpful" },
  { label: "Urgent", emoji: "🚨", key: "urgent" },
  { label: "Angry", emoji: "😡", key: "angry" },
  { label: "Support", emoji: "🙏", key: "support" },
];

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const categoryId = resolvedParams.slug;

  const [categoryName, setCategoryName] = useState<string>("");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  
  // States for the new comment logic integrated into the feed
  const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({});
  const [commentsData, setCommentsData] = useState<Record<number, any[]>>({});
  const [commentsLoading, setCommentsLoading] = useState<Record<number, boolean>>({});

  // --- HANDLERS ---

  const handleReaction = async (postId: number, reactionKey: string) => {
    try {
      const res = await axios.post(`${POST_SERVICE_URL}/api/post/${postId}/react/`, { 
        reaction: reactionKey 
      });
      const updateList = (list: any[]) => list.map(p => p.id === postId ? {
        ...p, user_reaction: res.data.current_reaction, reaction_counts: res.data.all_counts 
      } : p);
      setPosts(prev => updateList(prev));
      if (selectedPost?.id === postId) {
        setSelectedPost((prev: any) => ({ ...prev, user_reaction: res.data.current_reaction, reaction_counts: res.data.all_counts }));
      }
    } catch (err) { console.error("Reaction failed", err); }
  };

  const handleHelpful = async (postId: number) => {
    try {
      const res = await axios.patch(`${POST_SERVICE_URL}/api/post/${postId}/helpful/`);
      const { helpful } = res.data;
      const updatePosts = (list: any[]) => list.map((p) => p.id === postId ? {
        ...p, is_helpful: helpful,
        helpful_count: helpful ? (p.helpful_count || 0) + 1 : Math.max((p.helpful_count || 1) - 1, 0),
      } : p);
      setPosts((prev) => updatePosts(prev));
      if (selectedPost?.id === postId) {
        setSelectedPost((prev: any) => ({ ...prev, is_helpful: helpful,
          helpful_count: helpful ? (prev.helpful_count || 0) + 1 : Math.max((prev.helpful_count || 1) - 1, 0),
        }));
      }
    } catch (err) { console.error("Helpful toggle failed", err); }
  };

  const handleSave = async (postId: number) => {
    try {
      const res = await axios.patch(`${POST_SERVICE_URL}/api/post/${postId}/save/`);
      const { saved } = res.data;
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, is_saved: saved } : p));
      if (selectedPost?.id === postId) setSelectedPost((prev: any) => ({ ...prev, is_saved: saved }));
    } catch (err) { console.error("Save toggle failed", err); }
  };

  const toggleComments = async (postId: number) => {
    const isExpanding = !expandedComments[postId];
    setExpandedComments(prev => ({ ...prev, [postId]: isExpanding }));

    if (isExpanding && !commentsData[postId]) {
      setCommentsLoading(prev => ({ ...prev, [postId]: true }));
      try {
        const res = await axios.get(`${COMMENT_SERVICE_URL}/api/post/${postId}/comments/`);
        setCommentsData(prev => ({ ...prev, [postId]: res.data }));
      } catch (err) {
        console.error("Error fetching comments", err);
      } finally {
        setCommentsLoading(prev => ({ ...prev, [postId]: false }));
      }
    }
  };

  // --- DATA FETCHING ---

  useEffect(() => {
    if (!categoryId || categoryId === "undefined") return;

    async function fetchCategoryData() {
      try {
        setLoading(true);
        const categoryRes = await axios.get(`${CATEGORY_SERVICE_URL}/api/subcategory/${categoryId}/`);
        setCategoryName(categoryRes.data.name);

        const response = await axios.get(`${POST_SERVICE_URL}/posts/subcategory/${categoryId}/`);
        const postsData = response.data;

        const postsWithMedia = await Promise.all(
          postsData.map(async (post: any) => {
            try {
              const mediaRes = await axios.get(`${MEDIA_SERVICE_URL}/api/media/by-post/${post.id}/`);
              const mediaWithFullUrls = mediaRes.data.map((m: any) => {
                const filePath = m.file || m.image || ""; 
                return { ...m, displayUrl: filePath.startsWith("http") ? filePath : `${MEDIA_SERVICE_URL}${filePath}` };
              });
              return { ...post, media: mediaWithFullUrls };
            } catch { return { ...post, media: [] }; }
          })
        );
        setPosts(postsWithMedia);
      } catch (error) { console.error("Error loading category feed:", error);
      } finally { setLoading(false); }
    }
    fetchCategoryData();
  }, [categoryId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-[#0D0F12] min-h-screen">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
        <span className="text-gray-400">Loading {categoryName} feed...</span>
      </div>
    );
  }

  return (
    <div className={`flex-1 w-full lg:max-w-2xl mx-auto pb-10 px-4 bg-[#0D0F12] min-h-screen text-white ${montserrat.className}`}>
      
      {/* SEARCH BAR */}
      <div className="flex justify-center mb-8 mt-10">
        <div className="relative w-full max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#838891]" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-[#1F2228] rounded-full bg-[#1A1D23] text-gray-300 placeholder-[#838891] focus:outline-none focus:ring-1 focus:ring-gray-500 sm:text-sm"
            placeholder={`Search in ${categoryName}...`}
          />
        </div>
      </div>

      {/* HEADING AREA */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold uppercase tracking-tight">
          <span className="text-[#838891] lowercase font-normal">seeing feeds related to </span>
          {categoryName}
        </h1>
        <p className="text-[#838891] text-xs mt-2">Found {posts.length} reports</p>
      </div>

      {/* FEED LIST */}
      <div className="flex flex-col gap-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <article key={post.id} className="bg-[#0B0D10] border border-[#1F2228] rounded overflow-hidden transition relative w-full">
              
              {/* Top Right Inspect Button (Preserved logic) */}
              <div className="absolute top-4 right-4 z-10">
                <button 
                  onClick={() => setSelectedPost(post)}
                  className="flex items-center gap-1 text-[11px] font-bold uppercase text-[#838891] hover:text-white transition bg-black/40 px-2 py-1 rounded-md"
                >
                  inspect <ExternalLink size={12} />
                </button>
              </div>

              <div className="p-4 cursor-pointer hover:bg-[#111317]" onClick={() => toggleComments(post.id)}>
                {/* Header Section from new look */}
                <div className="flex items-center flex-wrap gap-2 text-xs text-[#838891] mb-2">
                  <div className={`w-5 h-5 rounded-full border border-[#1F2228] ${post.priority === "high" ? "bg-red-500" : "bg-blue-500"}`}></div>
                  <span className="font-bold text-gray-300">c/{post.category_name || categoryName}</span>
                  <span>•</span>
                  <span>Posted by u/{post.display_name || `User_${post.user_id}`}</span>
                  <span>•</span>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1 text-blue-500">
                    <MapPin size={12} />
                    <span className="font-medium">{post.location_name || 'Global'}</span>
                  </span>
                </div>

                {/* Media Preview from new look */}
                {post.media?.[0]?.displayUrl && (
                  <div className="w-full rounded-lg overflow-hidden border border-[#1F2228] mb-3 bg-black">
                    <img src={post.media[0].displayUrl} alt="Preview" className="w-full h-auto max-h-[500px] object-contain" />
                  </div>
                )}

                <h2 className="text-lg font-semibold text-gray-100 mb-3">{post.title}</h2>
                <p className="text-sm text-gray-300 mb-3 line-clamp-3 leading-relaxed">{post.caption}</p>

                {/* Interaction Row (Mixed: Look of new, Logic of old) */}
                <div className="flex items-center flex-wrap gap-3">
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleComments(post.id); }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold transition border border-[#1F2228] ${expandedComments[post.id] ? 'bg-gray-700 text-white' : 'bg-[#1A1D23] text-[#838891] hover:bg-gray-700'}`}
                  >
                    <MessageSquare size={14} />
                    {post.comment_count || 0} Comments
                  </button>

                  <button 
                    onClick={(e) => { e.stopPropagation(); handleHelpful(post.id); }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold transition border border-[#1F2228] ${post.is_helpful ? 'bg-green-500/20 text-green-500 border-green-500' : 'bg-[#1A1D23] text-[#838891] hover:bg-gray-700'}`}
                  >
                    <CheckCircle size={14} fill={post.is_helpful ? "currentColor" : "none"} fillOpacity={0.2} />
                    Helpful ({post.helpful_count || 0})
                  </button>

                  <button 
                    onClick={(e) => { e.stopPropagation(); handleSave(post.id); }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold transition border border-[#1F2228] ${post.is_saved ? 'bg-blue-500/20 text-blue-500 border-blue-500' : 'bg-[#1A1D23] text-[#838891] hover:bg-gray-700'}`}
                  >
                    <Bookmark size={14} fill={post.is_saved ? "currentColor" : "none"} fillOpacity={0.2} />
                    {post.is_saved ? "Saved" : "Save"}
                  </button>
                </div>

                {/* Reactions Row from old look (Modified to match new card spacing) */}
                <div className="flex items-center gap-2 mt-4">
                  {PRESET_REACTIONS.map((reac) => (
                    <button
                      key={reac.key}
                      onClick={(e) => { e.stopPropagation(); handleReaction(post.id, reac.key); }}
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

              {/* Inline Comments Section from new look */}
              {expandedComments[post.id] && (
                <div className="border-t border-[#1F2228] bg-[#0B0D10] p-4 space-y-6">
                  <div className="flex gap-3 items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0"></div>
                    <div className="flex-1 relative">
                      <input type="text" placeholder="What are your thoughts?" className="w-full bg-[#1A1D23] border border-[#1F2228] rounded-full py-2 px-4 text-sm text-gray-200 focus:outline-none focus:border-gray-500" />
                    </div>
                  </div>
                  <div className="space-y-6 pt-2">
                    {commentsLoading[post.id] ? (
                      <p className="text-xs text-gray-500 animate-pulse">Loading comments...</p>
                    ) : (commentsData[post.id] || []).length > 0 ? (
                      commentsData[post.id].map((comment: any) => (
                        <div key={comment.id} className="flex gap-3 group">
                          <div className={`w-8 h-8 rounded-full flex-shrink-0 ${comment.avatarColor || 'bg-blue-500'}`}></div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-bold text-gray-200">{comment.display_name}</span>
                              <span className="text-xs text-[#838891]">{comment.time || 'now'}</span>
                            </div>
                            <p className="text-sm text-gray-300 leading-relaxed">{comment.comment_text}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-500">No comments yet.</p>
                    )}
                  </div>
                </div>
              )}
            </article>
          ))
        ) : (
          <div className="text-[#838891] bg-[#1A1D23] p-10 rounded-xl border border-[#2D2F34] text-center">
            No posts found in {categoryName} yet.
          </div>
        )}
      </div>

      {/* MODAL (Original functionality preserved) */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-[#1A1D23] w-full max-w-6xl h-[85vh] flex flex-col md:flex-row overflow-hidden rounded-2xl border border-[#2F333A] shadow-2xl relative">
            {/* Modal Content - Left Media */}
            <div className="flex-[1.2] bg-black flex flex-col overflow-y-auto [scrollbar-width:none] border-r border-[#2F333A]">
              {selectedPost?.media && selectedPost.media.length > 0 ? (
                <div className="flex flex-col h-full">
                  {selectedPost.media.map((item: any, idx: number) => (
                    <div key={idx} className="w-full h-full flex justify-center items-center bg-black min-h-[50vh]">
                      <img src={item.displayUrl} alt="Content" className="max-h-full max-w-full object-contain" />
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

            {/* Modal Content - Right Details */}
            <div className="flex-1 flex flex-col h-full bg-[#1A1D23] overflow-hidden">
              <div className="flex-1 overflow-y-auto p-8 [scrollbar-width:none]">
                <div className="flex items-center gap-3 mb-6">
                  <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest ${selectedPost?.priority === "high" ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"}`}>
                    {selectedPost?.priority || "Normal"} Priority
                  </span>
                  <div className="flex flex-col leading-tight mr-2">
                    <span className="text-blue-500 font-bold text-xs flex items-center gap-1 uppercase">
                      <MapPin size={12} />
                      {selectedPost.location_name || "Unknown"}
                    </span>
                  </div>
                </div>

                <h1 className="text-3xl font-extrabold mb-4 text-white">{selectedPost?.title}</h1>
                <p className="text-gray-300 mb-8 whitespace-pre-wrap leading-relaxed">{selectedPost?.caption}</p>

                <div className="mb-8">
                  <p className="text-[10px] font-bold uppercase text-[#5c6066] mb-3 tracking-widest">Reactions</p>
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