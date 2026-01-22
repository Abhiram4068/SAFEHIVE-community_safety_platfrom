"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShieldAlert, Camera, Palette, X } from 'lucide-react';
import axios from 'axios';

export default function CreateCommunityPage() {
    const [newName, setNewName] = useState("");
    const [description, setDescription] = useState(""); 
    const [bannerColor, setBannerColor] = useState("#2563eb");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    async function handleCreateCommunity(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('name', newName);
        formData.append('description', description);
        formData.append('banner_color', bannerColor);
        if (image) formData.append('image', image);

        try {
            const response = await axios.post("/api/community/create/", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.status === 200 || response.status === 201) {
                router.push('/user/communities/'); 
                router.refresh();
            }
        } catch (error) {
            console.error("Error creating community:", error);
            alert("Failed to create community.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#0F1215] flex items-center justify-center p-4 md:p-10">
            <div className="bg-[#15191C] border border-[#2D2F34] p-8 md:p-12 rounded-none w-full max-w-5xl shadow-xl">
                
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-[#838891] hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft size={18} />
                    <span className="text-sm font-medium">Back to communities</span>
                </button>

                <div className="mb-10">
                    <h2 className="text-white text-3xl font-bold mb-2">Create a Community</h2>
                    <p className="text-[#838891] text-sm border-b border-[#2D2F34] pb-6">
                        Build a new space for your interests.
                    </p>
                </div>
                {/* GUIDELINES */}
                <div className="mb-10 bg-[#1A1D23] border-l-4 border-blue-500 p-6">
                    
                    <div className="flex items-center gap-3 mb-4">
                        <ShieldAlert className="text-blue-500 w-5 h-5" />
                        <h3 className="text-white font-bold text-sm uppercase tracking-widest">Community Guidelines</h3>
                    </div>
                    <ul className="space-y-3">
                        <li className="flex gap-3 text-sm text-[#838891]">
                            <span className="text-blue-500">•</span>
                            <span>This platform is intended only for community safety and public awareness.</span>
                        </li>
                        <li className="flex gap-3 text-sm text-[#838891]">
                            <span className="text-blue-500">•</span>
                            <span>Communities must focus on safety, awareness, or public-interest topics only.</span>
                        </li>
                    </ul>
                </div>

                
                <form onSubmit={handleCreateCommunity}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        
                        {/* LEFT COLUMN */}
                        <div className="space-y-6">
                            <div>
                                <label className="text-white text-lg font-bold block mb-1">Community Name</label>
                                <p className="text-[#838891] text-xs mb-4">Uppercase and lowercase letters matter.</p>
                                <div className="relative">
                                    <span className="absolute left-4 top-3.5 text-[#838891] text-base font-medium">r/</span>
                                    <input 
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        className="w-full bg-[#1A1D23] border border-[#2D2F34] rounded-none p-4 pl-10 text-base text-gray-200 focus:border-white outline-none"
                                        placeholder="community_name"
                                        required
                                    />
                                </div>
                            </div>

                            {/* IMAGE INPUT - ICON BASED */}
                            <div>
                                <label className="text-white text-lg font-bold block mb-1">Community Image</label>
                                <p className="text-[#838891] text-xs mb-4">Upload a profile picture for the group.</p>
                                
                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-16 h-16 bg-[#1A1D23] border border-[#2D2F34] flex items-center justify-center text-[#838891] hover:text-white hover:border-white transition-all overflow-hidden"
                                    >
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <Camera size={24} />
                                        )}
                                    </button>
                                    {image && (
                                        <button 
                                            type="button" 
                                            onClick={() => {setImage(null); setImagePreview(null);}}
                                            className="text-xs text-red-500 hover:underline flex items-center gap-1"
                                        >
                                            <X size={14} /> Remove
                                        </button>
                                    )}
                                    <input 
                                        type="file"
                                        ref={fileInputRef}
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="space-y-6">
                            <div>
                                <label className="text-white text-lg font-bold block mb-1">Community Description</label>
                                <p className="text-[#838891] text-xs mb-4">Tell us about your community.</p>
                                <input 
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-[#1A1D23] border border-[#2D2F34] rounded-none p-4 text-base text-gray-200 focus:border-white outline-none"
                                    placeholder="Description..."
                                    required
                                />
                            </div>

                            {/* BANNER COLOR INPUT - ICON BASED */}
                            <div>
                                <label className="text-white text-lg font-bold block mb-1">Banner Color</label>
                                <p className="text-[#838891] text-xs mb-4">Pick a theme color for your banner.</p>
                                
                                <div className="flex items-center gap-4 p-4 bg-[#1A1D23] border border-[#2D2F34] w-full max-w-[200px]">
                                    <div className="relative cursor-pointer group">
                                        <Palette size={24} className="text-[#838891] group-hover:text-white" />
                                        <input 
                                            type="color"
                                            value={bannerColor}
                                            onChange={(e) => setBannerColor(e.target.value)}
                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                        />
                                    </div>
                                    <span className="text-gray-200 font-mono text-sm uppercase">{bannerColor}</span>
                                    <div 
                                        className="w-4 h-4 rounded-full border border-white/20" 
                                        style={{ backgroundColor: bannerColor }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex gap-4 pt-8 justify-end bg-[#1A1D23] -mx-8 md:-mx-12 -mb-8 md:-mb-12 p-6 mt-16 border-t border-[#2D2F34]">
                        <button type="button" onClick={() => router.back()} className="px-8 py-2.5 text-white hover:underline font-bold text-sm">
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={loading}
                            className={`px-10 py-2.5 bg-white text-black rounded-full font-bold text-sm ${loading ? 'opacity-50' : 'hover:bg-gray-200'}`}
                        >
                            {loading ? "Creating..." : "Create Community"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}