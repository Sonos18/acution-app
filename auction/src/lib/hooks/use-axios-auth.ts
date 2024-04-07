"use client";
import { useEffect } from "react";
import { axiosAuth, axiosRefreshToken } from "../axios";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const useAxiosAuth = () => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken");
  useEffect(() => {
    const requestIntercept = axiosAuth.interceptors.request.use(
      async (config) => {
        const decodedToken = accessToken
          ? jwt.decode(accessToken as unknown as string)
          : null;
        const currentTime = Date.now() / 1000;
        if (
          decodedToken &&
          typeof decodedToken !== "string" &&
          decodedToken.exp &&
          decodedToken.exp < currentTime
        ) {
          const newAccessToken = await axiosRefreshToken.post("/user/refresh");
          config.headers["Authorization"] = `Bearer ${newAccessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    return () => {
      axiosAuth.interceptors.request.eject(requestIntercept);
    };
  }, []);

  return axiosAuth;
};
export default useAxiosAuth;
