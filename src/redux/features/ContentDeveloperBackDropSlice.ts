/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import { initialPopupLoaders } from "../../config/config";

// CD - content developer
const mainData: any = {
  backDrop: false,
  CDTaskSuccess: initialPopupLoaders,
};

const ContentDeveloperBackDrop = createSlice({
  name: "ContentDeveloperBackDrop",
  initialState: mainData,
  reducers: {
    setCDBackDrop: (state, action) => {
      state.backDrop = action.payload;
    },
    setCDTaskSuccess: (state, action) => {
      state.CDTaskSuccess = action.payload;
    },
  },
});

export const { setCDBackDrop, setCDTaskSuccess } =
  ContentDeveloperBackDrop.actions;
export default ContentDeveloperBackDrop.reducer;
