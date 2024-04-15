import http from "@/lib/http";
import { BlogResType, BlogsReponseType } from "@/schemaValidations/blog.schema";
import { GetSignedUrlResType } from "@/schemaValidations/file.schema";

const blogApiRequest = {
  getBlogs: (param: string) => http.get<BlogsReponseType>(`/blog${param}`),
  createBlog: (body: any) => http.post("/blog", body),
  getSignedUrl: (body: { type: string; size: number }) =>
    http.post<GetSignedUrlResType>("/file", body),
  getBlog: (id: string) => http.get<BlogResType>(`/blog/${id}`),
};

export default blogApiRequest;
