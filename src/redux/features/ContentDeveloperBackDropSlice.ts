/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

// CD - content developer
const mainData: any = {
  backDrop: false,
};

const ContentDeveloperBackDrop = createSlice({
  name: "ContentDeveloperBackDrop",
  initialState: mainData,
  reducers: {
    setCDBackDrop: (state, action) => {
      state.backDrop = action.payload;
    },
  },
});

export const { setCDBackDrop } = ContentDeveloperBackDrop.actions;
export default ContentDeveloperBackDrop.reducer;
