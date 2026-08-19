import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { aggregateForecast } from "../domain/aggregateForecast";
import {
  formatCityLabel,
  mapCurrentWeather,
} from "../domain/mapCurrentWeather";
import type { CurrentWeather, DailyForecast, Place } from "../domain/models";
import type { CurrentWeatherDto, ForecastResponseDto } from "./dto";

const appid = import.meta.env.VITE_OWM_API_KEY;

export type WeatherQueryArg = { city: string } | Place;

export interface WeatherData {
  current: CurrentWeather;
  forecast: DailyForecast[];
  place: Place;
}

function dedupeByLabel(places: Place[]): Place[] {
  const seen = new Set<string>();
  return places.filter((place) => {
    const label = formatCityLabel(place);
    if (seen.has(label)) return false;
    seen.add(label);
    return true;
  });
}

export const weatherApi = createApi({
  reducerPath: "weatherApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.openweathermap.org",
  }),
  // Weather barely moves in a session; 30 min fresh, 1 hour if unused.
  keepUnusedDataFor: 60 * 60,
  refetchOnMountOrArgChange: 30 * 60,
  endpoints: (build) => ({
    searchCities: build.query<Place[], string>({
      query: (q) => ({
        url: "/geo/1.0/direct",
        params: { q, limit: 5, appid },
      }),
      transformResponse: (places: Place[]) => dedupeByLabel(places),
    }),
    getWeather: build.query<WeatherData, WeatherQueryArg>({
      async queryFn(arg, _api, _extra, baseQuery) {
        let place: Place;
        if ("lat" in arg) {
          place = arg;
        } else {
          const geo = await baseQuery({
            url: "/geo/1.0/direct",
            params: { q: arg.city, limit: 1, appid },
          });
          if (geo.error) return { error: geo.error };
          const match = (geo.data as Place[])[0];
          if (!match) {
            return { error: { status: 404, data: "city-not-found" } };
          }
          place = match;
        }

        const params = {
          lat: place.lat,
          lon: place.lon,
          units: "metric",
          appid,
        };
        const [current, forecast] = await Promise.all([
          baseQuery({ url: "/data/2.5/weather", params }),
          baseQuery({ url: "/data/2.5/forecast", params }),
        ]);
        if (current.error) return { error: current.error };
        if (forecast.error) return { error: forecast.error };

        return {
          data: {
            place,
            current: mapCurrentWeather(
              current.data as CurrentWeatherDto,
              place,
            ),
            forecast: aggregateForecast(forecast.data as ForecastResponseDto),
          },
        };
      },
    }),
  }),
});

export const { useSearchCitiesQuery, useGetWeatherQuery } = weatherApi;
