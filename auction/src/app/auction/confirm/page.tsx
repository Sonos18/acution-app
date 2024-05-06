"use client";
import auctionApiRequest from "@/apiRequests/auction";
import { AuctionClosingType } from "@/schemaValidations/auction.schema";
import React, { useEffect, useState } from "react";
import TableConfirm from "../_components/table-confirm";
import ConfirmBox from "../_components/confirm-box";
import Loader from "@/components/loading";

const AuctionConfirmList = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [auctions, setAuctions] = useState<AuctionClosingType[] | []>([]);
  const [auctionIds, setAuctionIds] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const loadAuctions = async () => {
    try {
      setLoading(true);
      const res = await auctionApiRequest.getMyAuctionsCofirm();
      setAuctions(res.payload);
      console.log(res.payload);

      setAuctionIds(res.payload.map((auction) => auction.auctionId));
      setTotalPrice(
        res.payload.reduce((total, auction) => total + auction.endPrice, 0)
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadAuctions();
  }, []);
  if (loading) return <Loader />;
  return (
    <div className="w-6/7 xl:max-w-[2100px] mx-auto pb-6">
      <div className=" flex justify-center flex-col md:flex-row items-start relative ">
        {auctions[1] ? (
          <p className="text-center">No data</p>
        ) : (
          <>
            <TableConfirm auctions={auctions} />
            <ConfirmBox auctionIds={auctionIds} totalPrice={totalPrice} />
          </>
        )}
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
