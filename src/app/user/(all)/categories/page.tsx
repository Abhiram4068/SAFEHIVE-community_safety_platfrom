"use client";
import Link from 'next/link'
import React, { useState, useEffect } from 'react';
import { Compass } from 'lucide-react';
import axios from 'axios';

// 1. Updated Type Definitions to match your API response
type SubCategoryType = {
  id: number;
  name: string;
  description: string;
  icon: string;
  image: string | null;
};

type CategoryType = {
  id: number;
  name: string;
  description: string;
  icon: string;
  image: string | null;
  subcategories: SubCategoryType[];
};

export default function ExploreCenter() {
  const [categories, setCategories] = useState<CategoryType[]>([]);

  async function fetchdata() {
    try {
      const response = await axios.get('http://127.0.0.1:8002/api/categories/');
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <div className="flex-1 w-full lg:max-w-4xl mx-auto pb-10 px-4">
      {/* Search Bar Section */}
      <div className="flex justify-center my-6">
        <div className="relative w-full max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-[#838891]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <input 
            type="text" 
            className="block w-full pl-10 pr-3 py-2 border border-[#1F2228] rounded-full leading-5 bg-[#1A1D23] text-gray-300 placeholder-[#838891] focus:outline-none focus:border-gray-500 sm:text-sm" 
            placeholder="Browse Categories" 
          />
        </div>
      </div><br></br>

      {/* Explore Header */}
      <div className="bg-[#15191C] border border-[#2D2F34] rounded-xl p-6 mb-8 flex items-center gap-4">
        <div className="p-3 bg-[#1F2228] rounded-full">
          <Compass className="text-[#838891] w-8 h-8" />
        </div>
        <h1 className="text-white text-2xl font-bold">Explore Categories</h1>
      </div>

      {/* Main Category Sections */}
      {categories.map((mainCat) => (
        <section key={mainCat.id} className="mb-10">
          {/* Main Category Name as Header */}
          <div className="flex items-center gap-2 mb-4 px-2">
            <span className="text-xl">{mainCat.icon}</span>
            <h2 className="text-white text-lg font-bold">{mainCat.name}</h2>
          </div>
          
          {/* Subcategory Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mainCat.subcategories.length > 0 ? (
              mainCat.subcategories.map((sub) => (
                <CommunityCard 
                  key={sub.id} 
                  id={sub.id} 
                  name={sub.name} 
                  description={sub.description} 
                  icon={sub.icon} 
                />
              ))
            ) : (
              // Fallback if there are no subcategories for a main category
              <p className="text-[#838891] text-sm italic px-2">No sub-categories available.</p>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}

function CommunityCard({ id, name, description, icon }: { id: number, name: string, description: string, icon: string }) {
  return (
    <div className="bg-[#15191C] border border-[#2D2F34] rounded p-6 flex flex-col h-full hover:border-[#3e4147] transition-all">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl  shadow-inner">
          {icon}
        </div>
        <h3 className="text-white font-bold text-lg hover:underline cursor-pointer">{name}</h3>
      </div>
      
      <p className="text-[#838891] text-sm mb-6 flex-grow leading-relaxed">
        {description}
      </p>

      <Link href={`/user/categories/${id}`}>
        <button className="w-fit bg-[#2D2F34] hover:bg-[#3E4147] text-[#E4E6EB] px-6 py-1.5 rounded-full font-bold text-sm transition self-start">
          See Posts
        </button>
      </Link>
    </div>
  );
}