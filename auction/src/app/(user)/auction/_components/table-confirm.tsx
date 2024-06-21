"use client";
import auctionApiRequest from "@/apiRequests/auction";
import Loader from "@/components/loading";
import { AuctionClosingType } from "@/schemaValidations/auction.schema";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ItemConfirm } from "./item-confirm";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";


const TableConfirm = () => {
  const auctions=useSelector((state:RootState)=>state.auctionClosing.auctions);
  if (auctions.length < 1)
    return(
      <p className="text-center">
      You don&apos;t have any auction need confirm
      </p>
  )
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-center">Name</TableHead>
            <TableHead className="text-center">Start Price</TableHead>
            <TableHead className="text-center">Endprice</TableHead>
            <TableHead className="text-center">Start time</TableHead>
            <TableHead className="text-center">End time</TableHead>
            <TableHead className="text-right">Confirm</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(auctions) &&
            auctions.map((auction, index) => (
              <ItemConfirm key={auction.auctionId} auction={auction} />
            ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default TableConfirm;
