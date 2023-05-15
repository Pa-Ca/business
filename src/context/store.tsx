import auth from "./slices/auth";
import business from "./slices/business";
import branches from "./slices/branches";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

// Combine the reducers into a single root reducer
const reducer = combineReducers({
  auth,
  business,
  branches
});

// Create the configuration object for redux-persist
const persistConfig = {
  key: "root",
  storage,
};
const persistedReducer = persistReducer(persistConfig, reducer);

// Create the Redux store using configureStore and the persisted reducer
const store = configureStore({
  reducer: persistedReducer,
});

// Infer the RootState and AppDispatch types from the store itself
export default store;
export const persistor = persistStore(store);
export type AppDispatch = typeof persistor.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
