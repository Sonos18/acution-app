import http from "@/lib/http";
import { BlogsReponseType } from "@/schemaValidations/blog.schema";
import { GetSignedUrlResType } from "@/schemaValidations/file.schema";
import { create } from "domain";

const blogApiRequest = {
  getBlogs: (param: string) => http.get<BlogsReponseType>(`/blog${param}`),
  createBlog: (body: any) => http.post("/blog", body),
  getSignedUrl: (body: { type: string; size: number }) =>
    http.post<GetSignedUrlResType>("/file", body),
};

export default blogApiRequest;
