"use client";

import { Label } from "@/components/ui/label";
import LabelInputContainer from "./label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import BottomGradient from "./bottom-gradient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  SignUpSchema,
  SignUpSchemaType,
} from "@/schemaValidations/auth.schema";
import authApiRequest from "@/apiRequests/auth";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const SignupForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });
  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      const formData = { ...data, role: "user" };
      const res = await authApiRequest.signUp(formData);
      console.log(res);
      toast({
        title: "Account created.",
        description: "We've created your account for you.",
        className: "bg-green-500 text-white",
      });
      router.push("/signin");
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form className="my-8" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
        <LabelInputContainer>
          <Label htmlFor="firstname">First name</Label>
          <Input
            id="firstname"
            {...register("firstName")}
            placeholder="Tyler"
            type="text"
          />
          {errors.firstName && (
            <span className="text-red-600 font-bold">
              {errors.firstName.message}
            </span>
          )}
        </LabelInputContainer>
        <LabelInputContainer>
          <Label htmlFor="lastname">Last name</Label>
          <Input
            id="lastname"
            {...register("lastName")}
            placeholder="Durden"
            type="text"
          />
          {errors.lastName && <span>{errors.lastName.message}</span>}
        </LabelInputContainer>
      </div>
      <LabelInputContainer className="mb-4">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          {...register("email")}
          placeholder="projectmayhem@fc.com"
          type="text"
        />
        {errors.email && <span>{errors.email.message}</span>}
      </LabelInputContainer>
      <LabelInputContainer className="mb-4">
        <Label htmlFor="phone">Phone number</Label>
        <Input
          id="phone"
          {...register("phone")}
          placeholder="+84"
          type="text"
        />
        {errors.phone && <span>{errors.phone.message}</span>}
      </LabelInputContainer>
      <LabelInputContainer className="mb-4">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          {...register("password")}
          placeholder="••••••••"
          type="password"
        />
        {errors.password && <span>{errors.password.message}</span>}
      </LabelInputContainer>
      <LabelInputContainer className="mb-8">
        <Label htmlFor="confirmpassword">Confirm password</Label>
        <Input
          id="confirmpassword"
          {...register("confirmPassword")}
          placeholder="••••••••"
          type="password"
        />
        {errors.confirmPassword && (
          <span>{errors.confirmPassword.message}</span>
        )}
      </LabelInputContainer>
      <div className="text-right mt-2 mb-2 opacity-80">
      Do you already have an account? 
        <Link href="/signin" className="text-blue-300 hover:text-blue-500">
          Sign in
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
          <>Sign up&rarr;</>
        )}
        <BottomGradient />
      </button>
    </form>
  );
};
export default SignupForm;
