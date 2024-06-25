import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { currentUserSlice } from './userSlice'
import {blogSlice} from './blogSlice'
// redux/store.js
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { auctionClosingSlice } from './auctionClosingSlice';
import { paymentsSlice } from './paymentSlice';
import { historyAuction } from './historyAuction';

const persistConfig = {
  key: 'root',
  storage,
};
const rootReducer = combineReducers({
  currentUser: currentUserSlice.reducer,
  blog: blogSlice.reducer,
  auctionClosing: auctionClosingSlice.reducer,
  payments: paymentsSlice.reducer,
  historyAuction: historyAuction.reducer,
  // Add other reducers here
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch