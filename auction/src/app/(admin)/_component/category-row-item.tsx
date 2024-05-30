import { Button } from "@/components/ui/moving-border";
import { TableCell, TableRow } from "@/components/ui/table";
import { UserResType } from "@/schemaValidations/user.schema";
import Image from "next/image";
import { CategoryType } from "../category/page";
import categoryApiRequest from "@/apiRequests/category";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
interface Props{
    category: CategoryType
}
export function CategoryRow({category}:Props){
  const [loading,setLoading]=useState<boolean>(false);
  const router = useRouter();
  const handleDelete=async()=>{
    try {
      setLoading(true);
      const res=await categoryApiRequest.delete(category.categoryId);
      router.refresh();
      toast({
        title:"Success",
        description:"Category deleted",
        className:"bg-green-500 text-white"
      })
    } catch (error) {
      toast({
        title:"Error",
        description:"Category not deleted",
        className:"bg-red-500 text-white"
      })
    }
    finally{
        setLoading(false);
    }
  }
    return(
        <TableRow>
        <TableCell>
          {category.categoryName}
        </TableCell>
        <TableCell>{category.createdAt}</TableCell>
        <TableCell >
        <button onClick={handleDelete} disabled={loading}
        className="px-4 py-2 backdrop-blur-sm border bg-orange-200 border-emerald-500/20 text-white mx-auto text-center rounded-full relative mt-4">
          <span>{loading ? "Loading...":"Delete"}</span>
        </button>
        </TableCell>
      </TableRow>
    )
}
