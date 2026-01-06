import React from 'react';
import Link from 'next/link';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      {/* Added border and background container */}
      <div className="w-full max-w-[400px] bg-[#0A0A0A] border border-white/10 p-8 rounded-[10px] space-y-8">
        {/* Logo and Header */}
        <div className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 bg-[#FF4500] rounded-full flex items-center justify-center shadow-lg shadow-[#FF4500]/20">
            <div className="w-6 h-6 bg-white rounded-full opacity-20"></div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Reddify</h1>
          <p className="text-gray-400 text-sm">Welcome back, login to your account</p>
        </div>

        {/* Login Form */}
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full bg-[#1A1A1B] border border-[#343536] rounded-full px-6 py-3 focus:outline-none focus:border-white transition-colors"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-[#1A1A1B] border border-[#343536] rounded-full px-6 py-3 focus:outline-none focus:border-white transition-colors"
          />
          
          <button className="w-full bg-white text-black font-bold py-3 rounded-full hover:bg-gray-200 transition-colors">
            Log In
          </button>
        </form>

        <div className="text-center space-y-2">
          <Link href="" className="text-xs text-gray-500 hover:underline">Forgot password?</Link>
          <Link href="/register"><p className="text-sm text-gray-400">
            New to Reddify? <span className="text-blue-400 cursor-pointer hover:underline">Sign Up</span>
          </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;