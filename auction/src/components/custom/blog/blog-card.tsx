import likeApiRequest from "@/apiRequests/like";
import { useToast } from "@/components/ui/use-toast";
import { BlogResType, BlogsReponseType } from "@/schemaValidations/blog.schema";
import {
  Bookmark,
  BookmarkBorder,
  BorderColor,
  Delete,
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertDialogConfirm } from "../alert-dialog-confirm";
import blogApiRequest from "@/apiRequests/blog";
import ButtonDelete from "@/app/(user)/blog/_component/button-delete";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

interface BlogCardProps {
  blog: BlogResType;
}
const BlogCard = ({ blog }: BlogCardProps) => {
  const user=useSelector((state:RootState)=>state.currentUser.user);
  const [likes, setLikes] = useState<number>(blog.likes);
  const [isLiked, setIsLiked] = useState<boolean>(blog.isLiked);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const { toast } = useToast();
  
  const handleLike = async () => {
    try {
      setLoading(true);
      let description = "Liked a blog";
      if (!isLiked) {
        const res = await likeApiRequest.like({ blogId: blog.blogId });
        if (res.status === 400)
          throw new Error("You have already liked this blog");
        setLikes(likes + 1);
      } else {
        await likeApiRequest.disLike({ blogId: blog.blogId });
        setLikes(likes - 1);
        description = "Disliked a blog";
      }
      toast({
        description: description,
        title: "Success",
        className: "bg-green-500 text-white",
      });
      setLoading(false);
      setIsLiked(!isLiked);
    } catch (error) {
      const e = error as Error;
      toast({
        description: e.message,
        title: "Error",
        className: "bg-red-500 text-white",
      });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  
  const handleSave = async () => {
    try {
      setLoading(true);
      let description = "Saved a blog";
      if (!isSaved) {
      } else {
        description = "Unsaved a blog";
      }
      toast({
        description: description,
        title: "Success",
        className: "bg-green-500 text-white",
      });
      setLoading(false);
      setIsSaved(!isSaved);
    } catch (error) {
      const e = error as Error;
      toast({
        description: e.message,
        title: "Error",
        className: "bg-red-500 text-white",
      });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="mx-auto w-full max-w-xl rounded-lg flex flex-col gap-4 bg-white dark:bg-gray-200 p-5 max-sm:gap-2">
      <div className="flex justify-between">
        <Link href={`/profile/posts`}>
          <div className="flex gap-3 items-center">
            <Image
              src={blog.user.avatar}
              alt="profile photo"
              width={50}
              height={50}
              className="rounded-full"
            />
            <div className="flex flex-col gap-1 text-black dark:text-black">
              <p className="text-small-semibold ">
                {blog.user.firstName} {blog.user.lastName}
              </p>
              <p className="text-subtle-medium">{blog.createdAt}</p>
            </div>
          </div>
        </Link>

        {user?.userId === blog.user.userId && (
          <div className="text-black dark:text-black">
            <Link href={`/blog/${blog.blogId}/edit`}>
              <BorderColor sx={{ cursor: "pointer" }} />
            </Link>
          </div>
        )}
      </div>

      <p className="text-body-normal text-black max-sm:text-small-normal">
        {blog.content}
      </p>
      <Link href={`/blog/${blog.blogId}`}>
        <Image
          src={blog.image}
          alt="post photo"
          width={200}
          height={150}
          className="rounded-lg w-full"
        />
      </Link>
      <div className="text-base-semibold text-indigo-500 max-sm:text-small-normal cursor-pointer">
        {blog.hashtags &&
          blog.hashtags.length > 0 &&
          blog.hashtags.map((tag,idx) => 
          <Link key={idx}href={`/blog/?hashtag=${tag}`}>#{tag}</Link> )}
      </div>

      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          {loading ? (
            <Loader2 className="mx-auto h-4 w-4 animate-spin text-blue-500" />
          ) : !isLiked ? (
            <FavoriteBorder
              sx={{ color: "black", cursor: "pointer" }}
              onClick={() => handleLike()}
            />
          ) : (
            <Favorite
              sx={{ color: "red", cursor: "pointer" }}
              onClick={() => handleLike()}
            />
          )}

          <p className="text-black">{likes}</p>
        </div>

        {isSaved ? (
          <Bookmark
            sx={{ color: "purple", cursor: "pointer" }}
            onClick={() => handleSave()}
          />
        ) : (
          <BookmarkBorder
            sx={{ color: "white", cursor: "pointer" }}
            onClick={() => handleSave()}
          /> 
        )}

        {user?.userId === blog.user.userId && (
          <ButtonDelete id={blog.blogId} />
        )}
      </div>
    </div>
  );
};

export default BlogCard;
