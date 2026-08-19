import { memo } from "react";
import { displayTemperature } from "../domain/temperature";
import type { DailyForecast } from "../domain/models";
import { WeatherIcon } from "./WeatherIcon";

// Noon avoids the ISO date shifting a day in extreme timezones.
function weekday(isoDate: string): string {
  return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(
    new Date(`${isoDate}T12:00:00`),
  );
}

export const ForecastList = memo(function ForecastList({
  days,
}: {
  days: DailyForecast[];
}) {
  return (
    <section aria-label="5-day forecast" className="flex flex-col gap-3">
      <h2 className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
        5-day forecast
      </h2>
      <ul className="flex flex-1 flex-col gap-3">
        {days.map((day) => (
          <li
            key={day.date}
            className="flex flex-1 items-center justify-between gap-4 rounded-3xl border border-border bg-card px-5 py-3"
          >
            <span className="w-12 font-medium">{weekday(day.date)}</span>
            <WeatherIcon
              condition={day.condition}
              icon={day.icon}
              className="size-7 text-accent"
            />
            <span className="text-right">
              {displayTemperature(day.maxTempC, "celsius")}°
              <span className="text-muted-foreground">
                {" "}
                / {displayTemperature(day.minTempC, "celsius")}°
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
});
