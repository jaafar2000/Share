import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
      <div className="bg-black  z-50 w-full h-full flex justify-center items-center ">
      <div className=" opacity-100  ">
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
      </div>
    </div>
  );
}
