import { configureStore, combineReducers } from "@reduxjs/toolkit";
import orderReducer from "./slices/orderSlice"

import {
  persistStore,
  persistReducer,
  PERSIST,
  REHYDRATE,
  REGISTER,
  FLUSH,
  PAUSE,
  PURGE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";


const persistConfig = {
    key: "tickitz:redux",
    storage,
    blacklist: [],
};

const persistedReducer = persistReducer(
    persistConfig,
    combineReducers({
        order: orderReducer,
    }),
);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: {
                ignoreActions: [PERSIST, REHYDRATE, REGISTER, FLUSH, PAUSE, PURGE],
            },
        });
    },
});

export const persistedStore = persistStore(store);

export default store

