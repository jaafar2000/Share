"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  ClerkLoaded,
  ClerkLoading,
  useUser,
} from "@clerk/nextjs";
import {
  House,
  Search,
  MessageCircle,
  Users,
  User,
  Ellipsis,
  Share2,
  Menu,
  PlusCircle,
} from "lucide-react";

const Left = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const { user } = useUser();
  const [active, setActive] = useState<string>("Home");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!user) return;

    const fetchUserid = async () => {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) throw new Error("Failed to fetch /api/user");

        const { data } = await res.json();
        const UserMongooID = data.find(
          (item: any) => item?.clerkId === user.id
        );
        setUserId(UserMongooID?._id || null);
      } catch (err) {
        console.error("fetchUserid error:", err);
      }
    };

    fetchUserid();
  }, [user]);

  const menuItemStyle =
    "flex gap-3 py-6 md:py-1 md:gap-4 p-2 md:p-3 items-center text-lg md:text-xl text-gray-400 w-fit cursor-pointer hover:text-white transition-colors rounded-md";
  const menuItemText = "block";
  const activeStyle = "text-white";

  return (
    <div className="flex justify-between border-b border-[#2f3336] md:flex-col w-full md:w-[20%] md:h-screen md:border-r p-2 md:p-4">
      {/* Top Logo/Menu */}
      <div className="flex items-center md:justify-start gap-2 p-1 md:p-3">
        <Link
          href={"/"}
          className="hidden md:block cursor-pointer hover:bg-gray-700 rounded-full p-2"
        >
          <Share2 size={30} />
        </Link>
        {/* Mobile Menu Button */}
        <div
          className="block md:hidden cursor-pointer hover:bg-gray-700 rounded-full p-2"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          <Menu size={30} />
        </div>
      </div>

      {/* Menu Items */}
      <div
        className={`absolute top-20 left-0  z-50 w-0 md:relative md:w-full flex flex-col md:gap-6 md:overflow-visible overflow-hidden transition-all duration-300 ${
          isOpen ? "w-screen p-4 bg-black h-full " : "w-0 p-0"
        } md:max-h-full`}
      >
        <Link href={"/"}>
          <div
            className={`${menuItemStyle} ${
              active === "Home" ? activeStyle : ""
            }`}
            onClick={() => {
              setActive("Home");
              setIsOpen(false);
            }}
          >
            <House size={26} /> <span className={menuItemText}>Home</span>
          </div>
        </Link>

        <Link href={"/search"}>
          <div
            className={`${menuItemStyle} ${
              active === "Search" ? activeStyle : ""
            }`}
            onClick={() => {
              setActive("Search");
              setIsOpen(false);
            }}
          >
            <Search size={26} /> <span className={menuItemText}>Search</span>
          </div>
        </Link>

        <div
          className={`${menuItemStyle} ${
            active === "Messages" ? activeStyle : ""
          }`}
          onClick={() => {
            setActive("Messages");
            setIsOpen(false);
          }}
        >
          <MessageCircle size={26} />{" "}
          <span className={menuItemText}>Messages</span>
        </div>

        <Link
          href={"/users"}
          className={`${menuItemStyle} ${
            active === "Users" ? activeStyle : ""
          }`}
          onClick={() => {
            setActive("Users");
            setIsOpen(false);
          }}
        >
          <Users size={26} /> <span className={menuItemText}>Users</span>
        </Link>

        {user && userId && (
          <Link
            href={`/profile/${userId}`}
            className={`${menuItemStyle} ${
              active === "Profile" ? activeStyle : ""
            }`}
            onClick={() => {
              setActive("Profile");
              setIsOpen(false);
            }}
          >
            <User size={26} /> <span className={menuItemText}>Profile</span>
          </Link>
        )}

        {/* Post Button */}
        <Link
          href={"/create-post"}
          className="flex items-center justify-center gap-2 bg-white text-black font-bold py-2 px-4 rounded-3xl hover:bg-gray-200 transition-colors mt-2"
        >
          <PlusCircle size={20} /> <span>Post</span>
        </Link>
      </div>

      {/* Auth / User Info */}
      <div className="mt-2 md:mt-auto flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
        <ClerkLoading>Loading...</ClerkLoading>
        <ClerkLoaded>
          <SignedOut>
            <div className="flex flex-col md:flex-row gap-2">
              <div className="px-4 py-2 rounded-full bg-white cursor-pointer font-bold text-black text-center">
                <SignInButton />
              </div>
            </div>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center gap-2 md:gap-3 p-2 md:p-0">
              <UserButton />

              <div className=" hidden md:flex flex-col">
                <span className={menuItemText}>
                  {user?.firstName} {user?.lastName}
                </span>
                <span className={`text-sm text-gray-500 ${menuItemText}`}>
                  @{user?.username}
                </span>
              </div>
              <Ellipsis
                className={`text-gray-400 hidden md:block ${menuItemText}`}
              />
            </div>
          </SignedIn>
        </ClerkLoaded>
      </div>
    </div>
  );
};

export default Left;
