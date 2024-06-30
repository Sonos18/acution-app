"use client";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import RowAuctionHistory from "./row-auction-history";
import auctionApiRequest from "@/apiRequests/auction";
import { AuctionsResponseType } from "@/schemaValidations/auction.schema";
import { useEffect, useState } from "react";

export default function AuctionHistoryTable() {
    const user = useSelector((state: RootState) => state.currentUser.user);
    const [auctions, setAuctions] = useState<AuctionsResponseType["data"]|[]>([]);
    const loadHistory = async() => {
        const res=await auctionApiRequest.getHistoryAuctions(user?.userId as string);
        // sort by status and end time
        const sortedAuctions = res.payload.data.sort((a, b) => {
            if (a.status === "closed" && b.status !== "closed") return 1;
            if (a.status !== "closed" && b.status === "closed") return -1;
            if (a.status === "closed" && b.status === "closed") {
                if (a.endTime < b.endTime) return 1;
                if (a.endTime > b.endTime) return -1;
            }
            return 0;
        });
        // format endTime from Date to string YYYY-MM-DD HH:MM:SS
        setAuctions(sortedAuctions);
    }
    useEffect(() => {
        loadHistory();
    }, []);
    if (!auctions) return 
        <span>No History</span>;
    return(
        <Table>
            <TableCaption>Historical list of auctions</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>End Price</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {auctions.map((auction) => (
                    <RowAuctionHistory key={auction.auctionId} auction={auction} />
                ))}
            </TableBody>
        </Table>
    )
}