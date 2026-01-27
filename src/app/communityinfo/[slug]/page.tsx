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
  AlertTriangle,
  Trash2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type TabType = 'posts' | 'announcements' | 'members';

export default function CommunityCenter({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const groupId = resolvedParams.slug;
  const router = useRouter();
  // Data States
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]); // Added type any[]
  const [members, setMembers] = useState<any[]>([]); 
  const [groupData, setGroupData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('posts');

  // Status States
  const [isJoined, setIsJoined] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isDismantleModalOpen, setIsDismantleModalOpen] = useState(false);
  const [isDeletePostModalOpen, setIsDeletePostModalOpen] = useState(false);
  
  // Loading/Success States
  const [isJoining, setIsJoining] = useState(false);
  const [isDismantling, setIsDismantling] = useState(false);
  const [joinedSuccess, setJoinedSuccess] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);

  useEffect(() => {
    if (!groupId || groupId === "undefined") return;

    async function fetchData() {
      try {
        setLoading(true);
        const [groupRes, postsRes, membersRes, announcementsRes] = await Promise.all([
          axios.get(`/api/community/${groupId}/get/`),
          axios.get(`/api/community/${groupId}/posts/`),
          axios.get(`http://127.0.0.1:8005/api/groups/members/${groupId}/`),
          axios.get(`/api/community/${groupId}/announcements/`)
        ]);
        setGroupData(groupRes.data);
        setPosts(postsRes.data);
        setMembers(
          Array.isArray(membersRes.data)
            ? membersRes.data
            : membersRes.data.results || []
        );
        setAnnouncements(announcementsRes.data || []);
        
        setIsJoined(groupRes.data.is_member || false);
        setIsAdmin(groupRes.data.is_admin || false);

      } catch (error) {
        console.error("Error fetching community data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [groupId]);

const handleDeleteAnnouncement = async (annId: number) => {
  try {
    await axios.delete(`/api/community/announcements/${annId}/delete/`);
    // Update local state to remove the announcement from UI immediately
    setAnnouncements((prev) => prev.filter((ann) => ann.id !== annId));
  } catch (err) {
    alert("Failed to delete announcement");
  }
};
  const handleDeletePost = async (postId: number) => {
    try {
      await axios.delete(`/api/community/posts/${postId}/delete/`);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err) {
      alert("Failed to delete post");
    }
  };

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
      alert("Error joining group.");
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeaveConfirm = async () => {
    try {
      await axios.post('/api/community/leave', { groupId });
      setIsJoined(false);
      setIsLeaveModalOpen(false);
    } catch (error) {
      console.error("Leave error:", error);
    }
  };

  const handleDismantleConfirm = async () => {
    setIsDismantling(true);
    try {
      await axios.post(`/api/community/dismantle/`,  { groupId  });
      window.location.href = '/communities'; 
    } catch (error) {
      console.error("Dismantle error:", error);
      alert("Error dismantling group.");
    } finally {
      setIsDismantling(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-white bg-black min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400 font-medium">Loading </p>
        </div>
      </div>
    );
  }

  const communityName = groupData?.name || "community";
  const communityDescription = groupData?.description || `Official discussions for ${communityName}.`;

  return (
    <div className="flex-1 bg-black min-h-screen pb-10">
      
      {/* --- JOIN MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !isJoining && setIsModalOpen(false)} />
          <div className="relative bg-[#1A1D23] border border-[#343536] w-full max-w-sm rounded-2xl p-6 shadow-2xl">
            {!joinedSuccess ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-lg">Join Community?</h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-[#818384] hover:text-white transition-colors"><X size={20} /></button>
                </div>
                <p className="text-[#818384] text-sm mb-6">Are you sure you want to join <span className="text-white font-semibold">{communityName}</span>?</p>
                <div className="flex gap-3">
                  <button disabled={isJoining} onClick={() => setIsModalOpen(false)} className="flex-1 bg-[#343536] text-white py-2 rounded-full font-bold text-sm">Cancel</button>
                  <button disabled={isJoining} onClick={handleJoinConfirm} className="flex-1 bg-white text-black py-2 rounded-full font-bold text-sm disabled:opacity-50">{isJoining ? "Joining..." : "Confirm"}</button>
                </div>
              </>
            ) : (
              <div className="py-6 flex flex-col items-center text-center">
                <CheckCircle2 className="text-green-500 w-16 h-16 mb-4 animate-in zoom-in duration-300" />
                <h3 className="text-white font-bold text-xl mb-1">Welcome aboard!</h3>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- LEAVE MODAL --- */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsLeaveModalOpen(false)} />
          <div className="relative bg-[#1A1D23] border border-[#343536] w-full max-w-sm rounded-2xl p-6 shadow-2xl text-center">
             <div className="flex justify-center mb-4"><AlertTriangle className="text-red-500 w-12 h-12" /></div>
             <h3 className="text-white font-bold text-lg mb-2">Leave {communityName}?</h3>
             <p className="text-[#818384] text-sm mb-6">You will stop seeing posts from this community in your home feed.</p>
             <div className="flex gap-3">
                <button onClick={() => setIsLeaveModalOpen(false)} className="flex-1 bg-[#343536] text-white py-2 rounded-full font-bold text-sm">Stay</button>
                <button onClick={handleLeaveConfirm} className="flex-1 bg-red-600 text-white py-2 rounded-full font-bold text-sm hover:bg-red-700">Leave</button>
             </div>
          </div>
        </div>
      )}

      {/* --- DISMANTLE MODAL --- */}
      {isDismantleModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => !isDismantling && setIsDismantleModalOpen(false)} />
          <div className="relative bg-[#1A1D23] border-2 border-red-900/50 w-full max-w-sm rounded-2xl p-8 shadow-2xl text-center">
             <div className="flex justify-center mb-4">
                <div className="bg-red-500/10 p-4 rounded-full"><Trash2 className="text-red-500 w-10 h-10" /></div>
             </div>
             <h3 className="text-white font-bold text-xl mb-2">Dismantle Group?</h3>
             <p className="text-[#818384] text-sm mb-8">This will delete all posts and members. This action is <span className="text-red-500 font-bold underline">permanent</span>.</p>
             <div className="flex flex-col gap-3">
                <button disabled={isDismantling} onClick={handleDismantleConfirm} className="w-full bg-red-600 text-white py-2.5 rounded-full font-bold text-sm hover:bg-red-700 disabled:opacity-50">
                  {isDismantling ? "Deleting Group..." : "Dismantle Group"}
                </button>
                <button disabled={isDismantling} onClick={() => setIsDismantleModalOpen(false)} className="w-full bg-[#343536] text-white py-2.5 rounded-full font-bold text-sm">Cancel</button>
             </div>
          </div>
        </div>
      )}

      {/* --- DELETE POST MODAL --- */}
      {isDeletePostModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsDeletePostModalOpen(false)} />
          <div className="relative bg-[#1A1D23] border border-[#343536] w-full max-w-sm rounded-2xl p-6 shadow-2xl text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-red-500/10 p-3 rounded-full">
                <Trash2 className="text-red-500 w-8 h-8" />
              </div>
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Delete Post?</h3>
            <p className="text-[#818384] text-sm mb-6">This action cannot be undone. Your post will be removed from the community feed.</p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeletePostModalOpen(false)} className="flex-1 bg-[#343536] text-white py-2 rounded-full font-bold text-sm">Cancel</button>
              <button 
                onClick={() => {
                  if (postToDelete) {
                    handleDeletePost(postToDelete);
                    setIsDeletePostModalOpen(false);
                  }
                }} 
                className="flex-1 bg-red-600 text-white py-2 rounded-full font-bold text-sm hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HERO BANNER */}
      <div className="w-full">
        <div className="relative w-full h-44 rounded-b-lg" style={{ backgroundColor: groupData.banner_color }}>
          <div className="absolute -bottom-6 left-10">
            <div className="w-24 h-24 rounded-full border-[6px] border-black shadow-lg overflow-hidden bg-[#FF4500]">
              {groupData?.image ? (
                <img src={groupData.image} alt={communityName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">🧡</div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 pt-10 flex justify-between items-center">
          <h1 className="text-white text-3xl font-bold tracking-tighter uppercase">{communityName}</h1>
          <div className="flex items-center gap-3">
           {isAdmin && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => router.push(`/communityinfo/${groupId}/addannouncement`)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-full font-bold text-xs transition"
                >
                  <Bell size={14} /> Add Announcement
                </button>
                <button onClick={() => setIsDismantleModalOpen(true)} className="border border-red-600/50 text-red-500 px-4 py-1.5 rounded-full font-bold text-xs hover:bg-red-500/10 transition">
                  Dismantle
                </button>
              </div>
            )}
            
            {!isAdmin && (
  isJoined ? (
    <button
      className="group relative flex items-center justify-center gap-2 border border-[#343536] text-white px-6 py-1.5 rounded-full font-bold text-sm transition-all hover:border-red-500 hover:bg-red-500/10 min-w-[110px]"
      onClick={() => setIsLeaveModalOpen(true)}
    >
      <div className="flex items-center gap-2 group-hover:hidden">
        <CheckCircle2 className="w-4 h-4 text-green-500" /> <span>Joined</span>
      </div>
      <div className="hidden group-hover:flex items-center gap-2 text-red-500">
        <X className="w-4 h-4" /> <span>Leave</span>
      </div>
    </button>
  ) : (
    <button
      onClick={() => setIsModalOpen(true)}
      className="bg-white hover:bg-gray-200 text-black px-6 py-1.5 rounded-full font-bold text-sm transition"
    >
      Join
    </button>
  )
)}

          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 mt-6 flex gap-8 border-b border-[#1A1A1B]">
          {(['posts', 'announcements', 'members'] as TabType[]).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 text-sm font-bold capitalize transition-all ${activeTab === tab ? 'text-white border-b-2 border-white' : 'text-[#818384] hover:text-white'}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {activeTab === 'posts' && (
            <div className="space-y-4">
              {posts.length > 0 ? posts.map((ann: any) => (
                <div key={ann.id} className="bg-[#0B0D10] border border-[#343536] rounded-xl p-5 hover:border-[#4a4c4d] transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-500/10 text-blue-500 p-1.5 rounded-lg"><Bell size={16} /></span>
                      <div className="flex flex-col">
                        <h3 className="text-white font-bold text-base">{ann.title}</h3>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#818384]">
                          <span>Posted by</span>
                          <span className="text-emerald-500 font-semibold hover:underline cursor-pointer">
                            {ann.author || ann.display_name || "anonymous"}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#818384] font-medium bg-[#1A1D23] px-2 py-1 rounded">
                        {new Date(ann.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                      
                      {/* DELETE OPTION FOR OWNER */}
                      {ann.is_owner && (
                        <button 
                          onClick={() => {
                            setPostToDelete(ann.id);
                            setIsDeletePostModalOpen(true);
                          }}
                          className="text-[#818384] hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-[#D7DADC] text-sm leading-relaxed whitespace-pre-wrap">{ann.description}</p>
                </div>
              )) : <EmptyState message="No announcements found for this community." />}
            </div>
          )}
          {activeTab === 'announcements' && (
            <div className="space-y-4">
              {/* Professional Admin Notice */}
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 flex gap-3 items-start">
                <div className="bg-blue-500/10 p-2 rounded-lg">
                  <Bell className="text-blue-500 w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-blue-100 text-sm font-bold">Official Broadcasts</h4>
                  <p className="text-blue-200/60 text-xs leading-relaxed mt-0.5">
                    Only community administrators can publish announcements. This feed serves as the official record for high-priority updates, policy changes, and community events.
                  </p>
                </div>
              </div>

              {/* Announcements List */}
             {announcements.length > 0 ? (
  announcements.map((ann: any) => (
    <div
      key={ann.id}
      className="bg-[#0B0D10] border border-[#343536] rounded-xl p-5 hover:border-[#4a4c4d] transition-colors group"
    >
      {/* Container for the whole header row */}
      <div className="flex items-center justify-between mb-3">
        
        {/* Left Side: Icon and Title Info */}
        <div className="flex items-center gap-3">
          <span className="bg-blue-500/10 text-blue-500 p-1.5 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-all">
            <Bell size={16} />
          </span>
          <div>
            <h3 className="text-white font-bold text-base">{ann.title}</h3>
            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">
              Administrator
            </p>
          </div>
        </div>

        {/* Right Side: Date and Delete button grouped tightly */}
        <div className="flex items-center gap-4"> 
          <span className="text-xs text-[#818384] font-medium bg-[#1A1D23] px-3 py-1 rounded">
            {new Date(ann.created_at).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          
          {isAdmin && (
            <button
              onClick={() => {
                setPostToDelete(ann.id);
                setIsDeletePostModalOpen(true);
              }}
              className="text-[#818384] hover:text-red-500 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <p className="text-[#D7DADC] text-sm leading-relaxed whitespace-pre-wrap pl-1">
        {ann.content}
      </p>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-[#1A1A1B] flex items-center">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[10px] uppercase tracking-widest text-blue-500/80 font-bold">
            Verified Update
          </span>
        </div>
      </div>
    </div>
  ))
) : (
  <div className="flex flex-col items-center justify-center py-20 border border-dashed border-[#343536] rounded-xl bg-[#0B0D10]/50">
    <Bell className="text-[#343536] w-12 h-12 mb-3" />
    <p className="text-[#818384] text-sm font-medium">No official broadcasts yet.</p>
  </div>
)}
            </div>
          )}

          {activeTab === 'members' && (
            <div className="bg-[#0B0D10] border border-[#343536] rounded-xl overflow-hidden divide-y divide-[#1A1A1B]">
              {members.map((member: any) => (
                <div key={member.id} className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">{member.display_name?.charAt(0)}</div>
                    <div><p className="text-white font-bold text-sm">{member.display_name}</p><p className="text-[#818384] text-xs">{member.role}</p></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <AboutWidget communityDescription={communityDescription} membersCount={members.length} communityName={communityName} />
          <WelcomeWidget communityName={communityName} groupId={groupId} isJoined={isJoined} setIsModalOpen={setIsModalOpen}/>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return <div className="text-[#818384] bg-[#0B0D10] border border-[#343536] p-20 rounded-xl text-center">{message}</div>;
}

function AboutWidget({ communityDescription, membersCount, communityName }: any) {
  return (
    <div className="bg-[#0B0D10] border border-[#343536] rounded-lg p-4">
      <h3 className="text-white font-bold mb-3 italic">Welcome to {communityName}</h3>
      <h3 className="text-[#818384] text-xs font-bold uppercase mb-4">About</h3>
      <p className="text-[#D7DADC] text-sm mb-4 leading-relaxed">{communityDescription}</p>
      <div className="flex items-center gap-3 text-white text-sm font-medium border-t border-[#1F2228] pt-3">
        <Users className="w-4 h-4 text-[#818384]" /> {membersCount} members
      </div>
    </div>
  );
}

function WelcomeWidget({ communityName, groupId, isJoined , setIsModalOpen}: any) {
  return (
    <div className="bg-[#0B0D10] border border-[#343536] rounded-lg p-4">
      <h3 className="text-white font-bold mb-3 ">Post Something inside</h3>
      <p className="text-[#818384] text-xs mb-3">Share an update, or note that will be visible to all community members.</p>
      { isJoined?
        (<Link href={`/communityinfo/${groupId}/addpost`} className="block w-full bg-[#D7DADC] py-2 rounded-full text-black font-bold text-sm text-center hover:bg-white transition">
        Create Post
      </Link>):(
        <button
 onClick={() => setIsModalOpen(true)}
  className="block w-full bg-[#D7DADC] py-2 rounded-full text-black font-bold text-sm text-center hover:bg-white transition"
>
  Join The Community to Share Posts
</button>
      )
      }
      
    </div>
  );
}