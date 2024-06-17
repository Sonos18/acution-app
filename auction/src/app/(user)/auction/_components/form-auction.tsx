"use client";
import blogApiRequest from "@/apiRequests/blog";
import ImageUpload from "@/components/custom/ImageUpload";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { toast, useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  AuctionInput,
  AuctionInputType,
} from "@/schemaValidations/auction.schema";
import { format, set } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import auctionApiRequest from "@/apiRequests/auction";
import categoryApiRequest from "@/apiRequests/category";
import { CategoryType } from "@/app/(admin)/category/page";
export default function FormAuction() {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File[] | null>(null);
  const router = useRouter();
  const [categories,setCategories]=useState<CategoryType[]|[]>([]);
  const loadCategories=async()=>{
    try {
      const res=await categoryApiRequest.getAll();
      setCategories(res.payload);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(()=>{
    loadCategories();
  },[]);
  const form = useForm<AuctionInputType>({
    resolver: zodResolver(AuctionInput),
    defaultValues: {
      startPrice: 0,
      endPrice: 0,
      startTime: new Date(),
      endTime: new Date(),
      productName: "",
      description: "",
      categoryId: "",
      origin: "",
      images: [],
    },
  });
  const onSubmit = async (data: AuctionInputType) => {
    try {
      if (!file) {
        return;
      }
      setLoading(true);
      const fileTypes = file.map((f) => f.type);
      const res = await blogApiRequest.getSignedUrl({ types: fileTypes });
      const { urls, keys } = res.payload;
      let imageUrls = [];
      const bucket = process.env.NEXT_PUBLIC_AWS_BUCKET;
      for (let i = 0; i < keys.length; i++) {
        await fetch(urls[i], {
          method: "PUT",
          body: file[i],
        });
        imageUrls.push(bucket + keys[i]);
      }
      const newData = {
        ...data,
        images: imageUrls,
        startTime: data.startTime.toISOString(),
        endTime: data.endTime.toISOString(),
      };
      const auction = await auctionApiRequest.createAuction(newData);
      toast({
        title: "Success",
        description: "Auction created successfully",
        className: "bg-green-400 text-white",
      });
      if (auction.status !== 201) {
        throw new Error("Failed to create auction");
      }
      router.push("/auction");
      router.refresh();
    } catch (error) {
      const e = error as Error;
      toast({
        title: "Error",
        description: e.message,
        className: "bg-red-400 text-white",
      });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <Card className="w-1/3 mx-auto">
        <CardHeader>
          <CardTitle className="mx-auto">Create Auction</CardTitle>
          <CardDescription className="mx-auto">
            Deploy your new blog in one-click.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                <FormField
                  control={form.control}
                  name="startPrice"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Start Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Start Price"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-700" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endPrice"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>End Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="End Price"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-700" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel>Start Time</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a start time</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel>End Time</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a start time</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                <FormField
                  control={form.control}
                  name="productName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Name" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-700" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="origin"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Origin</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter Origin"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-700" />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="w-full mb-4">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter Description" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-700" />
                  </FormItem>
                )}
              />
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Categories</SelectLabel>
                              {Array.isArray(categories) && categories.length > 0 && categories.map((category) => (
                                <SelectItem
                                  key={category.categoryId}
                                  value={category.categoryId}
                                >
                                  {category.categoryName}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-red-700" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Product Images</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          ref={inputRef}
                          multiple
                          onChange={(e) => {
                            const files = e.target.files
                              ? Array.from(e.target.files)
                              : null;
                            if (files && files.length > 0 && files.length < 5) {
                              setFile(files);
                              field.onChange(["dfghd"]);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage className="text-red-700" />
                    </FormItem>
                  )}
                />
              </div>
              {file && (
                <div className="flex">
                  {Array.from(file).map((f, index) => (
                    <div className="mt-1 mx-auto" key={index}>
                      <Image
                        className="w-40 h-40 object-cover"
                        alt="preview"
                        src={URL.createObjectURL(f)}
                        width={128}
                        height={128}
                      />
                      <Button
                        className="my-auto mx-auto"
                        type="button"
                        variant={"destructive"}
                        size={"sm"}
                        onClick={() => {
                          const newFileArray = Array.from(file);
                          newFileArray.splice(index, 1);
                          if (newFileArray.length === 0) {
                            setFile(null);
                            form.setValue("images", []);
                            if (inputRef.current) {
                              inputRef.current.value = "";
                            }
                            return;
                          }
                          setFile(newFileArray);
                        }}
                      >
                        Delete Image
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* {(file || image) && (
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
              )}*/}
              <div className="flex justify-between p-6">
                <Button
                  type="button"
                  className={`bg-red-400 ${loading ? "opacity-70" : ""}`}
                  variant="destructive"
                  onClick={() => {
                    console.log("cancel");
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
                  ) : (
                    "Create"
                  )}
                </Button>
              </div>
            </form>
          </Form>
          {/* {imageUrl && <img src={imageUrl} alt="Uploaded content" />} */}
        </CardContent>
      </Card>
    </div>
  );
}
