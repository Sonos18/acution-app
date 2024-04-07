import envConfig from "@/config";
import axios from "axios";
import { cookies } from "next/headers";

const BASE_URL = envConfig.NEXT_PUBLIC_URL;
const cookieStore = cookies();
const accessToken = cookieStore.get("accessToken");
const refreshToken = cookieStore.get("refreshToken");

export const axiosRefreshToken = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${refreshToken}`,
  },
});

export const axiosAuth = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  },
});
