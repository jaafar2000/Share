// models/User.ts
import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId; 

  clerkId: string;
  first_name: string;
  last_name: string;
  image_url: string;
  email: string;
  username: string;
  createdAt: Date;
  cover: string;
  followers: Types.ObjectId[]; // array of User references
  following: Types.ObjectId[]; // array of User references
}

const UserSchema: Schema<IUser> = new Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    image_url: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    cover: { type: String, default: "" },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }], // refs to User
    following: [{ type: Schema.Types.ObjectId, ref: "User" }], // refs to User
  },
  { timestamps: true }
);

// Fix model overwrite issue in Next.js hot reload
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
console.log("✅ User model file executed");

export default User;
