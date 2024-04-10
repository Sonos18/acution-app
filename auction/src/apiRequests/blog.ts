import http from "@/lib/http";
import { GetSignedUrlResType } from "@/schemaValidations/file.schema";
import { create } from "domain";

const blogApiRequest = {
  getBlogs: (param: string) => http.get(`/blog${param}`),
  createBlog: (body: any) => http.post("/blog", body),
  getSignedUrl: (body: { type: string }) =>
    http.post<GetSignedUrlResType>("/file", body),
};

export default blogApiRequest;
