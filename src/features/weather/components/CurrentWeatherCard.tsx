import { Droplets, Thermometer, Wind } from "lucide-react";
import { useAppSelector } from "@/app/hooks";
import { selectUnit } from "@/features/preferences/preferencesSlice";
import { displayTemperature } from "../domain/temperature";
import type { CurrentWeather, DailyForecast } from "../domain/models";
import { WeatherIcon } from "./WeatherIcon";

interface CurrentWeatherCardProps {
  current: CurrentWeather;
  /** Today's aggregated forecast, for the daily high/low. */
  today?: DailyForecast;
}

export function CurrentWeatherCard({
  current,
  today,
}: CurrentWeatherCardProps) {
  const unit = useAppSelector(selectUnit);
  return (
    <section
      aria-label={`Current weather in ${current.city}`}
      className="flex flex-col gap-8 rounded-3xl border border-border p-8 shadow-xl [background:var(--gradient-card)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">{current.city}</h2>
          <p className="capitalize text-secondary-foreground">
            {current.description}
          </p>
        </div>
        <WeatherIcon
          condition={current.condition}
          icon={current.icon}
          className="size-16 text-accent [stroke-width:1.5]"
        />
      </div>

      <div>
        <p className="text-8xl font-extralight tracking-tighter">
          {displayTemperature(current.temperatureC, unit)}°
        </p>
        {today && (
          <p className="mt-1 text-secondary-foreground">
            H: {displayTemperature(today.maxTempC, unit)}° L:{" "}
            {displayTemperature(today.minTempC, unit)}°
          </p>
        )}
      </div>

      <dl className="grid grid-cols-3 gap-3">
        <Detail
          icon={Thermometer}
          label="Feels like"
          value={`${displayTemperature(current.feelsLikeC, unit)}°`}
        />
        <Detail
          icon={Droplets}
          label="Humidity"
          value={`${current.humidityPct}%`}
        />
        <Detail
          icon={Wind}
          label="Wind"
          value={`${Math.round(current.windSpeedMps * 3.6)} km/h`}
        />
      </dl>
    </section>
  );
}

interface DetailProps {
  icon: typeof Thermometer;
  label: string;
  value: string;
}

function Detail({ icon: Icon, label, value }: DetailProps) {
  return (
    <div className="rounded-2xl bg-black/20 p-3">
      <dt className="flex items-center gap-1.5 text-xs text-secondary-foreground">
        <Icon aria-hidden="true" className="size-3.5" />
        {label}
      </dt>
      <dd className="mt-1 text-lg font-medium">{value}</dd>
    </div>
  );
}
