"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

interface IUser {
  _id: string;
  image_url: string;
  username: string;
  first_name: string;
  clerkId: string;
  followers: string[];
  following: string[];
}

interface Props {
  isRightSide: boolean;
}

const WhoToFollow: React.FC<Props> = ({ isRightSide }) => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [current, setCurrent] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, isLoaded } = useUser();

  const fetchUsers = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch("/api/user");
      if (!res.ok) throw new Error("Failed to fetch users");
      const { data } = await res.json();
      const currentUser = data.find((u: IUser) => u.clerkId === user.id);
      setCurrent(currentUser);
      const filteredUsers = data.filter(
        (u: IUser) => u.clerkId !== currentUser?.clerkId
      );
      setUsers(filteredUsers);
    } catch (err: any) {
      console.error("Error fetching users:", err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isLoaded && user) {
      fetchUsers();
    } else if (isLoaded && !user) {
      setLoading(false);
    }
  }, [isLoaded, user, fetchUsers]);

  const Follow = async (id: string) => {
    if (!current) {
      console.error("Current user not loaded.");
      return;
    }

    const isCurrentlyFollowing = current.following.includes(id);

    setUsers((prevUsers) =>
      prevUsers.map((u) => {
        if (u._id === id) {
          const newFollowers = isCurrentlyFollowing
            ? u.followers.filter((followerId) => followerId !== current._id)
            : [...u.followers, current._id];
          return { ...u, followers: newFollowers };
        }
        return u;
      })
    );

    setCurrent((prevCurrent) => {
      if (!prevCurrent) return null;
      const newFollowing = isCurrentlyFollowing
        ? prevCurrent.following.filter((followingId) => followingId !== id)
        : [...prevCurrent.following, id];
      return { ...prevCurrent, following: newFollowing };
    });

    try {
      const res = await fetch("/api/Follow", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        throw new Error(`Failed to follow: ${res.statusText}`);
      }
    } catch (err: any) {
      console.error("Error following:", err.message);
      fetchUsers();
    }
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  // derive which users to display
  const displayedUsers = isRightSide ? users.slice(0, 3) : users;
  console.log(displayedUsers);

  return (
    <div>
      {displayedUsers.length === 0 ? (
        <div className="p-3 text-center text-gray-500 dark:text-gray-400">
          No users to follow at the moment.
        </div>
      ) : (
        displayedUsers.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-800"
          >
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-[40px] h-[40px] rounded-full overflow-hidden">
                <Image
                  src={user.image_url}
                  alt={`${user.username}'s profile`}
                  width={100}
                  height={100}
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-gray-900 dark:text-white">
                  <Link href={`/profile/${user._id}`}>{user.first_name}</Link>
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  @
                  {user.username.length >= 10
                    ? user.username.slice(0, 10) + "..."
                    : user.username}
                </span>
              </div>
            </div>
            <button
              onClick={() => Follow(user._id)}
              className={`px-4 py-1 text-sm font-bold rounded-full ${
                current?.following.includes(user._id)
                  ? "bg-gray-400 text-white dark:bg-zinc-600"
                  : "bg-black text-white dark:bg-white dark:text-black"
              }`}
            >
              {current?.following.includes(user._id) ? "UnFollow" : "Follow"}
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default WhoToFollow;
