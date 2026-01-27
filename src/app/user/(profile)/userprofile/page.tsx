"use client";

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom'; // Required for the fix
import {
  Calendar, Info, ChevronRight, Trash2, AlertTriangle, 
  Bookmark, ChevronDown, Archive, PinIcon, BookmarkX
} from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  
  // Data States
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [communities, setCommunities] = useState<communityType[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [savedPosts, setSavedPosts] = useState<any[]>([]);

  // Loading States
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UI States
  const [activeTab, setActiveTab] = useState<TabType>('Posts');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [openAnnouncementMenu, setOpenAnnouncementMenu] = useState<number | null>(null);
  const [openPostMenu, setOpenPostMenu] = useState<number | null>(null);

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

  const handleDeletePost = async () => {
    if (!deleteConfirmId) return;
    try {
      await axios.delete(`/api/post/${deleteConfirmId}/delete`, { withCredentials: true });
      setPosts(posts.filter(p => p.id !== deleteConfirmId));
      setDeleteConfirmId(null);
      setOpenPostMenu(null);
    } catch (e) {
      console.error("Delete failed");
    }
  };

  const handleUnsave = async (postId: number) => {
    try {
      await axios.post(`/api/post/${postId}/unsave/`, {}, { withCredentials: true });
      setSavedPosts(prev => prev.filter(p => p.id !== postId));
      setOpenPostMenu(null);
    } catch (err) {
      console.error("Unsave failed", err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchCommunities();
  }, []);

  useEffect(() => {
    if (activeTab === "Posts") fetchMyPosts();
    if (activeTab === "Announcements") fetchAnnouncements();
    if (activeTab === "Saved") fetchSavedPosts();
    setOpenPostMenu(null);
  }, [activeTab]);

  if (loading) return <div className="p-10 text-white flex justify-center">Loading profile...</div>;
  if (error || !profile) return <div className="p-10 text-red-500">{error || "User not found"}</div>;
  
  const profileImageUrl = profile.profile_image
    ? profile.profile_image.startsWith("http")
      ? profile.profile_image
      : `http://127.0.0.1:8012${profile.profile_image.startsWith('/') ? '' : '/'}${profile.profile_image}`
    : null;

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6 items-start p-4 md:p-8 bg-black min-h-screen text-white">

      {/* --- MAIN CONTENT COLUMN --- */}
      <div className="flex-1 min-w-0 space-y-6 order-2 lg:order-1">
        {/* PROFILE HEADER */}
        <div className="bg-[#0B0D10] border border-[#1F2228] rounded-l overflow-hidden shadow-2xl">
          <div className="h-40 w-full" style={{ backgroundColor: profile.banner_color ?? "#4f46e5" }} />
          <div className="px-8 pb-8">
            <div className="flex justify-between items-end -mt-12 mb-6">
              <div className="w-32 h-32 bg-[#1A1A1B] rounded-xl border-[6px] border-[#0B0D10] shadow-2xl overflow-hidden">
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-orange-500 to-yellow-400" />
                )}
              </div>
              <div className="flex gap-2 mb-2">
                <Link href="/user/editprofile">
                  <button className="bg-white text-black font-bold px-6 py-2 rounded-full text-sm hover:bg-gray-200 transition-colors">Edit Profile</button>
                </Link>
              </div>
            </div>
            <p className="text-gray-300 text-base font-bold tracking-tight mt-1">u/{profile.display_name}</p>
            <p className="text-gray-400 text-xs uppercase tracking-widest mt-2">{profile.bio}</p>
          </div>
        </div>

        {/* TABS - Added z-10 */}
        <div className="sticky top-[0px] lg:top-[64px] z-[5] bg-black/80 backdrop-blur-md border-b border-[#1F2228] flex">

          {(['Posts', 'Announcements', 'Saved'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'text-white border-b-2 border-orange-500' : 'text-gray-500 hover:text-gray-300'}`}
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
              {activeTab === "Posts" && (
                posts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {posts.map((post) => (
                      <PostItem 
                        key={post.id} 
                        post={post} 
                        onNavigate={() => router.push(`/user/post/${post.id}`)} 
                        onDelete={setDeleteConfirmId} 
                        isMenuOpen={openPostMenu === post.id}
                        toggleMenu={() => setOpenPostMenu(openPostMenu === post.id ? null : post.id)}
                        showDelete={true} 
                      />
                    ))}
                  </div>
                ) : <EmptyState message="You haven't add any posts yet." />
              )}
              
              {activeTab === "Announcements" && (
                 announcements.length > 0 ? (
                <div className="space-y-4">
                  {announcements.map((a) => (
                   
                    <div key={a.id} className="bg-[#0B0D10] border border-[#1F2228] rounded p-6 transition-all relative overflow-hidden group">
                      <div className="pr-10">
                        <h3 className="font-bold text-white text-lg mb-2">{a.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{a.content}</p>

                        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-4">
                          {new Date(a.created_at).toLocaleDateString()} • {new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                      <button
                        onClick={() => setOpenAnnouncementMenu(openAnnouncementMenu === a.id ? null : a.id)}
                        className={`absolute bottom-4 right-4 p-1.5 rounded-lg bg-[#1A1C1E] border border-[#343536] transition-all ${openAnnouncementMenu === a.id ? 'rotate-180 bg-orange-500 border-orange-400 text-white' : 'text-gray-500 hover:text-white'}`}
                      >
                        <ChevronDown size={18} />
                      </button>

                      {openAnnouncementMenu === a.id && (
                        <div className="mt-6 pt-4 border-t border-[#1F2228] flex gap-3 animate-in slide-in-from-top-2 duration-200">
                          <button
                            onClick={async () => {
                              try {
                                await axios.patch(`/api/announcements/${a.id}/archive/`, {}, { withCredentials: true });
                                setAnnouncements(prev => prev.filter(item => item.id !== a.id));
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
                 ) : <EmptyState message="You haven't add any announcements yet." icon={<Bookmark size={40} />} />
              )}

              {activeTab === "Saved" && (
                savedPosts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {savedPosts.map((post) => (
                      <PostItem 
                        key={post.id} 
                        post={post} 
                        onNavigate={() => router.push(`/user/post/${post.id}`)} 
                        onUnsave={() => handleUnsave(post.id)}
                        isMenuOpen={openPostMenu === post.id}
                        toggleMenu={() => setOpenPostMenu(openPostMenu === post.id ? null : post.id)}
                        showUnsave={true}
                        isSaved 
                      />
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
        <div className="bg-[#0B0D10] border border-[#1F2228] rounded p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4 text-[12px] font-bold text-gray-400 uppercase tracking-widest">
            <span>About User</span>
            <Info size={14} />
          </div>
          <p className="text-sm text-gray-200 leading-relaxed mb-6">{profile.bio || "No bio set yet."}</p>
          
          <div className="space-y-3 pt-4 border-t border-[#1F2228]">
            <div className="flex items-center gap-3 text-gray-300">
              <Calendar size={18} className="text-gray-500" />
              <span className="text-sm font-semibold">Joined: {new Date(profile.created_at).toLocaleDateString()}</span>
            </div>

            {/* Added Statistics Section */}
            <div className="grid grid-cols-1 gap-2 mt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 font-medium">Posts</span>
                <span className="text-white font-bold">{posts.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 font-medium">Communities</span>
                <span className="text-white font-bold">{communities.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 font-medium">Announcements</span>
                <span className="text-white font-bold">{announcements.length}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0B0D10] border border-[#1F2228] rounded overflow-hidden">
          <div className="p-5 border-b border-[#1F2228] flex items-center justify-between text-[12px] font-bold text-gray-400 uppercase tracking-widest">
            <Link
            href="/user/my-communities"
            className="flex items-center justify-between px-3 py-2 mt-2 text-[#838891] hover:text-white transition-colors text-xs font-bold uppercase tracking-tight group"
          >
  <span>My Communities</span>
  <ChevronRight size={14} className="text-gray-600" /></Link>
</div>
  
            {communities?.slice(0, 3).map((community) => (
              <Link key={community.id} href={`/communityinfo/${community.id}`} className="flex items-center gap-3 p-4 hover:bg-[#1A1D23] transition-colors group">
                <div className={`w-8 h-8 rounded flex items-center justify-center text-white font-bold text-xs ${community.color || 'bg-blue-600'}`}>{community.name.charAt(0).toUpperCase()}</div>
                <span className="flex-1 text-sm font-bold text-gray-200 group-hover:text-white truncate">r/{community.name}</span>
                <ChevronRight size={14} className="text-gray-600" />
              </Link>
            ))}
          
        </div>

        <Link href="/user/archive" className="flex items-center justify-between w-full p-4 bg-[#0B0D10] border border-[#1F2228] rounded hover:bg-[#1A1D23] hover:border-orange-500/50 transition-all group">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
              <Archive size={20} />
            </div>
            <div className="text-left">
              <p className="text-[11px] font-black uppercase tracking-[0.1em] text-gray-400 group-hover:text-orange-500">Archived</p>
              <p className="text-xs text-gray-500 font-medium">View Archived Content</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-gray-600" />
        </Link>

        <Link href="/user/pinned" className="flex items-center justify-between w-full p-4 bg-[#0B0D10] border border-[#1F2228] rounded hover:bg-[#1A1D23] hover:border-orange-500/50 transition-all group">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
              <PinIcon size={20} />
            </div>
            <div className="text-left">
              <p className="text-[11px] font-black uppercase tracking-[0.1em] text-gray-400 group-hover:text-orange-500">Pinned</p>
              <p className="text-xs text-gray-500 font-medium">View Pinned Content</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-gray-600" />
        </Link>
      </aside>

      {/* --- DELETE CONFIRM MODAL (PORTAL) --- */}
      {deleteConfirmId && (
        <DeleteModal onCancel={() => setDeleteConfirmId(null)} onConfirm={handleDeletePost} />
      )}
    </div>
  );
};

const PostItem = ({ post, onNavigate, onDelete, onUnsave, showDelete, showUnsave, isSaved, isMenuOpen, toggleMenu }: any) => {
  return (
    <div 
      onClick={onNavigate} 
      className="bg-[#16191D] border border-[#1F2228] rounded-l overflow-hidden cursor-pointer transition-all duration-200 hover:border-[#343536] flex flex-col h-full relative group"
    >
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-white font-bold text-sm line-clamp-2 pr-10">{post.title}</h3>
          {(showDelete || showUnsave) && (
             <button
                onClick={(e) => { e.stopPropagation(); toggleMenu(); }}
                className={`absolute bottom-4 right-4 p-1.5 rounded-lg bg-[#1A1C1E] border border-[#343536] transition-all  ${isMenuOpen ? 'rotate-180 bg-orange-500 border-orange-400 text-white' : 'text-gray-500 hover:text-white'}`}
              >
                <ChevronDown size={18} />
              </button>
          )}
          {isSaved && !isMenuOpen && <Bookmark size={14} className="text-blue-500 absolute top-4 right-4" />}
        </div>
        
        <p className="text-gray-400 text-xs line-clamp-3 mb-4 leading-relaxed">
          {post.caption || post.content || "No description available."}
        </p>

        {isMenuOpen && (
          <div className="mt-2 pt-4 border-t border-[#1F2228] flex gap-3 animate-in slide-in-from-top-2 duration-200">
             {showDelete && (
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(post.id); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs font-bold text-red-500 transition-all"
                >
                  <Trash2 size={14} /> Delete
                </button>
             )}
             {showUnsave && (
                <button
                  onClick={(e) => { e.stopPropagation(); onUnsave(); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 transition-all"
                >
                  <BookmarkX size={14} /> Unsave
                </button>
             )}
          </div>
        )}

        {!isMenuOpen && (
            <div className="mt-auto pt-4 flex items-center justify-between text-[#818384] border-t border-[#1F2228]/50">
                <span className="text-[10px] font-medium">{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ message, icon }: any) => (
  <div className="py-20 flex flex-col items-center justify-center text-gray-600 border-2 border-dashed border-[#1F2228] rounded-xl w-full">
    {icon}
    <p>{message}</p>
  </div>
);

// --- MODAL WITH PORTAL ---
const DeleteModal = ({ onCancel, onConfirm }: any) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div 
        className="bg-[#0B0D10] border border-[#1F2228] w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4 text-orange-500">
          <AlertTriangle size={24} />
          <h2 className="text-xl font-bold text-white">Delete Post?</h2>
        </div>
        <p className="text-gray-400 text-sm mb-8">Are you sure? This action cannot be undone.</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-5 py-2 rounded-full text-sm font-bold text-gray-400 hover:bg-[#1A1C1E] transition-colors">Cancel</button>
          <button onClick={onConfirm} className="px-5 py-2 rounded-full text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition-colors">Delete</button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ReddifyProfile;