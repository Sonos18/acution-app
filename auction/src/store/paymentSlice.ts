import { createSlice } from "@reduxjs/toolkit";
import { PaymentType } from "@/schemaValidations/payment.schema";

interface PaymentsType {
    payments:PaymentType[]|[];
    total:number;
    amount:number;
}
const initialState:PaymentsType = {
    payments:[],
    total:0,
    amount:0
}
export const paymentsSlice = createSlice({
    name: "paymnetsSlice",
    initialState,
    reducers: {
        setPayments: (state, action) => {
            const {payments,total,amount} = action.payload;
            state.payments = payments;
            state.total = total;
            state.amount = amount;
        },
        deletePayments: (state,action) => {
            const id= action.payload;
            state.payments = state.payments?.filter((payment) => payment.paymentId !== id);
        },
    },
});
export const { setPayments, deletePayments } = paymentsSlice.actions;
export default paymentsSlice.reducer;