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
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from "react";
import { setAuctionsClosing } from "@/store/auctionClosingSlice";
import auctionApiRequest from "@/apiRequests/auction";
import paymentApiRequest from "@/apiRequests/payment";
import { setPayments } from "@/store/paymentSlice";
import HistoryIcon from '@mui/icons-material/History';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Setting = () => {
  const [totalAuctions, setTotalAuctions] = useState(0);
  const [totalPayments, setTotalPayments] = useState<number>(0);
  const [totalHistory, setTotalHistory] = useState<number>(0);
  const dispath=useDispatch()
  const user = useSelector((state: RootState) => state.currentUser.user);
  const router = useRouter();
  const loadConfirm = async() => {
    const res = await auctionApiRequest.getMyAuctionsCofirm();
    const amount = res.payload.length;
    const total = res.payload.reduce((acc,curr) => acc+curr.endPrice,0);
    dispath(setAuctionsClosing({auctions:res.payload,amount,total}));
    setTotalAuctions(amount);
  };
  const loadPayments = async() => {
    const res = await paymentApiRequest.getPayments();
    const amount = res.payload.length;
    dispath(setPayments({payments:res.payload,amount:amount,total:res.payload.reduce((acc,curr) => acc+curr.total,0)}))
    setTotalPayments(amount);
  }
  const loadHistory = async() => {
    const res=await auctionApiRequest.getHistoryAuctions(user?.userId as string);
    setTotalHistory(res.payload.data.length);
    console.log(res.payload); 
  }
  useEffect(() => {
    try {
      loadConfirm();
      loadPayments();
      loadHistory();
    } catch (error) {
      console.log((error as Error).message);
    }
  }, []);
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
      shortcut: totalAuctions > 0?
        <div className="w-5 h-5 ml-1 rounded-full bg-red-400 flex items-center justify-center text-white">
          <p>{totalAuctions}</p>
        </div>
        :<></>    
    },
    {
      name: "Payment",
      link: "/payment",
      icon: <PaidIcon className="text-amber-400 mr-2 h-4 w-4" />,
      shortcut: totalPayments > 0?
        <div className="w-5 h-5 ml-1 rounded-full bg-red-400 flex items-center justify-center text-white">
          <p>{totalPayments}</p>
        </div>
        :<></>
    },
    {
      name: "Auction History",
      link: "/history",
      icon: <HistoryIcon className="text-cyan-700 mr-2 h-4 w-4" />,
      shortcut: totalHistory > 0?
      <div className="w-5 h-5 ml-1 rounded-full bg-red-400 flex items-center justify-center text-white">
        <p>{totalHistory}</p>
      </div>:<></>
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
