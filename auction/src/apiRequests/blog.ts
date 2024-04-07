import http from "@/lib/http";

const blogApiRequest = {
  getBlogs: (param: string) => http.get(`/blog${param}`),
};

export default blogApiRequest;
