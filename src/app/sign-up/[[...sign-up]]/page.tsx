import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="bg-black  z-50 w-full h-full flex justify-center items-center ">
      <div className=" opacity-100 ">
      <SignUp />
      </div>
    </div>
  );
}
