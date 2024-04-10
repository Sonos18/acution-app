"use client";
import blogApiRequest from "@/apiRequests/blog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { BlogInput, BlogInputType } from "@/schemaValidations/blog.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

export const FormBlog = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [errorFile, setErrorFile] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BlogInputType>({
    resolver: zodResolver(BlogInput),
    defaultValues: {
      title: "",
      content: "",
      keyImage: "key",
    },
  });
  const onSubmit = async (data: BlogInputType) => {
    try {
      setLoading(true);
      if (!file) {
        return;
      }
      const preSignedUrl = await blogApiRequest.getSignedUrl({
        type: file.type,
      });

      if (!preSignedUrl || !preSignedUrl.payload) {
        console.error("Failed to get pre-signed URL");
        return;
      }
      const response = await fetch(preSignedUrl.payload.url, {
        method: "PUT",
        body: file,
      });
      data.keyImage = preSignedUrl.payload.key;
      const res = await blogApiRequest.createBlog(data);
      toast({
        title: "Success",
        description: "Blog created successfully",
        className: "bg-green-500 text-white",
      });
      router.push("/blog");
      router.refresh();
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
  return (
    <Card className="w-1/3 mx-auto">
      <CardHeader>
        <CardTitle>Create Blog</CardTitle>
        <CardDescription>Deploy your new blog in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="tile"
                {...register("title")}
                placeholder="Title of your blog"
              />
              {errors.title && (
                <p className="text-red-500">{errors.title.message}</p>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="content">Framework</Label>
              <Textarea
                {...register("content")}
                id="content"
                placeholder="Content of your blog"
              />
              {errors.content && (
                <p className="text-red-500">{errors.content.message}</p>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="image">Pick Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFile(file);
                    setErrorFile(null);
                  } else setErrorFile("Image is required");
                }}
              />
              {errorFile && <p className="text-red-500">{errorFile}</p>}
            </div>
          </div>
          <div className="flex justify-between p-6">
            <Button
              type="button"
              className={`${loading ? "opacity-70" : ""}`}
              variant="outline"
              onClick={() => {
                router.back;
              }}
            >
              Cancel
            </Button>
            <Button className={`${loading ? "opacity-70" : ""}`} type="submit">
              {loading ? (
                <Loader2 className="mx-auto h-4 w-4 animate-spin" />
              ) : (
                "Deloy"
              )}
            </Button>
          </div>
        </form>
        {imageUrl && (
          <img
            src="https://my-auction-bucket.s3.ap-southeast-1.amazonaws.com/e9c65e5b-2cef-4a54-b0df-6dcaab39ba04?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLXNvdXRoZWFzdC0xIkcwRQIgPYyol1r2lGwkEc65NLTQxTVhc%2BzooAS6aH7OYFAdR5oCIQCcbz4W%2B1RfIrw4NgEVHutW46L7JlU%2BpOmL19iWpTquaCroAggjEAAaDDIxMTEyNTc1NTYzNyIMsjqunfbpCXvTw4QZKsUCfBK%2B9RaMHHAxz2hIU81zNJda1FWnhR4T3%2FjlzvwzJScL0WEFJWvHtFFcONXQAoiX%2B6XYCNNQBbVFJnna2HTY6kMmLWcufC7FfLQgwAbpvHWhGAYdjj%2Ft%2F5Thea3uWPo9rF45iGfFdmRS5g4yCKcvIHCDL5TXs1bRxwMK%2BtMckGewqPMbQOOHxntRLwwnGm5HZKGHK8hVGv1V2hYotSUZnCOe4LZZbhZHmNaa3dRs%2BrFcYRoKPBniDFT4r6pWcQnQX88DH3TcXm7xxNowDRuv0F0G35xW2sIcnJxtBQO6gpGNm73E3SXm5TATDsb5Ie46P3NSx9hsiCyavBNb1jE3E9F2E8lfRoSP4uBjWknK7W5VQEV42bu3GdgiPd1h5AbolyPrhemvNMr34L66jqKXjRBfko8JWHMs0CHkVrvTZRQ9poTPkzCw59ewBjqzAnkEVqr1hUssU3X%2BiebLAUX%2FN27IMRWQ1nAamnY%2F%2BCg2d1ASTnRaJUW6SlM8p%2FbR4f9UgZUGb7QnkZWUG2ReiFqV8KKjvwtiZo1pPA5VlE8ft%2BV79qqH3i1wfWc0bTmvWCTYfaDEsqpVwddtcF2p56yGcvTvIEl5SfkxNU0CKrvlg7otudgAot2cJ%2FAVtiM9JcjtV5kjCM12R1aF7Krns5gUi9nzA5Yvt1Hb5hCasZtSZmdcR1TIIQI7Qs9krzytCto91P1KnJLzzxnfRj2nfGLInMIa7PQZEbP2BgeOLZ2%2BZzfbYtSZriXDWITzyenySnmQ9VPsItVPxqdqDs3FwAPjMpLEWMunPCFBy%2FUuS6j5PtoX8vTKJIimHgxCb5DCt6IWarEokPGanypLMyTtxF%2B4dhg%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240410T051646Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIATCKATL32YGZF65O7%2F20240410%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=26d14f80f81741b14d7f462c47c507a88c365dc010c5a3e980b43803204ac924"
            alt="Uploaded content"
          />
        )}
      </CardContent>
    </Card>
  );
};
