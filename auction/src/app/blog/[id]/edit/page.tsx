import { useRouter } from "next/router";
import { FormBlog } from "../../_component/form-blog";
import { useParams } from "next/navigation";
import blogApiRequest from "@/apiRequests/blog";

export default async function EditBlog() {
  try {
    const { id } = useParams<{ id: string }>();
    const blog = await blogApiRequest.getBlog(id);
  } catch (error) {}
  return (
    <div>
      <h1>Blog Edit</h1>
      <FormBlog />
    </div>
  );
}
