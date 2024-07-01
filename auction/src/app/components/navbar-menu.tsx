"use client";
import React, { useEffect, useState } from "react";
import { Menu, MenuItem, ProductItem } from "@/components/ui/navbar-menu";
import { cn } from "@/lib/utils";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { NavItem } from "@/utils/type";
import { useRouter } from "next/navigation";

import { Setting } from "@/components/custom/setting";
import Link from "next/link";
import logo from "../../../public/logo.jpg";
import Image from "next/image";
import { Search } from "@/components/custom/search";
import Notification from "./notification";
import Message from "./message";

export function Nav() {
  const router = useRouter();
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
        <ul className="text-sm grid grid-cols-5 gap-2 p-2">
          {[
            "Watch",
            "Jewelry",
            "Car",
            "Pottery",
            "Musical instrument",
            "Bag",
            "Painting",
            "Clothes",
            "Wine"
          ].map((item, index) => (
            <li key={index} className="hover:text-blue-500 cursor-pointer">
              <Link href={{ pathname: '/auction', query: { category: item } }} as={`/auction?nameCategory=${item}`}>{item}</Link>
            </li>
          ))}
        </ul>
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
  const [items, setItems] = useState(navItems);
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
    setItems(updatedNavItems);
    router.push(ref);
  };
  
  return (
    <>
      <div className="grid grid-cols-10 gap-4 items-center bg-white mb-4">
        <div className="col-span-3 text-center">
          <Link href="/" className="item-center text-center">
            <Image
              src={logo}
              alt="Logo"
              height={72}
              width={128}
              className="mx-auto"
            />
          </Link>
        </div>
        <div className="col-span-3 mx-auto ">
          <div className="relative flex">
            <Navbar items={items} className="" />
          </div>
        </div>
        <Search />
        <div className="col-span-2 flex justify-center">
          <Notification />
          <Message />
          <Setting />
          </div>
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

