"use client";

import React, { useState, useEffect, use } from "react";
import axios from "axios";
import { 
  Loader2, Search, ExternalLink, MessageSquare, 
  CheckCircle, Bookmark, MapPin 
} from "lucide-react";
import { Montserrat } from 'next/font/google';
import { useRouter } from "next/navigation";
import { PostCard } from "@/src/components/PostCard";

const POST_SERVICE_URL = "http://127.0.0.1:8000";
const MEDIA_SERVICE_URL = "http://127.0.0.1:8006";
const CATEGORY_SERVICE_URL = "http://127.0.0.1:8002";

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-montserrat',
});

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const categoryId = resolvedParams.slug;

  const [categoryName, setCategoryName] = useState<string>("");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // --- LOGIC FROM HOME PAGE ---





  // --- DATA FETCHING (Scoped to Category) ---

  useEffect(() => {
    if (!categoryId) return;

    async function fetchCategoryData() {
      try {
        setLoading(true);
        // 1. Fetch Category Name
        const catRes = await axios.get(`${CATEGORY_SERVICE_URL}/api/subcategory/${categoryId}/`);
        setCategoryName(catRes.data.name);

        // 2. Fetch Posts for this specific category
        const postRes = await axios.get(`${POST_SERVICE_URL}/posts/subcategory/${categoryId}/`);
        const postsData = postRes.data;

        // 3. Fetch Media for these posts
        const postsWithMedia = await Promise.all(
          postsData.map(async (post: any) => {
            try {
              const mediaRes = await axios.get(`${MEDIA_SERVICE_URL}/api/media/by-post/${post.id}/`);
              const mediaWithUrls = mediaRes.data.map((m: any) => {
                const path = m.file || m.image || "";
                return { ...m, displayUrl: path.startsWith("http") ? path : `${MEDIA_SERVICE_URL}${path}` };
              });
              return { ...post, media: mediaWithUrls };
            } catch {
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

  // Filtering logic
  const filteredPosts = posts.filter((post) => {
    const query = searchQuery.toLowerCase();
    return (
      post.title?.toLowerCase().includes(query) ||
      post.caption?.toLowerCase().includes(query) ||
      post.location_name?.toLowerCase().includes(query)
    );
  });

  return (
    <div className={`flex-1 w-full lg:max-w-2xl mx-auto pb-10 px-4 bg-[#0D0F12] min-h-screen text-white ${montserrat.className}`}>
      
      {/* SEARCH BAR (UI from Page 1) */}
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
            placeholder={`Search in ${categoryName || 'category'}...`}
          />
        </div>
      </div>

      {/* CATEGORY HEADER */}
      <div className="max-w-xl mx-auto mb-8 px-2 text-center">
        <p className="text-[#838891] text-sm tracking-wide">
          Viewing reports for <span className="text-white font-bold">{categoryName}</span>
        </p>
      </div>

      {/* FEED LIST (Exact UI from Page 1) */}
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
          </div>
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div key={post.id} className="relative border border-[#1F2228] rounded-xl overflow-hidden bg-[#16181D]">
              <div className="absolute top-4 right-4 z-10">
        <button
        onClick={() => router.push(`/user/post/${post.id}/`)}
        className="flex items-center gap-1 text-[11px] font-bold uppercase text-[#838891] hover:text-white transition bg-black/40 px-2 py-1 rounded-md"
      >
        inspect <ExternalLink size={12} />
      </button>
              </div>

              <PostCard
                display_name={post.display_name || `User_${post.user_id}`}
                time={new Date(post.created_at).toLocaleDateString()}
                title={post.title}
                content={post.caption}
                location={post.location_name || 'Global'}
                imageUrl={post.media?.[0]?.displayUrl || null}
                votes={post.vote_count || 0}
                accentColor={post.priority === "high" ? "bg-red-500" : "bg-blue-500"}
              />
              
              <div className="flex items-center justify-between px-4 pb-4 -mt-2">
                <div className="flex items-center gap-4">
                  <button onClick={() => router.push(`/user/post/${post.id}/`)} className="flex items-center gap-1 text-sm text-[#838891] hover:text-blue-400 transition">
                    <MessageSquare size={16} />
                    <span>View Comments</span>
                  </button>

                 

                 
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-[#838891] py-10">
            No posts found in this category.
          </div>
        )}
      </div>
    </div>
  );
} 