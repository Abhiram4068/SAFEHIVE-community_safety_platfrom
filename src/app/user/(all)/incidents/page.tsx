"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  AlertCircle, 
  Send, 
  X, 
  ChevronDown, 
  Loader2, 
  Layers, 
  Info // Added Info icon
} from 'lucide-react';
import axios from 'axios';

interface Category {
  id: number;
  name: string;
  parent?: number | null;
}

export default function ReportIncident() {
  const [mainCategories, setMainCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingSubs, setFetchingSubs] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    caption: "",
    main_category_id: "", 
    category_id: ""      
  });

  // Load Main Categories on mount
  useEffect(() => {
    async function fetchMainCategories() {
      try {
        const response = await axios.get('http://127.0.0.1:8002/api/categories/');
        const mains = response.data.filter((cat: Category) => !cat.parent);
        setMainCategories(mains);
      } catch (error) {
        console.error("Error fetching main categories:", error);
      }
    }
    fetchMainCategories();
  }, []);

  const handleMainCategoryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMainId = e.target.value;
    setFormData(prev => ({ ...prev, main_category_id: selectedMainId, category_id: "" }));
    setSubCategories([]);

    if (!selectedMainId) return;

    setFetchingSubs(true);
    try {
      const res = await axios.get(
        `http://127.0.0.1:8002/api/categories/${selectedMainId}/subcategories/`
      );
      setSubCategories(res.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    } finally {
      setFetchingSubs(false);
    }
  };

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
      alert("Please select a specific sub-category and enter a title.");
      return;
    }

    setLoading(true);
    setUploadStatus("Getting location...");

    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        setUploadStatus("Creating report...");
        
        const postPayload = {
          title: formData.title,
          caption: formData.caption,
          category_id: parseInt(formData.main_category_id),
          subcategory_id: parseInt(formData.category_id),
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          priority: "medium" 
        };

        const postResponse = await axios.post('/api/post', postPayload);
        const newPostId = postResponse.data.id;

        if (imageFiles.length > 0 && newPostId) {
          setUploadStatus(`Uploading ${imageFiles.length} images...`);
          const uploadPromises = imageFiles.map(file => {
            const imgData = new FormData();
            imgData.append("post_id", newPostId);
            imgData.append("image", file);
            return axios.post('/api/media/upload', imgData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });
          });
          await Promise.all(uploadPromises);
        }

        alert("Incident reported successfully!");
        setFormData({ title: "", caption: "", main_category_id: "", category_id: "" });
        setImages([]);
        setImageFiles([]);
        setSubCategories([]);
      } catch (error) {
        console.error("Workflow Error:", error);
        alert("Submission failed.");
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
    <div className="flex-1 w-full lg:max-w-2xl mx-auto pb-10 px-4 mt-8">
      <div className="flex items-center gap-3 mb-6 border-b border-[#1F2228] pb-4 px-2">
        <div className="p-2 bg-red-500/10 rounded-lg">
          <AlertCircle className="text-red-500 w-6 h-6" />
        </div>
        <div>
          <h1 className="text-white text-xl font-bold tracking-tight uppercase">Report Incident</h1>
          <p className="text-[#838891] text-[10px] font-bold tracking-[0.2em] uppercase">Emergency Response Unit</p>
        </div>
      </div>

      <div className="bg-[#15191C] border border-[#2D2F34] rounded p-6 flex flex-col gap-6 shadow-2xl">
        
       {/* IMPORTANT NOTICE BOX */}
        <div className="bg-[#1A1D23] border-l-4 border-red-500 p-4 rounded-r-md">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-red-500" />
            <span className="text-xs font-bold text-white uppercase tracking-widest">Important Notice</span>
          </div>
          <ul className="text-[13px] text-[#838891] space-y-1.5 leading-relaxed ml-4">
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">●</span> 
              This is a community-based platform; please post only relevant incidents.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">●</span> 
              If a report is found to be irrelevant or false, administrators have full access to remove the post.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">●</span> 
              Ensure you are providing accurate details to assist emergency responders.
            </li>
          </ul>
        </div>

        {/* CATEGORY PICKER SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#838891] uppercase tracking-wider flex items-center gap-2">
              <Layers size={12} className="text-blue-500" /> 01. General Category
            </label>
            <div className="relative">
              <select 
                value={formData.main_category_id}
                onChange={handleMainCategoryChange}
                className="w-full bg-[#0B0E11] border border-[#2D2F34] rounded p-3.5 text-sm text-white appearance-none focus:border-blue-500 outline-none transition-all cursor-pointer hover:bg-[#1c2127]"
              >
                <option value="" disabled>Select category...</option>
                {mainCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-[#5c6066] pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className={`text-[10px] font-black uppercase tracking-wider flex items-center gap-2 transition-colors ${!formData.main_category_id ? 'text-gray-700' : 'text-[#838891]'}`}>
               02. Specific Issue
            </label>
            <div className="relative">
              <select 
                disabled={!formData.main_category_id || fetchingSubs}
                value={formData.category_id}
                onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                className="w-full bg-[#0B0E11] border border-[#2D2F34] rounded p-3.5 text-sm text-white appearance-none focus:border-blue-500 outline-none disabled:opacity-20 disabled:grayscale transition-all cursor-pointer"
              >
                {!formData.main_category_id ? (
                  <option value="">Awaiting Step 01...</option>
                ) : fetchingSubs ? (
                  <option value="">Fetching details...</option>
                ) : (
                  <>
                    <option value="">Select specific problem...</option>
                    {subCategories.map((sub) => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </>
                )}
              </select>
              {fetchingSubs ? (
                 <Loader2 className="absolute right-4 top-4 w-4 h-4 text-blue-500 animate-spin" />
              ) : (
                <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-[#5c6066] pointer-events-none" />
              )}
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-[#838891] uppercase tracking-wider">Report Title</label>
          <input 
            type="text" 
            placeholder="E.g. Large tree branch blocking Road 5"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full bg-[#0B0E11] border border-[#2D2F34] rounded p-3.5 text-sm text-white focus:border-blue-500 outline-none transition-all placeholder:text-gray-700"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-[#838891] uppercase tracking-wider">Additional Context</label>
          <textarea 
            rows={3}
            placeholder="Provide any extra details that might help responders..."
            value={formData.caption}
            onChange={(e) => setFormData({...formData, caption: e.target.value})}
            className="w-full bg-[#0B0E11] border border-[#2D2F34] rounded p-3.5 text-sm text-white focus:border-blue-500 outline-none resize-none transition-all placeholder:text-gray-700"
          />
        </div>

        {/* Image Evidence */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-[#838891] uppercase tracking-wider">Attachements</label>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" multiple className="hidden" />
          <div className="flex flex-wrap gap-3">
            {images.map((img, idx) => (
              <div key={idx} className="relative w-24 h-24 rounded overflow-hidden border border-[#2D2F34] group">
                <img src={img} className="w-full h-full object-cover" alt="Preview" />
                <button 
                  onClick={() => {
                    setImages(images.filter((_, i) => i !== idx));
                    setImageFiles(imageFiles.filter((_, i) => i !== idx));
                  }}
                  className="absolute inset-0 bg-red-600/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            ))}
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 border-2 border-dashed border-[#2D2F34] rounded-2xl flex flex-col items-center justify-center text-[#5c6066] hover:text-blue-500 hover:border-blue-500/50 bg-[#0B0E11] transition-all group"
            >
              <Camera className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase">Add Photo</span>
            </button>
          </div>
        </div>

        {/* Submit Section */}
        <div className="pt-6 border-t border-[#1F2228] flex justify-end items-center gap-4">
          {loading && (
            <div className="flex items-center gap-2 text-blue-400 font-black italic text-[10px] uppercase tracking-widest animate-pulse">
               {uploadStatus}
            </div>
          )}
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="bg-white text-black px-12 py-4 rounded-full font-black text-xs uppercase tracking-[0.15em] flex items-center gap-3 disabled:bg-gray-800 disabled:text-gray-500 transition-all hover:bg-blue-500 hover:text-white shadow-xl active:scale-95"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {loading ? "Transmitting..." : "Send Report"}
          </button>
        </div>
      </div>
    </div>
  );
}