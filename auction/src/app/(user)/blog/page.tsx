"use client";
import blogApiRequest from "@/apiRequests/blog";
import BlogCard from "@/components/custom/blog/blog-card";
import Loader from "@/components/loading";
import { BlogsReponseType, LastKeyType } from "@/schemaValidations/blog.schema";
import { Suspense, useEffect, useState } from "react";
import ButtonAdd from "./_component/button-add";
import VideoCameraBackIcon from "@mui/icons-material/VideoCameraBack";
import CollectionsIcon from "@mui/icons-material/Collections";
import MoodIcon from "@mui/icons-material/Mood";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setBlogs } from "@/store/blogSlice";
import type { RootState } from "@/store/store";
export default function Blog() {
  return(
    <Suspense fallback={<Loader />}>
      <BlogContent /> 
    </Suspense>
  )
}
function BlogContent() {
  const dispath=useDispatch();
  const [loading, setLoading] = useState(true);
  // const [blogs, setBlogs] = useState<BlogsReponseType["data"]>([]);
  const blogs=useSelector((state:RootState)=>state.blog.blog)
  const searchParams = useSearchParams();
  const search = searchParams.get("hashtag");
  const loadBlogs = async () => {
    try {
      const params = search ? `?limit=10&search=${search}` : "?limit=10";
      const response = await blogApiRequest.getBlogs(params);
      const sortedBlogs = response.payload.data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      dispath(setBlogs({data:sortedBlogs,lastKey:response.payload.lastKey}));
      setLoading(false);
    } catch (error) {
      const e = error as Error;
      console.error("Error fetching data: ", e.message);
    }
  };
  useEffect(() => {
    loadBlogs();
  }, [dispath]);
  return loading ? (
    <Loader />
  ) : (
    <div>
      <ButtonAdd item={addItem} />
      <div className="flex flex-col gap-10 mb-6">
        {blogs.length > 0 ? (
          blogs.map((blog) => <BlogCard blog={blog} key={blog.blogId} />)
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
