/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

const mainData: any = {
  DefinitionDetails: [],
  AllDefinitions: [],
};

const DefinitionsData = createSlice({
  name: "DefinitionsData",
  initialState: mainData,
  reducers: {
    setDefinitionDetails: (state, action) => {
      state.DefinitionDetails = action.payload;
    },
    setAllDefinitions: (state, action) => {
      state.AllDefinitions = action.payload;
    },
  },
});

export const { setDefinitionDetails, setAllDefinitions } =
  DefinitionsData.actions;
export default DefinitionsData.reducer;
