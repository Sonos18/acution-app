"use client";

import { sessionToken } from "@/lib/http";
import { session } from "@/lib/session";
import { useState } from "react";

export default function AppProvider({
  children,
  inititalSessionToken = "",
  inititalRefreshToken = "",
}: {
  children: React.ReactNode;
  inititalSessionToken?: string;
  inititalRefreshToken?: string;
}) {
  useState(() => {
    if (typeof window !== "undefined") {
      sessionToken.value = inititalSessionToken;
      sessionToken.refresh = inititalRefreshToken;
    }
  });
  return <>{children}</>;
}
