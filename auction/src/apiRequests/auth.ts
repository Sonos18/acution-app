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
  auth: (body: { sessionToken: string; refreshToken: string }) =>
    http.post("/api/auth", body, {
      baseUrl: "",
    }),
};

export default authApiRequest;
