"use client";

import React, { useState, useEffect } from 'react';

interface Comment {
  id: number;
  author: string;
  avatarColor: string;
  time: string;
  comment_text: string;
}

interface PostProps {
  id: string | number; // Added id to fetch specific comments
  subreddit: string;
  author: string;
  time: string;
  location?: string;  
  latitude:string,
  longitude:string,
  locationdistance: string;  
  title: string;
  content?: string;
  imageUrl?: string;
  votes: string;
  commentsCount: string;
  accentColor: string;
}

export const PostCard = ({ 
  id,
  subreddit, 
  author, 
  time, 
  location,
  locationdistance,
  title, 
  latitude,
  longitude,
  content, 
  imageUrl, 
  votes, 
  commentsCount, 
  accentColor 
}: PostProps) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  
  useEffect(() => {
    if (showComments && comments.length === 0) {
      const fetchComments = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`http://localhost:8015/api/post/${id}/comments/`);
          if (!response.ok) throw new Error('Failed to fetch');
          const data = await response.json();
          console.log("COMMENTS FROM API:", data);
          setComments(data);
        } catch (error) {
          console.error("Error fetching comments:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchComments();
    }
  }, [showComments, id, comments.length]);

  return (
    <article className="bg-[#0B0D10] border border-[#1F2228] rounded overflow-hidden transition mb-4 w-full">
      <div className="p-4 cursor-pointer hover:bg-[#111317]" onClick={() => setShowComments(!showComments)}>
        
        {/* Header Section (Kept Same) */}
        <div className="flex items-center flex-wrap gap-2 text-xs text-[#838891] mb-2">
          <div className={`w-5 h-5 rounded-full border border-[#1F2228] ${accentColor}`}></div>
          <span className="font-bold text-gray-300">c/{subreddit}</span>
          <span>•</span>
        <span>Posted by u/{author || "anonymous"}</span>
          <span>•</span>
          <span>{time}</span>
          {/* Replaced the second time/dot with Location UI */}
{/* Updated Location Section */}
  <span className="flex items-center gap-1 text-blue-500">
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="12" 
      height="12" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor"  /* Changed to currentColor to match text-blue-500 */
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
    <span className="font-medium">{location}</span>
  </span>
</div>
        
        
        
        
        {imageUrl && (
          <div className="w-full rounded-lg overflow-hidden border border-[#1F2228] mb-3">
            <img src={imageUrl} alt={title} className="w-full h-auto object-cover max-h-[500px]" />
          </div>
        )}
        <h2 className="text-lg font-semibold text-gray-100 mb-3">{title}</h2>
        {content && <p className="text-sm text-gray-300 mb-3 line-clamp-3">{content}</p>}

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
         
          
          <button 
            onClick={(e) => { e.stopPropagation(); setShowComments(!showComments); }}
            className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold transition border border-[#1F2228] ${showComments ? 'bg-gray-700 text-white' : 'bg-[#1A1D23] text-[#838891] hover:bg-gray-700'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            {commentsCount} Comments
          </button>
        </div>
      </div>

      {/* Comment Section */}
      {showComments && (
        <div className="border-t border-[#1F2228] bg-[#0B0D10] p-4 space-y-6">
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0"></div>
            <div className="flex-1 relative">
              <input 
                type="text" 
                placeholder="What are your thoughts?" 
                className="w-full bg-[#1A1D23] border border-[#1F2228] rounded-full py-2 px-4 text-sm text-gray-200 focus:outline-none focus:border-gray-500"
              />
            </div>
          </div>

          <div className="space-y-6 pt-2">
            {isLoading ? (
              <p className="text-xs text-gray-500 animate-pulse">Loading comments...</p>
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 group">
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 ${comment.avatarColor || 'bg-blue-500'}`}></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-gray-200">{comment.author}</span>
                      <span className="text-xs text-[#838891]">{comment.time}</span>
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
  );
};