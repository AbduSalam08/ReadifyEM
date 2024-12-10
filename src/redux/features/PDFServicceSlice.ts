/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

const mainData = {
  sectionsAttachments: [],
  pdfServiceDetails: {
    allSectionData: [],
    headerDetails: {},
  },
};

const PDFServiceData = createSlice({
  name: "PDFServiceData",
  initialState: mainData,
  reducers: {
    setSectionsAttachments: (state, action) => {
      state.sectionsAttachments = action.payload;
    },
    setPdfServiceDetails: (state, action) => {
      state.pdfServiceDetails = action.payload;
    },
    // setCurrentUserDetails: (state, payload) => {
    //   state.currentUserDetails = payload.payload;
    // },
  },
});

export const { setSectionsAttachments, setPdfServiceDetails } =
  PDFServiceData.actions;
export default PDFServiceData.reducer;
