"use client"

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';
import logo from "../../../../public/logo.jpg";

const LeftSideBar = () => {
  const pathname = usePathname();

  return (
    <div className="h-screen left-0 top-0 sticky p-10 flex flex-col gap-16 shadow-xl max-lg:hidden bg-blue-100">
      <Image src={logo} alt="logo" width={150} height={70} />
      <div className="flex flex-col gap-12">
        {navLinks.map((link) => (
          <Link
            href={link.url}
            key={link.label}
            className={`flex gap-4 text-body-medium ${
              pathname === link.url ? "text-blue-200" : "text-grey-200"
            }`}
          >
            {link.icon} <p>{link.label}</p>
          </Link>
        ))}
      </div>

      <div className="flex gap-4 text-body-medium items-center">
        <p>Edit Profile</p>
      </div>
    </div>
  );
};

export default LeftSideBar;
export const navLinks=[
    {
        label: "Dashboard",
        url: "/dashboard",
        icon: <DashboardIcon />,
        },
        {
        label: "Category",
        url: "/category",
        icon: <CategoryIcon />,
        },
        {
        label: "Users",
        url: "/users",
        icon: <PeopleIcon />,
    }
]