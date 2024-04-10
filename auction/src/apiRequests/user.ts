import http from "@/lib/http";
import { UserResType } from "@/schemaValidations/user.schema";

const userApiRequest = {
  get: (accessToken: string) =>
    http.get<UserResType>("/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
};
export default userApiRequest;
