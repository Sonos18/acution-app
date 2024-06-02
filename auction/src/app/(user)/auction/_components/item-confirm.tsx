import auctionApiRequest from "@/apiRequests/auction";
import { TableCell, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { AuctionClosingType } from "@/schemaValidations/auction.schema";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  auction: AuctionClosingType;
}
export const ItemConfirm = ({ auction }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const router=useRouter();
  const confirmAllAuction = async (id: string) => {
    try {
      setLoading(true);
      const res = await auctionApiRequest.confirmAuction(id);
      toast({
        title: "Auction Confirmed",
        description: "Auction has been confirmed successfully",
        duration: 3000,
        className: "bg-green-500 text-white",
      });
      router.push("/auction")
    } catch (e) {
      const error = e as Error;
      toast({
        title: "Error",
        description: error.message,
        duration: 3000,
        className: "bg-palette-danger text-white",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <TableRow key={auction.auctionId}>
        <TableCell>{auction.productName}</TableCell>
        <TableCell>{auction.startPrice}</TableCell>
        <TableCell>{auction.endPrice}</TableCell>
        <TableCell>{new Date(auction.startTime).toLocaleString()}</TableCell>
        <TableCell>{new Date(auction.endTime).toLocaleString()}</TableCell>
        <TableCell className="text-right">
          <button
            onClick={() => confirmAllAuction(auction.auctionId)}
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            {loading ? (
              <Loader2 className="mx-auto h-4 w-4 animate-spin" />
            ) : (
              "Confirm"
            )}
          </button>
        </TableCell>
      </TableRow>
    </>
  );
};
