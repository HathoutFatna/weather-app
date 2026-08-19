import { configureStore } from "@reduxjs/toolkit";
import { weatherApi } from "@/features/weather/api/weatherApi";

export function setupStore() {
  return configureStore({
    reducer: {
      [weatherApi.reducerPath]: weatherApi.reducer,
    },
    middleware: (getDefault) => getDefault().concat(weatherApi.middleware),
  });
}

export const store = setupStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
