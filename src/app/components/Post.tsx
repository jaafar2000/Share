// components/Post.tsx

"use client";
import React, { useState, useRef, useEffect } from "react";
// Remove this line: import { useImageStore } from "@/lib/actions/imagePreview";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { ImageUp } from "lucide-react";
import UploadImage from "@/lib/actions/UploadImage";
type PostProps = {
  onPostCreated: () => void;
  postId?: string;
  type?: string;
};

const Post: React.FC<PostProps> = ({
  onPostCreated,
  type,
  postId,
}) => {
  const [postText, setPostText] = useState<string>("");
  const { user } = useUser();
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUpload = async (): Promise<string | null> => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      console.log("No file selected");
      return null;
    }
    if (!(file instanceof File)) {
      console.error("Invalid file type:", file);
      return null;
    }
    const imageUrl = await UploadImage(file);
    return imageUrl;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPosting(true);
    try {
      const finalImageUrl = await handleUpload();

      if (postText || finalImageUrl) {
        const res = await fetch("/api/upload-post", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user?.id,
            imageUrl: finalImageUrl,
            postText,
            parentPostId: postId,
          }),
        });
        if (!res.ok) {
          console.error("❌ Error Posting");
        }
      }
      setPostText("");
      // Reset the local state after posting
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setIsPosting(false);
      onPostCreated();
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      setIsPosting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const formIsValid =
    postText.trim() !== "" || fileInputRef.current?.files?.[0];

  return (
    <div className="flex w-full relative border-b border-[#2f3336] flex-row items-start px-4 py-4 gap-3">
      {isPosting && (
        <div className="absolute w-full h-full top-0 flex items-center justify-center left-0 z-10 bg-black/80">
          <span className="loaderSpinner"></span>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center w-full gap-4"
      >
        <div className="flex flex-row items-start gap-3">
          <div className="relative h-12 w-12 rounded-full overflow-hidden">
            <Image
              src={user?.imageUrl ?? "/path/to/default-avatar.png"}
              alt="User profile"
              fill
              className="object-cover"
              sizes="45 px"
            />
          </div>
          <input
            className="text-white text-2xl outline-none bg-transparent flex-1 placeholder-gray-500 pt-2"
            type="text"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder={type}
          />
        </div>
        <div className="flex flex-row items-center justify-between px-3">
          <input
            id="file"
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <label
            htmlFor="file"
            className="flex p-2 rounded-full cursor-pointer transition-colors duration-200"
          >
            <ImageUp />
            <span className="text-gray-100 px-1">Upload Image</span>
          </label>
          <button
            type="submit"
            disabled={isPosting || !formIsValid}
            className={`px-4 py-2 rounded-full font-bold text-black transition-opacity duration-200 ${
              isPosting || !formIsValid
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-white cursor-pointer"
            }`}
          >
            {isPosting ? "Posting..." : "Post"}
          </button>
        </div>
        {/* Only show the image preview if a file has been selected */}
        {previewUrl  && (
          <div className="flex justify-center mt-4">
            <div className="relative rounded-lg w-full overflow-hidden bg-black/20 p-2">
              <Image
                src={previewUrl}
                alt="Preview"
                width={100}
                height={100}
                className="  w-full object-contain rounded-lg"
              />
              <button
                type="button"
                onClick={() => {
                  setPreviewUrl(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="absolute top-3 right-3 px-2 rounded-full bg-black/60 text-white hover:bg-black/80"
              >
                &times;
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default Post;
