"use client";
import {  useClerk } from "@clerk/nextjs";

const EditProfileButton = () => {
  const { openUserProfile } = useClerk();

  return (
    <button
      onClick={() => openUserProfile()}
      className="text-white px-4 py-2 rounded-full border border-white hover:bg-gray-800 transition"
    >
      Edit profile
    </button>
  );
};

export default EditProfileButton;
