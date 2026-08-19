import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import type { Place } from "@/features/weather/domain/models";

export interface SearchHistoryState {
  places: Place[];
}

const MAX_ENTRIES = 5;

const initialState: SearchHistoryState = { places: [] };

function samePlace(a: Place, b: Place): boolean {
  return a.lat === b.lat && a.lon === b.lon;
}

const searchHistorySlice = createSlice({
  name: "searchHistory",
  initialState,
  reducers: {
    /** Most recent first; re-searching the same coordinates moves that entry to the front. */
    placeSearched(state, action: PayloadAction<Place>) {
      const place = action.payload;
      state.places = [
        place,
        ...state.places.filter((existing) => !samePlace(existing, place)),
      ].slice(0, MAX_ENTRIES);
    },
  },
});

export const { placeSearched } = searchHistorySlice.actions;
export const searchHistoryReducer = searchHistorySlice.reducer;

export const selectRecentPlaces = (state: RootState): Place[] =>
  state.searchHistory.places;
