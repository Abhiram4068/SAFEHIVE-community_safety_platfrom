'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown, 
  ShieldCheck,
  LayoutDashboard,
  Mail // Imported for the Messages tab
} from 'lucide-react';

interface NavbarProps {
  user?: {
    id: number;
    username: string;
    role: string;
  } | null;
}

export const Navbar = ({ user }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-[#0B0D10]/95 backdrop-blur-md border-b border-[#1F2228] px-6 py-2.5">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        
        {/* Brand Section */}
        <div className="flex items-center gap-3 w-1/4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="text-xl font-bold tracking-tight text-white">Safehive</span>
          </Link>
        </div>

        {/* Right Action Section */}
        <div className="flex items-center gap-4 w-1/4 justify-end">
          {user ? (
            <div className="flex items-center gap-2 md:gap-4">
              
              {/* MESSAGES TAB - Visible only when logged in */}
              <Link
                href="/user/messages"
                className="flex items-center gap-2 px-3 py-1.5 text-[#838891] hover:text-white hover:bg-[#1F2228] rounded-full transition-all group"
              >
                <div className="relative">
                  <Mail size={20} className="group-hover:scale-110 transition-transform" />
                  {/* Optional indicator for new messages */}
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-orange-600 rounded-full border-2 border-[#0B0D10]" />
                </div>
                <span className=" sm:block text-sm font-medium">Inbox</span>
              </Link>

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className={`flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-full transition-all duration-200 border ${
                    isOpen 
                      ? 'bg-[#1F2228] border-[#343942]' 
                      : 'bg-transparent border-transparent hover:bg-[#1F2228] hover:border-[#2A2E36]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-yellow-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-[#0B0D10]">
                    {user.username.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="hidden md:flex flex-col items-start leading-tight">
                    <span className="text-sm font-semibold text-gray-100">{user.username}</span>
                    <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{user.role}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-[#16181D] border border-[#2A2E36] rounded-2xl shadow-2xl py-2 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-3 border-b border-[#2A2E36] mb-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Account</p>
                    </div>
                    
                    <DropdownLink href={`/user/userprofile/`} icon={<User size={18} />} label="My Profile" />
                    <DropdownLink href="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
                    <DropdownLink href="/settings" icon={<Settings size={18} />} label="Settings" />
                    
                    {user.role === 'admin' && (
                      <DropdownLink href="/admin" icon={<ShieldCheck size={18} className="text-orange-500" />} label="Admin Panel" />
                    )}

                    <div className="h-[1px] bg-[#2A2E36] my-2 mx-2" />

                    <form action="/logout" method="POST" className="px-2">
                      <button
                        type="submit"
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition-colors group"
                      >
                        <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
                        Sign Out
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-gray-300 hover:text-white px-4 py-2 text-sm font-medium transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="bg-white hover:bg-gray-200 text-black px-5 py-2 text-sm font-bold transition-all rounded-full shadow-sm"
              >
                Join Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const DropdownLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
  <Link 
    href={href}
    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-300 hover:bg-[#2A2E36] hover:text-white transition-all mx-2 rounded-xl"
  >
    <span className="text-gray-500">{icon}</span>
    {label}
  </Link>
);