import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/lib/models/Post";
import User from "@/lib/models/User";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  const { postId } = await context.params;

  try {
    await connectDB();
    const { userId } = await req.json();

    const user = await User.findOne({ clerkId: userId });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const postToBeLiked = await Post.findById(postId);
    if (!postToBeLiked)
      return NextResponse.json({ error: "Post not found" }, { status: 404 });

    const alreadyLiked = postToBeLiked.likes.some((id) => id.equals(user._id));

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      alreadyLiked
        ? { $pull: { likes: user._id } }
        : { $push: { likes: user._id } },
      { new: true }
    );

    return NextResponse.json({
      likesCount: updatedPost?.likes?.length ?? 0,
      isLiked: !alreadyLiked,
    });
  } catch (err: any) {
    console.error("❌ Error in like/unlike:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  const { postId } = await context.params;

  try {
    await connectDB();

    const deleted = await Post.findByIdAndDelete(postId);
    if (!deleted) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Post deleted" }, { status: 200 });
  } catch (err: any) {
    console.error("❌ Error deleting post:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
