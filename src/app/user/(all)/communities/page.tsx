import { Users, FileText, Plus, Search, ChevronRight } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';
import { cookies } from "next/headers";

type CommunityType = {
    id: number;
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    member_count?: number;
    post_count?: number;
}

export default async function TopCommunities() {
    let communities: CommunityType[] = [];

    const cookieStore = await cookies();
    const access = cookieStore.get("access")?.value;

    async function fetchData() {
        try {
            const response = await axios.get("http://127.0.0.1:8005/api/groups/list/");
            communities = response.data;
        } catch (error) {
            console.error("Error fetching communities:", error);
        }
    }

    await fetchData();

    return (
        <div className="flex-1 w-full lg:max-w-4xl mx-auto pb-10 px-4">
            {/* SEARCH AND NAVIGATION */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-8 pt-4">
                <div className="relative flex-1 w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-[#838891]" />
                    </div>
                    <input
                        type="text"
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

            <section className="mb-4 px-2">
                <div className="flex items-center gap-2">
                    <h2 className="text-white text-lg font-bold">Top Communities</h2>
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

            {communities.length === 0 && (
                <div className="text-center py-20 text-[#838891] border border-dashed border-[#2D2F34] rounded-xl mt-4">
                    No communities found. Be the first to create one!
                </div>
            )}
        </div>
    );
}

function CommunityRow({ community, rank }: { community: CommunityType, rank: number }) {
    const { id, name, description, icon, color } = community;
    
    return (
        <Link href={`/communityinfo/${id}`}>
            <div className="flex items-center gap-4 py-4 px-2 border-b border-[#1F2228] hover:bg-[#1A1D23]/50 transition-colors group">
                {/* RANK & ICON */}
                <div className="flex items-center gap-4 min-w-[70px]">
                    <span className="text-[#838891] font-medium text-sm w-4 text-center">{rank}</span>
                    <div className={`${color || 'bg-blue-600'} w-9 h-9 rounded-full flex items-center justify-center text-base shadow-inner shrink-0`}>
                        {icon || name.charAt(0).toUpperCase()}
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