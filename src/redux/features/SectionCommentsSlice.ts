/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

const mainData: any = {
  SectionComments: [],
  promatedComments: [],
};

const SectionCommentsData = createSlice({
  name: "SectionCommentsData",
  initialState: mainData,
  reducers: {
    setSectionComments: (state, action) => {
      state.SectionComments = action.payload;
    },
    setPromatedComments: (state, action) => {
      state.promatedComments = action.payload;
    },
  },
});

export const { setSectionComments, setPromatedComments } =
  SectionCommentsData.actions;
export default SectionCommentsData.reducer;
