"use client";

import Image from "next/image";
import React from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { Button } from "@/components/ui/moving-border";
import Clock from "@/app/components/count-down";
import { AuctionType } from "@/schemaValidations/auction.schema";
import Link from "next/link";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useRouter } from "next/navigation";
export function AuctionCard({ auction }: { auction: AuctionType }) {
  // const { user } = useAppContext();
  
  const router = useRouter();
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
                  <p className="text-lg">
                  {new Date(auction.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {new Date(auction.createdAt).toLocaleDateString('en-GB')}
                  </p>
                </div>
              </div>
            </Link>
            {/* {user?.userId === auction.user.userId && (
              <div className="text-black dark:text-white">
                <Link href={`/auction/${auction.auctionId}`}>
                  <MoreHorizIcon sx={{ cursor: "pointer" }} />
                </Link>
              </div>
            )} */}
          </div>
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300 hidden"
        >
          {auction.product.productName}
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-4">
          <Image
            src={auction.product.images[0]}
            // src="https%3A%2F%2Fmy-auction-bucket.s3.ap-southeast-1.amazonaws.com%2Fd3aba1f4-9812-43b1-945e-015d8570ef55%3FAWSAccessKeyId%3DASIATCKATL32VH4MVD7C%26Expires%3D1714221056%26Signature%3D60%252FvVOphXAr30Gj0r6q%252BbXOfrTY%253D%26X-Amzn-Trace-Id%3DRoot%253D1-662cec7c-061e8e2e0655aee33bd0f872%253BParent%253D3ba030264ead392e%253BSampled%253D0%253BLineage%253D4998e4dd%253A0%26x-amz-security-token%3DIQoJb3JpZ2luX2VjEIz%252F%252F%252F%252F%252F%252F%252F%252F%252F%252FwEaDmFwLXNvdXRoZWFzdC0xIkcwRQIhAIu6BPQi4n5IiEbAUyRqOYPiptW7o2MBmCLIGubPwpKtAiBUr7HIQp%252BKQnXh0dbtfISqrHEmLv%252FguJOv6lw1X0KS2yqXAwjV%252F%252F%252F%252F%252F%252F%252F%252F%252F%252F8BEAAaDDIxMTEyNTc1NTYzNyIMQWC6TrgvmPWB8zXqKusCsBhSGqxSaNxfVh8S06XcvLWZnsl0Y6xiFF3ln5ptl2nQVUcT78uqbwEDw6yZyPwrfuKgExAO1pmWG4bHrnmfeEZTm1c%252B0%252FPJDLiZPoQKOr9aqZluzYjecRYxFQFv8TVtEUqeiLeP9O0%252BsskyoOnCyPXlES83wLgZCdLTB0cWI9VjL2IfoKtk2ph9BlObGG%252FatYiDrZfAOLmc2LxIYXsWRt5qyPFB20MQPvlzDp3Yezekl403%252FqJfgENODeje0LIz8elpQsFd77NulnsmFrBDGeCNnctePlq6uh8kHetE5a7A4N6WMfNRnYllTAwKGB9uPtl7nw0XTDnl5EYvGNSRJL%252FgFFM6RuCMwwIEH0yEYG78hD2sXtjFyamVgAwadGmgE1ZTuMG%252Br6nfbKlC0mY%252F5cd0GfgBePyA1udDXWXzvQfU0QZTWVzRdOlEWoFgtqjsw%252Bb%252BHrrfo4h19ppOnirwYT%252BL2sg01mJmKp8AMIrWs7EGOp0BlafGLjkTJC%252BZFZheC%252Fa7K4F%252BJXrOQD09dMAcr2QmIm%252FNfHvn1YsFBWiARShOndk66K43%252B8m9JpC3SyJvypmgY%252FnxE8U0jQVZQPsqbI9v4tGk1%252BBMSEsykzW1%252FoYazGqVbcIbi%252F2u%252B%252FUEPrWk5hNatl1iu%252B9BDfNOt8Tpl6UIr4PzsuLQebtJYuFOIoNFDX%252BRfbhOORwoWMXzXwrs7A%253D%253D&w=256&q=75"
            height="1000"
            width="1000"
            className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt="thumbnail"
            priority
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
            <Link href={`/auction/${auction.auctionId}`}>
              <Button
                containerClassName="w-20 h-10 "
                borderRadius="1.75rem"
                className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
              >
                Bid
              </Button>
            </Link>
          </div>
        </div>
      </CardBody>
    </CardContainer>
  );
}
