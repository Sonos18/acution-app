import http from "@/lib/http";
import { BlogResType, BlogsReponseType } from "@/schemaValidations/blog.schema";
import { GetSignedUrlResType } from "@/schemaValidations/file.schema";

const blogApiRequest = {
  getBlogs: (param: string) => http.get<BlogsReponseType>(`/blog${param}`),
  createBlog: (body: any) => http.post("/blog", body),
  getSignedUrl: (body: { types: string[] }) =>
    http.post<GetSignedUrlResType>("/file", body),
  getBlog: (id: string) => http.get<BlogResType>(`/blog/?id=${id}`),
  updateBlog: (id: string, body: any) => http.put(`/blog/?id=${id}`, body),
  deleteBlog: (id: string) => http.delete(`/blog/?id=${id}`),
};

export default blogApiRequest;
