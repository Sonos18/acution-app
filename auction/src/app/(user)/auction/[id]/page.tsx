"use client";

import { useEffect, useState } from "react";
import ImageSection from "../_components/image-section";
import auctionApiRequest from "@/apiRequests/auction";
import { AuctionType } from "@/schemaValidations/auction.schema";
import Loader from "@/components/loading";
import DetailsSection from "../_components/details-section";

export default function BlogPost({ params }: { params: { id: string } }) {
  const [auction, setAuction] = useState<AuctionType>();
  const laodAuction = async () => {
    try {
      const res = await auctionApiRequest.getAuction(params.id);
      setAuction(res.payload);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    laodAuction();
  }, [params.id]);
  if (!auction) return <Loader />;
  return (
    auction && (
      <div>
        <div className="flex flex-col w-3/4 mx-auto">
          <div className="w-full xl:max-w-[2100px] mx-auto">
            <div className="flex flex-col md:flex-row flex-wrap md:flex-nowrap items-center md:items-start mt-8 relative">
              <ImageSection auction={auction} />
              <DetailsSection auction={auction} />
            </div>
            <div className="border-2 my-8">{/* <Benefits /> */}</div>
            {/* <SimilarProducts products={similarProductsList} /> */}
          </div>
        </div>
      </div>
    )
  );
}
