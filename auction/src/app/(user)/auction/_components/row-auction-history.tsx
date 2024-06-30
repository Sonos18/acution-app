import { TableCell, TableRow } from "@/components/ui/table";
import { AuctionClosingType, AuctionType } from "@/schemaValidations/auction.schema";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
    auction: AuctionType;
}
export default function RowAuctionHistory({auction}:Props) {
    const router = useRouter();
    const viewDetail = () => {
        router.push(`/auction/${auction.auctionId}`);
    }
    return(
        <TableRow key={auction.auctionId} onClick={viewDetail} onClickCapture={viewDetail} className="cursor-pointer hover:bg-slate-300">
            <TableCell>
                <Image src={auction.product.images[0]??""} alt={auction.product.productName} width={50} height={50} />
            </TableCell>
            <TableCell>{auction.product.productName}</TableCell>
            <TableCell>{new Date(auction.endTime).toLocaleString()}</TableCell>
            <TableCell>{auction.status}</TableCell>
        </TableRow>
    )
}