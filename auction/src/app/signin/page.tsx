"use client";
import React from "react";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
} from "@tabler/icons-react";
import { getSession, signIn } from "next-auth/react";
import SigninForm from "../components/custom/signin-form";
import BottomGradient from "../components/custom/bottom-gradient";
import authApiRequest from "@/apiRequests/auth";
import { useAppContext } from "../app-provider";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export interface SignInWithProvider {
  provider?: string;
  email?: string;
  name?: string;
  id?: string;
  picture?: string;
}
const Signin = () => {
  const router = useRouter();
  const { setUser } = useAppContext();

  const handleSignInWithProvider = async (provider: string) => {
    try {
      await signIn(provider);
      const session = await getSession();
      if (!session) {
        return;
      }
      const user = session.user as SignInWithProvider;
      if (user) {
        const dataInput = {
          provider: user.provider,
          email: user.email,
          name: user.name,
          id: user.id,
          picture: user.picture,
        };
        const { payload } = await authApiRequest.signInWithProvider(dataInput);
        setUser(payload.user);
        await authApiRequest.auth({
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken,
          role: payload.user.role,
        });
        toast({
          description: `Sign in with ${provider} successfully`,
          title: "SIGN IN!!",
          className: "bg-green-500",
          duration: 3000,
        });
        console.log(payload.user.role);

        if (payload.user.role === "admin") {
          router.push("/users");
          return;
        }
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Welcome to Auction App
        </h2>
        <SigninForm />
        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

        <div className="flex flex-col space-y-4">
          <button
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            onClick={() => handleSignInWithProvider("github")}
          >
            <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              GitHub
            </span>
            <BottomGradient />
          </button>
          <button
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            onClick={() => handleSignInWithProvider("google")}
          >
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              Google
            </span>
            <BottomGradient />
          </button>
          <button className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]">
            <IconBrandOnlyfans className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              OnlyFans
            </span>
            <BottomGradient />
          </button>
        </div>
      </div>
    </div>
  );
};
export default Signin;
