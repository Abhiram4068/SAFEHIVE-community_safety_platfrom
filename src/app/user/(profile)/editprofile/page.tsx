"use client";

import React, { useState, useRef } from 'react';
import { Camera, Save, ArrowLeft, Info, Image as ImageIcon, ShieldCheck, Trash2, Power, AlertTriangle, X, Loader2, Palette } from 'lucide-react';
import Link from 'next/link';

const EditProfilePage = ({ profileData }: any) => {
  const [formData, setFormData] = useState({
    display_name: profileData?.display_name || "",
    bio: profileData?.bio || "",
    profile_image: profileData?.profile_image || "",
    banner_color: profileData?.banner_color || "#4f46e5" 
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Modal States
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, banner_color: e.target.value });
  };

  // --- IMAGE UPLOAD LOGIC ---
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const response = await fetch('/api/proxy/upload', {
        method: 'POST',
        body: uploadData,
      });
      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      
      // Assume backend returns { url: "..." }
      setFormData(prev => ({ ...prev, profile_image: data.url }));
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  // --- FINAL SUBMISSION LOGIC ---
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/profile/update/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          display_name: formData.display_name,
          bio: formData.bio,
          profile_image: formData.profile_image,
          banner_color: formData.banner_color
        }),
      });

      if (response.ok) {
        alert("Profile updated successfully!");
        // Optional: window.location.href = "/userprofile";
      } else {
        const errorData = await response.json();
        alert(`Update failed: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Save Error:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center p-4 md:p-8 bg-black min-h-screen text-white font-sans">
      <div className="w-full max-w-4xl space-y-6">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <Link href="userprofile/" className="p-2 hover:bg-[#1A1C1E] rounded-full transition-colors border border-[#1F2228]">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold uppercase tracking-widest">Edit Profile</h1>
          </div>
        </div>

        <div className="bg-[#0B0D10] border border-[#1F2228] rounded-2xl overflow-hidden shadow-2xl">
          
          {/* BANNER AREA */}
          <div 
            className="h-40 w-full relative group transition-colors duration-500"
            style={{ backgroundColor: formData.banner_color }}
          >
             <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                <div className="flex items-center gap-2 bg-black/60 px-4 py-2 rounded-full border border-white/20">
                    <Palette size={16} />
                    <span className="text-xs font-bold uppercase tracking-tight">Change Color</span>
                </div>
                <input 
                  type="color" 
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                  value={formData.banner_color}
                  onChange={handleColorChange}
                />
             </label>
          </div>

          <div className="px-8 pb-10">
            {/* AVATAR & ACTIONS */}
            <div className="flex justify-between items-end -mt-12 mb-8">
              <div className="relative group w-32 h-32">
                <div className="w-full h-full bg-[#1A1A1B] rounded-3xl border-[6px] border-[#0B0D10] shadow-2xl overflow-hidden relative">
                    {formData.profile_image ? (
                      <img src={formData.profile_image} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-orange-500 to-yellow-400" />
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Loader2 className="animate-spin text-orange-500" size={24} />
                      </div>
                    )}
                </div>
                <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-3xl opacity-0 group-hover:opacity-100 cursor-pointer transition-all">
                    <Camera size={24} />
                    <span className="text-[10px] font-black uppercase mt-1">Upload</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              </div>

              <div className="flex gap-3 mb-2">
                <Link href="/userprofile" className="px-6 py-2 rounded-full text-sm font-bold text-gray-400 hover:bg-[#1A1C1E] transition-colors border border-[#1F2228]">
                    Cancel
                </Link>
                <button 
                    disabled={isUploading || isSaving}
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-orange-600 text-white font-bold px-6 py-2 rounded-full text-sm hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>

            {/* FORM FIELDS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Display Name</label>
                  <input 
                    type="text"
                    name="display_name"
                    value={formData.display_name}
                    onChange={handleChange}
                    className="w-full bg-[#16191D] border border-[#1F2228] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">About (Bio)</label>
                  <textarea 
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full bg-[#16191D] border border-[#1F2228] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors resize-none"
                  />
                  <p className="text-[10px] text-gray-600 text-right font-bold tracking-tighter uppercase">{formData.bio.length} / 160</p>
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <div className="bg-[#16191D]/50 border border-[#1F2228] rounded-2xl p-6 border-l-orange-600/50 border-l-2">
                  <div className="flex items-center gap-2 mb-4 text-[11px] font-black text-orange-500 uppercase tracking-widest">
                    <ShieldCheck size={14} />
                    <span>Profile Guidelines</span>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex gap-3 items-start"><div className="mt-1.5 w-1 h-1 rounded-full bg-orange-500 shrink-0" /><p className="text-xs text-gray-400 leading-relaxed">Changes to banner color and avatar are saved when you hit "Save Changes".</p></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* DANGER ZONE */}
            <div className="mt-12 pt-8 border-t border-[#1F2228] space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500/80 mb-4">Danger Zone</h3>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => setShowDisableModal(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#1F2228] text-xs font-bold text-gray-400 hover:text-orange-500 transition-all"><Power size={14} /> Disable Account</button>
                <button onClick={() => setShowDeleteModal(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#1F2228] text-xs font-bold text-gray-400 hover:text-red-500 transition-all"><Trash2 size={14} /> Delete Account</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {showDisableModal && <Modal title="Disable Account" description="Your profile will be hidden." confirmText="Disable" onConfirm={() => setShowDisableModal(false)} onCancel={() => setShowDisableModal(false)} variant="warning" />}
      {showDeleteModal && <Modal title="Delete Account" description="This is permanent." confirmText="Delete" onConfirm={() => setShowDeleteModal(false)} onCancel={() => setShowDeleteModal(false)} variant="danger" />}
    </div>
  );
};

const Modal = ({ title, description, confirmText, onConfirm, onCancel, variant }: any) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
    <div className="bg-[#0B0D10] border border-[#1F2228] w-full max-w-md rounded-2xl p-6 shadow-2xl text-white">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${variant === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'}`}><AlertTriangle size={24} /></div>
        <button onClick={onCancel} className="text-gray-500 hover:text-white"><X size={20} /></button>
      </div>
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-400 text-sm mb-8">{description}</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 px-5 py-3 rounded-xl text-sm font-bold bg-[#16191D]">Cancel</button>
        <button onClick={onConfirm} className={`flex-1 px-5 py-3 rounded-xl text-sm font-bold ${variant === 'danger' ? 'bg-red-600' : 'bg-orange-600'}`}>{confirmText}</button>
      </div>
    </div>
  </div>
);

export default EditProfilePage;