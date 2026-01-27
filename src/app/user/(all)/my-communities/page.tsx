import { Users, FileText, Plus, Search, ChevronRight } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';
import { cookies } from "next/headers";

type CommunityType = {
    id: number;
    name: string;
    description?: string;
    image?: string;
    color?: string;
    member_count?: number;
    post_count?: number;
}

const MEDIA_BASE_URL = "http://127.0.0.1:8005";

export default async function MyCommunities() {
    // 1. Get the token from cookies (Server-side)
    const cookieStore = await cookies();
    const access = cookieStore.get("access")?.value;
    
    let communities: CommunityType[] = [];

    // 2. Fetch data directly from the Django backend
    if (access) {
        try {
            const response = await axios.get("http://127.0.0.1:8005/api/groups/mygroup/", {
                headers: {
                    Authorization: `Bearer ${access}`,
                },
            });
            communities = response.data;
        } catch (error) {
            console.error("Error fetching communities from backend:", error);
        }
    }

    return (
        <div className="flex-1 w-full lg:max-w-4xl mx-auto pb-10 px-4">
            {/* SEARCH AND NAVIGATION */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-8 pt-4">
                <div className="relative flex-1 w-full">
                    
                </div>

                
            </div>

            <section className="mb-4 px-2">
                <div className="flex items-center gap-2">
                    <h2 className="text-white text-lg font-bold">Your Communities</h2>
                </div>
            </section>

            {/* LIST WITH DIVIDERS */}
            <div className="border-t border-[#1F2228]">
                {communities.map((community, index) => (
                    <CommunityRow 
                        key={community.id} 
                        community={community} 
                        rank={index + 1} 
                    />
                ))}
            </div>

            {/* EMPTY STATE */}
           {communities.length === 0 && (
  <Link href="/user/communities">
    <div className="text-center py-20 text-[#838891] border border-dashed border-[#2D2F34] rounded-xl mt-4
                    cursor-pointer hover:bg-[#1A1D23] hover:text-white transition">
      {access
        ? "No communities found. Join one!"
        : "Please log in to see your communities."}
    </div>
  </Link>
)}
        </div>
    );
}

// Sub-component for clarity
function CommunityRow({ community, rank }: { community: CommunityType, rank: number }) {
    const { id, name, description, image, color } = community;
    
    // Ensure image URL is absolute
    const imageUrl = image 
        ? (image.startsWith('http') ? image : `${MEDIA_BASE_URL}${image}`)
        : null;

    return (
        <Link href={`/communityinfo/${id}`}>
            <div className="flex items-center gap-4 py-4 px-2 border-b border-[#1F2228] hover:bg-[#1A1D23]/50 transition-colors group">
                {/* RANK & IMAGE */}
                <div className="flex items-center gap-4 min-w-[70px]">
                    <span className="text-[#838891] font-medium text-sm w-4 text-center">{rank}</span>
                    <div className={`${color || "bg-blue-600"} w-9 h-9 rounded-full overflow-hidden flex items-center justify-center shadow-inner shrink-0`}>
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-white font-bold text-xs">
                                {name.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                </div>

                {/* INFO */}
                <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="text-white font-bold text-sm group-hover:underline truncate">
                            r/{name}
                        </h3>
                    </div>
                    <p className="text-[#838891] text-xs truncate mt-0.5">
                        {description || `The official r/${name} community`}
                    </p>
                </div>

                {/* ARROW */}
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                    <ChevronRight className="w-4 h-4 text-[#838891]" />
                </div>
            </div>
        </Link>
    );
}