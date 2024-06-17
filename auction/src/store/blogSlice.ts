import { createSlice } from "@reduxjs/toolkit";
import { BlogsReponseType } from "@/schemaValidations/blog.schema";

export interface BLogsType{
    blog:BlogsReponseType["data"]|[];
    lastKey:BlogsReponseType["lastKey"]|null;
}
const initialState:BLogsType = {
    blog:[],
    lastKey:null
}
export const blogSlice = createSlice({
    name: "blogs",
    initialState,
    reducers: {
        setBlogs: (state, action) => {
            const {data,lastKey} = action.payload;
            state.blog = data;
            state.lastKey = lastKey
        },
        updateBlog: (state,action) => {
            const {id,data} = action.payload;
            state.blog = state.blog?.map((blog) => {
                if(blog.blogId === id){
                    return data;
                }
                return blog;
            })
        },
        deleteBlog: (state,action) => {
            const {id}= action.payload;
            state.blog = state.blog?.filter((blog) => blog.blogId !== id);
        }
    },
});
export const { setBlogs, updateBlog, deleteBlog } = blogSlice.actions;
export default blogSlice.reducer;