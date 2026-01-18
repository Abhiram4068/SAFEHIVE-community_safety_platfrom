"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Globe, Lock } from 'lucide-react';
import axios from 'axios';

export default function CreateCommunityPage() {
    const [newName, setNewName] = useState("");
    const [status, setStatus] = useState("public"); 
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleCreateCommunity(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post("http://127.0.0.1:8005/api/groups/create/", {
                name: newName,
                status: status 
            });
            router.push('/top-communities'); 
            router.refresh();
        } catch (error) {
            console.error("Error creating community:", error);
            alert("Failed to create community.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#0F1215] flex items-center justify-center p-4 md:p-10">
            {/* CHANGED: max-w-lg to max-w-5xl for a wide layout */}
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
                        Build a new space for your interests. Community names cannot be changed once created.
                    </p>
                </div>
                
                <form onSubmit={handleCreateCommunity}>
                    {/* CHANGED: Used a grid layout to take advantage of the width */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        
                        {/* Left Side: Name input */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-white text-lg font-bold block mb-1">Name</label>
                                <p className="text-[#838891] text-xs mb-4">Uppercase and lowercase letters matter for the URL.</p>
                                <div className="relative">
                                    <span className="absolute left-4 top-3.5 text-[#838891] text-base font-medium">r/</span>
                                    <input 
                                        autoFocus
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        className="w-full bg-[#1A1D23] border border-[#2D2F34] rounded-none p-4 pl-10 text-base text-gray-200 focus:border-white outline-none transition-all placeholder-[#4f535a]"
                                        placeholder="community_name"
                                        maxLength={21}
                                        required
                                    />
                                </div>
                                <div className="flex justify-between mt-2">
                                    <p className="text-[#838891] text-[11px]">Names must be between 3–21 characters.</p>
                                    <p className="text-[#838891] text-[11px] font-mono">{21 - newName.length} left</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Community Type */}
                        <div>
                            <label className="text-white text-lg font-bold block mb-4">Privacy Settings</label>
                            <div className="space-y-6">
                                <label className="flex items-start gap-4 cursor-pointer group bg-[#1A1D23] p-4 border border-transparent hover:border-[#2D2F34] transition">
                                    <input 
                                        type="radio" 
                                        name="status" 
                                        value="public"
                                        checked={status === "public"}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="mt-1.5 w-4 h-4 accent-white"
                                    />
                                    <div className="flex gap-3">
                                        <Globe size={20} className="text-[#838891] shrink-0 mt-0.5" />
                                        <div>
                                            <span className="text-sm font-bold text-white block">Public</span>
                                            <p className="text-xs text-[#838891] leading-relaxed">Anyone can view, post, and comment. Best for growing a large audience.</p>
                                        </div>
                                    </div>
                                </label>

                                <label className="flex items-start gap-4 cursor-pointer group bg-[#1A1D23] p-4 border border-transparent hover:border-[#2D2F34] transition">
                                    <input 
                                        type="radio" 
                                        name="status" 
                                        value="private"
                                        checked={status === "private"}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="mt-1.5 w-4 h-4 accent-white"
                                    />
                                    <div className="flex gap-3">
                                        <Lock size={20} className="text-[#838891] shrink-0 mt-0.5" />
                                        <div>
                                            <span className="text-sm font-bold text-white block">Private</span>
                                            <p className="text-xs text-[#838891] leading-relaxed">Only approved members can see content. Best for closed groups or testing.</p>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    {/* Action Buttons: Full width footer bar */}
                    <div className="flex gap-4 pt-8 justify-end bg-[#1A1D23] -mx-8 md:-mx-12 -mb-8 md:-mb-12 p-6 mt-16 border-t border-[#2D2F34]">
                        <button 
                            type="button"
                            onClick={() => router.back()}
                            className="px-8 py-2.5 text-white hover:underline font-bold text-sm transition-colors"
                        >
                            Cancel
                        </button>
                        
                        <button 
                            type="submit"
                            disabled={loading}
                            className={`px-10 py-2.5 bg-white text-black rounded-full font-bold text-sm transition-all ${loading ? 'opacity-50' : 'hover:bg-gray-200 active:scale-95'}`}
                        >
                            {loading ? "Creating..." : "Create Community"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}