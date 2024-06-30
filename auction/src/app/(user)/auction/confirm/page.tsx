"use client";
import auctionApiRequest from "@/apiRequests/auction";
import React, { useEffect } from "react";
import TableConfirm from "../_components/table-confirm";
import ConfirmBox from "../_components/confirm-box";
import { useDispatch } from "react-redux";
import {setAuctionsClosing} from '@/store/auctionClosingSlice';
const AuctionConfirmList = () => {
  const dispath = useDispatch();
  const loadConfirm = async() => {
    const res = await auctionApiRequest.getMyAuctionsCofirm();
    if (Array.isArray(res.payload)) {
      const amount = res.payload.length;
      const total = res.payload.reduce((acc,curr) => acc+curr.endPrice,0);
      dispath(setAuctionsClosing({auctions:res.payload,amount,total}));
    }
  };
  useEffect(() => {
    loadConfirm();
  }, []);
  return (
    <div className="w-6/7 xl:max-w-[2100px] mx-auto pb-6">
      <div className=" flex justify-center flex-col md:flex-row items-start relative ">
        <TableConfirm />
        <ConfirmBox />
      </div>
      <div className="text-center mt-2">
        <span className="text-sm text-gray-400">
          A list of your auction you need confirm.
        </span>
      </div>
    </div>
  );
};

export default AuctionConfirmList;
