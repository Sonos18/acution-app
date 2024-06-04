import blogApiRequest from "@/apiRequests/blog";
import { AlertDialogConfirm } from "@/components/custom/alert-dialog-confirm";
import { toast } from "@/components/ui/use-toast";
import { Delete } from "@mui/icons-material";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";


interface BlogProps{
    id: string;
    loadBlogs:()=>void;
}
export default function ButtonDelete({id,loadBlogs}: BlogProps) {
    const [loading, setLoading] = useState<Boolean>(false);
    const router=useRouter();
    const handleDelete = async () => {
        try {
          setLoading(true);
          const res = await blogApiRequest.deleteBlog(id);
          if (res.status !== 200) throw new Error(String(res.payload));
          toast({
            description: "Deleted a blog",
            title: "Success",
            className: "bg-green-500 text-white",
          });
          loadBlogs();
          router.refresh();
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
    <div>
      <AlertDialogConfirm
            title="Warning"
            description="Are you sure you want to delete this post"
            handleLogout={handleDelete}
          >
            {loading?<Loader2 className="mx-auto h-4 w-4 animate-spin text-red-400" />
                :<Delete sx={{ color: "black", cursor: "pointer" }} />}
          </AlertDialogConfirm>
    </div>
  );
}