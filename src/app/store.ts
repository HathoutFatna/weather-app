import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { preferencesReducer } from "@/features/preferences/preferencesSlice";
import { searchHistoryReducer } from "@/features/search-history/searchHistorySlice";
import { weatherApi } from "@/features/weather/api/weatherApi";
import type { Place } from "@/features/weather/domain/models";

const rootReducer = combineReducers({
  preferences: preferencesReducer,
  searchHistory: searchHistoryReducer,
  [weatherApi.reducerPath]: weatherApi.reducer,
});

type ClientState = Pick<
  ReturnType<typeof rootReducer>,
  "preferences" | "searchHistory"
>;
type PersistedState = Partial<ClientState>;

const PERSIST_KEY = "weather-app-state";

function loadPersistedState(): PersistedState | undefined {
  try {
    const raw = localStorage.getItem(PERSIST_KEY);
    if (!raw) return undefined;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return undefined;
    return sanitizePersistedState(parsed);
  } catch {
    return undefined;
  }
}

export function setupStore(preloadedState?: PersistedState) {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefault) => getDefault().concat(weatherApi.middleware),
    preloadedState,
  });
}

export const store = setupStore(loadPersistedState());

store.subscribe(() => {
  try {
    const { preferences, searchHistory } = store.getState();
    localStorage.setItem(
      PERSIST_KEY,
      JSON.stringify({ preferences, searchHistory }),
    );
  } catch {
    // Storage full or blocked — persistence is a convenience, not critical.
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

function sanitizePersistedState(parsed: object): PersistedState {
  const record = parsed as Record<string, unknown>;
  const state: PersistedState = {};

  if (record.preferences && typeof record.preferences === "object") {
    state.preferences = record.preferences as PersistedState["preferences"];
  }

  const history = record.searchHistory;
  if (typeof history === "object" && history !== null) {
    const places = (history as { places?: unknown }).places;
    if (Array.isArray(places) && places.every(isPersistedPlace)) {
      state.searchHistory = { places };
    }
  }

  return state;
}

function isPersistedPlace(value: unknown): value is Place {
  if (typeof value !== "object" || value === null) return false;
  const place = value as Record<string, unknown>;
  return (
    typeof place.name === "string" &&
    typeof place.lat === "number" &&
    typeof place.lon === "number" &&
    typeof place.country === "string" &&
    (place.state === undefined || typeof place.state === "string")
  );
}
