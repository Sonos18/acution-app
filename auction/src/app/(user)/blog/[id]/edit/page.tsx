"use client";

import { useRouter } from "next/router";
import { FormBlog } from "../../_component/form-blog";
import { useParams } from "next/navigation";
import blogApiRequest from "@/apiRequests/blog";
import { BlogResType } from "@/schemaValidations/blog.schema";
import { useEffect, useState } from "react";

export default function EditBlog() {
  const [blog, setBlog] = useState<BlogResType>();
  const { id } = useParams<{ id: string }>();
  const loadBlog = async () => {
    try {
      const res = await blogApiRequest.getBlog(id);
      setBlog(res.payload);
    } catch (error) {
      console.log("Error fetching data: ", error);
    }
  };
  useEffect(() => {
    loadBlog();
  }, []);
  return (
    <>
      <FormBlog blog={blog} />
    </>
  );
}
