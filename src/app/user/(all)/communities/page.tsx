"use client";

import { Plus, Search, ChevronRight } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from "react";

type CommunityType = {
  id: number;
  name: string;
  description?: string;
  image?: string;
  color?: string;
  member_count?: number;
  post_count?: number;
};

const MEDIA_BASE_URL = "http://127.0.0.1:8005";

export default function TopCommunities() {
  const [communities, setCommunities] = useState<CommunityType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8005/api/groups/list/"
        );
        setCommunities(response.data);
      } catch (error) {
        console.error("Error fetching communities:", error);
      }
    }
    fetchData();
  }, []);

  const filteredCommunities = searchQuery.trim()
    ? communities.filter((c) =>
        `${c.name} ${c.description || ""}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : communities;

  return (
    <div className="flex-1 w-full lg:max-w-4xl mx-auto pb-10 px-4">
      {/* SEARCH BAR */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-8 pt-4">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#838891]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-[#1F2228] rounded-full bg-[#1A1D23] text-gray-300 placeholder-[#838891] focus:outline-none focus:border-gray-500 sm:text-sm"
            placeholder="Search Communities"
          />
        </div>

        <Link
          href="/user/createcommunity"
          className="flex items-center gap-2 bg-white hover:bg-gray-200 text-black px-4 py-2 rounded-full font-bold text-sm transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Community
        </Link>
      </div>

      {/* LIST */}
      <div className="border-t border-[#1F2228]">
        {filteredCommunities.map((community, index) => (
          <CommunityRow
            key={community.id}
            community={community}
            rank={index + 1}
          />
        ))}
      </div>

      {filteredCommunities.length === 0 && (
        <div className="text-center py-20 text-[#838891] border border-dashed border-[#2D2F34] rounded-xl mt-4">
          No matching communities found
        </div>
      )}
    </div>
  );
}

function CommunityRow({
  community,
  rank,
}: {
  community: CommunityType;
  rank: number;
}) {
  const { id, name, description, image, color } = community;

  return (
    <Link href={`/communityinfo/${id}`}>
      <div className="flex items-center gap-4 py-4 px-2 border-b border-[#1F2228] hover:bg-[#1A1D23]/50 transition-colors group">
        <div className="flex items-center gap-4 min-w-[70px]">
          <span className="text-[#838891] font-medium text-sm w-4 text-center">
            {rank}
          </span>

          <div
            className={`${color || "bg-blue-600"} w-9 h-9 rounded-full overflow-hidden flex items-center justify-center`}
          >
            {image ? (
              <img
                src={`${MEDIA_BASE_URL}${image}`}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white font-bold">
                {name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </div>

        <div className="flex-grow min-w-0">
          <h3 className="text-white font-bold text-sm truncate">
            r/{name}
          </h3>
          <p className="text-[#838891] text-xs truncate mt-0.5">
            {description || `The official r/${name} community`}
          </p>
        </div>

        <ChevronRight className="w-4 h-4 text-[#838891] opacity-0 group-hover:opacity-100" />
      </div>
    </Link>
  );
}
