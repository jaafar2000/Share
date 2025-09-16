import User from "@/lib/models/User";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth();
    const { id } = await req.json();
    const clerkId = userId;

    const currentUser = await User.findOne({ clerkId: clerkId });
    if (!currentUser) {
      return NextResponse.json({ error: "Current user not found" }, { status: 404 });
    }

    const UserToFollow = await User.findById(id);
    if (!UserToFollow) {
      return NextResponse.json({ error: "User to follow not found" }, { status: 404 });
    }

    const isFollowing = UserToFollow.followers.includes(currentUser._id);

    if (isFollowing) {
      await User.findByIdAndUpdate(
        UserToFollow._id,
        { $pull: { followers: currentUser._id } }
      );
      await User.findByIdAndUpdate(
        currentUser._id, // Use the MongoDB _id
        { $pull: { following: UserToFollow._id } }
      );
    } else {
      await User.findByIdAndUpdate(
        UserToFollow._id,
        { $push: { followers: currentUser._id } }
      );
      await User.findByIdAndUpdate(
        currentUser._id, // Use the MongoDB _id
        { $push: { following: UserToFollow._id } }
      );
    }

    return NextResponse.json({ msg: "Success" }, { status: 200 }); 
  } catch (err) {
    console.error("Error in follow/unfollow route:", err);
    return NextResponse.json({ error: "Failed to update", details: err }, { status: 501 });
  }
}