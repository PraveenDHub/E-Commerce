import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/products/productSlice.js"

export const store = configureStore({
    devTools: true, // change to false when production
    reducer: {
        product: productReducer,
    },
});