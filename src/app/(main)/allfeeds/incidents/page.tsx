"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Camera, AlertCircle, Send, X, ChevronDown, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function ReportIncident() {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [images, setImages] = useState<string[]>([]); // For UI Previews
  const [imageFiles, setImageFiles] = useState<File[]>([]); // For Uploads
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>(""); // UI Feedback
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    caption: "",
    category_id: ""
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://127.0.0.1:8002/api/categories/');
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => setImages((prev) => [...prev, reader.result as string]);
        reader.readAsDataURL(file);
        setImageFiles((prev) => [...prev, file]);
      });
    }
    e.target.value = "";
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.category_id) {
      alert("Please fill in required fields.");
      return;
    }

    setLoading(true);
    setUploadStatus("Getting location...");

    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        // --- STEP 1: CREATE POST (POST SERVICE) ---
        setUploadStatus("Creating report...");
        
        const postPayload = {
          ...formData,
          category_id: parseInt(formData.category_id),
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          user_id: 2, // Hardcoded for your example
          priority: [2, 4, 5].includes(parseInt(formData.category_id)) ? "high" : "medium"
        };

        const postResponse = await axios.post('http://127.0.0.1:8000/api/post/', postPayload);
        const newPostId = postResponse.data.id;

        // --- STEP 2: UPLOAD IMAGES (IMAGE SERVICE) ---
        if (imageFiles.length > 0 && newPostId) {
          setUploadStatus(`Uploading ${imageFiles.length} images...`);
          
          // We upload images in parallel for better performance
          const uploadPromises = imageFiles.map(file => {
            const imgData = new FormData();
            imgData.append("post_id", newPostId);
            imgData.append("image", file);
            
            return axios.post('http://127.0.0.1:8001/media/upload/', imgData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });
          });

          await Promise.all(uploadPromises);
        }

        alert("Incident reported successfully!");
        setFormData({ title: "", caption: "", category_id: "" });
        setImages([]);
        setImageFiles([]);
      } catch (error) {
        console.error("Workflow Error:", error);
        alert("Submission failed at some point. Check console.");
      } finally {
        setLoading(false);
        setUploadStatus("");
      }
    }, () => {
      setLoading(false);
      alert("Location access is required.");
    });
  };

  return (
    <div className="flex-1 w-full lg:max-w-2xl mx-auto pb-10 px-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 border-b border-[#1F2228] pb-4 px-2">
        <div className="p-2 bg-red-500/10 rounded-lg">
          <AlertCircle className="text-red-500 w-6 h-6" />
        </div>
        <div>
          <h1 className="text-white text-xl font-bold">Report an Incident</h1>
          <p className="text-[#838891] text-sm">Decoupled Microservice Flow</p>
        </div>
      </div>

      <div className="bg-[#15191C] border border-[#2D2F34] rounded-xl p-6 flex flex-col gap-6 shadow-sm">
        {/* Category Select */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#838891] uppercase">Category</label>
          <div className="relative">
            <select 
              value={formData.category_id}
              onChange={(e) => setFormData({...formData, category_id: e.target.value})}
              className="w-full bg-[#0B0E11] border border-[#2D2F34] rounded-lg p-3 text-white appearance-none focus:border-blue-500 outline-none"
            >
              <option value="" disabled>Select category...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-4 w-4 h-4 text-[#838891] pointer-events-none" />
          </div>
        </div>

        {/* Title & Caption */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#838891] uppercase">Incident Title</label>
          <input 
            type="text" 
             placeholder="e.g., Street light not working"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full bg-[#0B0E11] border border-[#2D2F34] rounded-lg p-3 text-white focus:border-blue-500 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-[#838891] uppercase">Details & Description</label>
          <textarea 
            rows={4}
             placeholder="What happened? Area feels unsafe..."
            value={formData.caption}
            onChange={(e) => setFormData({...formData, caption: e.target.value})}
            className="w-full bg-[#0B0E11] border border-[#2D2F34] rounded-lg p-3 text-white focus:border-blue-500 outline-none resize-none"
          />
        </div>

        {/* Image Handling */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#838891] uppercase">Attachments</label>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" multiple className="hidden" />
          <div className="flex flex-wrap gap-3">
            {images.map((img, idx) => (
              <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-[#2D2F34]">
                <img src={img} className="w-full h-full object-cover" alt="Preview" />
                <button 
                  onClick={() => {
                    setImages(images.filter((_, i) => i !== idx));
                    setImageFiles(imageFiles.filter((_, i) => i !== idx));
                  }}
                  className="absolute top-1 right-1 bg-black/50 rounded-full p-1 hover:bg-red-500"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 border-2 border-dashed border-[#2D2F34] rounded-lg flex flex-col items-center justify-center text-[#838891] hover:text-white bg-[#0B0E11]"
            >
              <Camera className="w-5 h-5 mb-1" />
              <span className="text-[10px]">Add</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-[#2D2F34] flex justify-end items-center gap-4">
          {loading && <span className="text-xs text-blue-400 font-medium animate-pulse">{uploadStatus}</span>}
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="bg-white text-black px-8 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 disabled:bg-gray-600 transition"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {loading ? "Processing..." : "Submit Report"}
          </button>
        </div>
      </div>
    </div>
  );
}