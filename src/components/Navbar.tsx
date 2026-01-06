// components/Navbar.tsx
import React from 'react';
import Link from 'next/link';
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

       

        <div className="flex items-center gap-4 w-1/5 justify-end">
<Link href="/login/" className="hover:bg-gray-700 text-white px-4 py-1.5 text-sm font-medium transition border border-[#2A2E36] rounded-xl">
            Login
          </Link>
          <Link href="/register/"className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-1.5 text-sm font-medium transition border border-[#1F2228] rounded-xl">
            Become a member
          </Link>
          
        </div>
      </div>
    </nav>
  );
};