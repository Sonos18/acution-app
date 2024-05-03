import envConfig from "@/config";
import jwt from "jsonwebtoken";
import authApiRequest from "@/apiRequests/auth";
const baseURL = envConfig.NEXT_PUBLIC_URL;
export const UseRefreshToken = async (
  accessToken: string,
  refreshToken: string
) => {
  try {
    const decodedToken = jwt.decode(accessToken);
    if (!decodedToken || typeof decodedToken === "string" || !decodedToken.exp)
      return accessToken;
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) {
      const res = await fetch(`${baseURL}/user/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
      });
      const data = await res.json();
      const accessToken = data.accessToken;
      await authApiRequest.auth({ accessToken, refreshToken });
      return accessToken as string;
    }
  } catch (error) {
    return accessToken;
  }
};
