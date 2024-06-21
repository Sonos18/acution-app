"use client";
import auctionApiRequest from "@/apiRequests/auction";
import { AuctionClosingType } from "@/schemaValidations/auction.schema";
import React, { useEffect, useState } from "react";
import TableConfirm from "../_components/table-confirm";
import ConfirmBox from "../_components/confirm-box";

const AuctionConfirmList = () => {
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
