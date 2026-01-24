"use client";

import React, { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';

interface PostProps {
  id: string | number;
  display_name: string;
  time: string;
  location?: string;  
  latitude: string,
  longitude: string,
  locationdistance: string;  
  title: string;
  content?: string;
  imageUrl?: string;
  accentColor: string;
  is_owner?: boolean; 
  onDelete?: () => void; 
}

export const PostCard = ({ 
  
  display_name, 
  time, 
  location,
  title, 
  content, 
  imageUrl, 
  accentColor,
  is_owner,
  onDelete 
}: PostProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <>
      <article className="bg-[#0B0D10] border border-[#1F2228] rounded overflow-hidden transition mb-4 w-full relative">
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            {/* Header Info */}
            <div className="flex items-center flex-wrap gap-2 text-xs text-[#838891]">
              <div className={`w-5 h-5 rounded-full border border-[#1F2228] ${accentColor}`}></div>
              {/* <span className="font-bold text-gray-300">c/{subreddit}</span> */}
              <span>•</span>
              <span >Posted by u/<span className="font-bold text-gray-300">{display_name || "anonymous"}</span></span>
              <span>•</span>
              <span>{time}</span>
              <span className="flex items-center gap-1 text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <span className="font-medium">{location}</span>
              </span>
            </div>

            {/* Delete Trigger */}
            {is_owner && (
              <button 
                onClick={() => setIsDeleting(true)}
                className="p-2 text-[#838891] hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
          
          {imageUrl && (
            <div className="w-full rounded-lg overflow-hidden border border-[#1F2228] mb-3">
              <img src={imageUrl} alt={title} className="w-full h-auto object-cover max-h-[500px]" />
            </div>
          )}

          <h2 className="text-lg font-semibold text-gray-100 mb-3">{title}</h2>
          {content && <p className="text-sm text-gray-300 mb-3 line-clamp-3">{content}</p>}
        </div>
      </article>

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleting && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            onClick={() => setIsDeleting(false)} 
          />
          <div className="relative bg-[#1A1D23] border border-[#343536] w-full max-w-xs rounded-2xl p-6 shadow-2xl text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="text-red-500 w-10 h-10" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Delete Post?</h3>
            <p className="text-[#838891] text-xs mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsDeleting(false)} 
                className="flex-1 bg-[#343536] text-white py-2 rounded-full font-bold text-xs"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (onDelete) onDelete();
                  setIsDeleting(false);
                }} 
                className="flex-1 bg-red-600 text-white py-2 rounded-full font-bold text-xs hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};