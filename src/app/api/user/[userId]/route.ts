import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function GET(
  request: Request,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    await connectDB();
    const { userId } = await context.params;

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ data: user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user" + String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params;
    const body = await request.json();
    const { cover } = body; // ✅ matches frontend
    console.log("PUT body:", cover);
    await connectDB();

    const data = await User.findByIdAndUpdate(
      userId,
      { $set: { cover: cover } },
      { new: true }
    );

    return NextResponse.json({ data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { msg: err.message ?? String(err) },
      { status: 500 }
    );
  }
}
