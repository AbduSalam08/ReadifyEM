import { configureStore } from "@reduxjs/toolkit";
import MainSPContext from "../features/MainSPContextSlice";
import EMMTableOfContents from "../features/EMMTableOfContentSlice";
import SDDTemplatesSlice from "../features/SDDTemplatesSlice";

const store = configureStore({
  reducer: {
    MainSPContext: MainSPContext,
    EMMTableOfContents: EMMTableOfContents,
    SDDTemplatesData: SDDTemplatesSlice,
  },
});

export { store };
