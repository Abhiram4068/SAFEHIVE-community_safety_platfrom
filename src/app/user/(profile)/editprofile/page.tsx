"use client";

import React, { useState, useEffect } from 'react';
import { Camera, Save, ArrowLeft, ShieldCheck, Trash2, Power, Palette, Loader2 } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

const EditProfilePage = () => {
  // --- Data States ---
  const [formData, setFormData] = useState({
    display_name: "",
    bio: "",
    banner_color: "#4f46e5"
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // --- 1. Fetch Latest Data on Mount ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/api/userprofile/", { withCredentials: true });
        const data = response.data;
        
        setFormData({
          display_name: data.display_name || "",
          bio: data.bio || "",
          banner_color: data.banner_color || "#4f46e5"
        });

        // Format the image URL correctly from backend path
        if (data.profile_image) {
          const fullUrl = data.profile_image.startsWith("http")
            ? data.profile_image
            : `http://127.0.0.1:8012${data.profile_image.startsWith('/') ? '' : '/'}${data.profile_image}`;
          setPreviewUrl(fullUrl);
        }
      } catch (err) {
        console.error("Failed to load profile data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // --- Handlers ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, banner_color: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Image too large (max 5MB)");
      return;
    }
    setSelectedFile(file);
    // Local preview for the newly selected file
    setPreviewUrl(URL.createObjectURL(file)); 
  };

  const handleSave = async () => {
    setIsSaving(true);
    const submissionData = new FormData();
    
    submissionData.append("display_name", formData.display_name);
    submissionData.append("bio", formData.bio);
    submissionData.append("banner_color", formData.banner_color);
    
    if (selectedFile) {
      submissionData.append('profile_image', selectedFile);
    }

    try {
      const response = await axios.put("/api/userprofile/update", submissionData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.status === 200 || response.status === 204) {
        alert("Profile updated successfully!");
      }
    } catch (error: any) {
      console.error("Save Error:", error);
      const isHtml = typeof error.response?.data === 'string' && error.response?.data.includes('<!DOCTYPE');
      const errorMsg = isHtml ? "Update endpoint not found (404)." : JSON.stringify(error.response?.data || "Error");
      alert(`Update failed: ${errorMsg}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Loading UI
  if (isLoading) {
    return (
      <div className="w-full h-screen bg-black flex flex-col items-center justify-center text-white">
        <Loader2 className="animate-spin mb-4 text-orange-500" size={40} />
        <p className="italic text-gray-400">Fetching your profile...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center p-4 md:p-8 bg-black min-h-screen text-white font-sans">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <Link href="/user/userprofile" className="p-2 hover:bg-[#1A1C1E] rounded-full transition-colors border border-[#1F2228]">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold uppercase tracking-widest">Edit Profile</h1>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-[#0B0D10] border border-[#1F2228] rounded-2xl overflow-hidden shadow-2xl">
          {/* Banner Color Selector */}
          <div className="h-40 w-full relative group transition-colors duration-500" style={{ backgroundColor: formData.banner_color }}>
             <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                <div className="flex items-center gap-2 bg-black/60 px-4 py-2 rounded-full border border-white/20">
                    <Palette size={16} /><span className="text-xs font-bold uppercase">Change Color</span>
                </div>
                <input type="color" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" value={formData.banner_color} onChange={handleColorChange} />
             </label>
          </div>

          <div className="px-8 pb-10">
            {/* Profile Image & Save Button Row */}
            <div className="flex justify-between items-end -mt-12 mb-8">
              <div className="relative group w-32 h-32">
                <div className="w-full h-full bg-[#1A1A1B] rounded-3xl border-[6px] border-[#0B0D10] shadow-2xl overflow-hidden relative">
                    {previewUrl ? (
                      <img src={previewUrl} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-orange-500 to-yellow-400" />
                    )}
                </div>
                <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-3xl opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <Camera size={24} />
                    <span className="text-[10px] font-black uppercase mt-1">Upload</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              </div>

              <div className="flex gap-3 mb-2">
                <button 
                  disabled={isSaving} 
                  onClick={handleSave} 
                  className="flex items-center gap-2 bg-orange-600 text-white font-bold px-6 py-2 rounded-full text-sm hover:bg-orange-700 transition-colors disabled:opacity-50 min-w-[140px] justify-center shadow-lg shadow-orange-900/20"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 ml-1">Display Name</label>
                  <input 
                    type="text" 
                    name="display_name" 
                    placeholder="Your new display name" 
                    value={formData.display_name} 
                    onChange={handleChange} 
                    className="w-full bg-[#16191D] border border-[#1F2228] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 ml-1">About (Bio)</label>
                  <textarea 
                    name="bio" 
                    rows={4} 
                    placeholder="Tell us about yourself" 
                    value={formData.bio} 
                    onChange={handleChange} 
                    className="w-full bg-[#16191D] border border-[#1F2228] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors resize-none" 
                  />
                  <p className="text-[10px] text-gray-600 text-right font-bold uppercase">{formData.bio.length} / 160</p>
                </div>
              </div>

              {/* Guidelines Sidebar */}
              <div className="bg-[#16191D]/50 border border-[#1F2228] rounded-2xl p-6 border-l-orange-600/50 border-l-2 h-fit">
                <div className="flex items-center gap-2 mb-4 text-[11px] font-black text-orange-500 uppercase tracking-widest">
                  <ShieldCheck size={14} /><span>Profile Guidelines</span>
                </div>
                <ul className="text-xs text-gray-400 space-y-2 leading-relaxed">
                  <li>• Max file size is 5MB.</li>
                  <li>• Supported formats: JPG, PNG, WEBP.</li>
                  <li>• Display names are visible to everyone.</li>
                </ul>
              </div>
            </div>
            
            {/* Danger Zone */}
            <div className="mt-12 pt-8 border-t border-[#1F2228] space-y-4">
                <h3 className="text-[10px] font-black uppercase text-red-500/80">Danger Zone</h3>
                <div className="flex flex-wrap gap-4">
                  <button onClick={() => setShowDisableModal(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#1F2228] text-xs font-bold text-gray-400 hover:text-orange-500 hover:border-orange-500/50 transition-all">
                    <Power size={14} /> Disable Account
                  </button>
                  <button onClick={() => setShowDeleteModal(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#1F2228] text-xs font-bold text-gray-400 hover:text-red-500 hover:border-red-500/50 transition-all">
                    <Trash2 size={14} /> Delete Account
                  </button>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {(showDisableModal || showDeleteModal) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0B0D10] border border-[#1F2228] w-full max-w-md rounded-2xl p-6 shadow-2xl text-white">
            <h2 className="text-xl font-bold mb-2">{showDeleteModal ? "Delete Account" : "Disable Account"}</h2>
            <p className="text-sm text-gray-400 mb-6">
              {showDeleteModal 
                ? "This action is permanent and cannot be undone. All your posts and data will be lost." 
                : "You can re-enable your account anytime by logging back in."}
            </p>
            <div className="flex gap-3">
              <button onClick={() => {setShowDisableModal(false); setShowDeleteModal(false)}} className="flex-1 px-5 py-3 rounded-xl text-sm font-bold bg-[#16191D] hover:bg-[#1F2228] transition-colors">Cancel</button>
              <button className={`flex-1 px-5 py-3 rounded-xl text-sm font-bold ${showDeleteModal ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700'} transition-colors`}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfilePage;