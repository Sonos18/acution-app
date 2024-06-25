import { RootState } from "@/store/store";
import { useSelector } from "react-redux";


const ConfirmBox = () => {
  const total=useSelector((state:RootState)=>state.auctionClosing.total);
  const amount=useSelector((state:RootState)=>state.auctionClosing.amount);
  if (amount < 1) 
    return <>
        <p className="text-palette-mute text-lg mx-auto mt-12">List is Empty</p>
    </>;
  return (
    <>
        <div className="flex-grow sticky bottom-0 left-0 right-0 md:top-36 shadow-lg bg-palette-card border-2 rounded-lg py-4 xl:py-12 px-4 xl:px-8 -mx-[1rem] md:mx-4 xl:mx-8 mt-2 w-[50vw] md:w-auto  md:min-w-[300px] md:max-w-[400px]">
          <h3 className="text-md sm:text-lg md:text-xl">Confirm Auctions</h3>
          <div className="flex flex-col my-1 sm:my-2">
            <div className="flex items-center justify-between md:my-4">
              <p className="text-sm sm:text-base text-palette-mute md:text-palette-base">
                Total Auctions
              </p>
              <p className="rtl:ml-1 ltr:mr-1 font-bold">{amount}</p>
            </div>
            <div className="flex items-center justify-between md:my-4">
              <p className="text-sm sm:text-base text-palette-mute md:text-palette-base">
                Total Revenue
              </p>
              <p className="rtl:ml-1 ltr:mr-1 font-bold">{total} $</p>
            </div>
          </div>
          <button className="p-[3px] relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
            <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
              Confirm All
            </div>
          </button>
        </div>
    </>
  );
};
export default ConfirmBox;
