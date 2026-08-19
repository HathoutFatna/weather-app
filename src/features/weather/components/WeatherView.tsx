import { useEffect, useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";
import { CloudOff } from "lucide-react";
import { useAppDispatch } from "@/app/hooks";
import {
  useGetWeatherQuery,
  type WeatherQueryArg,
} from "@/features/weather/api/weatherApi";
import { SearchBar } from "@/features/weather/components/SearchBar";
import { CurrentWeatherCard } from "@/features/weather/components/CurrentWeatherCard";
import { ForecastList } from "@/features/weather/components/ForecastList";
import { EmptyState } from "@/features/weather/components/EmptyState";
import { WeatherSkeleton } from "@/features/weather/components/WeatherSkeleton";
import { RecentSearches } from "@/features/search-history/components/RecentSearches";
import { placeSearched } from "@/features/search-history/searchHistorySlice";

function weatherErrorMessage(
  error: FetchBaseQueryError | SerializedError | undefined,
): string {
  if (!error || !("status" in error)) {
    return "Something went wrong. Try again.";
  }
  if (error.status === 404) return "No city found matching that name.";
  if (error.status === 401) return "The API key was rejected.";
  if (error.status === "FETCH_ERROR") {
    return "Could not reach the weather service.";
  }
  return "Something went wrong. Try again.";
}

export function WeatherView() {
  const [arg, setArg] = useState<WeatherQueryArg | typeof skipToken>(skipToken);
  const { data, isUninitialized, isLoading, isError, error, refetch } =
    useGetWeatherQuery(arg);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data) dispatch(placeSearched(data.place));
  }, [data, dispatch]);

  const liveMessage = isLoading
    ? "Loading weather…"
    : isError
      ? weatherErrorMessage(error)
      : data
        ? `Weather for ${data.current.city} loaded.`
        : "";

  return (
    <main className="flex flex-1 flex-col gap-6">
      <SearchBar onSearch={(city) => setArg({ city })} />
      <RecentSearches onSelect={setArg} />

      <p role="status" aria-live="polite" className="sr-only">
        {liveMessage}
      </p>

      {isUninitialized && <EmptyState />}
      {isLoading && <WeatherSkeleton />}
      {isError && (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-3xl border border-destructive/30 bg-card/50 p-12 text-center">
          <CloudOff
            aria-hidden="true"
            className="size-12 text-destructive [stroke-width:1.5]"
          />
          <p className="text-lg font-medium">{weatherErrorMessage(error)}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-full bg-primary px-6 py-2 font-medium text-primary-foreground transition-colors outline-none hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-ring"
          >
            Retry
          </button>
        </div>
      )}
      {data && !isLoading && !isError && (
        <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
          <CurrentWeatherCard current={data.current} today={data.forecast[0]} />
          <ForecastList days={data.forecast} />
        </div>
      )}
    </main>
  );
}
