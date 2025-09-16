"use client";
import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, CalendarDays, X } from "lucide-react";
import fetchPosts from "@/lib/actions/fetchPosts";
import Feed from "@/app/components/Feed";
import EditProfileButton from "@/app/components/EditProfileButton";
import UploadImage from "@/lib/actions/UploadImage";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

interface ProfilePageProps {
  params: Promise<{
    profileId: string;
  }>;
}

const Page = ({ params }: ProfilePageProps) => {
  const { user } = useUser();
  const { profileId } = React.use(params);

  const [profileData, setProfileData] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const tabs = ["Posts", "Shared", "Articles", "Media"];
  const [active, setActive] = useState("Posts");

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await fetch(`/api/user/${profileId}`);
        if (!res.ok) throw new Error("Failed to fetch profile data");

        const { data } = await res.json();
        setProfileData(data);
      } catch (err) {
        console.error("❌ Error fetching profile:", err);
      }
    };

    fetchProfileData();
  }, [profileId]);

  useEffect(() => {
    fetchPosts().then((data) => {
      const filtered = data.filter(
        (post: any) => post.author._id === profileId
      );

      let filteredPosts;
      switch (active) {
        case "Posts":
          filteredPosts = filtered.filter((p: any) => p.parentPostId === null);
          break;
        case "Articles":
        case "Media":
          filteredPosts = filtered.filter((p: any) => p.image);
          break;
        case "Articles":
          filteredPosts = filtered.filter(
            (p: any) => p.body && p.body.trim() !== ""
          );
          break;
        case "Shared":
          filteredPosts = filtered.filter((p: any) => p.reposted);
          break;
        default:
          filteredPosts = filtered;
      }

      setPosts(filteredPosts);
    });
  }, [profileId, active]);

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
    }
  };

  const handleUpload = async (): Promise<string | null> => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return null;

    if (!(file instanceof File)) {
      console.error("Invalid file type:", file);
      return null;
    }

    const imageUrl = await UploadImage(file);
    return imageUrl;
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const finalImageUrl = await handleUpload();
      if (finalImageUrl) {
        await fetch(`/api/user/${profileId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cover: finalImageUrl }),
        });

        const updatedRes = await fetch(`/api/user/${profileId}`);
        if (updatedRes.ok) {
          const { data } = await updatedRes.json();
          setProfileData(data);
        }
      }
    } catch (error) {
      console.error("❌ Error updating profile:", error);
    }
    setSaving(false);
    setPreviewUrl(null);
  };

  if (!profileData) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span className="loaderSpinner"></span>
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-y-scroll hide-scrollbar">
      {/* HEADER */}
      <div className="sticky top-0 z-10 flex items-center border-b border-[#2f3336] py-4 text-xl font-bold backdrop-blur-[20px] backdrop-saturate-[180%] bg-black/60">
        <Link href="/" className="z-10">
          <ArrowLeft size={20} className="ml-4 mr-2 cursor-pointer" />
        </Link>

        <h2 className="text-white px-3">
          {profileData?.first_name} {profileData?.last_name}
        </h2>
      </div>

      <div className="w-full">
        {/* Cover Image */}
        <div className="relative h-48 bg-gray-800">
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            id="cover-file"
          />
          {profileData?.cover && (
            <Image
              src={profileData.cover}
              alt="Cover"
              width={800}
              height={192}
              className="object-cover w-full h-full"
            />
          )}
          {profileData?.clerkId === user?.id && (
            <label
              htmlFor="cover-file"
              className="absolute bottom-2 right-2 bg-black/60 text-white px-3 py-1 rounded cursor-pointer text-sm"
            >
              Edit Cover
            </label>
          )}

          {/* Profile Image */}
          <Image
            src={profileData?.image_url || "/default-avatar.png"}
            alt="Profile"
            width={128}
            height={128}
            className="w-32 h-32 rounded-full border-4 border-black absolute -bottom-16 left-4 object-cover"
          />
        </div>

        {/* Edit Profile Button */}
        <div
          className={`flex justify-end items-center p-4 ${
            profileData?.clerkId === user?.id ? "" : "py-6"
          }`}
        >
          {profileData?.clerkId === user?.id && <EditProfileButton />}
        </div>
      </div>

      {/* MODAL PREVIEW */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-black border border-[#2f3336] rounded-xl p-10 relative w-[90%] max-w-lg">
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            {previewUrl && (
              <Image
                src={previewUrl}
                alt="Preview"
                width={600}
                height={192}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPreviewUrl(null)}
                className="px-4 py-2 rounded bg-gray-700 text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="px-4 py-2 rounded bg-blue-500 text-white disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROFILE INFO */}
      <div className="p-4">
        <p className="text-2xl font-bold">
          {profileData?.first_name} {profileData?.last_name}
        </p>
        <p className="text-sm text-gray-400">@{profileData?.username}</p>
        {profileData?.createdAt && (
          <p className="text-gray-400 my-4 flex items-center">
            <CalendarDays size={18} className="inline mr-1" />
            Joined{" "}
            {new Date(profileData.createdAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        )}
        <div className="text-gray-400">
          <span className="mr-4">
            <span className="font-bold text-white">
              {profileData?.following?.length || 0}
            </span>{" "}
            Following
          </span>
          <span>
            <span className="font-bold text-white">
              {profileData?.followers?.length || 0}
            </span>{" "}
            Followers
          </span>
        </div>
      </div>

      {/* TABS */}
      <div className="flex border-b border-gray-700 text-gray-500 text-sm font-medium">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`flex-1 py-3 hover:bg-gray-800 transition-colors ${
              active === tab
                ? "text-white border-b-2 border-white"
                : "text-gray-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* FEED */}
      <Feed
        FromProfile={true}
        active={active}
        posts={posts}
        fetchPosts={fetchPosts}
      />
    </div>
  );
};

export default Page;
