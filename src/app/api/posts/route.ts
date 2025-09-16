import { connectDB } from "@/lib/mongodb";
import Post from "@/lib/models/Post"; // then Post

import { NextResponse } from "next/server";
import mongoose from "mongoose";
export async function GET() {
  try {
    await connectDB();
    console.log("✅ Connected to database");
    console.log("Registered models:", mongoose.modelNames()); // debug

    const posts = await Post.find()
      .populate({
        path: "author",
        select: "clerkId first_name last_name image_url username",
      })
      .populate({
        path: "parentPostId",
        populate: {
          path: "author",
          select: "clerkId first_name last_name image_url username",
        },
      })
      .populate({
        path: "reposted",
        populate: [
          {
            path: "author",
            select: "clerkId first_name last_name image_url username",
          },
          {
            path: "reposted",
            populate: {
              path: "author",
              select: "clerkId first_name last_name image_url username",
            },
          },
        ],
      })
      .sort({ createdAt: -1 });
    // const finalPosts = posts.filter((p) => p.parentPostId === null);

    return NextResponse.json(posts, { status: 200 });
  } catch (err: any) {
    console.error("❌ Error fetching posts:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
