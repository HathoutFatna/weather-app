import type { CurrentWeatherDto } from "../api/dto";
import type { CurrentWeather, Place } from "./models";

export function formatCityLabel(place: Place): string {
  return [place.name, place.state, place.country].filter(Boolean).join(", ");
}

export function mapCurrentWeather(
  dto: CurrentWeatherDto,
  place: Place,
): CurrentWeather {
  const condition = dto.weather.at(0);

  return {
    city: formatCityLabel(place),
    temperatureC: dto.main.temp,
    feelsLikeC: dto.main.feels_like,
    condition: condition?.main ?? "Unknown",
    description: condition?.description ?? "",
    icon: condition?.icon ?? "",
    humidityPct: dto.main.humidity,
    windSpeedMps: dto.wind.speed,
  };
}
