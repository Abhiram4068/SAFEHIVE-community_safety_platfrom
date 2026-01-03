"use client"; // Required for useState in Next.js App Router

import React, { useState } from 'react';

interface Comment {
  id: number;
  author: string;
  avatarColor: string;
  time: string;
  text: string;
}

interface PostProps {
  subreddit: string;
  author: string;
  time: string;
  title: string;
  content?: string;
  imageUrl?: string;
  votes: string;
  commentsCount: string;
  accentColor: string;
}

export const PostCard = ({ subreddit, author, time, title, content, imageUrl, votes, commentsCount, accentColor }: PostProps) => {
  // 1. State to handle showing/hiding comments
  const [showComments, setShowComments] = useState(false);

  // Mock comments data
  const mockComments: Comment[] = [
    { id: 1, author: "Bakoro", avatarColor: "bg-orange-400", time: "a year ago", text: "Did you pair them with any of their delicious toppings like whipped cream or fruit?" },
    { id: 2, author: "John Carter", avatarColor: "bg-teal-500", time: "a year ago", text: "Those Japanese soufflé pancakes from Flippers in Shibuya must have been amazing! So fluffy and light." }
  ];

  return (
    <article className="bg-[#0B0D10] border border-[#1F2228] rounded-lg overflow-hidden transition mb-4 w-full">
      {/* Post Content Wrapper */}
      <div className="p-4 cursor-pointer hover:bg-[#111317]" onClick={() => setShowComments(!showComments)}>
        <div className="flex items-center gap-2 text-xs text-[#838891] mb-2">
          <div className={`w-5 h-5 rounded-full border border-[#1F2228] ${accentColor}`}></div>
          <span className="font-bold text-gray-300">r/{subreddit}</span>
          <span>•</span>
          <span>Posted by u/{author}</span>
          <span>•</span>
          <span>{time}</span>
        </div>
        
        <h2 className="text-lg font-semibold text-gray-100 mb-3">{title}</h2>
        {content && <p className="text-sm text-gray-300 mb-3 line-clamp-3">{content}</p>}
        
        {imageUrl && (
          <div className="w-full rounded-lg overflow-hidden border border-[#1F2228] mb-3">
            <img src={imageUrl} alt={title} className="w-full h-auto object-cover max-h-[500px]" />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#1A1D23] rounded-full text-[#838891] font-bold text-xs border border-[#1F2228]">
            <button className="p-2 hover:bg-gray-700 hover:text-orange-500 rounded-l-full transition border-r border-[#1F2228]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
            </button>
            <span className="px-2 text-white">{votes}</span>
            <button className="p-2 hover:bg-gray-700 hover:text-blue-500 rounded-r-full transition border-l border-[#1F2228]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
            </button>
          </div>
          
          <button 
            onClick={(e) => { e.stopPropagation(); setShowComments(!showComments); }}
            className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold transition border border-[#1F2228] ${showComments ? 'bg-gray-700 text-white' : 'bg-[#1A1D23] text-[#838891] hover:bg-gray-700'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            {commentsCount} Comments
          </button>
        </div>
      </div>

      {/* 2. COMMENT SECTION (Conditional Rendering) */}
      {showComments && (
        <div className="border-t border-[#1F2228] bg-[#0B0D10] p-4 space-y-6">
          
          {/* Comment Input Box */}
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

          {/* Comment List */}
          <div className="space-y-6 pt-2">
            {mockComments.map((comment) => (
              <div key={comment.id} className="flex gap-3 group">
                <div className={`w-8 h-8 rounded-full flex-shrink-0 ${comment.avatarColor}`}></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-gray-200">{comment.author}</span>
                    <span className="text-xs text-[#838891]">{comment.time}</span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {comment.text}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <button className="text-xs font-bold text-[#838891] hover:text-white transition flex items-center gap-1">
                       <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                       Like
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};