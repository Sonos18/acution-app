import http from "@/lib/http";
import { UserResType } from "@/schemaValidations/user.schema";

const likeApiRequest = {
  like: (body: { blogId: string }) => http.post("/like", body),
  disLike: (body: { blogId: string }) => http.delete("/dislike"),
};
export default likeApiRequest;
