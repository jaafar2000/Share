import User from "@/lib/models/User";
import Post from "@/lib/models/Post";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB(); // ✅ ensure DB connection

    const data = await req.json();
    const { userId, imageUrl, postText, parentPostId } = data;

    const user = await User.findOne({ clerkId: userId }); // ✅ pass id directly
    console.log(user);
    if (!user) {
      return NextResponse.json({ message: "No User Found" }, { status: 401 });
    }

    const newComment = await Post.create({
      body: postText || null,
      image: imageUrl,
      author: user?._id,
      parentPostId: parentPostId || null,
    });

    if (parentPostId) {
      await Post.findByIdAndUpdate(
        { _id: parentPostId },
        { $push: { comments: newComment?._id } },
        { new: true }
      );
    }

    console.log("succes createing yser");
    return NextResponse.json({ message: "Success", data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
