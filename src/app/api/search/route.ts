import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Post from "@/lib/models/Post";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    if (!query) {
      return NextResponse.json({ users: [], posts: [] });
    }

    // 🔹 Search Users
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { first_name: { $regex: query, $options: "i" } },
        { last_name: { $regex: query, $options: "i" } },
      ],
    }).limit(10);

    // 🔹 Search Posts (title or content field — adjust based on your schema)
    const postResults = await Post.find({
      $or: [
        { body: { $regex: query, $options: "i" } },
        { title: { $regex: query, $options: "i" } },
      ],
    })
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
            path: "reposted", // 👈 second-level repost
            populate: {
              path: "author",
              select: "clerkId first_name last_name image_url username",
            },
          },
        ],
      })
      .limit(10);

    return NextResponse.json({ users, posts: postResults });
  } catch (err: any) {
    console.error("Search API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
