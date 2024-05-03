"use client";
import React, { use, useEffect, useState } from "react";
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
import { Setting } from "@/components/custom/setting";
import { useAppContext } from "../app-provider";
import Link from "next/link";

export function Nav() {
  const { user } = useAppContext();
  if (!user) return <></>;
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
      <div className="grid grid-cols-10 gap-4 items-center bg-white mb-4">
        <div className="col-span-3 text-center">
          <Link href="/" className="text-indigo-400">
            APP AUCTION
          </Link>
        </div>
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
        {user ? <Setting avatar={user.avatar} /> : <></>}
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
        {items.map((item, index) => (
          <MenuItem
            key={item.name}
            item={item.name}
            active={active}
            setActive={setActive}
            navigation={item.link}
          >
            {item.items && item.items}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
const navItems: NavItem[] = [
  {
    name: "Home",
    link: "/",
    active: true,
  },
  {
    name: "Blog",
    link: "/blog",
    active: false,
  },
  {
    name: "Auction",
    link: "/auction",
    active: false,
    items: (
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
    ),
  },
  {
    name: "About",
    link: "/about",
    active: false,
  },
  {
    name: "Contract",
    link: "/contract",
    active: false,
  },
];
