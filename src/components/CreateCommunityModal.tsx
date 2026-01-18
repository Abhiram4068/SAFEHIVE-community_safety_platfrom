"use client";

import React, { useState } from 'react';
import { X, Globe, Lock } from 'lucide-react';
import axios from 'axios';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateCommunityModal = ({ isOpen, onClose }: ModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("public");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8005/api/groups/', {
        name,
        description,
        group_type: type
      });
      onClose();
      window.location.reload(); 
    } catch (error) {
      console.error("Error creating community:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1A1A1B] w-full max-w-lg rounded-xl border border-[#343536] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-[#343536]">
          <h2 className="text-white font-bold text-lg">Create a community</h2>
          <button onClick={onClose} className="text-[#818384] hover:text-white transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* Name Input */}
          <div>
            <label className="block text-white font-medium mb-1">Name</label>
            <p className="text-[#818384] text-xs mb-2">Community names including capitalization cannot be changed.</p>
            <div className="relative">
              <span className="absolute left-3 top-2 text-[#818384]">r/</span>
              <input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="community_name"
                className="w-full bg-[#1A1A1B] border border-[#343536] rounded p-2 pl-7 text-white focus:outline-none focus:border-white transition"
                maxLength={21}
                required
              />
            </div>
            <p className="text-[#818384] text-xs mt-1">{21 - name.length} characters remaining</p>
          </div>

          {/* Description Input - FIXED */}
          <div>
            <label className="block text-white font-medium mb-1">Description</label>
            <p className="text-[#818384] text-xs mb-2">Tell us what this community is about.</p>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="This community is for..."
              className="w-full bg-[#1A1A1B] border border-[#343536] rounded p-2 text-white focus:outline-none focus:border-white transition min-h-[80px] resize-none"
              maxLength={100}
              required
            />
            <p className="text-[#818384] text-xs mt-1">{100 - description.length} characters remaining</p>
          </div>

          {/* Community Type */}
          <div className="space-y-3">
            <label className="block text-white font-medium">Community type</label>
            
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="radio" name="type" checked={type === "public"} onChange={() => setType("public")} className="accent-blue-500" />
              <Globe className="w-5 h-5 text-[#818384]" />
              <div>
                <span className="text-white text-sm font-bold flex items-center gap-2">Public</span>
                <p className="text-[#818384] text-xs">Anyone can view, post, and comment to this community.</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="radio" name="type" checked={type === "private"} onChange={() => setType("private")} className="accent-blue-500" />
              <Lock className="w-5 h-5 text-[#818384]" />
              <div>
                <span className="text-white text-sm font-bold flex items-center gap-2">Private</span>
                <p className="text-[#818384] text-xs">Only approved users can view and submit to this community.</p>
              </div>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#343536]">
            <button 
              type="button"
              onClick={onClose} 
              className="px-5 py-2 rounded-full border border-[#D7DADC] text-[#D7DADC] font-bold text-sm hover:bg-[#272729] transition"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-5 py-2 rounded-full bg-[#D7DADC] text-black font-bold text-sm hover:bg-white transition"
            >
              Create Community
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};