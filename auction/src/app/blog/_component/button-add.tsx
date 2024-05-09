"use client";

import { useAppContext } from "@/app/app-provider";
import Image from "next/image";

import Link from "next/link";
import { addItemType } from "../page";
interface Props {
  item: addItemType;
}
const ButtonAdd = ({ item }: Props) => {
  const { user } = useAppContext();
  if (!user) return <></>;
  return (
    <div className="w-full max-w-xl mx-auto bg-white mb-4 rounded-lg p-4">
      <div className=" flex justify-center">
        <Image
          src={user?.avatar}
          alt="profile photo"
          width={50}
          height={50}
          className="rounded-full cursor-pointer"
        />

        <div className="w-full rounded-3xl bg-slate-100 my-auto p-2 hover:bg-slate-200 cursor-pointer">
          <Link href={item.link}>
            {user?.firstName} {user?.lastName}, {item.title}
          </Link>
        </div>
      </div>
      <div className="w-full my-2">
        <hr className="h-1/2 bg-slate-600" />
      </div>
      <div className="w-full grid grid-cols-12 items-center">
        {item.cateItems.map((cateItem, idx) => (
          <div
            key={idx}
            className="col-span-4 bg-white hover:bg-slate-300 p-2 rounded-lg text-center"
          >
            {cateItem.icon}
            <span className="text-sm text-slate-600">{cateItem.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ButtonAdd;
