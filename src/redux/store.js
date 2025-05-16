import { configureStore } from '@reduxjs/toolkit';
import  blogReducer from "./slice/blogSlice/blogSlice";

export const store = configureStore({
  reducer: {
    blogs :  blogReducer,
  },
})