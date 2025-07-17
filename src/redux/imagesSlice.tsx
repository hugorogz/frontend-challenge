import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Image } from "../utils";

interface ImagesState {
  images: Image[];
}

const initialState: ImagesState = {
  images: [],
};

export const imagesSlice = createSlice({
  name: "imagesSlice",
  initialState,
  reducers: {
    setImages: (state, action: PayloadAction<Image[]>) => {
      state.images = action.payload;
    },
  },
});

export const { setImages } = imagesSlice.actions;
export default imagesSlice.reducer;
