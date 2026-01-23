"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Bell,  
  ArrowLeft,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AnnouncementsPage() {

  const router = useRouter();

  const [announcements, setAnnouncements] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        setLoading(true);
const annRes = await axios.get('/api/admin/announcements/');
setAnnouncements(annRes.data || []);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAnnouncements();
  }, []);



  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header Navigation */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-[#343536]">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-[#1A1D23] rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="font-bold text-lg">From Admin </h1>
            </div>
          </div>

          
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-8">
        {/* Admin Info Card */}
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6 mb-8 flex gap-4">
          <div className="bg-blue-500/10 p-3 rounded-xl h-fit">
            <ShieldCheck className="text-blue-500 w-6 h-6" />
          </div>
          <div>
            <h4 className="text-blue-100 font-bold">Official Channel</h4>
            <p className="text-blue-200/60 text-sm leading-relaxed mt-1">
              Welcome to the official broadcast feed. These updates are strictly 
              from community administrators and contain important news, policy changes, and events.
            </p>
          </div>
        </div>

        {/* Announcements List */}
        <div className="space-y-6">
          {announcements.length > 0 ? (
            announcements.map((ann) => (
              <div 
                key={ann.id} 
                className="bg-[#0B0D10] border border-[#343536] rounded-2xl p-6 hover:border-[#4a4c4d] transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500/10 text-blue-400 p-2 rounded-lg">
                      <Bell size={18} />
                    </div>
                    <div>
                      <h2 className="text-white font-bold text-xl leading-tight">{ann.title}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-bold uppercase tracking-tighter">
                          Admin Post
                        </span>
                        <span className="text-[#818384] text-xs flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(ann.created_at).toLocaleDateString(undefined, { 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>


                </div>

                <div className="text-[#D7DADC] leading-relaxed whitespace-pre-wrap text-base">
                  {ann.content || ann.message}
                </div>

                <div className="mt-6 pt-4 border-t border-[#1A1A1B] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-blue-500/80 font-black">
                      Verified Update
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-[#1A1A1B] rounded-l">
              <div className="hiddentext-[#343536] w-16 h-16 mb-4" />
        
              <p className="text-[#818384] text-sm mt-1">No announcements have been posted yet.</p>
              <div className="hiddentext-[#343536] w-16 h-16 mb-4" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}