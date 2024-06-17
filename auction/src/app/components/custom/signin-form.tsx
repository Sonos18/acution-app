"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import LabelInputContainer from "./label";
import { useForm } from "react-hook-form";
import React from "react";
import { useRouter } from "next/navigation";
import BottomGradient from "./bottom-gradient";
import { Loader2 } from "lucide-react";
import authApiRequest from "@/apiRequests/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SignInSchema,
  SignInSchemaType,
} from "@/schemaValidations/auth.schema";
import { toast } from "@/components/ui/use-toast";
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/userSlice';


const SigninForm = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  const onSubmit = async (data: SignInSchemaType) => {
    try {
      setIsLoading(true);
      const result = await authApiRequest.signIn(data);
      const { accessToken, refreshToken, user } = result.payload;
      dispatch(setUser(user));
      await authApiRequest.auth({
        accessToken: accessToken,
        refreshToken: refreshToken,
        role: user.role,
      });
      toast({
        description: "Sign in successfully",
        title: "success",
        className: "bg-green-500",
        duration: 3000,
      });
      if (user.role === "admin") {
        router.push("/dashboard");
        return;
      }
      router.push("/");
    } catch (error) {
      toast({
        description: "Account or password is incorrect",
        title: "error",
        className: "bg-red-500",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <form className="my-8" onSubmit={handleSubmit(onSubmit)}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            placeholder="projectmayhem@fc.com"
            type="text"
            {...register("email")}
          />
          {errors.email && <p className="text-red-400">{errors.email.message}</p>}
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            {...register("password")}
            id="password"
            placeholder="••••••••"
            type="password"
          />
          {errors.password && <p className="text-red-400">{errors.password.message}</p>}
        </LabelInputContainer>
        <div className="text-right mt-2 mb-2 opacity-80">
        Do not have an account? 
          <Link href="/signup" className="text-blue-300 hover:text-blue-500">
          Sign up
          </Link>
        </div>
        <button
          className={`bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] ${
            isLoading ? "opacity-70" : ""
          }`}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mx-auto h-4 w-4 animate-spin" />
          ) : (
            <>Sign in&rarr;</>
          )}
          <BottomGradient />
        </button>
      </form>
    </>
  );
};

export default SigninForm;
