"use client";

import React from "react";
import SignupForm from "../components/custom/signup-form";

const Signup = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Welcome to Auction App
        </h2>
        <SignupForm />
      </div>
    </div>
  );
};
export default Signup;
