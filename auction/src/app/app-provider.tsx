"use client";

import { session } from "@/lib/session";
import { SignInResSchemaType } from "@/schemaValidations/auth.schema";
import { UserResType } from "@/schemaValidations/user.schema";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type User = SignInResSchemaType["user"];

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
}: {
  children: React.ReactNode;
}) {
  const [user, setUserState] = useState<User | null>(() => {
    return null;
  });
  const setUser = useCallback(
    (user: User | null, callback?: (user: User | null) => void) => {
      setUserState(user);
      localStorage.setItem("user", JSON.stringify(user));
      if (callback) {
        callback(user);
      }
    },
    [setUserState]
  );

  useEffect(() => {
    const _user = localStorage.getItem("user");
    setUserState(_user ? JSON.parse(_user) : null);
  }, [setUserState]);

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
