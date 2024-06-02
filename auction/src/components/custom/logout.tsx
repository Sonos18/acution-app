"use client";
import { useState } from "react";
import { AlertDialogConfirm } from "./alert-dialog-confirm";
import { Button } from "../ui/button";
import { useAppContext } from "@/app/app-provider";
import authApiRequest from "@/apiRequests/auth";
import { toast } from "../ui/use-toast";
import { usePathname, useRouter } from "next/navigation";
import { handleErrorApi } from "@/lib/utils";


export const Logout = () => {
  const { setUser } = useAppContext();
  const router = useRouter();
  const pathname = usePathname();
  const handleLogout = async () => {
    try {
      const res = await authApiRequest.logoutFromNextServer();
      console.log("res", res);

      await authApiRequest.logout();
      router.push("/signin");
    } catch (error) {
      console.log("error", (error as Error).message);
      handleErrorApi({
        error,
      });
    } finally {
      toast({
        title: "success",
        description: "Logged out successfully",
      });
      setUser(null);
      router.refresh();
    }
  };
  return (
    <div className="text-center">
      <AlertDialogConfirm
        title="LOGOUT!!!"
        description="Are you sure you want to log out?"
        handleLogout={handleLogout}
      >
        <Button className="bg-gray-600 ">Logout</Button>
      </AlertDialogConfirm>
    </div>
  );
};
