"use client";

import { accessToken } from "@/lib/http";
import { session } from "@/lib/session";
import { useState } from "react";

export default function AppProvider({
  children,
  inititalaccessToken = "",
  inititalRefreshToken = "",
}: {
  children: React.ReactNode;
  inititalaccessToken?: string;
  inititalRefreshToken?: string;
}) {
  useState(() => {
    if (typeof window !== "undefined") {
      accessToken.value = inititalaccessToken;
      accessToken.refresh = inititalRefreshToken;
    }
  });
  return <>{children}</>;
}
