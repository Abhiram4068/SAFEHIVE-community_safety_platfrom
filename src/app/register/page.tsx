"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
  const router = useRouter();

  // State fields
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let response = await axios.post(
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
      console.log(response.data);

      router.push("/login");
    } catch (error) {
      console.error("Registration failed", error);
      setError("Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1f2e] text-white">
      {/* Main Content */}
      <main className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-2xl">
          <h1 className="text-3xl font-bold text-center mb-8">
            Create your account
          </h1>

          <div className="bg-[#252b3b] border border-[#1F2228] rounded-lg p-8">
            <div>
              {/* Grid Container for 2-column layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#1a1f2e] border border-[#1F2228] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-0 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[#1a1f2e] border border-[#1F2228] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-0 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#1a1f2e] border border-[#1F2228] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-0 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#1a1f2e] border border-[#1F2228] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-0 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                  <p className="text-red-400 text-sm text-center">{error}</p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors"
              >
                {loading ? 'Creating...' : 'Sign Up'}
              </button>
            </div>

            <div className="mt-6 text-center space-y-2">
              <a href="/" className="block text-xs text-gray-400 hover:text-gray-300">
                Back to Home
              </a>
              <p className="text-sm text-gray-400">
                already in Safehive?{' '}
                <a href="/login" className="text-blue-500 hover:text-blue-400">
                  Log In
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Badge */}
      <div className="fixed bottom-6 right-6">
        <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg">
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <span className="text-green-500 text-lg">😊</span>
          </div>
          Made in Bettermode
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;