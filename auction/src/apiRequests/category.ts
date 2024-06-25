import { CategoryType } from "@/app/(admin)/category/page";
import http from "@/lib/http";

const categoryApiRequest = {
  create: (body: { nameCategory: string }) => http.post("/category", body),
  delete: (id:string) => http.delete(`/category/?id=${id}`),
  getAll: () => http.get<CategoryType[]>("/category",{
    cache:'no-store'
  }),
};
export default categoryApiRequest;
