"use client";

import Image from "next/image";
import React from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { Button } from "@/components/ui/moving-border";
import Clock from "@/app/components/count-down";
import { AuctionType } from "@/schemaValidations/auction.schema";
import Link from "next/link";
import { useAppContext } from "@/app/app-provider";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
export function AuctionCard({ auction }: { auction: AuctionType }) {
  const { user } = useAppContext();
  return (
    <CardContainer className="inter-var w-full">
      <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-neutral-600 dark:text-white w-full"
        >
          <div className="flex justify-between">
            <Link href={`/profile/posts`}>
              <div className="flex gap-3 items-center">
                <Image
                  src={auction.user.avatar}
                  alt="profile photo"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div className="flex flex-col gap-1  dark:text-white">
                  <p className="text-small-semibold ">
                    {auction.user.firstName} {auction.user.lastName}
                  </p>
                  <p className="text-subtle-medium">
                    {auction.product.productName}
                  </p>
                </div>
              </div>
            </Link>
            {user?.userId === auction.user.userId && (
              <div className="text-black dark:text-white">
                <Link href={`/auction/${auction.auctionId}`}>
                  <MoreHorizIcon sx={{ cursor: "pointer" }} />
                </Link>
              </div>
            )}
          </div>
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
        >
          {auction.product.description}
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-4">
          <Image
            src={auction.product.images[0]}
            height="1000"
            width="1000"
            className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt="thumbnail"
          />
        </CardItem>
        <div className="mt-2">
          <Clock endTime={new Date(auction.endTime).getTime()} />
        </div>
        <div className="flex justify-between items-center mt-1">
          <CardItem
            translateZ={20}
            as="button"
            className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
          >
            Current Price: {auction.currentPrice} $
          </CardItem>
          {/* <CardItem
            translateZ={20}
            as="button"
            className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
          >
             <Button
        borderRadius="1.75rem"
        className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
      >
        Borders are cool
      </Button>
          </CardItem> */}

          <div className="hover:cursor-pointer">
            <Button
              containerClassName="w-20 h-10 "
              borderRadius="1.75rem"
              className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
            >
              Bid
            </Button>
          </div>
        </div>
      </CardBody>
    </CardContainer>
  );
}
