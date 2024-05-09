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
import PersonIcon from "@mui/icons-material/Person";
import { useRouter } from "next/navigation";
export const Setting = ({ avatar }: { avatar: string }) => {
  const router = useRouter();
  return (
    <div>
      <div className="col-span-1 mx-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Image
              src={avatar}
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
                  <span>{item.name}</span>
                  <DropdownMenuShortcut>{item.icon}</DropdownMenuShortcut>
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
    icon: <PersonIcon />,
  },
  {
    name: "Confirm my auctions",
    link: "/auction/confirm",
    icon: <PublishedWithChangesIcon className="ml-3" />,
  },
  {
    name: "Payment",
    link: "/payment",
    icon: <PublishedWithChangesIcon className="ml-3" />,
  },
];
