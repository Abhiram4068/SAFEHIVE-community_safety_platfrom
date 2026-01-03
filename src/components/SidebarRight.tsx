// components/RightSidebar.tsx
export const RightSidebar = () => {
  return (
    <aside className="hidden xl:block w-80 pl-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto border-l border-[#1F2228]">
      <div className="bg-[#0B0D10] rounded-md mb-4 border border-[#1F2228] p-2">
        <h3 className="font-semibold text-gray-300 mb-4 px-2">Recent Posts</h3>
        <div className="space-y-4">
          {/* Example of a single item */}
          <div className="flex gap-3 items-start p-2 hover:bg-[#1A1D23] rounded-lg cursor-pointer transition border border-transparent hover:border-[#1F2228]">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white border border-[#1F2228]">r/g</div>
            <div className="flex-1">
              <p className="text-xs text-[#838891] mb-1">r/gaming • 4h</p>
              <p className="text-sm font-medium text-gray-200 line-clamp-2">The new Zelda trailer looks absolutely insane.</p>
              <p className="text-xs text-[#838891] mt-1">20 comments</p>
            </div>
          </div>
          {/* Add more items as needed */}
        </div>
        <button className="w-full text-center text-xs text-blue-400 font-semibold mt-4 hover:underline border-t border-[#1F2228] pt-2">View All</button>
      </div>
    </aside>
  );
};