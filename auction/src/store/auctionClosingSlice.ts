import { createSlice } from "@reduxjs/toolkit";
import { AuctionClosingType } from "@/schemaValidations/auction.schema";

interface AuctionType {
    auctions:AuctionClosingType[]|[];
    total:number;
    amount:number;
}
const initialState:AuctionType = {
    auctions:[],
    total:0,
    amount:0,
}
export const auctionClosingSlice = createSlice({
    name: "auctionsClosing",
    initialState,
    reducers: {
        setAuctionsClosing: (state, action) => {
            const {auctions,total,amount} = action.payload;
            state.auctions = auctions;
            state.total = total;
            state.amount = amount;
        },
        deleteAuctionsClosing: (state,action) => {
            const id= action.payload;
            state.auctions = state.auctions?.filter((auction) => auction.auctionId !== id);
        },
    },
});
export const { setAuctionsClosing, deleteAuctionsClosing } = auctionClosingSlice.actions;
export default auctionClosingSlice.reducer;