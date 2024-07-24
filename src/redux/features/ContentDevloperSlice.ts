/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

// CD - content developer
const mainData: any = {
  CDSectionsData: [],
  CDDocDetails: [],
};

const ContentDeveloperData = createSlice({
  name: "ContentDeveloperData",
  initialState: mainData,
  reducers: {
    setCDSectionData: (state, action) => {
      state.CDSectionsData = action.payload;
    },
    setCDDocDetails: (state, action) => {
      state.CDDocDetails = action.payload;
    },
  },
});

export const { setCDSectionData, setCDDocDetails } =
  ContentDeveloperData.actions;
export default ContentDeveloperData.reducer;
