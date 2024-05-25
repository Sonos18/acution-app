import { Button } from "@/components/ui/moving-border";
import { TableCell, TableRow } from "@/components/ui/table";
import { UserResType } from "@/schemaValidations/user.schema";
import Image from "next/image";
import { UserTamp } from "../users/page";
interface Props{
    user: UserTamp[0];
}
const UserRow=({user}:Props)=>{
    return(
        <TableRow>
        <TableCell>
          {/* <Image src={user.avatar} alt="avatar" width={50} height={50} />
           */}
        {user.firstName}
        </TableCell>
        <TableCell>{user.firstName} {user.lastName}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.role}</TableCell>
        <TableCell>
            <Button>Edit</Button>
        </TableCell>
      </TableRow>
    )
}
export default UserRow;