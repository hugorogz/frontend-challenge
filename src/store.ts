import { configureStore } from "@reduxjs/toolkit";
import imagesReducer from "./redux/imagesSlice";
import categoriesReducer from "./redux/categoriesSlice";

export const store = configureStore({
  reducer: {
    images: imagesReducer,
    categories: categoriesReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
