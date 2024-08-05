/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

const mainData = {
  sectionsAttachments: [],
};

const PDFServiceData = createSlice({
  name: "PDFServiceData",
  initialState: mainData,
  reducers: {
    setSectionsAttachments: (state, action) => {
      state.sectionsAttachments = action.payload;
    },
    // setCurrentUserDetails: (state, payload) => {
    //   state.currentUserDetails = payload.payload;
    // },
  },
});

export const { setSectionsAttachments } = PDFServiceData.actions;
export default PDFServiceData.reducer;
