"use client";
import auctionApiRequest from "@/apiRequests/auction";
import { cn } from "@/lib/utils";
import { Suspense, useEffect, useState } from "react";
import {
  AuctionsResponseType,
  LastKeyType,
} from "@/schemaValidations/auction.schema";
import Loader from "@/components/loading";
import { AnimatePresence, motion } from "framer-motion";
import { Card } from "@/components/ui/card-hover-effect";
import { AuctionCard } from "./_components/auction-card";
import ButtonAdd from "../blog/_component/button-add";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useSearchParams } from "next/navigation";

export default function Auction() {
  return(
    <Suspense fallback={<Loader />}>
      <AuctionContent /> 
    </Suspense>
  )
}

function AuctionContent () {
  const [lastKey, setLastKey] = useState<LastKeyType | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [auctions, setAuctions] = useState<AuctionsResponseType["data"]>([]);
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const loadAuctions = async () => {
    try {
      const param = search ? `?limit=10&search=${search}` : "?limit=10";
      const response = await auctionApiRequest.getAuctions(param);
      console.log(response.payload);
      
      const sortedAuctions = response.payload.data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setAuctions(sortedAuctions );
      setLastKey(response.payload.lastKey);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuctions();
  }, [search]);
  const safeAuctions = auctions || [];
  return loading ? (
    <Loader />
  ) : (
    <div className="mx-auto w-3/4">
      <ButtonAdd item={addItem} />
      <div
        className={cn("grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3  py-10")}
      >
        {safeAuctions.map((item, idx) => (
          <div
            key={item.auctionId}
            className="relative group  block p-2 h-full w-full"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.span
                  className="absolute inset-0 w-full bg-neutral-200 dark:bg-slate-800/[0.8] block  rounded-3xl"
                  layoutId="hoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { duration: 0.15 },
                  }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.15, delay: 0.2 },
                  }}
                />
              )}
            </AnimatePresence>
            <Card>
              <AuctionCard auction={item} />
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
const addItem = {
  link: "/auction/add",
  title: "what do you want to auction your product?",
  cateItems: [
    {
      name: "Fast shipping",
      icon: (
        <LocalShippingIcon className="text-rose-500 mr-1" fontSize="small" />
      ),
    },
    {
      name: "Support 24/7",
      icon: (
        <SupportAgentIcon className="text-green-400 mr-1" fontSize="small" />
      ),
    },
    {
      name: "Easy payment",
      icon: (
        <CreditCardIcon className="text-orange-400 mr-1" fontSize="small" />
      ),
    },
  ],
};
