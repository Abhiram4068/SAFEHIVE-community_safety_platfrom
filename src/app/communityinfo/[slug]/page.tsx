"use client";

import React, { useState, useEffect, use } from 'react';
import axios from 'axios';
import { PostCard } from '@/src/components/PostCard';
import { 
  Bell, 
  MoreHorizontal, 
  Users, 
  X, 
  CheckCircle2,
  AlertTriangle 
} from 'lucide-react';

type TabType = 'posts' | 'announcements' | 'members';

export default function CommunityCenter({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const groupId = resolvedParams.slug;
  
  // Data States
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [posts, setPosts] = useState([]);
  const [members, setMembers] = useState<any[]>([]); 
  const [groupData, setGroupData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('posts');

  // Membership & Modal States
  const [isJoined, setIsJoined] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false); // New state for leave popup
  const [isJoining, setIsJoining] = useState(false);
  const [joinedSuccess, setJoinedSuccess] = useState(false);

  useEffect(() => {
    if (!groupId || groupId === "undefined") return;

    async function fetchData() {
      try {
        setLoading(true);
        const [groupRes, postsRes, membersRes, announcementsRes] = await Promise.all([
          axios.get(`/api/community/${groupId}`),
          axios.get(`http://127.0.0.1:8005/api/group/${groupId}/posts/`),
          axios.get(`http://127.0.0.1:8005/api/groups/members/${groupId}/`),
          axios.get(`http://127.0.0.1:8005/api/groups/${groupId}/announcements/`)
          
        ]);
        console.log("GROUP RESPONSE:", groupRes.data);
        setGroupData(groupRes.data);
        setPosts(postsRes.data);
        setMembers(membersRes.data || []);
        setAnnouncements(announcementsRes.data || []);
        
        setIsJoined(groupRes.data.is_member || false);

      } catch (error) {
        console.error("Error fetching community data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [groupId]);

  const handleJoinConfirm = async () => {
    setIsJoining(true);
    try {
      const response = await axios.post('/api/community/join', { groupId });
      if (response.status === 200) {
        setJoinedSuccess(true);
        setIsJoined(true);
        
        setTimeout(() => {
          setIsModalOpen(false);
          setJoinedSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Join error:", error);
      alert("Error joining group.");
    } finally {
      setIsJoining(false);
    }
  };

  // Logic for leaving
  const handleLeaveConfirm = async () => {
    try {
     const response = await axios.post('/api/community/leave', { groupId });
      console.log("Calling Leave API for:", groupId);
      setIsJoined(false);
      setIsLeaveModalOpen(false);
    } catch (error) {
      console.error("Leave error:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-white bg-black min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400 font-medium">Loading r/{groupId}...</p>
        </div>
      </div>
    );
  }

  const communityName = groupData?.name || "community";
  const communityDescription = groupData?.description || `Official discussions for ${communityName}.`;

  return (
    <div className="flex-1 bg-black min-h-screen pb-10">
      
      {/* --- JOIN CONFIRMATION MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => !isJoining && setIsModalOpen(false)}
          />
          <div className="relative bg-[#1A1D23] border border-[#343536] w-full max-w-sm rounded-2xl p-6 shadow-2xl">
            {!joinedSuccess ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-lg">Join Community?</h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-[#818384] hover:text-white transition-colors">
                    <X size={20} />
                  </button>
                </div>
                <p className="text-[#818384] text-sm mb-6">
                  Are you sure you want to join <span className="text-white font-semibold">r/{communityName}</span>?
                </p>
                <div className="flex gap-3">
                  <button 
                    disabled={isJoining}
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-[#343536] text-white py-2 rounded-full font-bold text-sm hover:bg-[#444648] transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    disabled={isJoining}
                    onClick={handleJoinConfirm}
                    className="flex-1 bg-white text-black py-2 rounded-full font-bold text-sm disabled:opacity-50 hover:bg-gray-200 transition-colors"
                  >
                    {isJoining ? "Joining..." : "Confirm"}
                  </button>
                </div>
              </>
            ) : (
              <div className="py-6 flex flex-col items-center text-center">
                <CheckCircle2 className="text-green-500 w-16 h-16 mb-4 animate-in zoom-in duration-300" />
                <h3 className="text-white font-bold text-xl mb-1">Welcome aboard!</h3>
                <p className="text-[#818384] text-sm">You joined r/{communityName}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- LEAVE CONFIRMATION MODAL --- */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsLeaveModalOpen(false)}
          />
          <div className="relative bg-[#1A1D23] border border-[#343536] w-full max-w-sm rounded-2xl p-6 shadow-2xl text-center">
             <div className="flex justify-center mb-4">
                <AlertTriangle className="text-red-500 w-12 h-12" />
             </div>
             <h3 className="text-white font-bold text-lg mb-2">Leave r/{communityName}?</h3>
             <p className="text-[#818384] text-sm mb-6">
               You will stop seeing posts from this community in your home feed.
             </p>
             <div className="flex gap-3">
                <button 
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="flex-1 bg-[#343536] text-white py-2 rounded-full font-bold text-sm"
                >
                  Stay
                </button>
                <button 
                  onClick={handleLeaveConfirm}
                  className="flex-1 bg-red-600 text-white py-2 rounded-full font-bold text-sm hover:bg-red-700 transition-colors"
                >
                  Leave
                </button>
             </div>
          </div>
        </div>
      )}

      {/* HERO BANNER */}
      <div className="w-full">
        <div className="relative w-full h-44 bg-[#D9C4B1] rounded-b-lg">
          <div className="absolute -bottom-6 left-10">
            <div className="w-24 h-24 rounded-full bg-[#FF4500] border-[6px] border-black flex items-center justify-center text-4xl shadow-lg">
              {groupData?.icon || "🧡"}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 pt-10 flex justify-between items-center">
          <h1 className="text-white text-3xl font-bold tracking-tighter uppercase">
            r/{communityName}
          </h1>
          
         <div className="flex items-center gap-2">
  {isJoined ? (
    <button
      className="group relative flex items-center justify-center gap-2 
                 border border-[#343536] text-white px-6 py-1.5 
                 rounded-full font-bold text-sm transition-all 
                 hover:border-red-500 hover:bg-red-500/10 min-w-[110px]"
      onClick={() => setIsLeaveModalOpen(true)} // Changed to trigger leave modal
    >
      <div className="flex items-center gap-2 group-hover:hidden">
        <CheckCircle2 className="w-4 h-4 text-green-500" />
        <span>Joined</span>
      </div>

      <div className="hidden group-hover:flex items-center gap-2 text-red-500">
        <X className="w-4 h-4" />
        <span>Leave</span>
      </div>
    </button>
  ) : (
    <button
      onClick={() => setIsModalOpen(true)}
      className="bg-white hover:bg-gray-200 text-black 
                 px-6 py-1.5 rounded-full font-bold text-sm transition"
    >
      Join
    </button>
  )}

  <button className="p-2 border border-[#343536] rounded-full text-white hover:bg-[#1A1A1B] transition-colors">
    <Bell className="w-5 h-5" />
  </button>

  <button className="p-2 border border-[#343536] rounded-full text-white hover:bg-[#1A1A1B] transition-colors">
    <MoreHorizontal className="w-5 h-5" />
  </button>
</div>

        </div>

        {/* TABS */}
        <div className="max-w-6xl mx-auto px-6 mt-6 flex gap-8 border-b border-[#1A1A1B]">
          {(['posts', 'announcements', 'members'] as TabType[]).map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-bold capitalize transition-all ${activeTab === tab ? 'text-white border-b-2 border-white' : 'text-[#818384] hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-6 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {activeTab === 'posts' && (
            posts.length > 0 ? posts.map((ann: any) => <PostCard key={ann.id} {...ann} content={ann.description} />) : <EmptyState message="No posts yet." />
          )}
          {activeTab === 'announcements' && (
            announcements.length > 0 ? announcements.map((ann: any) => <PostCard key={ann.id} {...ann} content={ann.description} />) : <EmptyState message="No announcements." />
          )}
          {activeTab === 'members' && (
            <div className="bg-[#0B0D10] border border-[#343536] rounded-xl overflow-hidden divide-y divide-[#1A1A1B]">
              {members.map((member: any) => (
                <div key={member.id} className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">{member.display_name?.charAt(0)}</div>
                    <div><p className="text-white font-bold text-sm">{member.display_name}</p><p className="text-[#818384] text-xs">Member</p></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <AboutWidget communityDescription={communityDescription} membersCount={members.length} />
          <WelcomeWidget communityName={communityName} />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return <div className="text-[#818384] bg-[#0B0D10] border border-[#343536] p-20 rounded-xl text-center">{message}</div>;
}

function AboutWidget({ communityDescription, membersCount }: any) {
  return (
    <div className="bg-[#0B0D10] border border-[#343536] rounded-lg p-4">
      <h3 className="text-[#818384] text-xs font-bold uppercase mb-4">About</h3>
      <p className="text-[#D7DADC] text-sm mb-4 leading-relaxed">{communityDescription}</p>
      <div className="flex items-center gap-3 text-white text-sm font-medium border-t border-[#1F2228] pt-3">
        <Users className="w-4 h-4 text-[#818384]" /> {membersCount} members
      </div>
    </div>
  );
}

function WelcomeWidget({ communityName }: any) {
  return (
    <div className="bg-[#0B0D10] border border-[#343536] rounded-lg p-4">
      <h3 className="text-white font-bold mb-3 italic">Welcome to r/{communityName}</h3>
      <button className="w-full bg-[#D7DADC] py-2 rounded-full text-black font-bold text-sm hover:bg-white transition">Create Post</button>
    </div>
  );
}