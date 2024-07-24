/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

const mainData: any = {
  AllSectionsData: [],
  ConfigurePageDetails: [],
};

const SectionConfiguration = createSlice({
  name: "SectionConfiguration",
  initialState: mainData,
  reducers: {
    setAllSectionsData: (state, action) => {
      state.AllSectionsData = action.payload;
    },
    setConfigurePageDetails: (state, action) => {
      state.ConfigurePageDetails = action.payload;
    },
  },
});

export const { setAllSectionsData, setConfigurePageDetails } =
  SectionConfiguration.actions;
export default SectionConfiguration.reducer;
