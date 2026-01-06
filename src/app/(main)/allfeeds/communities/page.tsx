"use client";

import React from 'react';
import { Users, FileText } from 'lucide-react';
import axios from 'axios';
import { useState,useEffect } from 'react';
import Link from 'next/link'
type CommunityType = {    
        id: number;
        name: string;
        created_by: number;
        created_at: Date;
        status: string    
}


export default function TopCommunities() {
    let [communities,setcommunities] = useState<CommunityType[]>([])

 async function fetchData(){
    const response = await axios.get("http://127.0.0.1:8000/api/groups/list/")
    console.log(response.data)
    setcommunities(response.data)

}

useEffect(()=>{
    fetchData()
},[])
  return (
    /* Matches original container: flex-1, w-full, lg:max-w-4xl (wider for list), mx-auto, pb-10, px-4 */
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
              placeholder="Explore Communities" 
            />
          </div>
        </div>
        </center> <br/>
      {/* HEADER SECTION */}
      <div className="mb-6 px-2">
        <h1 className="text-white text-2xl font-bold">Top Communities</h1>
        <p className="text-[#838891] text-sm mt-1">Browse Reddify's communities</p>
      </div>

      {/* COMMUNITIES BOX - Matches the card styling in the image */}
      <div className="bg-[#0F1215] border border-[#2D2F34] rounded-l overflow-hidden">
        <div className="flex flex-col">
          {communities.map((community, index) => (
            <div 
              key={community.id} 
              className={`flex items-center justify-between p-5 hover:bg-[#1F2228] transition-colors ${
                index !== communities.length - 1 ? 'border-b border-[#2D2F34]' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Community Icon */}
                <div className={`${community.color} w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-inner`}>
                  {community.icon}
                </div>
                
                {/* Text Info */}
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight hover:underline cursor-pointer">
                    {community.name}
                  </h3>
                  <p className="text-[#838891] text-sm mt-0.5">
                    {community.description}
                  </p>
                </div>
              </div>

              {/* Stats & Action */}
              <div className="flex items-center gap-8">
                {/* Stats */}
                <div className="hidden md:flex items-center gap-6">
                  <div className="flex items-center gap-1.5 text-[#838891]">
                    <Users size={16} />
                    <span className="text-sm">{community.members}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#838891]">
                    <FileText size={16} />
                    <span className="text-sm">{community.posts}</span>
                  </div>
                </div>

                {/* Join Button */}
                <Link href={`communities/${community.id}`} >
                <button className="bg-[#2D2F34] hover:bg-[#3E4147] text-white px-5 py-2 rounded-full font-bold text-sm transition">
                  Info
                </button>

                </Link>
                <button className="bg-[#2D2F34] hover:bg-[#3E4147] text-white px-5 py-2 rounded-full font-bold text-sm transition">
                  Join
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}