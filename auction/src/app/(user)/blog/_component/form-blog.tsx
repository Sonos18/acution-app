"use client";
import blogApiRequest from "@/apiRequests/blog";
import MultiText from "@/components/custom/MultiText";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  BlogInput,
  BlogInputType,
  BlogResType,
} from "@/schemaValidations/blog.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {  useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {addBlog, updateBlog} from "@/store/blogSlice";
import type { RootState } from "@/store/store";

export const FormBlog = ({ blog }: { blog?: BlogResType }) => {
  const dispath=useDispatch();
  const currentUser=useSelector((state:RootState)=>state.currentUser.user);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [errorFile, setErrorFile] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast }: { toast: any } = useToast();
  const router = useRouter();
  const bucket = process.env.NEXT_PUBLIC_AWS_BUCKET;
  const form = useForm<BlogInputType>({
    resolver: zodResolver(BlogInput),
    defaultValues: {
      title: "",
      content: "",
      keyImage: "",
      hashtags: [],
    },
  });
  useEffect(() => {
    if (blog) {
      form.reset({
        title: blog.title,
        content: blog.content,
        keyImage: blog.image,
        hashtags: blog.hashtags,
      });
    }
  }, [blog]);

  const image = form.watch("keyImage");

  const handleImageUpload = async (file: File | null) => {
    if (!file) {
      return;
    }
    try {
      const types = [file.type];
      const preSignedUrl = await blogApiRequest.getSignedUrl({
        types,
      });
      if (!preSignedUrl || !preSignedUrl.payload) {
        console.error("Failed to get pre-signed URL");
        return;
      }
      await fetch(preSignedUrl.payload.urls[0], {
        method: "PUT",
        body: file,
      });
      return preSignedUrl.payload.keys[0];
    } catch (error) {
      console.error("Error uploading image", error);
    }
  };
  const handleCreateBlog = async (data: BlogInputType) => {
    const keyImage = await handleImageUpload(file);
    if (!keyImage) {
      return;
    }
    const imageUrl= bucket + keyImage;
    const updatedData = { ...data, keyImage: [imageUrl] };
    const res=await blogApiRequest.createBlog(updatedData);
    if (currentUser=== null)return;
    const newBLog={
      ...res.payload,
      user:{
        userId:currentUser.userId,
        firstName:currentUser.firstName,
        lastName:currentUser.lastName,
        avatar:currentUser.avatar
      },
      isLiked:false,
      like:0
    }
    dispath(addBlog(newBLog));
  };
  const handleUpdateBlog = async (data: BlogInputType) => {
    let updatedData = { ...data, keyImage: [data.keyImage] };
    if (file) {
      const keyImage = await handleImageUpload(file);
      if (!keyImage) {
        return;
      }
      updatedData.keyImage = [keyImage];
    }
    await blogApiRequest.updateBlog(blog?.blogId ?? "", updatedData);
    const newBlog = { ...blog, 
      title: updatedData.title,
      content: updatedData.content,
      image: updatedData.keyImage[0],
      hashtags: updatedData.hashtags,
     };
    dispath(updateBlog(newBlog));
  };
  const onSubmit = async (data: BlogInputType) => {
    try {
      setLoading(true);
      if (blog) {
        await handleUpdateBlog(data);
      } else {
        await handleCreateBlog(data);
      }
      toast({
        title: "Success",
        description: "Blog created successfully",
        className: "bg-green-500 text-white",
      });
      router.push("/blog");
    } catch (error) {
      setLoading(false);
      const e = error as Error;
      toast({
        title: "Error",
        description: e.message,
        className: "bg-red-500 text-white",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleKeyPress = (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };
  return (
    <Card className="w-1/3 mx-auto">
      <CardHeader>
        <CardTitle className="mx-auto">
          {blog ? "Update Blog" : "Create Blogs"}
        </CardTitle>
        <CardDescription className="mx-auto">
          Deploy your new blog in one-click.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Title"
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage className="text-red-700" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hashtags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hashtags (Enter to add more)</FormLabel>
                  <FormControl>
                    <MultiText
                      placeholder="Tags"
                      value={field.value}
                      onChange={(tag) => field.onChange([...field.value, tag])}
                      onRemove={(tagToRemove) =>
                        field.onChange([
                          ...field.value.filter((tag) => tag !== tagToRemove),
                        ])
                      }
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Content of your blog"
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage className="text-red-700" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="keyImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PickImage</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      ref={inputRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFile(file);
                          field.onChange("gaga");
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-red-700" />
                </FormItem>
              )}
            />
            {(file || image) && (
              <div className="flex mt-1 mx-auto">
                <Image
                  src={file ? URL.createObjectURL(file) : image}
                  width={128}
                  height={128}
                  alt="preview"
                  className="w-40 h-40 object-cover"
                />
                <Button
                  className="my-auto mx-auto"
                  type="button"
                  variant={"destructive"}
                  size={"sm"}
                  onClick={() => {
                    setFile(null);
                    form.setValue("keyImage", "");
                    if (inputRef.current) {
                      inputRef.current.value = "";
                    }
                  }}
                >
                  Delete Image
                </Button>
              </div>
            )}
            <div className="flex justify-between p-6">
              <Button
                type="button"
                className={`bg-red-400 ${loading ? "opacity-70" : ""}`}
                variant="destructive"
                onClick={() => {
                  router.push("/blog");
                }}
              >
                Cancel
              </Button>
              <Button
                className={`${loading ? "opacity-70" : ""}`}
                type="submit"
              >
                {loading ? (
                  <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                ) : blog ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </form>
        </Form>
        {imageUrl && <img src={imageUrl} alt="Uploaded content" />}
      </CardContent>
    </Card>
  );
};
