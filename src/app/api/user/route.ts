import User from "@/lib/models/User";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("starting fetching all users ");
    await connectDB();
    const data = await User.find();
    console.log("fetching usesrs done" + {data})
    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ msg: err }, { status: 401 });
  }
}
