"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { 
  Loader2, Bookmark, MessageSquare, Send,
  CheckCircle, ChevronLeft 
} from "lucide-react";
import Link from "next/link";
import { PostCard } from "@/src/components/PostCard";

const POST_SERVICE_URL = "http://127.0.0.1:8000";
const MEDIA_SERVICE_URL = "http://127.0.0.1:8006";
const COMMENT_SERVICE_URL = "http://127.0.0.1:8008";

const PRESET_REACTIONS = [
  { label: "Concerned", emoji: "😟", key: "concerned" },
  { label: "Action Required", emoji: "📢", key: "action_required" },
  { label: "Helpful", emoji: "🤝", key: "helpful" },
  { label: "Urgent", emoji: "🚨", key: "urgent" },
  { label: "Angry", emoji: "😡", key: "angry" },
  { label: "Support", emoji: "🙏", key: "support" },
];

export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [postingComment, setPostingComment] = useState(false);

  useEffect(() => {
    if (id) fetchPostData();
  }, [id]);

  const fetchPostData = async () => {
    try {
      setLoading(true);
      const postRes = await axios.get(`${POST_SERVICE_URL}/api/post/${id}/`);
      let postData = postRes.data;

      // Media Fetching
      try {
        const mediaRes = await axios.get(`${MEDIA_SERVICE_URL}/api/media/by-post/${id}/`);
        postData.media = mediaRes.data.map((m: any) => ({
          ...m,
          displayUrl: (m.file || m.image || "").startsWith("http") 
            ? (m.file || m.image) 
            : `${MEDIA_SERVICE_URL}${m.file || m.image}`,
        }));
      } catch (e) { postData.media = []; }

      // Comments Fetching
      try {
        const commentRes = await axios.get(`${COMMENT_SERVICE_URL}/api/post/${id}/comments/`);
        setComments(commentRes.data);
      } catch (e) { setComments([]); }

      setPost(postData);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleHelpful = async () => {
    try {
      const res = await axios.patch(`/api/post/${id}/helpful/`);
      setPost({ ...post, is_helpful: res.data.helpful, helpful_count: res.data.helpful_count });
    } catch (err) { console.error(err); }
  };



  const handleReaction = async (key: string) => {
    try {
      const res = await axios.post(`${POST_SERVICE_URL}/api/post/${id}/react/`, { reaction: key });
      setPost({ ...post, user_reaction: res.data.current_reaction, reaction_counts: res.data.all_counts });
    } catch (err) { console.error(err); }
  };

  const postComment = async () => {
    if (!commentText.trim()) return;
    try {
      setPostingComment(true);
      const res = await axios.post("/api/comment", { post_id: id, comment_text: commentText });
      setComments([res.data, ...comments]);
      setCommentText("");
    } catch (err) { console.error(err); }
    finally { setPostingComment(false); }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#0D0F12]">
      <Loader2 className="animate-spin text-blue-500" size={32} />
    </div>
  );

  if (!post) return <div className="p-20 text-center text-white">Post not found.</div>;

  return (
    <div className="flex-1 w-full lg:max-w-2xl mx-auto pb-10 px-4 bg-[#0D0F12] min-h-screen text-white">
      {/* Header Navigation */}
      <div className="py-6 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-[#1A1D23] rounded-full transition">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Post Thread</h1>
      </div>

      {/* THE POST CARD (Exact same structure as feed) */}
      <div className="mb-4">
        <PostCard
          id={post.id}
          display_name={post.display_name}
          time={new Date(post.created_at).toLocaleDateString()}
          title={post.title}
          content={post.caption}
          location={post.location_name || 'Global'}
          latitude={post.latitude}
          longitude={post.longitude}
          locationdistance="" 
          imageUrl={post.media?.[0]?.displayUrl || null}
          accentColor={post.priority === "high" ? "bg-red-500" : "bg-blue-500"}
        />

        {/* Post Actions Area (Matching Feed Logic) */}
        <div className="px-4 py-3  rounded-b-xl -mt-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div>
               
                {comments.length} <span className="text-[15px] text-[#5c6066] ">comment(s)</span>
              </div>

              
              <div >
                {post.helpful_count || 0} <span className="text-[15px] text-[#5c6066] ">found this helpful</span>
              </div>
              
            </div>

            
          </div>

         
        </div>
      </div>

{/* COMMENT INPUT */}
<div className="mt-8 mb-10">
  <div className="flex gap-3 items-end bg-[#1A1D23] border border-[#1F2228] rounded-2xl p-2 focus-within:ring-1 focus-within:ring-blue-500 transition">
    <textarea
      value={commentText}
      onChange={(e) => setCommentText(e.target.value)}
      placeholder="Write a comment..."
      className="flex-1 bg-transparent border-none p-2 text-sm text-gray-200 focus:outline-none transition resize-none min-h-[45px]"
      rows={2}
    />
    <button 
      onClick={postComment}
      disabled={postingComment || !commentText.trim()}
      
      className="mb-1 p-2.5 bg-blue-600 hover:bg-blue-700 disabled: text-white rounded-xl transition flex-shrink-0"
    >
      {postingComment ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
    </button>
  </div>
</div>
{/* COMMENTS LIST */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[#838891] uppercase tracking-wider mb-4">Discussion</h3>
        {comments.length === 0 ? (
          <div className="text-center py-10 text-[#5c6066] text-sm italic border border-dashed border-[#1F2228] rounded-xl">
            No comments yet. Be the first to share your thoughts.
          </div>
        ) : (
          comments.map((c: any, index: number) => (
            <React.Fragment key={c.id}>
              <div className="flex gap-4 p-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-900 to-[#1A1D23] flex-shrink-0 border border-[#2F333A] flex items-center justify-center text-xs font-bold text-blue-400">
                  {String(c.user_id).charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-white">{c.display_name}</span>
                    <span className="text-[10px] text-[#5c6066]">Today</span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {c.comment_text}
                  </p>
                </div>
              </div>
              
              {/* THE LINE: Only renders if it's NOT the last comment */}
              {index < comments.length - 1 && (
                <div className="h-[1px] w-full bg-[#1F2228] mx-auto" />
              )}
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
}