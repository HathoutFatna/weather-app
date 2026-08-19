import { createSlice } from "@reduxjs/toolkit";
import type { TemperatureUnit } from "@/features/weather/domain/temperature";
import type { RootState } from "@/app/store";

export interface PreferencesState {
  unit: TemperatureUnit;
}

const initialState: PreferencesState = { unit: "celsius" };

const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    unitToggled(state) {
      state.unit = state.unit === "celsius" ? "fahrenheit" : "celsius";
    },
  },
});

export const { unitToggled } = preferencesSlice.actions;
export const preferencesReducer = preferencesSlice.reducer;

export const selectUnit = (state: RootState): TemperatureUnit =>
  state.preferences.unit;
