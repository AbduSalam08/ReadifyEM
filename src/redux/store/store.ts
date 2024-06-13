import { configureStore } from "@reduxjs/toolkit";
import MainSPContext from "../features/MainSPContext";
import EMMTableOfContents from "../features/EMMTableOfContents";

const store = configureStore({
  reducer: {
    MainSPContext: MainSPContext,
    EMMTableOfContents: EMMTableOfContents,
  },
});

export { store };
