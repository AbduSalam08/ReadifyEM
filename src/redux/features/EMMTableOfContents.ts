/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

const mainData: any = {
  adminData: [],
  nonAdminData: [],
  foldersData: [],
};

const EMMTableOfContents = createSlice({
  name: "EMMTableOfContents",
  initialState: mainData,
  reducers: {
    setEMMTOCAdminData: (state, action) => {
      state.adminData = action.payload;
    },
    setEMMTOCUserData: (state, action) => {
      state.nonAdminData = action.payload;
    },
    setFoldersData: (state, action) => {
      state.foldersData = action.payload;
    },
  },
});

export const { setEMMTOCAdminData, setEMMTOCUserData, setFoldersData } =
  EMMTableOfContents.actions;
export default EMMTableOfContents.reducer;
