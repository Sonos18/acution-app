"use client";
import auctionApiRequest from "@/apiRequests/auction";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  AuctionType,
  AuctionsResponseType,
  LastKeyType,
} from "@/schemaValidations/auction.schema";
import Loader from "@/components/loading";
import { AnimatePresence, motion } from "framer-motion";
import { Card } from "@/components/ui/card-hover-effect";
import { ThreeDCardCategory } from "../components/category";
import { AuctionCard } from "./_components/auction-card";

const Auction = () => {
  const [lastKey, setLastKey] = useState<LastKeyType | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [auctions, setAuctions] = useState<AuctionsResponseType["data"]>([]);
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const loadAuctions = async () => {
    try {
      const response = await auctionApiRequest.getAuctions("?limit=10");
      setAuctions(response.payload.data);
      setLastKey(response.payload.lastKey);
      setLoading(false);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadAuctions();
  }, []);
  const safeAuctions = auctions || [];
  return loading ? (
    <Loader />
  ) : (
    <div className="mx-auto w-3/4">
      <h1>Auction</h1>
      <div
        className={cn("grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3  py-10")}
      >
        {safeAuctions.map((item, idx) => (
          <div
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
export default Auction;
