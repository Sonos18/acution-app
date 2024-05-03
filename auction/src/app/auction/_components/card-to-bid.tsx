import React, { useEffect, useState } from "react";
import { HiOutlinePlusSm, HiMinusSm } from "react-icons/hi";
import { AuctionType } from "@/schemaValidations/auction.schema";
import Clock from "@/app/components/count-down";
import { Button } from "@/components/ui/moving-border";
import auctionApiRequest from "@/apiRequests/auction";
import Loader from "@/components/loading";
import GavelIcon from "@mui/icons-material/Gavel";
import PaidIcon from "@mui/icons-material/Paid";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { AlertDialogConfirm } from "@/components/custom/alert-dialog-confirm";
import { useRouter } from "next/navigation";
interface Props {
  auction: AuctionType;
}
const CardToBid: React.FC<Props> = ({ auction }) => {
  const [value, setValue] = useState<number>(auction.currentPrice + 1);
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();
  const [currentPrice, setCurrentPrice] = useState<number>(
    auction.currentPrice
  );
  const bid = async () => {
    try {
      setLoading("bid");
      await auctionApiRequest.bidAuction(auction.auctionId, {
        price: value,
      });
      setCurrentPrice(value);
      setValue(value + 1);
      toast({
        title: "Success",
        description: `You bid successfully with price is ${value}`,
        className: "bg-green-100",
        duration: 3000,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(null);
    }
  };
  const buy = async () => {
    setLoading("buy");
    if (value >= auction.endPrice * 0.9) {
      toast({
        title: "Warning",
        description: "You dont buy this product, Let bid it!",
        className: "bg-yellow-100",
        duration: 3000,
      });
      setLoading(null);
      return;
    }
    try {
      await auctionApiRequest.buyAuction(auction.auctionId, {
        price: auction.endPrice,
      });
      router.push("/auction");
      toast({
        title: "Success",
        description: "You bought this product successfully",
        className: "bg-green-100",
        duration: 3000,
      });
      router.refresh();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(null);
    }
  };
  return (
    <div className="flex flex-col items-center flex-grow sticky top-10 md:top-36 max-w-[350px] mt-8 rtl:mr-auto ltr:ml-auto xl:rtl:ml-2 px-6 py-4 sm:p-4 xl:p-6 border-2 shadow-lg">
      <Clock endTime={new Date(auction.endTime).getTime()} />
      <div className="flex justify-around w-full pt-1">
        <div className="flex flex-col w-full text-center">
          <p className="text-lg text-rose-700">End Price</p>
          <p>{auction.endPrice}</p>
        </div>
        <div className="flex flex-col w-full text-center ">
          <p className="text-lg text-green-700">Current Price</p>
          <p>{currentPrice}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 cursor-pointer">
        <div
          className="p-2"
          onClick={() => {
            if (value > currentPrice + 1) setValue(value - 1);
          }}
        >
          <HiMinusSm
            style={{
              fontSize: "1.5rem",
              opacity: `${value === currentPrice + 1 ? 0.6 : 1}`,
            }}
          />
        </div>
        <input
          className="text-center inline-block w-[70px] rtl:pr-8 ltr:pl-7 py-2 mx-1 sm:mx-4 border-[1px] border-gray-400"
          type="number"
          value={value}
          min={currentPrice + 1}
        />
        <div className="p-2" onClick={() => setValue(value + 1)}>
          <HiOutlinePlusSm style={{ fontSize: "1.5rem" }} />
        </div>
      </div>
      <br />
      <div className="flex justify-around w-full">
        <AlertDialogConfirm
          title="Confirm"
          description="Are you sure you want to buy this product?"
          handleLogout={buy}
        >
          <Button
            containerClassName="w-24 h-10"
            borderRadius="1.75rem"
            className="bg-rose-200 dark:bg-slate-900 text-black dark:text-white border-rose-300 dark:border-slate-800 "
            disabled={loading ? true : false}
          >
            {loading === "buy" ? (
              <Loader2 className="mx-auto h-4 w-4 animate-spin" />
            ) : (
              <>
                Buy <PaidIcon className="hover:text-green-400 pl-1" />
              </>
            )}
          </Button>
        </AlertDialogConfirm>
        <Button
          containerClassName="w-20 h-10 "
          borderRadius="1.75rem"
          className="bg-green-200 dark:bg-slate-900 text-black dark:text-white border-green-300 dark:border-slate-800"
          onClick={bid}
          disabled={loading ? true : false}
        >
          {loading === "bid" ? (
            <Loader2 className="mx-auto h-4 w-4 animate-spin" />
          ) : (
            <>
              Bid <GavelIcon className="hover:text-rose-400 pl-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CardToBid;
