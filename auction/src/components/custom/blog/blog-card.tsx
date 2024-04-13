import likeApiRequest from "@/apiRequests/like";
import { useAppContext } from "@/app/app-provider";
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
import { useEffect, useState } from "react";

const BlogCard = ({ blog }: { blog: BlogResType }) => {
  const { user } = useAppContext();
  const [likes, setLikes] = useState<number>(blog.likes);
  const [isLiked, setIsLiked] = useState<boolean>(blog.isLiked);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const { toast } = useToast();
  const handleLike = async () => {
    console.log("like", isLiked);
    try {
      setLoading(true);
      let description = "Liked a blog";
      if (!isLiked) {
        const res = await likeApiRequest.like({ blogId: blog.blogId });
        if (res.status === 400)
          throw new Error("You have already liked this blog");

        setLikes(likes + 1);
      } else {
        const res = await likeApiRequest.disLike({ blogId: blog.blogId });
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

  const handleDelete = async () => {};
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
    <div className="mx-auto w-full max-w-xl rounded-lg flex flex-col gap-4 bg-black p-5 max-sm:gap-2">
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
            <div className="flex flex-col gap-1">
              <p className="text-small-semibold text-white">
                {blog.user.firstName} {blog.user.lastName}
              </p>
              <p className="text-subtle-medium text-white">@{blog.createdAt}</p>
            </div>
          </div>
        </Link>

        {user?.userId === blog.user.userId && (
          <Link href={`/edit-post/${blog.blogId}`}>
            <BorderColor sx={{ color: "white", cursor: "pointer" }} />
          </Link>
        )}
      </div>

      <p className="text-body-normal text-white max-sm:text-small-normal">
        {blog.content}
      </p>

      <Image
        src={blog.image}
        alt="post photo"
        width={200}
        height={150}
        className="rounded-lg w-full"
      />

      <p className="text-base-semibold text-purple-400 max-sm:text-small-normal">
        {blog.hashtags &&
          blog.hashtags.length > 0 &&
          blog.hashtags.map((tag) => `#${tag} `)}
      </p>

      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          {loading ? (
            <Loader2 className="mx-auto h-4 w-4 animate-spin" />
          ) : !isLiked ? (
            <FavoriteBorder
              sx={{ color: "white", cursor: "pointer" }}
              onClick={() => handleLike()}
            />
          ) : (
            <Favorite
              sx={{ color: "red", cursor: "pointer" }}
              onClick={() => handleLike()}
            />
          )}

          <p className="text-white">{likes}</p>
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
          <Delete
            sx={{ color: "white", cursor: "pointer" }}
            onClick={() => handleDelete()}
          />
        )}
      </div>
    </div>
  );
};

export default BlogCard;
