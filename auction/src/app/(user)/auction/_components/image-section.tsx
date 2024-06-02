import Image from "next/image";
import React, { useState } from "react";
import { AuctionType } from "@/schemaValidations/auction.schema";

interface Props {
  auction: AuctionType;
}
const ImageSection: React.FC<Props> = ({ auction }) => {
  const [selectedImg, setSelectedImg] = useState(0);
  function onClickHandler(index: number) {
    setSelectedImg(index);
  }
  return (
    <div className="flex items-start rounded-lg w-full md:w-auto">
      {/* <ProductPageActions /> */}
      <div className="flex flex-col items-center w-full md:w-auto">
        <div className="flex flex-grow md:ltr:mr-3 md:rtl:ml-3">
          <Image
            src={auction.product.images[selectedImg]}
            alt="product img"
            width={450}
            height={330}
            priority
            className="object-contain md:drop-shadow-xl dark:bg-palette-card"
          />
        </div>
        {auction.product.images.length > 1 && (
          <div className="flex mt-4  md:p-4 w-full max-w-[350px] overflow-auto">
            {auction.product.images.map((imgItem: string, index: number) => {
              return (
                <div
                  key={index}
                  className={`flex items-center justify-center p-2 md:p-4 rounded-lg  border-none transition-all duration-300 ease-in-out min-w-[80px] ${
                    index === selectedImg
                      ? "border-2 border-slate-300/60 shadow-md bg-palette-card/60"
                      : ""
                  }`}
                  onClick={() => onClickHandler(index)}
                >
                  <Image
                    src={imgItem}
                    width={70}
                    height={70}
                    alt="product img"
                    className="object-contain"
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageSection;
