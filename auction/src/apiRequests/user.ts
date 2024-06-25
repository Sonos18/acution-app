import http from "@/lib/http";
import {
  UserResType,
  UserUpdateSchemaType,
} from "@/schemaValidations/user.schema";

const userApiRequest = {
  get: (accessToken: string) =>
    http.get<UserResType>("/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  update: (body: UserUpdateSchemaType) => http.put<UserResType>("/user", body),
  getAll: () => http.get<UserResType[]>("/user/all"),
};
export default userApiRequest;
