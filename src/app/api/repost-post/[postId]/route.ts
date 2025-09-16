import User from "@/lib/models/User";
import Post from "@/lib/models/Post";
import { connectDB } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  const { postId } = await context.params; // ✅ no await
  try {
    await connectDB();

    const data = await req.json();
    const { userId, textbody } = data;
    const user = await User.findOne({ clerkId: userId });
    if (!user || !user._id) {
      return NextResponse.json(
        { message: "User not found or invalid" },
        { status: 401 }
      );
    }

    // Add userId to post.reposted array
    const post = await Post.create({
      reposted: postId,
      author: user?._id,
      body: textbody,
    });
    const originalPost = await Post.findByIdAndUpdate(
      postId,
      { $inc: { noOfRepostedTimes: +1 } },
      { new: true }
    );
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post, originalPost }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ err }, { status: 501 });
  }
}
