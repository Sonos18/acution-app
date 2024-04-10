"use client";

import { accessToken } from "@/lib/http";
import { session } from "@/lib/session";
import { UserResType } from "@/schemaValidations/user.schema";
import { createContext, useContext, useState } from "react";

type User = UserResType;

const AppContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
}>({
  user: null,
  setUser: () => {},
});

export const useAppContext = () => {
  const context = useContext(AppContext);
  return context;
};

export default function AppProvider({
  children,
  inititalaccessToken = "",
  inititalRefreshToken = "",
  user: userProp,
}: {
  children: React.ReactNode;
  inititalaccessToken?: string;
  inititalRefreshToken?: string;
  user: User | null;
}) {
  const [user, setUser] = useState<User | null>(userProp);
  useState(() => {
    if (typeof window !== "undefined") {
      accessToken.value = inititalaccessToken;
      accessToken.refresh = inititalRefreshToken;
    }
  });
  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
