/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

// CD - content developer
const mainData: any = {
  CDSectionsData: [],
  CDDocDetails: [],
  CDHeaderDetails: [],
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
    setCDHeaderDetails: (state, action) => {
      state.CDHeaderDetails = action.payload;
    },
  },
});

export const { setCDSectionData, setCDDocDetails, setCDHeaderDetails } =
  ContentDeveloperData.actions;
export default ContentDeveloperData.reducer;
