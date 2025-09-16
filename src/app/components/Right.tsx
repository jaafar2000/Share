"use client";
import React from "react";
import { Search } from "lucide-react";
import WhoToFollow from "./WhoToFollow";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
const Right = () => {
  const { user } = useUser();
  const trends = [
    { title: "React", tweets: "45.1K" },
    { title: "Tailwind CSS", tweets: "28.9K" },
    { title: "JavaScript", tweets: "72.3K" },
    { title: "Web Development", tweets: "60.5K" },
  ];

  return (
    <div className=" hidden  w-[30%] p-4 md:flex flex-col justify-between border-l border-[#2f3336]">
      <div>
        {/* Search Bar */}
        <div className="py-2">
          <Link href="/search">
            <div className=" flex items-center justify-center w-full py-2 px-4 rounded-full bg-white text-black ">
              <Search
                size={20}
                className="text-gray-500 dark:text-gray-400 mr-2"
              />
              Search
            </div>
          </Link>
        </div>

        {/* What's happening section */}
        <div className="p-2 overflow-hidden border-[#2f3336] border-1 rounded-xl">
          <div className="p-3 font-extrabold text-xl text-gray-900 dark:text-white">
            What&apos;s happening
          </div>
          {trends.map((trend, index) => (
            <div
              key={index}
              className="p-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-800"
            >
              <div className="font-bold text-gray-900 dark:text-white text-base mb-1">
                {trend.title}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {trend.tweets} Tweets
              </div>
            </div>
          ))}
          <div className="p-3 text-blue-500 cursor-pointer hover:text-blue-600">
            Show more
          </div>
        </div>
        {/* Who to follow section */}
        <div className="p-2 overflow-hidden border-[#2f3336] border-1 rounded-xl mt-4">
          <div className="p-3 font-extrabold text-xl text-gray-900 dark:text-white">
            Who to follow
          </div>
          {user ? (
            <>
              <WhoToFollow isRightSide={true} />
              <Link href={"/users"}>
                <div className="p-3 text-blue-500 cursor-pointer hover:text-blue-600">
                  Show more
                </div>
              </Link>
            </>
          ) : (
            <div className="px-4 py-4 text-gray-500 dark:text-gray-400">
              Log in to show users
            </div>
          )}
        </div>
      </div>

      {/* Footer Links */}
      <div className="p-2 text-xs text-gray-500 dark:text-gray-400">
        <a href="#" className="hover:underline">
          Terms of Service
        </a>
        <a href="#" className="hover:underline ml-2">
          Privacy Policy
        </a>
        <a href="#" className="hover:underline ml-2">
          Cookie Policy
        </a>
        <a href="#" className="hover:underline ml-2">
          Accessibility
        </a>
        <a href="#" className="hover:underline ml-2">
          Ads info
        </a>
        <span className="ml-2">&copy; 2024 X Corp.</span>
      </div>
    </div>
  );
};

export default Right;
