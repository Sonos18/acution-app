"use client";
import React, { useState } from "react";
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

export function Nav() {
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
        <div className="col-span-4 mx-auto ">
          <div className="relative flex">
            <Navbar items={items} className="" />
          </div>
        </div>
        <Search />
        <Setting />
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
    // items: (
    //   <div className="  text-sm grid grid-cols-2 gap-10 p-4">
    //     <ProductItem
    //       title="Algochurn"
    //       href="https://algochurn.com"
    //       src="https://assets.aceternity.com/demos/algochurn.webp"
    //       description="Prepare for tech interviews like never before."
    //     />
    //     <ProductItem
    //       title="Tailwind Master Kit"
    //       href="https://tailwindmasterkit.com"
    //       src="https://assets.aceternity.com/demos/tailwindmasterkit.webp"
    //       description="Production ready Tailwind css components for your next project"
    //     />
    //     <ProductItem
    //       title="Moonbeam"
    //       href="https://gomoonbeam.com"
    //       src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.51.31%E2%80%AFPM.png"
    //       description="Never write from scratch again. Go from idea to blog in minutes."
    //     />
    //     <ProductItem
    //       title="Rogue"
    //       href="https://userogue.com"
    //       src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.47.07%E2%80%AFPM.png"
    //       description="Respond to government RFPs, RFIs and RFQs 10x faster using AI"
    //     />
      // </div>
    // ),
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
