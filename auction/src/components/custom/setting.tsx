import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Image from "next/image";
import { Logout } from "./logout";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import PaidIcon from '@mui/icons-material/Paid';
import PersonIcon from "@mui/icons-material/Person";
import { useRouter } from "next/navigation";
import type { RootState } from '@/store/store';
import {  useSelector } from 'react-redux'
import HistoryIcon from '@mui/icons-material/History';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Setting = () => {
  const user = useSelector((state: RootState) => state.currentUser.user);
  const router = useRouter();
  const dropdownItem = [
    {
      name: "Profile",
      link: "/profile",
      icon: <PersonIcon className="mr-2 h-4 w-4"/>,
      shortcut:"⇧⌘P",
    },
    {
      name: "Auction Confirm",
      link: "/auction/confirm",
      icon: <PublishedWithChangesIcon className="text-emerald-400 mr-2 h-4 w-4" />,
      shortcut: "⇧⌘A", 
    },
    {
      name: "Payment",
      link: "/payment",
      icon: <PaidIcon className="text-amber-400 mr-2 h-4 w-4" />,
      shortcut: "⇧⌘W"
    },
    {
      name: "Auction History",
      link: "/auction/history",
      icon: <HistoryIcon className="text-cyan-700 mr-2 h-4 w-4" />,
      shortcut: "⇧⌘H"
    },
  ];
  return (
    <div>
      
      <div className="">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer h-12 w-12">
              <AvatarImage src={user?.avatar || "/avatar.jpg"} alt="profile photo" />
              <AvatarFallback>US</AvatarFallback>
            </Avatar>
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
