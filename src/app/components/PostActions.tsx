"use client";

import React, { useState } from "react";
import {
  Heart,
  MessageCircle,
  Repeat2,
  ChartNoAxesColumn,
  Bookmark,
  CircleX,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { IPost } from "@/lib/models/Post";
import Link from "next/link";

interface Props {
  likes?: (string | any)[]; // can be IUser objects or string IDs
  _id: string;
  comments?: IPost[];
  repost?: () => void;
  setRepost?: (text: string) => void;
  noOfRepostedTime?: number;
}

const PostActions: React.FC<Props> = ({
  _id,
  repost,
  setRepost,
  comments = [],
  noOfRepostedTime = 0,
  likes = [],
}) => {
  const { user } = useUser();
  const [likesCount, setLikesCount] = useState<number>(likes.length);
  const [isRepostOpen, setIsRepostOpen] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(false);

  const handleLike = async () => {
    if (!user) return;

    try {
      const res = await fetch(`/api/posts/${_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!res.ok) throw new Error("Failed to like post");

      const data = await res.json();
      setLikesCount(data.likesCount); // update from DB
      console.log("data from liked", data)
      setLiked(data.isLiked);
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const openRepostModal = () => setIsRepostOpen(true);
  const closeRepostModal = () => setIsRepostOpen(false);

  return (
    <>
      {isRepostOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40"
          onClick={closeRepostModal}
        />
      )}

      <div className="flex justify-between  items-center text-gray-400 text-sm py-2 w-full">
        {/* Comments */}
        <Link
          href={`/posts/${_id}`}
          className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors"
        >
          <MessageCircle size={20} /> <span>{comments.length}</span>
        </Link>

        {/* Repost */}
        <button
          className="flex items-center gap-1 cursor-pointer hover:text-green-500 transition-colors"
          onClick={openRepostModal}
        >
          <Repeat2 size={20} />
          <span>{noOfRepostedTime}</span>
        </button>

        {/* Likes */}
        <div
          className="flex items-center gap-1 cursor-pointer transition-colors"
          onClick={handleLike}
        >
          <Heart
            size={20}
            className={liked ? "text-white fill-white" : ""}
          />
          <span>{likesCount}</span>
        </div>

        {/* Stats placeholder */}
        <div className="flex items-center gap-1 text-gray-400">
          <ChartNoAxesColumn size={20} /> <span>5.7K</span>
        </div>

        {/* Bookmark */}
        <div className="flex items-center gap-1 cursor-pointer hover:text-yellow-400 transition-colors">
          <Bookmark size={20} />
        </div>
      </div>

      {/* Repost Modal */}
      {isRepostOpen && (
        <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-black border border-[#2f3336] rounded-xl p-6 shadow-lg">
          <div className="flex justify-end">
            <CircleX
              size={24}
              className="cursor-pointer hover:text-red-500"
              onClick={closeRepostModal}
            />
          </div>
          <h2 className="text-lg font-semibold text-white mb-4">Repost</h2>
          <form
            className="flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              repost?.();
              closeRepostModal();
            }}
          >
            <input
              type="text"
              placeholder="Add a comment..."
              className="w-full p-3 rounded-lg bg-black border border-[#2f3336] text-white focus:outline-none focus:border-white"
              onChange={(e) => setRepost?.(e.target.value)}
            />
            <button
              type="submit"
              className="bg-gray-100 hover:bg-white text-black cursor-pointer transition-colors py-2 rounded-lg font-medium"
            >
              Repost
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default PostActions;
