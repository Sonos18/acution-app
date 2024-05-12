"use client";
import blogApiRequest from "@/apiRequests/blog";
import BlogCard from "@/components/custom/blog/blog-card";
import Loader from "@/components/loading";
import { BlogsReponseType, LastKeyType } from "@/schemaValidations/blog.schema";
import { useEffect, useState } from "react";
import ButtonAdd from "./_component/button-add";
import VideoCameraBackIcon from "@mui/icons-material/VideoCameraBack";
import CollectionsIcon from "@mui/icons-material/Collections";
import MoodIcon from "@mui/icons-material/Mood";
import { useSearchParams } from "next/navigation";

export default function Blog() {
  const [lastKey, setLastKey] = useState<LastKeyType | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<BlogsReponseType["data"]>([]);
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const loadBlogs = async () => {
    try {
      const params = search ? `?limit=10&search=${search}` : "?limit=10";
      const response = await blogApiRequest.getBlogs(params);
      console.log("Response", response);
      setBlogs(response.payload.data);
      setLastKey(response.payload.lastKey);
      setLoading(false);
    } catch (error) {
      const e = error as Error;
      console.error("Error fetching data: ", e.message);
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
      <ButtonAdd item={addItem} />
      <div className="flex flex-col gap-10 mb-6">
        {safeBlogs.length > 0 ? (
          safeBlogs.map((blog) => <BlogCard blog={blog} key={blog.blogId} />)
        ) : (
          <p className="text-center text-xl opacity-70">
            There are no matching blog posts
          </p>
        )}
      </div>
    </div>
  );
}
const addItem = {
  link: "/blog/add",
  title: "what do you want to share?",
  cateItems: [
    {
      name: "Live Video",
      icon: (
        <VideoCameraBackIcon className="text-rose-500 mr-1" fontSize="small" />
      ),
    },
    {
      name: "Picture/Video",
      icon: (
        <CollectionsIcon className="text-green-400 mr-1" fontSize="small" />
      ),
    },
    {
      name: "Mood/Activity",
      icon: <MoodIcon className="text-orange-400 mr-1" fontSize="small" />,
    },
  ],
};
export type addItemType = typeof addItem;
