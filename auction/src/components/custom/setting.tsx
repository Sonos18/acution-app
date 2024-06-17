import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";
import Image from "next/image";
import { AlertDialogConfirm } from "./alert-dialog-confirm";
import { Logout } from "./logout";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import PaidIcon from '@mui/icons-material/Paid';
import PersonIcon from "@mui/icons-material/Person";
import { useRouter } from "next/navigation";
import type { RootState } from '@/store/store';
import { useSelector } from 'react-redux'
export const Setting = () => {
  const user = useSelector((state: RootState) => state.currentUser.user);
  const router = useRouter();
  return (
    <div>
      <div className="col-span-1 mx-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Image
              src={user?.avatar || "/avatar.jpg"}
              alt="profile photo"
              width={50}
              height={50}
              className="rounded-full cursor-pointer"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuGroup>
              {dropdownItem.map((item, index) => (
                <DropdownMenuItem
                  key={index}
                  className="text-base"
                  onClick={() => router.push(item.link)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                  <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Logout />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
const dropdownItem = [
  {
    name: "Profile",
    link: "/profile",
    icon: <PersonIcon className="mr-2 h-4 w-4"/>,
    shortcut:"⇧⌘P",
  },
  {
    name: "Confirm my auctions",
    link: "/auction/confirm",
    icon: <PublishedWithChangesIcon className="text-emerald-400 mr-2 h-4 w-4" />,
    shortcut:"⇧⌘A",
  },
  {
    name: "Payment",
    link: "/payment",
    icon: <PaidIcon className="text-amber-400 mr-2 h-4 w-4" />,
    shortcut:"⌘K",
  },
];
