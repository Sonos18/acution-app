import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import RowAuctionHistory from "./row-auction-history";

export default function AuctionHistoryTable() {
    const auctions = useSelector((state:RootState)=>state.historyAuction.auctions);
    
    return(
        <Table>
            <TableCaption>asjdfgf</TableCaption>
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