import { Button } from "@/components/ui/moving-border";
import { TableCell, TableRow } from "@/components/ui/table";
import { UserResType } from "@/schemaValidations/user.schema";
import Image from "next/image";
interface Props{
    category: {
        name: string;
        date: string;
    };
}
export function CategoryRow({category}:Props){
    return(
        <TableRow>
        <TableCell>
          {category.name}
        </TableCell>
        <TableCell>{category.date}</TableCell>
        <TableCell >
        <button className="px-4 py-2 backdrop-blur-sm border bg-orange-200 border-emerald-500/20 text-white mx-auto text-center rounded-full relative mt-4">
          <span>Edit</span>
        </button>
        </TableCell>
      </TableRow>
    )
}
