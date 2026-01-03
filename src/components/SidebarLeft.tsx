import Link from "next/link";
const COMMUNITIES = [
  { emoji: '🎮', label: 'r/Gaming', slug: 'gaming' },

];
const CATEGORIES = [
  { emoji: '🎮', label: 'Accident' },
  { emoji: '⚾', label: 'Theft' },
  { emoji: '📈', label: 'Weather' },


];
const FEED = [
  { emoji: '🏠', label: 'Home' },
  { emoji: '🚨', label: 'Report Incident' },
  { emoji: '⚠️', label: 'Issues' },
  { emoji: '💬', label: 'Community' },
  { emoji: '🆘', label: 'Emergency' },
  { emoji: '#️⃣', label: 'Hashtags' },
  { emoji: '📊', label: 'Reports & Stats' },
  { emoji: '⚙️', label: 'Settings' },
];

export const Sidebar = () => {
  return (
    <aside className="hidden lg:block w-64 pr-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto border-r border-[#1F2228]">



      <div className="mt-8">
        <h3 className="px-3 text-xs font-semibold text-[#838891] uppercase tracking-wider mb-2">FEED</h3>
        <div className="space-y-1">
 {FEED.map((feed) => (
            <a key={feed.label} href="#" className="flex items-center px-3 py-2 text-[#838891] hover:bg-[#1A1D23] rounded-md text-sm border border-transparent hover:border-[#1F2228]">
              <span className="mr-3">{feed.emoji}</span> {feed.label}
            </a>
          ))}

        </div>
      </div>
      <div className="mt-8">
        <h3 className="px-3 text-xs font-semibold text-[#838891] uppercase tracking-wider mb-2">your communities</h3>
        <div className="space-y-1">
          {COMMUNITIES.map((community) => (
  <Link
  key={community.slug}
  href={`/community/${community.slug}`}
  className="flex items-center px-3 py-2 text-[#838891] hover:bg-[#1A1D23] rounded-md text-sm border border-transparent hover:border-[#1F2228]"
>
  <span className="mr-3">{community.emoji}</span>
  {community.label}
</Link>
          ))}
        </div>
      </div>
      <div className="mt-8">
        <h3 className="px-3 text-xs font-semibold text-[#838891] uppercase tracking-wider mb-2">Category</h3>
        <div className="space-y-1">
          {CATEGORIES.map((topic) => (
            <a key={topic.label} href="#" className="flex items-center px-3 py-2 text-[#838891] hover:bg-[#1A1D23] rounded-md text-sm border border-transparent hover:border-[#1F2228]">
              <span className="mr-3">{topic.emoji}</span> {topic.label}
            </a>
          ))}
        </div>
      </div>
      
      <div className="mt-8 border-t border-[#1F2228] pt-4 px-3 text-xs text-[#838891]">
        <p>Reddify © 2026. All rights reserved.</p>
      </div>
    </aside>
  );
};