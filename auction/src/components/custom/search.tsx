"use client";
import { Combobox } from "@/app/components/combobox";
import { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { Input } from "../ui/input";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export const Search = () => {
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState<string>("");
  const [page, setPage] = useState<string>("");
  const pathname = usePathname();
  const router = useRouter();
  const hadleSearch = async () => {
    if (!page || !searchValue) return;
    const params = new URLSearchParams(searchParams);
    params.set("search", searchValue);
    if (pathname.includes(page)) {
      router.replace(`${pathname}?${params.toString()}`);
    } else {
      router.push(`${page}?${params.toString()}`);
    }
  };

  return (
    <>
      <div className="col-span-2 ">
        <div className="bg-slate-50 flex justify-center items-center rounded-md border-2 relative">
          <Combobox pages={pages} setPage={setPage} page={page} />
          <Input
            className="h-8"
            placeholder="Enter key work"
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <IoSearchSharp
            onClick={hadleSearch}
            size={24}
            className="absolute right-1 hover:cursor-pointer"
            color="#475569"
          />
        </div>
      </div>
    </>
  );
};
const pages = [
  {
    value: "blog",
    label: "Blog",
  },
  {
    value: "auction",
    label: "Auction",
  },
];
export type pagesType = typeof pages;
