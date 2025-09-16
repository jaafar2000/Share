"use client";
import React from "react";
import Post from "../components/Post";
import { CircleX } from "lucide-react";
import { useRouter } from "next/navigation"; // Import the router

const Page = () => {
  const router = useRouter(); // Initialize the router

  const closeModal = () => {
    router.back(); // Use the router to go back in history, closing the modal
  };

  return (
    <div className=" w-full h-full flex items-center justify-center left-0 top-0 bg-black/50 ">
      <div className="bg-black w-[500px] h-fit border-1 rounded-xl border-[#2f3336] ">
        <div className="flex flex-row justify-between items-center p-4">
          <p className="text-3xl">Post</p>
          <button
            onClick={closeModal} // Use a button with an onClick handler
            className="cursor-pointer text-gray-500 hover:text-white"
          >
            <CircleX />
          </button>
        </div>
        <Post
          onPostCreated={() => {
            router.back(); // Use the router to go back in history, closing the modal
          }}
          type={"What's happening?"}
          postId={""}
        />
      </div>
    </div>
  );
};

export default Page;
