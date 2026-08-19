import type {
  ForecastResponseDto,
  ForecastSlotDto,
  WeatherConditionDto,
} from "../api/dto";
import type { DailyForecast } from "./models";

/**
 * Groups the ~40 three-hour forecast slots into at most five daily summaries:
 * min/max temperature and the day's most frequent condition.
 *
 * Days follow the searched city's local calendar, not the browser's: each
 * slot's UTC time is shifted by the city's timezone offset before reading
 * the date. The first day may be partial (it starts at the next slot).
 */
export function aggregateForecast(dto: ForecastResponseDto): DailyForecast[] {
  const byDay = new Map<string, ForecastSlotDto[]>();

  // dto.list is chronological and Map keeps insertion order,
  // so the days come out already sorted.
  for (const slot of dto.list) {
    const day = localDayKey(slot.dt, dto.city.timezone);
    const slots = byDay.get(day) ?? [];
    slots.push(slot);
    byDay.set(day, slots);
  }

  return [...byDay.entries()]
    .slice(0, 5)
    .map(([date, slots]) => summarizeDay(date, slots));
}

function localDayKey(utcSeconds: number, offsetSeconds: number): string {
  return new Date((utcSeconds + offsetSeconds) * 1000)
    .toISOString()
    .slice(0, 10);
}

function summarizeDay(date: string, slots: ForecastSlotDto[]): DailyForecast {
  const temps = slots.map((slot) => slot.main.temp);
  const dominant = dominantCondition(slots);

  return {
    date,
    minTempC: Math.min(...temps),
    maxTempC: Math.max(...temps),
    condition: dominant?.main ?? "Unknown",
    icon: dominant?.icon ?? "",
  };
}

// Most frequent primary condition wins; earliest one wins ties.
function dominantCondition(
  slots: ForecastSlotDto[],
): WeatherConditionDto | undefined {
  const counts = new Map<string, number>();
  let best: WeatherConditionDto | undefined;
  let bestCount = 0;

  for (const slot of slots) {
    const condition = slot.weather.at(0);
    if (!condition) continue;

    const count = (counts.get(condition.main) ?? 0) + 1;
    counts.set(condition.main, count);
    if (count > bestCount) {
      bestCount = count;
      best = condition;
    }
  }

  return best;
}
