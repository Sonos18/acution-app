import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { HiOutlinePlusSm, HiMinusSm } from "react-icons/hi";
import { BsCartPlus } from "react-icons/bs";
import { AuctionType } from "@/schemaValidations/auction.schema";
import Clock from "@/app/components/count-down";
import { Button } from "@/components/ui/moving-border";

interface Props {
  auction: AuctionType;
}
const CardToBid: React.FC<Props> = ({ auction }) => {
  const [value, setValue] = useState<number>(auction.currentPrice + 1);
  return (
    <div className="flex flex-col items-center flex-grow sticky top-10 md:top-36 max-w-[350px] mt-8 rtl:mr-auto ltr:ml-auto xl:rtl:ml-2 px-6 py-4 sm:p-4 xl:p-6 border-2 shadow-lg">
      <Clock endTime={new Date(auction.endTime).getTime()} />
      <div className="flex justify-around w-full pt-1">
        <div className="flex flex-col w-full text-center">
          <p className="text-lg text-rose-300">End Price</p>
          <p>{auction.endPrice}</p>
        </div>
        <div className="flex flex-col w-full text-center ">
          <p className="text-lg text-green-300">Current Price</p>
          <p>{auction.currentPrice}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 cursor-pointer">
        <div
          className="p-2"
          onClick={() => {
            if (value > auction.currentPrice + 1) setValue(value - 1);
          }}
        >
          <HiMinusSm
            style={{
              fontSize: "1.5rem",
              opacity: `${value === auction.currentPrice + 1 ? 0.6 : 1}`,
            }}
          />
        </div>
        <input
          className="text-center inline-block w-[70px] rtl:pr-8 ltr:pl-7 py-2 mx-1 sm:mx-4 border-[1px] border-gray-400"
          type="number"
          value={value}
          min={auction.currentPrice + 1}
        />
        <div className="p-2" onClick={() => setValue(value + 1)}>
          <HiOutlinePlusSm style={{ fontSize: "1.5rem" }} />
        </div>
      </div>
      <br />
      <div className="flex justify-around w-full">
        <Button
          containerClassName="w-20 h-10"
          borderRadius="1.75rem"
          className="bg-rose-200 dark:bg-slate-900 text-black dark:text-white border-rose-300 dark:border-slate-800"
        >
          Buy Now
        </Button>
        <Button
          containerClassName="w-20 h-10 "
          borderRadius="1.75rem"
          className="bg-green-200 dark:bg-slate-900 text-black dark:text-white border-green-300 dark:border-slate-800"
        >
          Bid
        </Button>
      </div>
    </div>
  );
};

export default CardToBid;
