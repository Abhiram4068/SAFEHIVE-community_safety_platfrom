"use client";

import React from 'react';
import { Compass } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios'
import { responseCookiesToRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
// const TRENDING_COMMUNITIES = [
//   { id: 'movies', name: 'r/movies', desc: 'Movies', icon: '🕶️', color: 'bg-yellow-400' },
//   { id: 'food', name: 'r/food', desc: 'Food and Drink', icon: '🍳', color: 'bg-emerald-500' },
//   { id: 'art', name: 'r/Art', desc: 'This is a subreddify about art', icon: '🎨', color: 'bg-indigo-500' },
// ];

type CategoryType = {    
        id: number;
        name: string;    
        icon: string;      
        description: string;
          
}

const TOP_COMMUNITIES = [
  { id: 'worldnews', name: 'r/worldnews', description: 'A place for major news from around the world', icon: '🏴‍☠️', color: 'bg-rose-500' },
  { id: 'techsupport', name: 'r/techsupport', description: 'Are you stuck on a tech problem?', icon: '📱', color: 'bg-blue-500' },
  { id: 'books', name: 'r/books', description: 'Reading, Writing, and Literature', icon: '📚', color: 'bg-orange-500' },
];

export default function ExploreCenter() {

  let [categories, setCategories] = useState<CategoryType[]>([])

  async function fetchdata(){
    let reponse=await axios.get('http://127.0.0.1:8002/api/categories/')
    setCategories(reponse.data)
  }
  useEffect(()=>{
   fetchdata()

  },[])

  return (
    <div className="flex-1 w-full lg:max-w-4xl mx-auto pb-10 px-4">
      <center><div className="hidden md:flex flex-1 max-w-xl mx-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-[#838891]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <input 
              type="text" 
              className="block w-full pl-10 pr-3 py-2 border border-[#1F2228] rounded-full leading-5 bg-[#1A1D23] text-gray-300 placeholder-[#838891] focus:outline-none focus:bg-[#1A1D23] focus:border-gray-500 sm:text-sm" 
              placeholder="Browse Categories" 
            />
          </div>
        </div>
        </center> <br/>
      {/* 1. EXPLORE HEADER CARD */}
      <div className="bg-[#15191C] border border-[#2D2F34] rounded-xl p-6 mb-8 flex items-center gap-4">
        <div className="p-3 bg-[#1F2228] rounded-full">
          <Compass className="text-[#838891] w-8 h-8" />
        </div>
        <h1 className="text-white text-2xl font-bold">Explore Categories</h1>
      </div>

      {/* 2. TRENDING GLOBALLY SECTION */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4 px-2">
          <span className="text-xl">🔥</span>
          <h2 className="text-white text-lg font-bold">Critical </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map((item) => (
            <CommunityCard key={item.id} {...item} />
          ))}
        </div>
      </section>

      {/* 3. TOP GLOBALLY SECTION */}
      <section>
        <div className="flex items-center gap-2 mb-4 px-2">
          <span className="text-xl">🌎</span>
          <h2 className="text-white text-lg font-bold">Top Categories</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TOP_COMMUNITIES.map((item) => (
            <CommunityCard key={item.id} {...item} />
          ))}
        </div>
      </section>
      
    </div>
  );
}

function CommunityCard({ name, description , icon}: { name: string, description: string, icon:string }) {
  return (
    <div className="bg-[#15191C] border border-[#2D2F34] rounded-xl p-6 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className={` w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-inner`}>
         {icon}
        </div>
        <h3 className="text-white font-bold text-lg hover:underline cursor-pointer">{name}</h3>
      </div>
      
      <p className="text-[#838891] text-sm mb-6 flex-grow leading-relaxed">
        {description}
      </p>

      <button className="w-fit bg-[#2D2F34] hover:bg-[#3E4147] text-[#E4E6EB] px-6 py-1.5 rounded-full font-bold text-sm transition self-start">
        See Posts
      </button>
    </div>
  );
}