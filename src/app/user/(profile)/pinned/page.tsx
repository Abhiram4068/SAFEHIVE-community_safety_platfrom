"use client";

import React, { useState, useEffect } from 'react';
import { Pin, ArrowLeft, Clock, MessageSquare, Megaphone, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

const ViewPinsPage = () => {
  const [activeTab, setActiveTab] = useState< 'Announcements'>();

  const [pinnedAnnouncements, setPinnedAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPins = async () => {
    try {
      setLoading(true);
      // Fetching pinned announcements as per your specific endpoint
      const [annRes] = await Promise.all([
        axios.get("/api/my-pinned-announcements/")
      ]);
      setPinnedAnnouncements(annRes.data);
      // Note: Add your pinned posts endpoint here if available
    } catch (e) {
      console.error("Failed to fetch pins", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPins();
  }, []);

  const handleUnpinAnnouncement = async (id: number) => {
    try {
      await axios.patch(`/api/announcements/${id}/unpin/`);
      setPinnedAnnouncements(prev => prev.filter(ann => ann.id !== id));
    } catch (err) {
      console.error("Failed to unpin", err);
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
                <Pin size={20} className="text-orange-500 fill-orange-500/20" /> PINNED ANNOUNCEMENTS
              </h1>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Saved for Quick Access</p>
            </div>
          </div>
        </div>

        {/* UNDERLINE TABS */}
       

        {/* CONTENT AREA */}
        <div className="min-h-[400px] pt-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-600 animate-pulse">
              <Clock size={40} className="mb-4" />
              <p className="font-bold uppercase text-[10px] tracking-widest">Accessing PINS...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pinnedAnnouncements.length > 0 ? pinnedAnnouncements.map(ann => (
                <div key={ann.id} className="bg-[#0B0D10] border border-[#1F2228] p-6 rounded-xl group hover:border-orange-500/30 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-white">{ann.title}</h3>
                    <button 
                      onClick={() => handleUnpinAnnouncement(ann.id)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-orange-500 hover:bg-orange-500/10 hover:border-orange-500/50 transition-all"
                    >
                      <RotateCcw size={12} /> Unpin
                    </button>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed mb-6">{ann.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                        <Clock size={12} /> Date: {new Date(ann.created_at).toLocaleDateString()}
                    </div>
                    <Megaphone size={14} className="text-gray-800" />
                  </div>
                </div>
              )) : <EmptyState message="No pinned broadcasts found" />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="py-24 flex flex-col items-center justify-center text-gray-700  rounded-2xl bg-[#0B0D10]/50">
    
    <p className="text-[10px] font-black uppercase tracking-[0.2em]">{message}</p>
  </div>
);

export default ViewPinsPage;