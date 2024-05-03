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

interface Props {
  auctions: AuctionClosingType[];
}
const TableConfirm = ({ auctions }: Props) => {
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
          {auctions.map((auction, index) => (
            <TableRow key={index}>
              <TableCell>{auction.productName}</TableCell>
              <TableCell>{auction.startPrice}</TableCell>
              <TableCell>{auction.endPrice}</TableCell>
              <TableCell>
                {new Date(auction.startTime).toLocaleString()}
              </TableCell>
              <TableCell>
                {new Date(auction.endTime).toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                <button className="bg-green-500 text-white px-4 py-2 rounded-md">
                  Confirm
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default TableConfirm;
