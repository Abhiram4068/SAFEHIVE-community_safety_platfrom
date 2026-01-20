"use client";

import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    await axios.post(
     "http://localhost:3000/api/login/",       
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, 
      }
    );


    router.push("/user");
  } catch (err: any) {
    setError(
      err.response?.data?.error ||
      err.response?.data?.detail ||
      "Invalid username or password"
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] bg-[#0A0A0A] border border-white/10 p-8 rounded-[10px] space-y-8">

        {/* Header */}
        <div className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 bg-[#FF4500] rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-full opacity-20" />
          </div>
          <h1 className="text-2xl font-bold">SafeHive</h1>
          <p className="text-gray-400 text-sm">Welcome back, login to your account</p>
        </div>

        {/* Login Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full bg-[#1A1A1B] border border-[#343536] rounded-full px-6 py-3"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full bg-[#1A1A1B] border border-[#343536] rounded-full px-6 py-3"
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-bold py-3 rounded-full hover:bg-gray-200"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center space-y-2">
          <Link href="#" className="text-xs text-gray-500 hover:underline">
            Forgot password?
          </Link>
          <Link href="/register">
            <p className="text-sm text-gray-400">
              New to Reddify?{" "}
              <span className="text-blue-400 hover:underline">Sign Up</span>
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
