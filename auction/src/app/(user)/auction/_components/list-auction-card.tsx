"use client";
import { cn } from "@/lib/utils";
import { AuctionsResponseType, LastKeyType } from "@/schemaValidations/auction.schema";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card-hover-effect";
import { AuctionCard } from "./auction-card";
import { BlogsReponseType } from "@/schemaValidations/blog.schema";
import auctionApiRequest from "@/apiRequests/auction";


export default function AuctionCardList(){
  const [auctions, setAuctions] = useState<AuctionsResponseType["data"]>([]);([]);
  const loadAuctions = async () => {
      try {
        const param = "?limit=6";
        const response = await auctionApiRequest.getAuctions(param);
        const sortedAuctions = response.payload.data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setAuctions(sortedAuctions );
      } catch (error) {
        console.error(error);
    };
  }
  useEffect(() => {
    loadAuctions();
  }, []);
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  return (
  <div className={cn("grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3  py-10")}>
        {auctions.map((item, idx) => (
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
      </div>)
}