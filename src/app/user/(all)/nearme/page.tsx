"use client";

import { useState } from 'react';
import { PostCard } from '@/src/components/PostCard';
import axios from "axios";
import { useRouter } from "next/navigation";
import { MessageSquare, CheckCircle, Bookmark, ExternalLink, Search } from "lucide-react";

const MEDIA_SERVICE_URL = "http://127.0.0.1:8006";
const POST_SERVICE_URL = "http://127.0.0.1:8000";

export default function NearMe() {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // --- ADDED: HELPFUL LOGIC ---
  const handleHelpful = async (postId: number) => {
    try {
      const res = await axios.patch(`/api/post/${postId}/helpful/`);
      const { helpful, helpful_count } = res.data;
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, is_helpful: helpful, helpful_count: helpful_count } : p
        )
      );
    } catch (err) {
      console.error("Helpful toggle failed", err);
    }
  };

  // --- ADDED: SAVE LOGIC ---
  const handleSave = async (postId: number) => {
    try {
      const res = await axios.patch(`/api/post/${postId}/save/`);
      const { saved } = res.data;
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, is_saved: saved } : p))
      );
    } catch (err) {
      console.error("Save toggle failed", err);
    }
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("Your browser does not support location services.");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`/api/nearby/?lat=${latitude}&lng=${longitude}&radius=5`);
          if (!response.ok) throw new Error("Failed to fetch nearby posts.");
          const realData = await response.json();

          const postsWithMedia = await Promise.all(
            realData.map(async (post: any) => {
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
          setHasPermission(true);
        } catch (err) {
          setError("Could not connect to SafeHive services.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setLoading(false);
        setError(err.code === 1 ? "Location access denied." : "Position unavailable.");
      }
    );
  };
const filteredPosts = searchQuery.trim()
  ? posts.filter((post) =>
      `${post.title || ""} ${post.caption || ""}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
  : posts;
  return (
    <div className="flex-1 w-full lg:max-w-2xl mx-auto pb-10 px-4 bg-[#0D0F12] min-h-screen text-white">
      {!hasPermission && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-[#1F2228] rounded-xl bg-[#1A1D23] mt-10 px-6">
          <div className="bg-[#2D333B] p-4 rounded-full mb-4">
            <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">See what's happening nearby</h2>
          <button onClick={requestLocation} className="px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition">
            Share My Location
          </button>
          {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white mb-4"></div>
          <p className="text-[#838891]">Searching for nearby safe-havens...</p>
        </div>
      )}

      {hasPermission && !loading && (
        <div className="flex flex-col w-full gap-4 mt-6">
           <div className="flex justify-center mb-8 mt-4">
        <div className="relative w-full max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#838891]" />
          </div>
         <input
  type="text"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  className="block w-full pl-10 pr-3 py-2 border border-[#1F2228] rounded-full bg-[#1A1D23] text-gray-300 placeholder-[#838891] focus:outline-none focus:ring-1 focus:ring-gray-500 sm:text-sm"
  placeholder="Search SafeHive"
/>
        </div>
      </div>
          <div className="flex items-center justify-between mb-2 border-b border-[#1F2228] pb-4">
            <h2 className="text-lg font-semibold text-white">Local Feed</h2>
            <button onClick={requestLocation} className="text-xs text-blue-400 hover:underline">Refresh Location</button>
          </div>
          
          {filteredPosts.length > 0 ? (
  filteredPosts.map((post) => (
            <div key={post.id} className="relative border border-[#1F2228] rounded-xl overflow-hidden bg-[#16181D]">
              {/* INSPECT BUTTON */}
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => router.push(`/user/post/${post.id}/`)}
                  className="flex items-center gap-1 text-[11px] font-bold uppercase text-[#838891] hover:text-white transition bg-black/40 px-2 py-1 rounded-md"
                >
                  inspect <ExternalLink size={12} />
                </button>
              </div>

              <PostCard 
                display_name={post.display_name}
                time={new Date(post.created_at).toLocaleDateString()}
                title={post.title}
                content={post.caption}
                location={post.location_name || 'Global'}
                locationdistance={`${post.distance?.toFixed(1)} km away`}
                imageUrl={post.media?.[0]?.displayUrl || null}
                votes={post.vote_count || 0}
                accentColor={post.priority === "high" ? "bg-red-500" : "bg-blue-500"}
              />

              {/* INTERACTION BAR */}
              <div className="flex items-center justify-between px-4 pb-4 -mt-2">
                <div className="flex items-center gap-4">
                  <button onClick={() => router.push(`/user/post/${post.id}/`)} className="flex items-center gap-1 text-sm text-[#838891] hover:text-blue-400 transition">
                    <MessageSquare size={16} />
                    <span>View Comments</span>
                  </button>

                  <button 
                    onClick={() => handleHelpful(post.id)}
                    className={`flex items-center gap-1 text-sm transition ${post.is_helpful ? "text-green-500" : "text-[#838891] hover:text-green-400"}`}
                  >
                    <CheckCircle size={16} fill={post.is_helpful ? "currentColor" : "none"} fillOpacity={0.2} />
                    <span>Helpful ({post.helpful_count || 0})</span>
                  </button>

                  <button 
                    onClick={() => handleSave(post.id)}
                    className={`flex items-center gap-1 text-sm transition ${post.is_saved ? "text-blue-500" : "text-[#838891] hover:text-blue-400"}`}
                  >
                    <Bookmark size={16} fill={post.is_saved ? "currentColor" : "none"} fillOpacity={0.2} />
                    <span>{post.is_saved ? "Saved" : "Save"}</span>
                  </button>
                </div>
              </div>
            </div>
            ))
) : (
  <div className="text-center text-[#838891] py-10">
    No matching posts found
  </div>
)}
        </div>
      )}
    </div>
  );
}