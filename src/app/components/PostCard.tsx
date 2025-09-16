"use client";

import React, { act, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Trash } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { IPost } from "@/lib/models/Post";
import { IUser } from "@/lib/models/User";
import { useUser } from "@clerk/nextjs";
import PostActions from "./PostActions";
import { usePathname } from "next/navigation";
type PopulatedPost = Omit<IPost, "author" | "_id" | "username"> & {
  _id: string;
  author?: IUser | null;
  reposted?: PopulatedPost | null;
  username: string;
  parentPostId?: PopulatedPost | null;
  comments?: IPost[];
  likes?: IUser[];
};

type PostCardProps = {
  post: PopulatedPost;
  onPostCreated: () => void;
  type: string;
  active: string;
  FromProfile?: boolean
};

const PostCard: React.FC<PostCardProps> = ({
  post,
  active,
  onPostCreated,
  type,
}) => {
  const { user } = useUser();
  const [isDeleting, setIsDeleting] = useState(false);
  const [repost, setRepost] = useState("");
  const pathname = usePathname();

  const {
    _id,
    body,
    image,
    createdAt,
    comments = [],
    likes = [],
    reposted,
    author,
    noOfRepostedTimes,
    parentPostId,
  } = post;

  // original post if this is a repost
  const rootPost = reposted?.reposted ? reposted.reposted : reposted;

  // current post author (user who posted or reposted)
  const clerkId = author?.clerkId;
  const username = author?.username ?? "unknown";
  const image_url = author?.image_url ?? "/default-avatar.png";
  const first_name = author?.first_name ?? "";
  const last_name = author?.last_name ?? "";
  const id = author?._id ?? "";

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/posts/${_id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error deleting post");
      onPostCreated();
    } catch (error) {
      console.error(error);
      setIsDeleting(false);
    }
  };

  const handleRepost = async (_id: string) => {
    try {
      const res = await fetch(`/api/repost-post/${_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id, textbody: repost }),
      });
      if (!res.ok) throw new Error("Error reposting");
      await res.json();
      onPostCreated();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {isDeleting && <div className="loader w-full"></div>}
      {pathname.slice(1, 8) === "profile" && active === "Replies" && (
        <p className="my-3 text-sm text-gray-500">
          Reply to{" "}
          <span className="text-blue-400 mr-2">
            @{parentPostId?.author?.username ?? "unknown"}&apos;s
          </span>
          <Link href={`/posts/${parentPostId?._id}`}>post</Link>
        </p>
      )}
      {/* Main wrapper */}
      <div className="flex items-start mb-2">
        {/* avatar */}
        <Link href={`/profile/${id}`}>
          <Image
            src={image_url}
            alt={`${first_name} ${last_name}`}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full mr-3"
          />
        </Link>
        {/* main content */}
        <div className="flex flex-col w-full">
          <div>
            {/* header */}
            <p className="font-bold flex items-center">
              {first_name} {last_name}{" "}
              <Link href={`/profile/${id}`}>
                <span className="text-sm text-gray-300 underline ml-1 font-thin">
                  @{username}
                </span>
              </Link>
              <span className="text-sm text-gray-400 font-thin">
                {" "}
                ·{" "}
                {createdAt
                  ? formatDistanceToNow(new Date(createdAt), {
                      addSuffix: true,
                    })
                  : ""}
              </span>
              {user?.id === clerkId && (
                <button onClick={handleDelete} className="ml-auto">
                  <Trash size={16} />
                </button>
              )}
            </p>

            {/* body */}
            <Link href={`/posts/${_id}`}>
              <p className="text-lg break-words py-2">
                {body.length > 150 ? `${body.slice(0, 150)}...` : body}
              </p>
            </Link>
            {/* reposted post (original) */}
            {rootPost && (
              <div className="mt-2 border border-[#2f3336] p-3 rounded-xl text-sm">
                <div className="flex items-start">
                  <Image
                    src={rootPost.author?.image_url ?? "/default-avatar.png"}
                    alt={`${rootPost.author?.first_name ?? ""} ${
                      rootPost.author?.last_name ?? ""
                    }`}
                    width={30}
                    height={30}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <div>
                    <p className="font-bold flex items-center justify-between">
                      <span>
                        {rootPost.author?.first_name}{" "}
                        {rootPost.author?.last_name}{" "}
                        <Link href={`/profile/${rootPost.author?._id}`}>
                          <span className="text-sm text-gray-300 underline ml-1 font-thin">
                            @{rootPost.author?.username ?? "unknown"}
                          </span>
                        </Link>
                      </span>

                      <Link href={`/posts/${rootPost._id}`}>
                        <span className="text-sm text-gray-300 underline ml-1 font-thin">
                          Show full post
                        </span>
                      </Link>
                    </p>
                    <p>{rootPost.body}</p>
                    {rootPost.image && (
                      <div className=" h-[400px] w-fit rounded-xl   overflow-hidden flex items-center justify-start bg-black">
                        <Image
                          src={rootPost.image || "/placeholder.png"}
                          alt="Post media"
                          width={1000}
                          height={1000}
                          className=" h-full w-fit "
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* normal post image (if not repost) */}
            {!rootPost && image && (
              <Link href={`/posts/${_id}`}>
                <div className="my-2 flex justify-start">
                  <div className=" h-[400px] w-fit rounded-xl   overflow-hidden flex items-center justify-start bg-black">
                    <Image
                      src={image}
                      alt="Post media"
                      width={1000}
                      height={1000}
                      className=" h-full w-fit "
                    />
                  </div>
                </div>
              </Link>
            )}
          </div>

          {/* actions (no actions inside nested repost preview) */}
          {type !== "reposted" && (
            <PostActions
              noOfRepostedTime={noOfRepostedTimes}
              repost={() => handleRepost(_id)}
              likes={likes}
              comments={comments}
              _id={_id}
              setRepost={setRepost}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default PostCard;
