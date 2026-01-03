// components/Navbar.tsx
import React from 'react';

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-[#0B0D10]/95 backdrop-blur-sm border-b border-[#1F2228] px-4 py-2">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 w-1/5">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center border border-[#1F2228]">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16z"/>
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Reddify</span>
          </div>
        </div>

        <div className="hidden md:flex flex-1 max-w-xl mx-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-[#838891]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <input 
              type="text" 
              className="block w-full pl-10 pr-3 py-2 border border-[#1F2228] rounded-full leading-5 bg-[#1A1D23] text-gray-300 placeholder-[#838891] focus:outline-none focus:bg-[#1A1D23] focus:border-gray-500 sm:text-sm" 
              placeholder="Search Reddify" 
            />
          </div>
        </div>

        <div className="flex items-center gap-4 w-1/5 justify-end">
          <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-1.5 rounded-full text-sm font-medium transition border border-[#1F2228]">
            Log In
          </button>
        </div>
      </div>
    </nav>
  );
};