/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

const mainData: any = {
  SDDtemplateDetails: [],
  AllSDDTemplates: [],
};

const SDDTemplatesData = createSlice({
  name: "SDDTemplatesData",
  initialState: mainData,
  reducers: {
    setSDDTemplateDetails: (state, action) => {
      state.SDDtemplateDetails = action.payload;
    },
    setAllSDDTemplates: (state, action) => {
      state.AllSDDTemplates = action.payload;
    },
  },
});

export const { setSDDTemplateDetails, setAllSDDTemplates } =
  SDDTemplatesData.actions;
export default SDDTemplatesData.reducer;
