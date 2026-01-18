"use client";

import React, { useState, useEffect, use } from 'react'; // Import use
import axios from 'axios';
import { PostCard } from '@/src/components/PostCard';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  // Unwrap the params promise
  const resolvedParams = use(params);
  const categoryId = resolvedParams.slug;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch if categoryId exists and is not "undefined"
    if (!categoryId || categoryId === "undefined") return;

    async function fetchPosts() {
      try {
        setLoading(true);
        const response = await axios.get(`http://127.0.0.1:8000/api/category/post/${categoryId}/`);
        setPosts(response.data);
      } catch (error) {
        console.error("Error loading category posts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [categoryId]);

  if (loading) {
    return <div className="p-10 text-white flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      <span className="ml-3">Loading category feed...</span>
    </div>;
  }

  return (
    <div className="flex-1 w-full lg:max-w-4xl mx-auto pb-10 px-4 mt-6">
      <h1 className="text-white text-2xl font-bold mb-6 uppercase tracking-tight">
        Browsing Category: {categoryId}
      </h1>

      {posts.length > 0 ? (
        posts.map((post: any) => (
          <PostCard 
            key={post.id}
            subreddit={post.category_name || "General"}
            author={post.author_username || "anonymous"}
            time={post.time_display || "Just now"}
            title={post.title}
            content={post.content}
            imageUrl={post.image}
            votes={post.votes?.toString() || "0"}
            commentsCount={post.comments_count?.toString() || "0"}
            accentColor="bg-blue-500"
            location={post.location}
            locationdistance={post.distance}
          />
        ))
      ) : (
        <div className="text-[#838891] bg-[#15191C] p-10 rounded-xl border border-[#2D2F34] text-center">
          No posts found in this category yet.
        </div>
      )}
    </div>
  );
}