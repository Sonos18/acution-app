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
          {Array.isArray(auctions) &&
            auctions.map((auction, index) => <ItemConfirm auction={auction} />)}
        </TableBody>
      </Table>
    </div>
  );
};
export default TableConfirm;
