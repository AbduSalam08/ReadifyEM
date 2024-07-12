import { configureStore } from "@reduxjs/toolkit";
import MainSPContext from "../features/MainSPContextSlice";
import EMMTableOfContents from "../features/EMMTableOfContentSlice";
import SDDTemplatesSlice from "../features/SDDTemplatesSlice";
import MyTasksSlice from "../features/MyTasksSlice";

const store = configureStore({
  reducer: {
    MainSPContext: MainSPContext,
    EMMTableOfContents: EMMTableOfContents,
    SDDTemplatesData: SDDTemplatesSlice,
    myTasksData: MyTasksSlice,
  },
});

export { store };
