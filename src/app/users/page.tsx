import React from "react";
import WhoToFollow from "../components/WhoToFollow";

const page = () => {
  return (
    <div className="w-full h-screen overflow-y-scroll hide-scrollbar">
      <div className="sticky top-0 z-10 flex items-center border-b-1 border-[#2f3336] py-4 text-xl font-bold backdrop-blur-[20px] backdrop-saturate-[180%] bg-black/60">
        <h2 className="text-white px-3">Users</h2>
      </div>
      <WhoToFollow isRightSide={false} />
    </div>
  );
};

export default page;
