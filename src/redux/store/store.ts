import { configureStore } from "@reduxjs/toolkit";
import MainSPContext from "../features/MainSPContext";

const store = configureStore({
  reducer: {
    MainSPContext: MainSPContext,
  },
});

export { store };
