"use client";

import blogApiRequest from "@/apiRequests/blog";
import BlogCard from "@/components/custom/blog/blog-card";
import Loader from "@/components/loading";
import { BlogsReponseType, LastKeyType } from "@/schemaValidations/blog.schema";
import { report } from "process";
import { useEffect, useState } from "react";
import { set } from "zod";

export default function Blog() {
  const [lastKey, setLastKey] = useState<LastKeyType | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<BlogsReponseType["data"]>([]);
  const loadBlogs = async () => {
    try {
      const response = await blogApiRequest.getBlogs("?limit=10");
      setBlogs(response.payload.data);
      setLastKey(response.payload.lastKey);
      setLoading(false);
      console.log(response);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };
  useEffect(() => {
    loadBlogs();
  }, []);
  const safeBlogs = blogs || [];
  return loading ? (
    <Loader />
  ) : (
    <div>
      <h1>Blog</h1>
      <div className="flex flex-col gap-10">
        {safeBlogs.length > 0 &&
          safeBlogs.map((blog) => <BlogCard blog={blog} />)}
      </div>
    </div>
  );
}
