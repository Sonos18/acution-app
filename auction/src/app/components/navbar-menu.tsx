"use client";
import React, { useEffect, useState } from "react";
import {
  HoveredLink,
  Menu,
  MenuItem,
  ProductItem,
} from "@/components/ui/navbar-menu";
import { cn } from "@/lib/utils";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { IconHome, IconMessage, IconUser } from "@tabler/icons-react";
import { usePathname, useSearchParams } from "next/navigation";
import { NavItem } from "@/utils/type";
import { useRouter } from "next/navigation";
import { Combobox } from "./combobox";
import { Input } from "@/components/ui/input";
import { IoSearchSharp } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserResType } from "@/schemaValidations/user.schema";

export function Nav({ user }: { user: UserResType | null }) {
  console.log(user);
  const [items, setItems] = useState(navItems);
  const router = useRouter();
  const handleItemClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    index: Number,
    ref: string
  ) => {
    event.preventDefault();
    const updatedNavItems = navItems.map((item, i) => ({
      ...item,
      active: i === index,
    }));
    console.log(updatedNavItems);
    setItems(updatedNavItems);
    router.push(ref);
  };
  return (
    <>
      <div className="grid grid-cols-10 gap-4 items-center ">
        <div className="col-span-3 text-center">App Auction</div>
        <div className="col-span-4 mx-auto ">
          <div className="relative flex">
            <Navbar items={items} className="" />
          </div>
        </div>
        <div className="col-span-2 ">
          <div className="bg-slate-50 flex justify-center items-center rounded-md border-2 relative">
            <Combobox />
            <Input className="h-8" placeholder="Enter key work" />
            <IoSearchSharp
              size={24}
              className="absolute right-1"
              color="#475569"
            />
          </div>
        </div>
        {user ? (
          <div className="col-span-1 mx-auto">
            <Avatar className="" onClick={() => router.push("/profile")}>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        ) : (
          <div>Signin</div>
        )}
      </div>
      <FloatingNav navItems={items} handleItemClick={handleItemClick} />
    </>
  );
}

function Navbar({
  items,
  className,
}: {
  items: NavItem[];
  className?: string;
}) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div className={cn(" inset-x-0 max-w-2xl z-50", className)}>
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item={items[0].name}>
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/web-dev">Web Development</HoveredLink>
            <HoveredLink href="/interface-design">Interface Design</HoveredLink>
            <HoveredLink href="/seo">Search Engine Optimization</HoveredLink>
            <HoveredLink href="/branding">Branding</HoveredLink>
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item={items[3].name} />
        <MenuItem setActive={setActive} active={active} item={items[4].name} />
        <MenuItem setActive={setActive} active={active} item={items[1].name}>
          <div className="  text-sm grid grid-cols-2 gap-10 p-4">
            <ProductItem
              title="Algochurn"
              href="https://algochurn.com"
              src="https://assets.aceternity.com/demos/algochurn.webp"
              description="Prepare for tech interviews like never before."
            />
            <ProductItem
              title="Tailwind Master Kit"
              href="https://tailwindmasterkit.com"
              src="https://assets.aceternity.com/demos/tailwindmasterkit.webp"
              description="Production ready Tailwind css components for your next project"
            />
            <ProductItem
              title="Moonbeam"
              href="https://gomoonbeam.com"
              src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.51.31%E2%80%AFPM.png"
              description="Never write from scratch again. Go from idea to blog in minutes."
            />
            <ProductItem
              title="Rogue"
              href="https://userogue.com"
              src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.47.07%E2%80%AFPM.png"
              description="Respond to government RFPs, RFIs and RFQs 10x faster using AI"
            />
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item={items[2].name}>
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/hobby">Hobby</HoveredLink>
            <HoveredLink href="/individual">Individual</HoveredLink>
            <HoveredLink href="/team">Team</HoveredLink>
            <HoveredLink href="/enterprise">Enterprise</HoveredLink>
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
}
const navItems: NavItem[] = [
  {
    name: "Home",
    link: "/",
    icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    active: true,
  },
  {
    name: "About",
    link: "/about",
    icon: <IconUser className="h-4 w-4 text-neutral-500 dark:text-white" />,
    active: false,
  },
  {
    name: "Contract",
    link: "/contract",
    icon: <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />,
    active: false,
  },
  {
    name: "Auction",
    link: "/auction",
    active: false,
  },
  {
    name: "Blog",
    link: "/blog",
    active: false,
  },
];
