import userApiRequest from "@/apiRequests/user";
import { User, useAppContext } from "@/app/app-provider";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "@/components/ui/use-toast";
import {
  UserUpdateSchema,
  UserUpdateSchemaType,
} from "@/schemaValidations/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export function SheetEditProfile() {
  const { user, setUser } = useAppContext();
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<UserUpdateSchemaType>({
    resolver: zodResolver(UserUpdateSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });
  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      });
    }
  }, [user]);
  const handleKeyPress = (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };
  const onSubmit = async (data: UserUpdateSchemaType) => {
    try {
      setLoading(true);
      const updateData = await userApiRequest.update(data);
      setUser(updateData.payload);
      toast({
        description: "Updated successfully",
        title: "success",
        className: "bg-green-500",
        duration: 3000,
      });
    } catch (error) {
      const e = error as Error;
      console.error(e.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Update</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-10 items-center gap-4">
                      <div className="col-span-3">
                        <FormLabel>First Name</FormLabel>
                      </div>

                      <div className="col-span-7">
                        <FormControl>
                          <Input
                            placeholder="firstName"
                            {...field}
                            onKeyDown={handleKeyPress}
                          />
                        </FormControl>
                      </div>
                    </div>
                    <FormMessage className="text-red-700" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-10 items-center gap-4">
                      <div className="col-span-3">
                        <FormLabel>Last Name</FormLabel>
                      </div>

                      <div className="col-span-7">
                        <FormControl>
                          <Input
                            placeholder="firstName"
                            {...field}
                            onKeyDown={handleKeyPress}
                          />
                        </FormControl>
                      </div>
                    </div>
                    <FormMessage className="text-red-700" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-10 items-center gap-4">
                      <div className="col-span-3">
                        <FormLabel>Email</FormLabel>
                      </div>

                      <div className="col-span-7">
                        <FormControl>
                          <Input
                            placeholder="firstName"
                            {...field}
                            onKeyDown={handleKeyPress}
                          />
                        </FormControl>
                      </div>
                    </div>
                    <FormMessage className="text-red-700" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-10 items-center gap-4">
                      <div className="col-span-3">
                        <FormLabel>Phone</FormLabel>
                      </div>

                      <div className="col-span-7">
                        <FormControl>
                          <Input
                            placeholder="phone"
                            {...field}
                            onKeyDown={handleKeyPress}
                          />
                        </FormControl>
                      </div>
                    </div>
                    <FormMessage className="text-red-700" />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="mx-auto h-4 w-4 animate-spin" />
              ) : (
                <>Save changes</>
              )}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
