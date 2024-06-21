import { createSlice } from "@reduxjs/toolkit";
import { AuctionClosingType } from "@/schemaValidations/auction.schema";

interface AuctionType {
    auctions:AuctionClosingType[]|[];
}
const initialState:AuctionType = {
    auctions:[],
}
export const historyAuction = createSlice({
    name: "historyAuction",
    initialState,
    reducers: {
        setHistoryAuctions: (state, action) => {
            const auctions = action.payload;
            state.auctions = auctions;
        },
    },
});
export const { setHistoryAuctions } = historyAuction.actions;
export default historyAuction.reducer;