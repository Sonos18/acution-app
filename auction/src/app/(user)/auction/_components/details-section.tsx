import React from "react";

import { AuctionType } from "@/schemaValidations/auction.schema";
import CardToBid from "./card-to-bid";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

interface Props {
  auction: AuctionType;
}
const DetailsSection: React.FC<Props> = ({ auction }) => {
  const currentUser=useSelector((state:RootState)=>state.currentUser.user);
  return (
    <div className="bg-palette-card md:bg-transparent w-[100vw] md:w-auto px-5 flex-grow self-center lg:self-start mt-8 md:mt-0 !-mx-[1rem] lg:ltr:ml-4 lg:rtl:mr-4 py-5 md:py-0 rounded-tl-[4rem] rounded-tr-[3rem] flex flex-col z-10">
      <h2 className="text-palette-mute whitespace-normal rtl:md:text-right ltr:md:text-left">
        {auction.product.productName}
      </h2>
      <hr className="mt-1 hidden md:block" />
      <div className="flex items-start flex-wrap relative">
        <div className="flex-grow mt-4 w-2/5">
          <h1 className="text-lg">Product Details:</h1>
          <h3 className="text-lg mt-2 flex">
            <p>Category:</p>
            {auction.product.category}
          </h3>
          <h3 className="text-lg mt-2 flex">
            <p>Origin:</p>
            {auction.product.origin}
          </h3>
          <h3 className="text-lg mt-2">
            <p>Description:</p>
            {auction.product.description}
          </h3>
        </div>
        {auction.status==='closed'||currentUser?.userId===auction.user.userId?<></>:<CardToBid auction={auction} />}
      </div>
    </div>
  );
};

export default DetailsSection;
