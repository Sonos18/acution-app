import { createSlice } from "@reduxjs/toolkit";
import { SignInResSchemaType } from "@/schemaValidations/auth.schema";

export interface CurrentUser{
    user:SignInResSchemaType["user"]|null;
}
const initialState:CurrentUser = {
    user:null
}
export const currentUserSlice = createSlice({
    name: "currentUser",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        removeUser: (state) => {
            state.user = null;
        },
    },
});
export const { setUser, removeUser } = currentUserSlice.actions;
export default currentUserSlice.reducer;