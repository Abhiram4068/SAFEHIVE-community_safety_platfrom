import React from 'react';
import Link from 'next/link';

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      {/* Same white line border box as Login */}
      <div className="w-full max-w-[400px] bg-[#0A0A0A] border border-white/10 p-8 rounded-[24px]">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-2">
             <div className="w-8 h-8 bg-[#FF4500] rounded-full"></div>
             <span className="font-bold text-lg text-white">Reddify</span>
          </div>
          <h2 className="text-xl font-semibold">Create your account</h2>
          <p className="text-gray-500 text-[10px] mt-1 uppercase tracking-wider">Join the community</p>
        </div>

        {/* Register Form */}
        <form className="space-y-4">
          <input
            type="email"
            className="w-full bg-[#1A1A1B] border border-[#343536] rounded-full px-6 py-3 focus:outline-none focus:border-white transition-colors"
            placeholder="Email"
          />
          <input
            type="text"
            className="w-full bg-[#1A1A1B] border border-[#343536] rounded-full px-6 py-3 focus:outline-none focus:border-white transition-colors"
            placeholder="Username"
          />
          <input
            type="password"
            className="w-full bg-[#1A1A1B] border border-[#343536] rounded-full px-6 py-3 focus:outline-none focus:border-white transition-colors"
            placeholder="Password"
          />
          
          <button className="w-full bg-[#FF4500] text-white font-bold py-3 rounded-full mt-4 hover:bg-[#FF5714] transition-colors shadow-lg shadow-[#FF4500]/10">
            Sign Up
          </button>
        </form>

        <Link href="/login"><p className="text-center mt-6 text-sm text-gray-400">
          Already a Reddifier? <span className="text-blue-400 cursor-pointer hover:underline">Log In</span>
        </p>
        </Link> 
      </div>
      
      <footer className="mt-8 text-gray-600 text-[10px] uppercase tracking-widest">
        Reddify © 2026. All rights reserved.
      </footer>
    </div>
  );
};

export default RegisterPage;