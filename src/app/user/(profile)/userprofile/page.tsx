"use client";

import React, { useEffect, useState } from 'react';
import {
  Settings, Calendar, Info, ChevronRight, MessageSquare,
  ArrowBigUp, MoreVertical, Trash2, X, AlertTriangle, Bookmark, ChevronDown, Archive, Clock, PinIcon
} from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';

// --- Interfaces ---
type communityType = {
  id: number;
  name: string;
  color?: string;
};

interface UserProfile {
  username?: string;
  full_name?: string;
  display_name: string;
  bio?: string;
  profile_image?: string;
  banner_color?: string;
  created_at: string;
}

type TabType = 'Posts' | 'Announcements' | 'Saved';

const ReddifyProfile = () => {
  // Data States
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [communities, setCommunities] = useState<communityType[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [savedPosts, setSavedPosts] = useState<any[]>([]);

  // ARCHIVE STATES
  const [archivedPosts, setArchivedPosts] = useState<any[]>([]);
  const [archivedAnnouncements, setArchivedAnnouncements] = useState<any[]>([]);
  const [archiveTab, setArchiveTab] = useState<'Posts' | 'Announcements'>('Posts');

  // Loading States
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UI States
  const [activeTab, setActiveTab] = useState<TabType>('Posts');
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [showDeleteMenu, setShowDeleteMenu] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const [openAnnouncementMenu, setOpenAnnouncementMenu] = useState<number | null>(null);

  // --- API Functions ---

  const fetchProfile = async () => {
    try {
      const response = await axios.get("/api/userprofile/", { withCredentials: true });
      setProfile(response.data);
    } catch (e) {
      setError("Failed to load profile data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCommunities = async () => {
    try {
      const res = await axios.get("/api/mycommunity/", { withCredentials: true });
      setCommunities(res.data);
    } catch (err) {
      console.error("Failed to load communities", err);
    }
  };

  const fetchMyPosts = async () => {
    try {
      setDataLoading(true);
      const res = await axios.get("/api/my-posts/", { withCredentials: true });
      setPosts(res.data);
    } catch (e) {
      console.error("Failed to fetch posts");
    } finally {
      setDataLoading(false);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      setDataLoading(true);
      const res = await axios.get("/api/my-announcements/", { withCredentials: true });
      setAnnouncements(res.data);
    } catch (e) {
      console.error("Failed to fetch announcements");
    } finally {
      setDataLoading(false);
    }
  };

  const fetchSavedPosts = async () => {
    try {
      setDataLoading(true);
      const res = await axios.get("/api/my-saved-posts/", { withCredentials: true });
      setSavedPosts(res.data);
    } catch (e) {
      console.error("Failed to fetch saved posts");
    } finally {
      setDataLoading(false);
    }
  };

  const fetchArchivedData = async () => {
    try {
      const postRes = await axios.get("/api/my-archived-posts/", { withCredentials: true });
      const annRes = await axios.get("/api/my-archived-announcements/", { withCredentials: true });
      setArchivedPosts(postRes.data);
      setArchivedAnnouncements(annRes.data);
    } catch (e) {
      console.error("Failed to fetch archives");
    }
  };

  const handleDeletePost = async () => {
    if (!deleteConfirmId) return;
    try {
      await axios.delete(`/api/post/${deleteConfirmId}/delete`, { withCredentials: true });
      setPosts(posts.filter(p => p.id !== deleteConfirmId));
      setDeleteConfirmId(null);
      setShowDeleteMenu(null);
    } catch (e) {
      console.error("Delete failed");
    }
  };

  // --- Effect Hooks ---

  useEffect(() => {
    fetchProfile();
    fetchCommunities();
    fetchArchivedData(); // Load archives initially
  }, []);

  useEffect(() => {
    if (activeTab === "Posts") fetchMyPosts();
    if (activeTab === "Announcements") fetchAnnouncements();
    if (activeTab === "Saved") fetchSavedPosts();
  }, [activeTab]);

  if (loading) return <div className="p-10 text-white flex justify-center italic">Loading profile...</div>;
  if (error || !profile) return <div className="p-10 text-red-500">{error || "User not found"}</div>;

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6 items-start p-4 md:p-8 bg-black min-h-screen text-white">

      {/* --- MAIN CONTENT COLUMN --- */}
      <div className="flex-1 min-w-0 space-y-6 order-2 lg:order-1">
        {/* PROFILE HEADER */}
        <div className="bg-[#0B0D10] border border-[#1F2228] rounded-2xl overflow-hidden shadow-2xl">
          <div
            className="h-40 w-full"
            style={{ backgroundColor: profile.banner_color ?? "#4f46e5" }}
          />
          <div className="px-8 pb-8">
            <div className="flex justify-between items-end -mt-12 mb-6">
              <div className="w-32 h-32 bg-[#1A1A1B] rounded-3xl border-[6px] border-[#0B0D10] shadow-2xl overflow-hidden">
                {profile.profile_image ? (
                  <img src={profile.profile_image} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-orange-500 to-yellow-400" />
                )}
              </div>
              <div className="flex gap-2 mb-2">
                <a href="editprofile/">
                  <button className="bg-white text-black font-bold px-6 py-2 rounded-full text-sm hover:bg-gray-200 transition-colors">Edit Profile</button>
                </a>
                <button className="p-2 bg-[#1A1C1E] border border-[#343536] rounded-full text-gray-400 hover:text-white transition-colors">
                  <Settings size={20} />
                </button>
              </div>
            </div>
            <p className="text-gray-300 text-base font-bold tracking-tight mt-1">
              u/{profile.display_name}
            </p>
            <p className="text-gray-400 text-xs uppercase tracking-widest mt-2">
              {profile.bio}
            </p>
          </div>
        </div>

        {/* TABS */}
        <div className="sticky top-[0px] lg:top-[64px] z-20 bg-black/80 backdrop-blur-md border-b border-[#1F2228] flex">
          {(['Posts', 'Announcements', 'Saved'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'text-white border-b-2 border-orange-500' : 'text-gray-500 hover:text-gray-300'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* CONTENT AREA */}
        <div className="min-h-[400px]">
          {dataLoading ? (
            <div className="py-20 text-center text-gray-500 italic">Loading content...</div>
          ) : (
            <>
              {/* POSTS TAB */}
              {activeTab === "Posts" && (
                posts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {posts.map((post) => (
                      <PostItem key={post.id} post={post} onOpen={setSelectedPost} onDelete={setDeleteConfirmId} showDelete={true} />
                    ))}
                  </div>
                ) : <EmptyState message="No posts yet." />
              )}
              {activeTab === "Announcements" && (
                <div className="space-y-4">
                  {announcements.map((a) => (
                    <div key={a.id} className="bg-[#0B0D10] border border-[#1F2228] rounded-xl p-6 transition-all relative overflow-hidden group">
                      <div className="pr-10">
                        <h3 className="font-bold text-white text-lg mb-2">{a.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{a.content}</p>

                        {/* CREATED AT VALUE */}
                        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-4">
                          {new Date(a.created_at).toLocaleDateString()} • {new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                      {/* BOTTOM RIGHT ARROW TOGGLE */}
                      <button
                        onClick={() => setOpenAnnouncementMenu(openAnnouncementMenu === a.id ? null : a.id)}
                        className={`absolute bottom-4 right-4 p-1.5 rounded-lg bg-[#1A1C1E] border border-[#343536] transition-all ${openAnnouncementMenu === a.id ? 'rotate-180 bg-orange-500 border-orange-400 text-white' : 'text-gray-500 hover:text-white'}`}
                      >
                        <ChevronDown size={18} />
                      </button>

                      {/* EXPANDABLE OPTIONS SECTION */}
                      {openAnnouncementMenu === a.id && (
                        <div className="mt-6 pt-4 border-t border-[#1F2228] flex gap-3 animate-in slide-in-from-top-2 duration-200">
                          <button
                            onClick={async () => {
                              try {
                                await axios.patch(`/api/announcements/${a.id}/archive/`, {}, { withCredentials: true });
                                setAnnouncements(prev => prev.filter(item => item.id !== a.id));
                                fetchArchivedData(); // Refresh sidebar archives
                              } catch (err) {
                                console.error("Archive failed", err);
                              }
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 transition-all"
                          >
                            <Archive size={14} /> Archive
                          </button>
                          <button
                            onClick={async () => {
                              try {
                                await axios.delete(`/api/announcements/${a.id}/delete/`, { withCredentials: true });
                                setAnnouncements(prev => prev.filter(item => item.id !== a.id));
                              } catch (err) {
                                console.error("Delete failed", err);
                              }
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs font-bold text-red-500 transition-all"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {/* SAVED TAB (FIXED) */}
              {activeTab === "Saved" && (
                savedPosts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {savedPosts.map((post) => (
                      <PostItem key={post.id} post={post} onOpen={setSelectedPost} onDelete={null} showDelete={false} isSaved />
                    ))}
                  </div>
                ) : <EmptyState message="You haven't saved any posts yet." icon={<Bookmark size={40} />} />
              )}
            </>
          )}
        </div>
      </div>

      {/* --- SIDEBAR --- */}
      <aside className="w-full lg:w-[320px] space-y-4 shrink-0 lg:sticky lg:top-[80px] order-1 lg:order-2">
        {/* About User */}
        <div className="bg-[#0B0D10] border border-[#1F2228] rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4 text-[12px] font-bold text-gray-400 uppercase tracking-widest">
            <span>About User</span>
            <Info size={14} />
          </div>
          <p className="text-sm text-gray-200 leading-relaxed mb-6">{profile.bio || "No bio set yet."}</p>
          <div className="flex items-center gap-3 text-gray-300">
            <Calendar size={18} className="text-gray-500" />
            <span className="text-sm font-semibold">Joined: {new Date(profile.created_at).toLocaleDateString()}</span>
          </div>
        </div>

       

        {/* My Communities */}
        <div className="bg-[#0B0D10] border border-[#1F2228] rounded-xl overflow-hidden">
          <div className="p-5 border-b border-[#1F2228] text-[12px] font-bold text-gray-400 uppercase tracking-widest">My Communities</div>
          <div className="divide-y divide-[#1F2228]">
            {communities?.map((community) => (
              <Link key={community.id} href={`/communityinfo/${community.id}`} className="flex items-center gap-3 p-4 hover:bg-[#1A1D23] transition-colors group">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${community.color || 'bg-blue-600'}`}>{community.name.charAt(0).toUpperCase()}</div>
                <span className="flex-1 text-sm font-bold text-gray-200 group-hover:text-white truncate">r/{community.name}</span>
                <ChevronRight size={14} className="text-gray-600 group-hover:text-white" />
              </Link>
            ))}
          </div>
        </div>
         {/* --- NEW ARCHIVE SECTION --- */}
        {/* NEW ARCHIVE BUTTON */}
  <Link 
    href="/user/archive" 
    className="flex items-center justify-between w-full p-4 bg-[#0B0D10] border border-[#1F2228] rounded-xl hover:bg-[#1A1D23] hover:border-orange-500/50 transition-all group"
  >
    <div className="flex items-center gap-3">
      <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
        <Archive size={20} />
      </div>
      <div className="text-left">
        <p className="text-[11px] font-black uppercase tracking-[0.1em] text-gray-400 group-hover:text-orange-500 transition-colors">
          Archived
        </p>
        <p className="text-xs text-gray-500 font-medium">View Archived Content</p>
      </div>
    </div>
    <ChevronRight size={18} className="text-gray-600 group-hover:text-white transition-colors" />
  </Link>
  <Link 
    href="/user/pinned" 
    className="flex items-center justify-between w-full p-4 bg-[#0B0D10] border border-[#1F2228] rounded-xl hover:bg-[#1A1D23] hover:border-orange-500/50 transition-all group"
  >
    <div className="flex items-center gap-3">
      <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
        <PinIcon size={20} />
      </div>
      <div className="text-left">
        <p className="text-[11px] font-black uppercase tracking-[0.1em] text-gray-400 group-hover:text-orange-500 transition-colors">
          Pinned
        </p>
        <p className="text-xs text-gray-500 font-medium">View Pinned Content</p>
      </div>
    </div>
    <ChevronRight size={18} className="text-gray-600 group-hover:text-white transition-colors" />
  </Link>
      </aside>

      {/* --- MODALS --- */}
      {selectedPost && <DetailModal post={selectedPost} onClose={() => setSelectedPost(null)} />}

      {deleteConfirmId && (
        <DeleteModal
          onCancel={() => setDeleteConfirmId(null)}
          onConfirm={handleDeletePost}
        />
      )}
    </div>
  );
};

// --- Sub-Components (Unchanged) ---
const PostItem = ({ post, onOpen, onDelete, showDelete, isSaved }: any) => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div onClick={() => onOpen(post)} className="bg-[#16191D] border border-[#1F2228] rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:border-[#343536] flex flex-col h-full relative group">
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-white font-bold text-sm line-clamp-2 pr-6">{post.title}</h3>
          {showDelete && (
            <div className="relative">
              <button onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }} className="p-1 hover:bg-gray-700 rounded-full text-gray-500">
                <MoreVertical size={16} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-[#1A1D23] border border-[#343536] rounded-lg shadow-2xl z-30">
                  <button onClick={(e) => { e.stopPropagation(); onDelete(post.id); setMenuOpen(false); }} className="flex items-center gap-2 w-full px-4 py-2 text-red-500 hover:bg-red-500/10 text-xs font-bold">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          )}
          {isSaved && <Bookmark size={14} className="text-blue-500" />}
        </div>
        <div className="mt-auto pt-4 flex items-center justify-between text-[#818384]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <ArrowBigUp size={16} className="text-orange-500" />
              <span className="text-xs font-bold">{post.vote_count || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare size={14} />
              <span className="text-xs font-bold">{post.comment_count || 0}</span>
            </div>
          </div>
          <span className="text-[10px] font-medium">{new Date(post.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ message, icon }: any) => (
  <div className="py-20 flex flex-col items-center justify-center text-gray-600 border-2 border-dashed border-[#1F2228] rounded-xl">
    {icon}
    <p>{message}</p>
  </div>
);

const DetailModal = ({ post, onClose }: any) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={onClose}>
    <div className="bg-[#0B0D10] border border-[#1F2228] w-full max-w-4xl rounded-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]" onClick={e => e.stopPropagation()}>
      <div className="md:flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <span className="text-orange-500 text-xs font-bold tracking-widest uppercase">r/{post.community_name || 'general'}</span>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={24} /></button>
        </div>
        <h2 className="text-2xl font-black mb-4">{post.title}</h2>
        <p className="text-gray-300 text-sm leading-relaxed mb-8">{post.caption || "No content available."}</p>
        <div className="flex gap-6 mt-auto text-gray-400 pt-6 border-t border-[#1F2228]">
          <span className="flex items-center gap-2"><ArrowBigUp className="text-orange-500" /> {post.vote_count}</span>
          <span className="flex items-center gap-2"><MessageSquare size={18} /> {post.comment_count}</span>
        </div>
      </div>
    </div>
  </div>
);

const DeleteModal = ({ onCancel, onConfirm }: any) => (
  <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
    <div className="bg-[#0B0D10] border border-[#1F2228] w-full max-w-md rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center gap-3 mb-4 text-orange-500">
        <AlertTriangle size={24} />
        <h2 className="text-xl font-bold text-white">Delete Post?</h2>
      </div>
      <p className="text-gray-400 text-sm mb-8">Are you sure? This action cannot be undone.</p>
      <div className="flex gap-3 justify-end">
        <button onClick={onCancel} className="px-5 py-2 rounded-full text-sm font-bold text-gray-400 hover:bg-[#1A1C1E]">Cancel</button>
        <button onClick={onConfirm} className="px-5 py-2 rounded-full text-sm font-bold bg-red-600 text-white hover:bg-red-700">Delete</button>
      </div>
    </div>
  </div>
);

export default ReddifyProfile;