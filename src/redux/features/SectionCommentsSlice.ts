/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

const mainData: any = {
  SectionComments: [],
};

const SectionCommentsData = createSlice({
  name: "SectionCommentsData",
  initialState: mainData,
  reducers: {
    setSectionComments: (state, action) => {
      state.SectionComments = action.payload;
    },
  },
});

export const { setSectionComments } = SectionCommentsData.actions;
export default SectionCommentsData.reducer;
