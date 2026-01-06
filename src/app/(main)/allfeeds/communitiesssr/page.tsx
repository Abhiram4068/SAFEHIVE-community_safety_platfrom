
import { Users, FileText } from 'lucide-react';
import axios from 'axios';


type CommunityType = {
    
        id: number;
        name: string;
        created_by: number;
        created_at: Date;
        status: string
    
}


export default async function TopCommunities() {
    let communities :CommunityType[]=[]

 async function fetchData(){
    const response = await axios.get("http://127.0.0.1:8000/api/groups/list/")
 
    communities = response.data

}
  await fetchData()
  return (
    /* Matches original container: flex-1, w-full, lg:max-w-4xl (wider for list), mx-auto, pb-10, px-4 */
    <div className="flex-1 w-full lg:max-w-4xl mx-auto pb-10 px-4 mt-8">
      
      {/* HEADER SECTION */}
      <div className="mb-6 px-2">
        <h1 className="text-white text-2xl font-bold">Top Communities</h1>
        <p className="text-[#838891] text-sm mt-1">Browse Reddify's communities</p>
      </div>

      {/* COMMUNITIES BOX - Matches the card styling in the image */}
      <div className="bg-[#0F1215] border border-[#2D2F34] rounded-l overflow-hidden">
        <div className="flex flex-col">
          {communities.map((community, index) => (
            <div 
              key={community.id} 
              className={`flex items-center justify-between p-5 hover:bg-[#1F2228] transition-colors ${
                index !== communities.length - 1 ? 'border-b border-[#2D2F34]' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Community Icon */}
                <div className={`${community.color} w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-inner`}>
                  {community.icon}
                </div>
                
                {/* Text Info */}
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight hover:underline cursor-pointer">
                    {community.name}
                  </h3>
                  <p className="text-[#838891] text-sm mt-0.5">
                    {community.description}
                  </p>
                </div>
              </div>

              {/* Stats & Action */}
              <div className="flex items-center gap-8">
                {/* Stats */}
                <div className="hidden md:flex items-center gap-6">
                  <div className="flex items-center gap-1.5 text-[#838891]">
                    <Users size={16} />
                    <span className="text-sm">{community.members}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#838891]">
                    <FileText size={16} />
                    <span className="text-sm">{community.posts}</span>
                  </div>
                </div>

                {/* Join Button */}
                <button className="bg-[#2D2F34] hover:bg-[#3E4147] text-white px-5 py-2 rounded-full font-bold text-sm transition">
                  Join
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}