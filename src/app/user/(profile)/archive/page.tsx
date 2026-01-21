"use client";

import React, { useState, useEffect } from 'react';
import { Archive, ArrowLeft, Clock, MessageSquare, ArrowBigUp, Inbox, Megaphone, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

const ArchivePage = () => {
  const [activeTab, setActiveTab] = useState<'Posts' | 'Announcements'>('Posts');
  const [archivedPosts, setArchivedPosts] = useState<any[]>([]);
  const [archivedAnnouncements, setArchivedAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArchives = async () => {
    try {
      setLoading(true);
      const [annRes] = await Promise.all([
        axios.get("/api/my-archived-announcements/")
      ]);
      setArchivedAnnouncements(annRes.data);
    } catch (e) {
      console.error("Failed to fetch archives", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchives();
  }, []);

  const handleUnarchiveAnnouncement = async (id: number) => {
    try {
      await axios.patch(`/api/announcements/${id}/unarchive/`);
      setArchivedAnnouncements(prev => prev.filter(ann => ann.id !== id));
    } catch (err) {
      console.error("Failed to unarchive", err);
    }
  };

  return (
    <div className="w-full flex flex-col items-center p-4 md:p-8 bg-black min-h-screen text-white font-sans">
      <div className="w-full max-w-4xl space-y-8">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#1F2228] pb-6">
          <div className="flex items-center gap-4">
            <Link href="/user/userprofile" className="p-2 hover:bg-[#1A1C1E] rounded-full transition-colors border border-[#1F2228]">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-xl font-bold uppercase tracking-widest flex items-center gap-2">
                <Archive size={20} className="text-orange-500" /> ARCHIVES
              </h1>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Hidden Archives</p>
            </div>
          </div>
        </div>

        {/* UNDERLINE TABS */}
        <div className="flex gap-8 border-b border-[#1F2228]">
          {(['Posts', 'Announcements'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-xs font-black uppercase tracking-[0.15em] transition-all relative ${
                activeTab === tab 
                ? 'text-white' 
                : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 animate-in fade-in duration-300" />
              )}
            </button>
          ))}
        </div>

        {/* CONTENT AREA */}
        <div className="min-h-[400px] pt-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-600 animate-pulse">
              <Clock size={40} className="mb-4" />
              <p className="font-bold uppercase text-[10px] tracking-widest">Accessing ARCHIVES...</p>
            </div>
          ) : activeTab === 'Posts' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {archivedPosts.length > 0 ? archivedPosts.map(post => (
                <div key={post.id} className="bg-[#0B0D10] border border-[#1F2228] p-5 rounded-xl hover:border-gray-700 transition-colors group relative overflow-hidden">
                  <h3 className="font-bold text-sm text-gray-200 group-hover:text-white transition-colors mb-4 line-clamp-2">{post.content}</h3>
                  <div className="flex items-center justify-between text-[#818384]">
                    <div className="flex gap-3">
                       <span className="flex items-center gap-1 text-[11px] font-bold"><MessageSquare size={13}/> {post.comment_count}</span>
                    </div>
                    <span className="text-[9px] font-bold text-gray-600 uppercase">{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              )) : <EmptyState message="No archived posts found" />}
            </div>
          ) : (
            <div className="space-y-4">
              {archivedAnnouncements.length > 0 ? archivedAnnouncements.map(ann => (
                <div key={ann.id} className="bg-[#0B0D10] border border-[#1F2228] p-6 rounded-xl group hover:border-orange-500/30 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-white">{ann.title}</h3>
                    {/* ADDED UNARCHIVE BUTTON */}
                    <button 
                      onClick={() => handleUnarchiveAnnouncement(ann.id)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-orange-500 hover:bg-orange-500/10 hover:border-orange-500/50 transition-all"
                    >
                      <RotateCcw size={12} /> Unarchive
                    </button>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed mb-6">{ann.content}</p>
                  <div className="flex items-center gap-2 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                    <Clock size={12} /> Date: {new Date(ann.created_at).toLocaleDateString()}
                  </div>
                </div>
              )) : <EmptyState message="No archived broadcasts found" />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="py-24 flex flex-col items-center justify-center text-gray-700 border border-[#1F2228] rounded-2xl bg-[#0B0D10]/50">
    <Archive size={32} className="mb-4 opacity-10" />
    <p className="text-[10px] font-black uppercase tracking-[0.2em]">{message}</p>
  </div>
);

export default ArchivePage;