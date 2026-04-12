import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/products/productSlice.js"
import userReducer from "../features/products/User/userSlice.js"
import cartReducer from "../features/products/Cart/cartSlice.js"
import orderReducer from "../features/products/orderSlice.js"

export const store = configureStore({
    devTools: true, // change to false when production
    reducer: {
        product: productReducer,
        user: userReducer,
        cart: cartReducer,
        order: orderReducer,
    },
});