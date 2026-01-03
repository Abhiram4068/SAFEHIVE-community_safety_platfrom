import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/SidebarLeft';
import { PostCard } from '../components/PostCard';
import { RightSidebar } from '../components/SidebarRight';

// export default function Home() {
//   return (
//     <div className="bg-[#0B0D10] text-[#D1D5DB] min-h-screen">
//       <Navbar />
      
//       <main className="max-w-[1600px] w-full mx-auto flex pt-4 border-x border-[#1F2228]">
//         <Sidebar />

        // <div className="flex-1 w-full lg:max-w-2xl mx-auto pb-10 px-4">
          // <div className="flex gap-4 mb-4 border-b border-[#1F2228] pb-2 px-2">
          //   <button className="text-white font-semibold text-sm border-b border-white">Best</button>
          //   <button className="text-[#838891] hover:text-white font-medium text-sm transition">Hot</button>
          //   <button className="text-[#838891] hover:text-white font-medium text-sm transition">New</button>
          // </div>

          // <PostCard 
          //   subreddit="food"
          //   author="chef_mike"
          //   time="5 hours ago"
          //   title="Japanese Souffle Pancakes"
          //   imageUrl="https://images.unsplash.com/photo-1598214886806-c87b84b7078b?q=80&w=1000"
          //   votes="14.2k"
          //   comments="452"
          //   accentColor="bg-blue-500"
          // />
          
//           <PostCard 
//             subreddit="technology"
//             author="tech_guru"
//             time="8 hours ago"
//             title="Looking to the future today"
//             imageUrl="https://images.unsplash.com/photo-1598214886806-c87b84b7078b?q=80&w=1000"
//             content="Artificial Intelligence is advancing at a pace we haven't seen since the industrial revolution..."
//             votes="3.1k"
//             comments="89"
//             accentColor="bg-green-500"
//           />
//           <PostCard 
//             subreddit="technology"
//             author="tech_guru"
//             time="8 hours ago"
//             title="Looking to the future today"
//             imageUrl="https://images.unsplash.com/photo-1598214886806-c87b84b7078b?q=80&w=1000"
//             content="Artificial Intelligence is advancing at a pace we haven't seen since the industrial revolution..."
//             votes="3.1k"
//             comments="89"
//             accentColor="bg-green-500"
//           />
//         </div>

//         <RightSidebar />
//       </main>
//     </div>
//   );
// }
export default function Home() {
  return (
    <div className="bg-[#0B0D10] text-[#D1D5DB] min-h-screen antialiased">
      <Navbar />
      
      {/* CHANGE: Added 'px-6' (or 'px-10' for more space) to the main tag.
          This pushes both sidebars away from the very edges of the screen/container.
      */}
      <main className="max-w-[1600px] w-full mx-auto flex pt-4 px-18 border-x border-[#1F2228]">
        
        {/* Left Sidebar */}
        <Sidebar />

        {/* Central Feed */}
        <div className="flex-1 w-full lg:max-w-2xl mx-auto pb-10 px-4">

          <div className="flex gap-4 mb-4 border-b border-[#1F2228] pb-2 px-2">
            <button className="text-white font-semibold text-sm border-b border-white">Best</button>
            <button className="text-[#838891] hover:text-white font-medium text-sm transition">Hot</button>
            <button className="text-[#838891] hover:text-white font-medium text-sm transition">New</button>
          </div>

          
           <PostCard 
            subreddit="food"
            author="chef_mike"
            time="5 hours ago"
            title="Japanese Souffle Pancakes"
            imageUrl="https://images.unsplash.com/photo-1598214886806-c87b84b7078b?q=80&w=1000"
            votes="14.2k"
            commentsCount="452"
            accentColor="bg-blue-500"
          />

          <PostCard 
            subreddit="technology"
            author="tech_guru"
            time="8 hours ago"
            title="Looking to the future today"
            imageUrl="https://images.unsplash.com/photo-1598214886806-c87b84b7078b?q=80&w=1000"
            content="Artificial Intelligence is advancing at a pace we haven't seen since the industrial revolution..."
            votes="3.1k"
            commentsCount="89"
            accentColor="bg-green-500"
          />
        </div>

        {/* Right Sidebar */}
        <RightSidebar />
        
      </main>
    </div>
  );
}