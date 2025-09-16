import mongoose, { Schema, Document, Model, Types } from "mongoose";
import "./User"; // this runs User.ts and registers the model
import { IUser } from "./User"; // type import only
export interface IPost extends Document {
  body: string;
  image?: string;
  author: Types.ObjectId | IUser;
  parentPostId?: Types.ObjectId | IPost;
  createdAt: Date;
  updatedAt: Date;
  likes: mongoose.Types.ObjectId[]; // ✅ make sure it's ObjectId[]
  comments?: Types.ObjectId[] | IPost;
  reposted?: Types.ObjectId | IUser;
  noOfRepostedTimes: number;
}
const PostSchema: Schema<IPost> = new Schema(
  {
    body: { type: String },
    image: { type: String },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    parentPostId: { type: Schema.Types.ObjectId, ref: "Post", default: null },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Post" , default: null}],
    reposted: { type: Schema.Types.ObjectId, ref: "Post", default: null },
    noOfRepostedTimes: { type: Number },
  },
  { timestamps: true }
);

const Post: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);
console.log("✅ Post model file executed");

export default Post;
