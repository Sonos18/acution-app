import { configureStore } from '@reduxjs/toolkit'
import { currentUserSlice } from './userSlice'
import {blogSlice} from './blogSlice'

export const store = configureStore({
  reducer: {
    currentUser: currentUserSlice.reducer,
    blog: blogSlice.reducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch