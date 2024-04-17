"use client";
import { useState } from "react";
import { AlertDialogConfirm } from "./alert-dialog-confirm";
import { Button } from "../ui/button";

export const Logout = () => {
  const handleLogout = () => {
    console.log("action logout");
  };
  return (
    <div className="text-center">
      <AlertDialogConfirm
        title="asa"
        description="ASJGDJAS"
        handleLogout={handleLogout}
      >
        <Button className="bg-gray-600">Logout</Button>
      </AlertDialogConfirm>
    </div>
  );
};
