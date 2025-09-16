import User from "../models/User";
import { connectDB } from "../mongodb";
export const createOrUpdateUser = async (
  id: string,
  first_name: string,
  last_name: string,
  image_url: string,
  email: string,
  username: string
) => {
  try {
    await connectDB();

    const user = await User.findOneAndUpdate(
      { clerkId: id },
      {
        $set: {
          first_name: first_name,
          last_name: last_name,
          image_url: image_url,
          email: email,
          username: username,
        },
      },
      { new: true, upsert: true }
    );

    return user;
  } catch (error) {
    console.log("Error creating or updating user:", error);
  }
};

export const deleteUser = async (id: string) => {
  await connectDB(); // ✅ ensure DB connection
  await User.findOneAndDelete({ id });
};
