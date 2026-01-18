"use client";

import { useState } from 'react';
import { PostCard } from '@/src/components/PostCard';

export default function NearMe() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("Your browser does not support location services.");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // 1. CAPTURE REAL COORDINATES
        const { latitude, longitude } = position.coords;
        
        try {
          // 2. FETCH FROM DJANGO BACKEND
          // Note: Radius is set to 5km by default here
const response = await fetch(
  `/api/nearby/?lat=${latitude}&lng=${longitude}&radius=5`
);

          if (!response.ok) {
            throw new Error("Failed to fetch nearby posts from server.");
          }

          const realData = await response.json();
          
          // 3. UPDATE STATE WITH REAL DATA
          setPosts(realData);
          setHasPermission(true);
        } catch (err) {
          setError("Could not connect to SafeHive services. Please try again.");
          console.error("Fetch error:", err);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setLoading(false);
        if (err.code === 1) {
          setError("Location access was denied. Please allow access to see local posts.");
        } else {
          setError("Position unavailable. Please try again later.");
        }
      }
    );
  };

  return (
    <div className="flex-1 w-full lg:max-w-2xl mx-auto pb-10 px-4">
      {/* 1. INITIAL PERMISSION STATE */}
      {!hasPermission && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-[#1F2228] rounded-xl bg-[#1A1D23] mt-10 px-6">
          <div className="bg-[#2D333B] p-4 rounded-full mb-4">
            <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">See what's happening nearby</h2>
          <p className="text-[#838891] mb-6 max-w-sm">
            Allow location access to find posts, events, and discussions within 5km of your current area.
          </p>
          <button 
            onClick={requestLocation}
            className="px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition active:scale-95"
          >
            Share My Location
          </button>
          {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}
        </div>
      )}

      {/* 2. LOADING STATE */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white mb-4"></div>
          <p className="text-[#838891] animate-pulse">Searching for nearby safe-havens...</p>
        </div>
      )}

      {/* 3. POSTS FEED (Real Data) */}
      {hasPermission && !loading && (
        <div className="flex flex-col w-full animate-in fade-in duration-500">
          <div className="flex items-center justify-between mb-6 border-b border-[#1F2228] pb-4">
            <h2 className="text-lg font-semibold text-white">Local Feed</h2>
            <button onClick={requestLocation} className="text-xs text-blue-400 hover:underline">
              Refresh Location
            </button>
          </div>
          
          {posts.length > 0 ? (
            posts.map((post, index) => (
                <PostCard 
                    key={post.id || index} 
                    subreddit={post.category_id || "local"}
                    author={`user_${post.user_id}`}
                    time={new Date(post.created_at).toLocaleDateString()}
                    locationdistance={`${post.distance} km away`}
                    location={post.location_name}
                    title={post.title}
                    content={post.caption}
                    votes={post.vote_count || 0}
                    commentsCount={post.comment_count}
                    accentColor="bg-blue-500"
                />
            ))
          ) : (
            <div className="text-center py-10">
                <p className="text-[#838891]">No posts found within 5km of you.</p>
                <button onClick={requestLocation} className="mt-4 text-blue-400 text-sm">Try expanding search radius</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}