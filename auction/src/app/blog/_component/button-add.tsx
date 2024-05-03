"use client";

import { useAppContext } from "@/app/app-provider";
import Image from "next/image";
import VideoCameraBackIcon from "@mui/icons-material/VideoCameraBack";
import CollectionsIcon from "@mui/icons-material/Collections";
import MoodIcon from "@mui/icons-material/Mood";
import Link from "next/link";
const ButtonAdd = () => {
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
          <Link href="/blog/addBlog">
            {user?.firstName} {user?.lastName}, what do you want to share?
          </Link>
        </div>
      </div>
      <div className="w-full my-2">
        <hr className="h-1/2 bg-slate-600" />
      </div>
      <div className="w-full grid grid-cols-12 items-center">
        <div className="col-span-4 bg-white hover:bg-slate-300 p-2 rounded-lg text-center">
          <VideoCameraBackIcon
            className="text-rose-500 mr-1"
            fontSize="small"
          />
          <span className="text-sm text-slate-600">Live Video</span>
        </div>
        <div className="col-span-4 bg-white hover:bg-slate-300 p-2 rounded-lg text-center">
          <CollectionsIcon className="text-green-400 mr-1" fontSize="small" />
          <span className="text-sm text-slate-600">Picture/Video</span>
        </div>
        <div className="col-span-4 bg-white hover:bg-slate-300 p-2 rounded-lg text-center">
          <MoodIcon className="text-orange-400 mr-1" fontSize="small" />
          <span className="text-sm text-slate-600">Mood/Activity</span>
        </div>
      </div>
    </div>
  );
};
export default ButtonAdd;
