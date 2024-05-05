import http from "@/lib/http";
import {
  SignInResSchemaType,
  SignInSchemaType,
  SignUpSchemaType,
} from "@/schemaValidations/auth.schema";

const authApiRequest = {
  signIn: (body: SignInSchemaType) =>
    http.post<SignInResSchemaType>("/user/signin", body),
  signUp: (body: SignUpSchemaType) => http.post<any>("/user/signup", body),
  auth: (body: { accessToken: string; refreshToken: string }) =>
    http.post("/api/auth", body, {
      baseUrl: "",
    }),
  refreshToken: (body: { refreshToken: string }) =>
    http.post("/user/refresh-token", body),
  logoutFromNextServer: () =>
    http.post(
      "/api/auth/logout",
      {},
      {
        baseUrl: "",
      }
    ),
  logout: () => http.get("/user/logout"),
};

export default authApiRequest;
