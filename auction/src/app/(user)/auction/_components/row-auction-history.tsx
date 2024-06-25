import { TableCell, TableRow } from "@/components/ui/table";
import { AuctionClosingType } from "@/schemaValidations/auction.schema";

interface Props {
    auction: AuctionClosingType;
}
export default function RowAuctionHistory({auction}:Props) {
    const viewDetail = () => {
        
    }
    return(
        <TableRow key={auction.auctionId} onClick={viewDetail}>
            <TableCell>Image</TableCell>
            <TableCell>Product Name</TableCell>
            <TableCell>End Price</TableCell>
            <TableCell>Status</TableCell>
        </TableRow>
    )
}