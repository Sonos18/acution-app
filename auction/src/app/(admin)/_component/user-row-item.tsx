import { DropdownMenuTrigger,DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/moving-border";
import { TableCell, TableRow } from "@/components/ui/table";
import { UserResType } from "@/schemaValidations/user.schema";
import Image from "next/image";
import UpdateIcon from '@mui/icons-material/Update';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
interface Props{
    user: UserResType;
}
const UserRow=({user}:Props)=>{
    return(
        <TableRow>
            <TableCell>
                <Image src={user.avatar} alt="avatar" width={50} height={50} />
            </TableCell>
            <TableCell>
                {user.firstName}
            </TableCell>
            <TableCell>{user.firstName} {user.lastName}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.phone??"Not Update"}</TableCell>
            <TableCell>
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button containerClassName="w-20 h-10 "
                                className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800">
                                Edit
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48">
                        <DropdownMenuLabel>Choose one action</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                            <DropdownMenuItem >
                                <UpdateIcon className="mr-2 h-4 w-4 text-emerald-400"/>
                                <span>Update Person</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <PersonRemoveIcon className="mr-2 h-4 w-4 text-red-400"/>
                                <span>Delete Person</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
            </TableCell>
      </TableRow>
    )
}
export default UserRow;