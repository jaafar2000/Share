"use client";

import React, { useState } from "react";
import PostCard from "../components/PostCard";
import Link from "next/link";
import Image from "next/image";
const Page = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ users: any[]; posts: any[] }>({
    users: [],
    posts: [],
  });
  const [activeTab, setActiveTab] = useState<"people" | "posts">("people");

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);

    if (!q) {
      setResults({ users: [], posts: [] });
      return;
    }

    try {
      const res = await fetch(`/api/search?q=${q}`);
      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setResults({
        users: data.users || [],
        posts: data.posts || [],
      });
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  return (
    <div className="w-full h-screen overflow-y-scroll hide-scrollbar">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center border-b border-[#2f3336] py-4 text-xl font-bold backdrop-blur-[20px] backdrop-saturate-[180%] bg-black/60">
        <h2 className="text-white px-3">Search</h2>
      </div>

      {/* Search Input */}
      <div className="p-4">
        <input
          value={query}
          onChange={handleSearch}
          className="w-full py-2 px-4 border-1 border-[#2f3336] focus:border-gray-600 ease-in-out duration-150 transition outline-none rounded-2xl  bg-black text-white"
          placeholder="Search users or posts..."
        />

        {/* Toggle Tabs */}
        <div className="flex gap-4 mt-4 border-b border-[#2f3336]">
          <button
            onClick={() => setActiveTab("people")}
            className={`pb-2  cursor-pointer  border-b-2 border-transparent ease-in-out duration-150 transition ${
              activeTab === "people"
                ? "border-b-2 border-white text-white"
                : "text-gray-400"
            }`}
          >
            People
          </button>
          <button
            onClick={() => setActiveTab("posts")}
            className={`pb-2 cursor-pointer border-b-2  border-transparent  ease-in-out duration-150 transition ${
              activeTab === "posts"
                ? "border-b-2 border-white text-white"
                : "text-gray-400"
            }`}
          >
            Posts
          </button>
        </div>

        {/* Results */}
        <ul className="mt-2">
          {activeTab === "people" &&
            results.users.map((u) => (
              <li
                key={u._id}
                className="p-2 border-b border-[#2f3336] flex flex-row items-center gap-3 "
              >
                <div className="w-[40px] h-[40px]   rounded-full overflow-hidden ">
                  <Image
                    src={u?.image_url}
                    width={100}
                    height={100}
                    alt={u?.username}
                  />
                </div>
                <Link href={`/profile/${u?._id}`}>
                  {u.first_name} {u.last_name}
                  <span className="text-gray-500 ml-2 underline ">
                    @{u.username}
                  </span>{" "}
                </Link>
              </li>
            ))}

          {activeTab === "posts" &&
            results.posts.map((p) => (
              <li key={p._id} className="p-2 border-b border-[#2f3336]">
                <PostCard
                  post={p}
                  active=""
                  onPostCreated={() => {
                    return;
                  }}
                  type="reposted"
                />
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Page;
