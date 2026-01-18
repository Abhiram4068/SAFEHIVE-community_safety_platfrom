"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { responseCookiesToRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

const RegisterPage = () => {
  const router = useRouter();

  // 🔹 State fields (Updated with phone)
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState(""); // New field
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
     let reponse = await axios.post(
        "http://localhost:3000/api/register/",
        {
          email,
          username,
          password,
          phone, 
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(reponse.data)

      router.push("/login");
    } catch (error) {
      console.error("Registration failed", error);
      alert("Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      {/* Increased max-width slightly for the 2-column layout */}
      <div className="w-full max-w-[500px] bg-[#0A0A0A] border border-white/10 p-8 rounded-[24px]">
        
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start space-x-2 mb-2">
             <div className="w-8 h-8 bg-[#FF4500] rounded-full"></div>
             <span className="font-bold text-lg text-white">Reddify</span>
          </div>
          <h2 className="text-xl font-semibold">Create your account</h2>
          <p className="text-gray-500 text-[10px] mt-1 uppercase tracking-wider">Join the community</p>
        </div>

        {/* Register Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          
          {/* 🔹 Grid Container for 2-way layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="email"
              className="w-full bg-[#1A1A1B] border border-[#343536] rounded-full px-6 py-3 focus:outline-none focus:border-white transition-colors"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="text"
              className="w-full bg-[#1A1A1B] border border-[#343536] rounded-full px-6 py-3 focus:outline-none focus:border-white transition-colors"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              className="w-full bg-[#1A1A1B] border border-[#343536] rounded-full px-6 py-3 focus:outline-none focus:border-white transition-colors"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="tel"
              className="w-full bg-[#1A1A1B] border border-[#343536] rounded-full px-6 py-3 focus:outline-none focus:border-white transition-colors"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF4500] text-white font-bold py-3 rounded-full mt-4 hover:bg-[#FF5714] transition-colors shadow-lg shadow-[#FF4500]/10"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <Link href="/login">
          <p className="text-center mt-6 text-sm text-gray-400">
            Already a Reddifier?{" "}
            <span className="text-blue-400 cursor-pointer hover:underline">
              Log In
            </span>
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