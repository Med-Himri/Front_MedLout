"use client";

import { useState } from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";

const makeStore = () =>
  configureStore({
    reducer: {
      cart: cartReducer,
    },
  });

export function ReduxProvider({ children }) {
  // One store per browser tab / per server render — a module-level store
  // would be shared between all visitors during server rendering.
  const [store] = useState(makeStore);
  return <Provider store={store}>{children}</Provider>;
}
